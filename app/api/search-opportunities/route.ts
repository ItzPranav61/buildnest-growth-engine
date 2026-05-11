import { NextResponse } from "next/server";
import {
  normalizeCategory,
  type Category,
  type OpportunitySearchResult
} from "@/lib/resources";

export const runtime = "nodejs";

type GoogleSearchItem = {
  title?: string;
  link?: string;
  snippet?: string;
  displayLink?: string;
};

type GoogleSearchResponse = {
  items?: GoogleSearchItem[];
  error?: {
    code?: number;
    message?: string;
    errors?: Array<{ reason?: string; message?: string }>;
  };
};

function cleanSource(link: string, displayLink?: string) {
  if (displayLink) {
    return displayLink.replace(/^www\./, "");
  }

  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return "Unknown source";
  }
}

function guessCategory(title: string, snippet: string, selectedCategory: string | null): Category {
  if (selectedCategory && selectedCategory !== "All") {
    return normalizeCategory(selectedCategory);
  }

  const combinedText = `${title} ${snippet}`.toLowerCase();

  if (combinedText.includes("intern")) {
    return "Internship";
  }

  if (combinedText.includes("hackathon") || combinedText.includes("challenge")) {
    return "Hackathon";
  }

  if (combinedText.includes("open source") || combinedText.includes("oss")) {
    return "Open Source";
  }

  if (combinedText.includes("community") || combinedText.includes("club")) {
    return "Community";
  }

  if (combinedText.includes("tool") || combinedText.includes("credit") || combinedText.includes("pack")) {
    return "Tool";
  }

  if (combinedText.includes("free")) {
    return "Freebie";
  }

  if (combinedText.includes("project") || combinedText.includes("idea")) {
    return "Project";
  }

  return "Learning";
}

function isQuotaError(response: GoogleSearchResponse) {
  const reason = response.error?.errors?.[0]?.reason?.toLowerCase() ?? "";
  const message = response.error?.message?.toLowerCase() ?? "";

  return reason.includes("limit") || reason.includes("quota") || message.includes("quota");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim();
  const category = searchParams.get("category")?.trim() || null;
  const googleSearchApiKey = process.env.GOOGLE_SEARCH_API_KEY?.trim() ?? "";
  const googleSearchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID?.trim() ?? "";
  const hasGoogleSearchApiKey = Boolean(googleSearchApiKey);
  const hasGoogleSearchEngineId = Boolean(googleSearchEngineId);

  console.info("[Opportunity Radar] Google env check", {
    hasGoogleSearchApiKey,
    hasGoogleSearchEngineId
  });

  if (!hasGoogleSearchApiKey || !hasGoogleSearchEngineId) {
    return NextResponse.json(
      { error: "Google Search is not configured. Add GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_ENGINE_ID." },
      { status: 500 }
    );
  }

  if (!query) {
    return NextResponse.json({ error: "Search query is required." }, { status: 400 });
  }

  const googleUrl = new URL("https://www.googleapis.com/customsearch/v1");
  googleUrl.searchParams.set("key", googleSearchApiKey);
  googleUrl.searchParams.set("cx", googleSearchEngineId);
  googleUrl.searchParams.set("q", query);
  googleUrl.searchParams.set("num", "8");

  let response: Response;
  let payload: GoogleSearchResponse;

  try {
    response = await fetch(googleUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store"
    });
    payload = (await response.json()) as GoogleSearchResponse;
  } catch {
    return NextResponse.json(
      { error: "Google Search is unavailable. Try again later." },
      { status: 502 }
    );
  }

  if (!response.ok || payload.error) {
    const errorMessage = isQuotaError(payload)
      ? "Google Search quota exceeded. Try again later."
      : payload.error?.message || "Google Search failed. Try another query.";

    return NextResponse.json({ error: errorMessage }, { status: response.status || 500 });
  }

  const results: OpportunitySearchResult[] = (payload.items ?? [])
    .filter((item) => item.title && item.link)
    .map((item) => {
      const title = item.title ?? "";
      const link = item.link ?? "";
      const snippet = item.snippet ?? "";

      return {
        title,
        link,
        snippet,
        source: cleanSource(link, item.displayLink),
        categoryGuess: guessCategory(title, snippet, category),
        status: "Active",
        quality: "Medium",
        sourceType: "Curated"
      };
    });

  return NextResponse.json({ results });
}
