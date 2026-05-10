import { ChangeEvent, FormEvent } from "react";

type BulkImportPanelProps = {
  value: string;
  isImporting: boolean;
  importSummary: string;
  importErrors: string[];
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
  onExport: () => void;
};

const exampleJson = `[
  {
    "title": "Google Summer of Code",
    "category": "Open Source",
    "description": "A global program where contributors work with open source organizations.",
    "whyValuable": "Great for open-source experience.",
    "difficulty": "Advanced",
    "indiaFriendly": "Yes",
    "status": "Active",
    "startDate": "2026-05-12",
    "endDate": "2026-08-18",
    "deadlineDate": "2026-05-10",
    "quality": "High",
    "sourceType": "Official",
    "link": "https://summerofcode.withgoogle.com/",
    "discordSummary": "Apply for a global open-source program."
  }
]`;

const inputClass =
  "min-h-44 w-full min-w-0 rounded-md border border-[#CFC0AA] bg-white px-3.5 py-3 font-mono text-xs leading-5 text-ink outline-none transition placeholder:text-muted hover:border-brand focus:border-brand focus:shadow-[0_0_0_3px_rgba(91,127,255,0.12)]";

export function BulkImportPanel({
  value,
  isImporting,
  importSummary,
  importErrors,
  onChange,
  onSubmit,
  onClear,
  onExport
}: BulkImportPanelProps) {
  function handleTextareaChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange(event.target.value);
  }

  return (
    <details className="rounded-xl border border-[#D1C1A9] bg-[#E8DFCA] text-ink shadow-[0_14px_34px_rgba(36,48,65,0.12)]">
      <summary className="cursor-pointer list-none px-4 py-4 text-sm font-bold text-ink sm:px-5">
        <span className="block">Bulk Import</span>
        <span className="mt-1 block text-sm font-normal leading-5 text-muted">
          Paste AI-generated JSON resource arrays here.
        </span>
      </summary>

      <form onSubmit={onSubmit} className="border-t border-[#D1C1A9] px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
        <label htmlFor="bulk-import-json" className="grid gap-2 text-sm font-semibold text-ink">
          JSON array
          <textarea
            id="bulk-import-json"
            value={value}
            onChange={handleTextareaChange}
            className={inputClass}
            placeholder={exampleJson}
            spellCheck={false}
          />
        </label>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="submit"
            disabled={isImporting || !value.trim()}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_16px_rgba(91,127,255,0.18)] transition hover:bg-brandDark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isImporting ? "Importing..." : "Import Resources"}
          </button>

          <button
            type="button"
            onClick={onClear}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#AFC8DC] bg-soft px-5 py-2 text-sm font-semibold text-ink shadow-[0_6px_14px_rgba(36,48,65,0.08)] transition hover:bg-[#B9D2E5]"
          >
            Clear
          </button>
        </div>

        <button
          type="button"
          onClick={onExport}
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[#CFC0AA] bg-white px-5 py-2 text-sm font-semibold text-ink transition hover:border-brand hover:text-[#304FB8]"
        >
          Export Resources
        </button>

        {importSummary && (
          <p className="mt-4 rounded-lg border border-[#AFC8DC] bg-soft px-3 py-2 text-sm font-semibold text-ink">
            {importSummary}
          </p>
        )}

        {importErrors.length > 0 && (
          <div className="mt-3 max-h-40 overflow-y-auto rounded-lg border border-danger/30 bg-dangerSoft px-3 py-2 text-xs leading-5 text-danger">
            {importErrors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </form>
    </details>
  );
}
