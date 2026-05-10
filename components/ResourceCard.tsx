import {
  categoryBadgeClasses,
  formatRelativeTime,
  statusBadgeClasses,
  type Resource
} from "@/lib/resources";

type ResourceCardProps = {
  resource: Resource;
  isSaved: boolean;
  isDeleting: boolean;
  onToggleSave: (id: string) => void;
  onCopy: (resource: Resource) => void;
  onDelete: (id: string) => void;
};

export function ResourceCard({
  resource,
  isSaved,
  isDeleting,
  onToggleSave,
  onCopy,
  onDelete
}: ResourceCardProps) {
  return (
    <article className="flex min-h-72 w-full min-w-0 flex-col rounded-xl border border-[#E2D8C9] bg-[#FFFDFC] p-5 text-ink shadow-[0_16px_36px_rgba(36,48,65,0.13)] transition hover:-translate-y-0.5 hover:border-[#D3C4AF] hover:shadow-[0_20px_42px_rgba(36,48,65,0.17)] sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2.5">
          <span
            className={`max-w-full break-words rounded-full border px-3 py-1 text-xs font-semibold ${categoryBadgeClasses[resource.category]}`}
          >
            {resource.category}
          </span>

          <span
            className={`max-w-full break-words rounded-full border px-3 py-1 text-xs font-semibold ${statusBadgeClasses[resource.status]}`}
          >
            {resource.status}
          </span>

          {resource.difficulty && (
            <span className="max-w-full break-words rounded-full border border-line bg-page px-3 py-1 text-xs font-medium text-muted">
              {resource.difficulty}
            </span>
          )}

          {resource.india_friendly === "Yes" && (
            <span className="rounded-full border border-line bg-page px-3 py-1 text-xs font-medium text-muted">
              &#x1F1EE;&#x1F1F3; India
            </span>
          )}
        </div>

        <button
          type="button"
          aria-pressed={isSaved}
          onClick={() => onToggleSave(resource.id)}
          className={`inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
            isSaved
              ? "border-brand bg-brandSoft text-[#304FB8]"
              : "border-line bg-white text-muted hover:border-brand hover:text-ink"
          }`}
        >
          {isSaved ? "Saved" : "Save"}
        </button>
      </div>

      <div className="mt-5 min-h-0 flex-1">
        <h3 className="break-words text-xl font-bold leading-snug text-ink">{resource.title}</h3>

        {resource.type && <p className="mt-2 break-words text-sm font-medium text-muted">{resource.type}</p>}

        <p className="mt-2 break-words text-xs font-medium leading-5 text-muted">
          Posted by {resource.postedBy} &bull; {formatRelativeTime(resource.createdAt)}
        </p>

        {resource.description && (
          <p className="mt-4 line-clamp-4 break-words text-sm leading-7 text-muted">
            {resource.description}
          </p>
        )}
      </div>

      <div className="mt-7 grid min-w-0 gap-2.5 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
        {resource.link ? (
          <a
            href={resource.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 min-w-0 items-center justify-center break-words rounded-full bg-brand px-5 py-2 text-center text-sm font-semibold text-white shadow-[0_8px_16px_rgba(91,127,255,0.18)] transition hover:bg-brandDark"
          >
            Open Link
          </a>
        ) : (
          <span className="hidden sm:block" />
        )}

        <button
          type="button"
          onClick={() => onCopy(resource)}
          className="inline-flex min-h-11 min-w-0 items-center justify-center break-words rounded-full bg-soft px-4 py-2 text-center text-sm font-semibold text-ink shadow-[0_6px_14px_rgba(36,48,65,0.10)] transition hover:bg-[#B9D2E5]"
        >
          Copy Discord Post
        </button>

        <button
          type="button"
          disabled={isDeleting}
          onClick={() => onDelete(resource.id)}
          className="inline-flex min-h-11 min-w-0 items-center justify-center break-words rounded-full border border-danger/45 bg-white px-4 py-2 text-center text-sm font-semibold text-danger transition hover:border-danger hover:bg-dangerSoft hover:text-[#7E2E3D] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
}
