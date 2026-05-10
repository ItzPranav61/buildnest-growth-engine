import { categories, statuses } from "@/lib/resources";

type ResourceToolbarProps = {
  resourceCount: number;
  totalCount: number;
  selectedCategory: string;
  selectedStatus: string;
  searchQuery: string;
  activeFilterCount: number;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
};

const controlClass =
  "min-h-10 w-full min-w-0 rounded-md border border-[#CFC0AA] bg-white px-3.5 py-2 text-sm text-ink outline-none transition placeholder:text-muted hover:border-brand focus:border-brand focus:shadow-[0_0_0_3px_rgba(91,127,255,0.12)]";

export function ResourceToolbar({
  resourceCount,
  totalCount,
  selectedCategory,
  selectedStatus,
  searchQuery,
  activeFilterCount,
  onCategoryChange,
  onStatusChange,
  onSearchChange,
  onClearFilters
}: ResourceToolbarProps) {
  return (
    <div className="w-full min-w-0 rounded-xl border border-[#D1C1A9] bg-[#E8DFCA] p-4 text-ink shadow-[0_14px_34px_rgba(36,48,65,0.12)] sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-ink">Resources</h2>
          <p className="text-sm text-muted">
            {resourceCount} shown from {totalCount} total
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="max-w-full rounded-full bg-brandSoft px-3 py-1 font-mono text-xs font-semibold text-[#304FB8]">
            {activeFilterCount} active {activeFilterCount === 1 ? "filter" : "filters"}
          </span>
          <button
            type="button"
            onClick={onClearFilters}
            disabled={activeFilterCount === 0}
            className="min-h-11 rounded-full border border-[#AFC8DC] bg-soft px-4 py-2 text-sm font-semibold text-ink shadow-[0_6px_14px_rgba(36,48,65,0.08)] transition hover:bg-[#B9D2E5] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_11rem_10rem]">
        <label htmlFor="resource-search" className="grid gap-2 text-sm font-semibold text-ink">
          Search
          <input
            id="resource-search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className={controlClass}
            placeholder="Search title, description, category"
          />
        </label>

        <label htmlFor="category-filter" className="grid gap-2 text-sm font-semibold text-ink">
          Category
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
            className={controlClass}
          >
            <option>All</option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>

        <label htmlFor="status-filter" className="grid gap-2 text-sm font-semibold text-ink">
          Status
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(event) => onStatusChange(event.target.value)}
            className={controlClass}
          >
            <option>All</option>
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
