import { FormEvent } from "react";
import {
  categories,
  creationStatuses,
  qualityOptions,
  sourceTypeOptions,
  type ResourceFormData
} from "@/lib/resources";

type ResourceFormProps = {
  form: ResourceFormData;
  errors: Partial<Record<keyof ResourceFormData, string>>;
  isSaving: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (field: keyof ResourceFormData, value: string) => void;
};

const inputClass =
  "min-h-10 w-full min-w-0 rounded-md border border-[#CFC0AA] bg-white px-3.5 py-2 text-sm text-ink outline-none transition placeholder:text-muted hover:border-brand focus:border-brand focus:shadow-[0_0_0_3px_rgba(91,127,255,0.12)] aria-[invalid=true]:border-danger";

export function ResourceForm({
  form,
  errors = {},
  isSaving,
  onSubmit,
  onChange
}: ResourceFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full min-w-0 rounded-xl border border-[#D1C1A9] bg-[#E8DFCA] p-4 text-ink shadow-[0_14px_34px_rgba(36,48,65,0.13)] sm:p-5 lg:sticky lg:top-6 lg:h-fit"
    >
      <div>
        <h2 className="text-lg font-bold text-ink">Add Resource</h2>
        <p className="mt-1 text-sm leading-5 text-muted">Capture one useful link for the community.</p>
      </div>

      <div className="mt-5 grid min-w-0 gap-3.5">
        <label htmlFor="title" className="grid gap-2 text-sm font-semibold text-ink">
          Title <span className="sr-only">required</span>
          <input
            id="title"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "title-error" : undefined}
            value={form.title}
            onChange={(event) => onChange("title", event.target.value)}
            className={inputClass}
            placeholder="GitHub Student Developer Pack"
          />
          {errors.title && (
            <p id="title-error" className="text-xs font-medium text-danger">
              {errors.title}
            </p>
          )}
        </label>

        <label htmlFor="description" className="grid gap-2 text-sm font-semibold text-ink">
          Description <span className="sr-only">required</span>
          <textarea
            id="description"
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? "description-error" : undefined}
            value={form.description}
            onChange={(event) => onChange("description", event.target.value)}
            className={`${inputClass} min-h-24 resize-y leading-5`}
            placeholder="Short summary of what members get and who it is useful for."
          />
          {errors.description && (
            <p id="description-error" className="text-xs font-medium text-danger">
              {errors.description}
            </p>
          )}
        </label>

        <label htmlFor="type" className="grid gap-2 text-sm font-medium text-muted">
          Type
          <input
            id="type"
            value={form.type}
            onChange={(event) => onChange("type", event.target.value)}
            className={inputClass}
            placeholder="Student benefit, fellowship, challenge"
          />
        </label>

        <label htmlFor="posted-by" className="grid gap-2 text-sm font-medium text-muted">
          Posted By
          <input
            id="posted-by"
            value={form.postedBy}
            onChange={(event) => onChange("postedBy", event.target.value)}
            className={inputClass}
            placeholder="BuildNest Member"
          />
        </label>

        <label htmlFor="link" className="grid gap-2 text-sm font-medium text-muted">
          Link
          <input
            id="link"
            value={form.link}
            onChange={(event) => onChange("link", event.target.value)}
            className={inputClass}
            placeholder="https://..."
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-3">
          <label htmlFor="start-date" className="grid gap-2 text-sm font-medium text-muted">
            Start Date
            <input
              id="start-date"
              type="date"
              value={form.startDate}
              onChange={(event) => onChange("startDate", event.target.value)}
              className={inputClass}
            />
          </label>

          <label htmlFor="end-date" className="grid gap-2 text-sm font-medium text-muted">
            End Date
            <input
              id="end-date"
              type="date"
              value={form.endDate}
              onChange={(event) => onChange("endDate", event.target.value)}
              className={inputClass}
            />
          </label>

          <label htmlFor="deadline-date" className="grid gap-2 text-sm font-medium text-muted">
            Deadline
            <input
              id="deadline-date"
              type="date"
              value={form.deadlineDate}
              onChange={(event) => onChange("deadlineDate", event.target.value)}
              className={inputClass}
            />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label htmlFor="category" className="grid gap-2 text-sm font-medium text-muted">
            Category <span className="sr-only">required</span>
            <select
              id="category"
              aria-invalid={Boolean(errors.category)}
              aria-describedby={errors.category ? "category-error" : undefined}
              value={form.category}
              onChange={(event) => onChange("category", event.target.value)}
              className={inputClass}
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            {errors.category && (
              <p id="category-error" className="text-xs font-medium text-danger">
                {errors.category}
              </p>
            )}
          </label>

          <label htmlFor="difficulty" className="grid gap-2 text-sm font-medium text-muted">
            Difficulty
            <select
              id="difficulty"
              value={form.difficulty}
              onChange={(event) => onChange("difficulty", event.target.value)}
              className={inputClass}
            >
              <option value="">Select</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label htmlFor="india-friendly" className="grid gap-2 text-sm font-medium text-muted">
            India Friendly
            <select
              id="india-friendly"
              value={form.india_friendly}
              onChange={(event) => onChange("india_friendly", event.target.value)}
              className={inputClass}
            >
              <option>Yes</option>
              <option>No</option>
              <option>Check details</option>
            </select>
          </label>

          <label htmlFor="quality" className="grid gap-2 text-sm font-medium text-muted">
            Quality
            <select
              id="quality"
              value={form.quality}
              onChange={(event) => onChange("quality", event.target.value)}
              className={inputClass}
            >
              {qualityOptions.map((quality) => (
                <option key={quality}>{quality}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label htmlFor="source-type" className="grid gap-2 text-sm font-medium text-muted">
            Source Type
            <select
              id="source-type"
              value={form.sourceType}
              onChange={(event) => onChange("sourceType", event.target.value)}
              className={inputClass}
            >
              {sourceTypeOptions.map((sourceType) => (
                <option key={sourceType}>{sourceType}</option>
              ))}
            </select>
          </label>

          <label htmlFor="status" className="grid gap-2 text-sm font-medium text-muted">
            Status
            <select
              id="status"
              value={form.status}
              onChange={(event) => onChange("status", event.target.value)}
              className={inputClass}
            >
              {creationStatuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="mt-5 min-h-11 w-full rounded-full bg-brand px-6 py-2.5 text-base font-semibold text-white shadow-[0_8px_16px_rgba(91,127,255,0.18)] transition hover:bg-brandDark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Adding..." : "Add Resource"}
      </button>
    </form>
  );
}
