"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { BulkImportPanel } from "@/components/BulkImportPanel";
import { ResourceCard } from "@/components/ResourceCard";
import { ResourceForm } from "@/components/ResourceForm";
import { ResourceSkeleton } from "@/components/ResourceSkeleton";
import { ResourceToolbar } from "@/components/ResourceToolbar";
import { Toast } from "@/components/Toast";
import {
  demoResources,
  emptyResourceForm,
  formatDiscordPost,
  getResourceSortScore,
  matchesDateFilter,
  normalizeResource,
  parseBulkImportResources,
  toResourceFormPayload,
  toSupabaseResourcePayload,
  type DateFilter,
  type Quality,
  type Resource,
  type ResourceRow,
  type ResourceFormData,
  type Status
} from "@/lib/resources";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";

type FormErrors = Partial<Record<keyof ResourceFormData, string>>;
const savedResourcesStorageKey = "buildnest-saved-resources";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [form, setForm] = useState<ResourceFormData>(emptyResourceForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDateFilter, setSelectedDateFilter] = useState<DateFilter>("All Dates");
  const [selectedQuality, setSelectedQuality] = useState<Quality | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [savedResourceIds, setSavedResourceIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [bulkImportValue, setBulkImportValue] = useState("");
  const [bulkImportSummary, setBulkImportSummary] = useState("");
  const [bulkImportErrors, setBulkImportErrors] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(!hasSupabaseConfig);

  useEffect(() => {
    setIsMounted(true);
    setSavedResourceIds(readSavedResourceIds());
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
      setResources(((data ?? []) as ResourceRow[]).map(normalizeResource));
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
      const matchesDates = matchesDateFilter(resource, selectedDateFilter);
      const matchesQuality = selectedQuality === "All" || resource.quality === selectedQuality;
      const matchesSaved = !savedOnly || savedResourceIds.includes(resource.id);

      const searchableText = [
        resource.title,
        resource.description,
        resource.category
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesCategory && matchesStatus && matchesDates && matchesQuality && matchesSaved && (!query || searchableText.includes(query));
    }).sort((firstResource, secondResource) => {
      const scoreDifference = getResourceSortScore(firstResource) - getResourceSortScore(secondResource);

      if (scoreDifference !== 0) {
        return scoreDifference;
      }

      return new Date(secondResource.createdAt).getTime() - new Date(firstResource.createdAt).getTime();
    });
  }, [resources, savedOnly, savedResourceIds, searchQuery, selectedCategory, selectedDateFilter, selectedQuality, selectedStatus]);

  const activeFilterCount = useMemo(() => {
    return [
      searchQuery.trim(),
      selectedCategory !== "All",
      selectedStatus !== "All",
      selectedDateFilter !== "All Dates",
      selectedQuality !== "All",
      savedOnly
    ].filter(Boolean).length;
  }, [savedOnly, searchQuery, selectedCategory, selectedDateFilter, selectedQuality, selectedStatus]);

  function readSavedResourceIds() {
    try {
      const savedValue = window.localStorage.getItem(savedResourcesStorageKey);
      const parsedValue = savedValue ? JSON.parse(savedValue) : [];
      return Array.isArray(parsedValue)
        ? parsedValue.filter((value): value is string => typeof value === "string")
        : [];
    } catch {
      return [];
    }
  }

  function persistSavedResourceIds(nextSavedIds: string[]) {
    try {
      window.localStorage.setItem(savedResourcesStorageKey, JSON.stringify(nextSavedIds));
    } catch {
      setToast("Saved resources unavailable in this browser.");
    }
  }

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
    setSelectedDateFilter("All Dates");
    setSelectedQuality("All");
    setSavedOnly(false);
  }

  function toggleSavedResource(id: string) {
    setSavedResourceIds((currentSavedIds) => {
      const isAlreadySaved = currentSavedIds.includes(id);
      const nextSavedIds = isAlreadySaved
        ? currentSavedIds.filter((savedId) => savedId !== id)
        : [...currentSavedIds, id];

      persistSavedResourceIds(nextSavedIds);
      setToast(isAlreadySaved ? "Removed from saved." : "Saved resource.");
      return nextSavedIds;
    });
  }

  async function addResource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving || !validateForm()) {
      return;
    }

    setIsSaving(true);
    const newResource = toResourceFormPayload(form);

    const optimisticResource: Resource = {
      id: `local-${crypto.randomUUID()}`,
      ...newResource
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
      .insert(toSupabaseResourcePayload(newResource))
      .select("*")
      .single();

    if (error) {
      setIsDemoMode(true);
      setToast("Supabase unavailable. Using demo mode.");
    } else if (data) {
      setResources((currentResources) =>
        currentResources.map((resource) =>
          resource.id === optimisticResource.id ? normalizeResource(data as ResourceRow) : resource
        )
      );
      setToast("Resource added.");
    }

    setIsSaving(false);
  }

  async function importResources(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isImporting) {
      return;
    }

    setIsImporting(true);
    const importResult = parseBulkImportResources(bulkImportValue, resources);
    setBulkImportErrors(importResult.errors);

    if (importResult.resources.length === 0) {
      setBulkImportSummary(
        `Imported 0 resources. Skipped ${importResult.skippedCount} resources.`
      );
      setToast("No valid resources to import.");
      setIsImporting(false);
      return;
    }

    const optimisticResources: Resource[] = importResult.resources.map((resource) => ({
      id: `bulk-${crypto.randomUUID()}`,
      ...resource
    }));
    const optimisticIds = new Set(optimisticResources.map((resource) => resource.id));

    setResources((currentResources) => [...optimisticResources, ...currentResources]);
    setBulkImportValue("");
    setBulkImportSummary(
      `Imported ${importResult.importedCount} resources. Skipped ${importResult.skippedCount} resources.`
    );

    if (!supabase || isDemoMode) {
      setToast(`Imported ${importResult.importedCount} resources.`);
      setIsImporting(false);
      return;
    }

    const { data, error } = await supabase
      .from("resources")
      .insert(importResult.resources.map(toSupabaseResourcePayload))
      .select("*");

    if (error) {
      setIsDemoMode(true);
      setToast("Supabase unavailable. Using demo mode.");
    } else if (data) {
      const savedResources = ((data ?? []) as ResourceRow[]).map(normalizeResource);
      setResources((currentResources) => [
        ...savedResources,
        ...currentResources.filter((resource) => !optimisticIds.has(resource.id))
      ]);
      setToast(`Imported ${savedResources.length} resources.`);
    }

    setIsImporting(false);
  }

  function clearBulkImport() {
    setBulkImportValue("");
    setBulkImportSummary("");
    setBulkImportErrors([]);
  }

  function exportResources() {
    const exportRows = resources.map((resource) => ({
      title: resource.title,
      category: resource.category,
      description: resource.description ?? "",
      whyValuable: "",
      difficulty: resource.difficulty ?? "",
      indiaFriendly: resource.india_friendly ?? "",
      status: resource.status,
      startDate: resource.startDate ?? "",
      endDate: resource.endDate ?? "",
      deadlineDate: resource.deadlineDate ?? "",
      quality: resource.quality,
      sourceType: resource.sourceType,
      link: resource.link ?? "",
      discordSummary: resource.description ?? "",
      postedBy: resource.postedBy,
      createdAt: resource.createdAt
    }));
    const blob = new Blob([JSON.stringify(exportRows, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `buildnest-resources-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setToast("Resources exported.");
  }

  async function deleteResource(id: string) {
    if (deletingId) {
      return;
    }

    setDeletingId(id);
    const resourceToDelete = resources.find((resource) => resource.id === id);
    const resourceWasSaved = savedResourceIds.includes(id);

    if (!supabase || isDemoMode) {
      setResources((currentResources) =>
        currentResources.filter((resource) => resource.id !== id)
      );
      setSavedResourceIds((currentSavedIds) => {
        const nextSavedIds = currentSavedIds.filter((savedId) => savedId !== id);
        persistSavedResourceIds(nextSavedIds);
        return nextSavedIds;
      });
      setToast("Resource deleted.");
      setDeletingId(null);
      return;
    }

    setResources((currentResources) =>
      currentResources.filter((resource) => resource.id !== id)
    );
    setSavedResourceIds((currentSavedIds) => {
      const nextSavedIds = currentSavedIds.filter((savedId) => savedId !== id);
      persistSavedResourceIds(nextSavedIds);
      return nextSavedIds;
    });

    const { error } = await supabase.from("resources").delete().eq("id", id);

    if (error) {
      if (resourceToDelete) {
        setResources((currentResources) => [resourceToDelete, ...currentResources]);
      }
      setSavedResourceIds((currentSavedIds) => {
        const nextSavedIds = resourceToDelete && resourceWasSaved
          ? Array.from(new Set([...currentSavedIds, resourceToDelete.id]))
          : currentSavedIds;
        persistSavedResourceIds(nextSavedIds);
        return nextSavedIds;
      });

      setIsDemoMode(true);
      setToast("Supabase unavailable. Using demo mode.");
    } else {
      setToast("Resource deleted.");
    }

    setDeletingId(null);
  }

  async function updateResourceStatus(id: string, nextStatus: Status) {
    if (statusUpdatingId) {
      return;
    }

    setStatusUpdatingId(id);
    const resourceToUpdate = resources.find((resource) => resource.id === id);

    setResources((currentResources) =>
      currentResources.map((resource) =>
        resource.id === id ? { ...resource, status: nextStatus } : resource
      )
    );

    if (!supabase || isDemoMode) {
      setToast(`Resource marked ${nextStatus.toLowerCase()}.`);
      setStatusUpdatingId(null);
      return;
    }

    const { error } = await supabase
      .from("resources")
      .update({ status: nextStatus })
      .eq("id", id);

    if (error) {
      if (resourceToUpdate) {
        setResources((currentResources) =>
          currentResources.map((resource) =>
            resource.id === id ? resourceToUpdate : resource
          )
        );
      }

      setIsDemoMode(true);
      setToast("Supabase unavailable. Using demo mode.");
    } else {
      setToast(`Resource marked ${nextStatus.toLowerCase()}.`);
    }

    setStatusUpdatingId(null);
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
      className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-6 overflow-x-hidden px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:px-8"
    >
      <header className="flex flex-col gap-6 border-b border-line pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-sm font-semibold text-brand">
            Discord resource ops
          </p>
          <h1 className="mt-3 max-w-3xl break-words text-3xl font-bold leading-tight tracking-normal text-ink sm:text-[42px]">
            BuildNest Growth Engine
          </h1>
          <div className="mt-3 h-1 w-24 rounded-full bg-brand" />
          <p className="mt-4 max-w-2xl break-words text-base leading-7 text-muted">
            Curate practical internships, hackathons, tools, communities, and learning links for
            your Discord members.
          </p>
        </div>

        <div className="w-full max-w-full break-words rounded-xl border border-[#D1C1A9] bg-[#E8DFCA] px-4 py-4 font-mono text-xs font-semibold text-ink shadow-[0_10px_24px_rgba(36,48,65,0.09)] sm:px-5 sm:text-sm lg:w-auto">
          {isDemoMode ? "Database not connected yet. Using local demo mode." : "Connected to Supabase"}
        </div>
      </header>

      <section className="grid w-full min-w-0 gap-6 lg:grid-cols-[minmax(18rem,0.3fr)_minmax(0,0.7fr)]">
        <aside className="grid h-fit min-w-0 gap-4 lg:sticky lg:top-6">
          <ResourceForm
            form={form}
            errors={formErrors}
            isSaving={isSaving}
            onSubmit={addResource}
            onChange={updateForm}
          />

          <BulkImportPanel
            value={bulkImportValue}
            isImporting={isImporting}
            importSummary={bulkImportSummary}
            importErrors={bulkImportErrors}
            onChange={setBulkImportValue}
            onSubmit={importResources}
            onClear={clearBulkImport}
            onExport={exportResources}
          />
        </aside>

        <section className="min-w-0">
          <ResourceToolbar
            resourceCount={filteredResources.length}
            totalCount={resources.length}
            selectedCategory={selectedCategory}
            selectedStatus={selectedStatus}
            selectedDateFilter={selectedDateFilter}
            selectedQuality={selectedQuality}
            searchQuery={searchQuery}
            savedOnly={savedOnly}
            savedCount={savedResourceIds.length}
            activeFilterCount={activeFilterCount}
            onCategoryChange={setSelectedCategory}
            onStatusChange={setSelectedStatus}
            onDateFilterChange={setSelectedDateFilter}
            onQualityChange={setSelectedQuality}
            onSearchChange={setSearchQuery}
            onSavedOnlyChange={setSavedOnly}
            onClearFilters={clearFilters}
          />

          <div className="mt-5">
            {isLoading ? (
              <div>
                <p className="mb-4 text-sm text-muted">Loading resources...</p>
                <ResourceSkeleton />
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="rounded-xl border border-[#E2D8C9] bg-[#FFFDFC] p-6 text-center text-ink shadow-[0_16px_36px_rgba(36,48,65,0.13)] sm:p-8">
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
                    isSaved={savedResourceIds.includes(resource.id)}
                    isDeleting={deletingId === resource.id}
                    isStatusUpdating={statusUpdatingId === resource.id}
                    onToggleSave={toggleSavedResource}
                    onUpdateStatus={updateResourceStatus}
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
