"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ResourceCard } from "@/components/ResourceCard";
import { ResourceForm } from "@/components/ResourceForm";
import { ResourceSkeleton } from "@/components/ResourceSkeleton";
import { ResourceToolbar } from "@/components/ResourceToolbar";
import { Toast } from "@/components/Toast";
import {
  demoResources,
  emptyResourceForm,
  formatDiscordPost,
  normalizeResource,
  toResourceFormPayload,
  type Resource,
  type ResourceFormData
} from "@/lib/resources";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";

type FormErrors = Partial<Record<keyof ResourceFormData, string>>;

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [form, setForm] = useState<ResourceFormData>(emptyResourceForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(!hasSupabaseConfig);

  useEffect(() => {
    setIsMounted(true);
    loadResources();
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  async function loadResources() {
    setIsLoading(true);

    if (!supabase) {
      setResources(demoResources);
      setIsDemoMode(true);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setToast("Supabase unavailable. Using demo mode.");
      setResources(demoResources);
      setIsDemoMode(true);
    } else {
      setResources(((data ?? []) as Resource[]).map(normalizeResource));
      setIsDemoMode(false);
    }

    setIsLoading(false);
  }

  const filteredResources = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesCategory =
        selectedCategory === "All" || resource.category === selectedCategory;
      const matchesStatus = selectedStatus === "All" || resource.status === selectedStatus;

      const searchableText = [
        resource.title,
        resource.description,
        resource.category
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesCategory && matchesStatus && (!query || searchableText.includes(query));
    });
  }, [resources, searchQuery, selectedCategory, selectedStatus]);

  const activeFilterCount = useMemo(() => {
    return [searchQuery.trim(), selectedCategory !== "All", selectedStatus !== "All"].filter(Boolean)
      .length;
  }, [searchQuery, selectedCategory, selectedStatus]);

  function updateForm(field: keyof ResourceFormData, value: string) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setFormErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = "Title is required.";
    }

    if (!form.category.trim()) {
      nextErrors.category = "Category is required.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Description is required.";
    }

    setFormErrors(nextErrors);

    const firstInvalidField = Object.keys(nextErrors)[0];

    if (firstInvalidField) {
      window.requestAnimationFrame(() => {
        document.getElementById(firstInvalidField)?.focus();
      });
    }

    return Object.keys(nextErrors).length === 0;
  }

  function clearFilters() {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedStatus("All");
  }

  async function addResource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving || !validateForm()) {
      return;
    }

    setIsSaving(true);

    const optimisticResource: Resource = {
      id: `local-${crypto.randomUUID()}`,
      ...toResourceFormPayload(form),
      created_at: new Date().toISOString()
    };

    if (!supabase || isDemoMode) {
      setResources((currentResources) => [optimisticResource, ...currentResources]);
      setForm(emptyResourceForm);
      setFormErrors({});
      setToast("Resource added.");
      setIsSaving(false);
      return;
    }

    setResources((currentResources) => [optimisticResource, ...currentResources]);
    setForm(emptyResourceForm);
    setFormErrors({});

    const { data, error } = await supabase
      .from("resources")
      .insert(toResourceFormPayload(form))
      .select("*")
      .single();

    if (error) {
      setIsDemoMode(true);
      setToast("Supabase unavailable. Using demo mode.");
    } else if (data) {
      setResources((currentResources) =>
        currentResources.map((resource) =>
          resource.id === optimisticResource.id ? normalizeResource(data as Resource) : resource
        )
      );
      setToast("Resource added.");
    }

    setIsSaving(false);
  }

  async function deleteResource(id: string) {
    if (deletingId) {
      return;
    }

    setDeletingId(id);
    const resourceToDelete = resources.find((resource) => resource.id === id);

    if (!supabase || isDemoMode) {
      setResources((currentResources) =>
        currentResources.filter((resource) => resource.id !== id)
      );
      setToast("Resource deleted.");
      setDeletingId(null);
      return;
    }

    setResources((currentResources) =>
      currentResources.filter((resource) => resource.id !== id)
    );

    const { error } = await supabase.from("resources").delete().eq("id", id);

    if (error) {
      if (resourceToDelete) {
        setResources((currentResources) => [resourceToDelete, ...currentResources]);
      }

      setIsDemoMode(true);
      setToast("Supabase unavailable. Using demo mode.");
    } else {
      setToast("Resource deleted.");
    }

    setDeletingId(null);
  }

  async function copyDiscordPost(resource: Resource) {
    try {
      await navigator.clipboard.writeText(formatDiscordPost(resource));
      setToast("Discord post copied.");
    } catch {
      setToast("Clipboard unavailable. Try copying again from your browser.");
    }
  }

  if (!isMounted) {
    return (
      <main
        suppressHydrationWarning
        className="min-h-screen bg-page"
        aria-label="Loading BuildNest Growth Engine"
      />
    );
  }

  return (
    <main
      suppressHydrationWarning
      className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8"
    >
      <header className="flex flex-col gap-6 border-b border-line pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-sm font-semibold text-brand">
            Discord resource ops
          </p>
          <h1 className="mt-3 max-w-3xl text-[32px] font-bold leading-tight tracking-normal text-ink sm:text-[42px]">
            BuildNest Growth Engine
          </h1>
          <div className="mt-3 h-1 w-24 rounded-full bg-brand" />
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            Curate practical internships, hackathons, tools, communities, and learning links for
            your Discord members.
          </p>
        </div>

        <div className="rounded-xl border border-[#D1C1A9] bg-[#E8DFCA] px-5 py-4 font-mono text-sm font-semibold text-ink shadow-[0_10px_24px_rgba(36,48,65,0.09)]">
          {isDemoMode ? "Database not connected yet. Using local demo mode." : "Connected to Supabase"}
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(18rem,0.3fr)_minmax(0,0.7fr)]">
        <ResourceForm
          form={form}
          errors={formErrors}
          isSaving={isSaving}
          onSubmit={addResource}
          onChange={updateForm}
        />

        <section className="min-w-0">
          <ResourceToolbar
            resourceCount={filteredResources.length}
            totalCount={resources.length}
            selectedCategory={selectedCategory}
            selectedStatus={selectedStatus}
            searchQuery={searchQuery}
            activeFilterCount={activeFilterCount}
            onCategoryChange={setSelectedCategory}
            onStatusChange={setSelectedStatus}
            onSearchChange={setSearchQuery}
            onClearFilters={clearFilters}
          />

          <div className="mt-5">
            {isLoading ? (
              <div>
                <p className="mb-4 text-sm text-muted">Loading resources...</p>
                <ResourceSkeleton />
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="rounded-xl border border-[#E2D8C9] bg-[#FFFDFC] p-8 text-center text-ink shadow-[0_16px_36px_rgba(36,48,65,0.13)]">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#AFC8DC] bg-soft font-mono text-sm font-semibold text-brand">
                  BN
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink">No matching resources found</h3>
                <p className="mt-2 text-sm text-muted">
                  Clear filters or add a new resource for this view.
                </p>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 min-h-11 rounded-full border border-[#AFC8DC] bg-soft px-5 py-2 text-sm font-semibold text-ink shadow-[0_6px_14px_rgba(36,48,65,0.08)] transition hover:bg-[#B9D2E5]"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 xl:grid-cols-2">
                {filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    isDeleting={deletingId === resource.id}
                    onCopy={copyDiscordPost}
                    onDelete={deleteResource}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </section>

      <Toast message={toast} />
    </main>
  );
}
