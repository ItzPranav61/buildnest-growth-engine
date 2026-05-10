export const categories = [
  "Internship",
  "Hackathon",
  "Open Source",
  "Learning",
  "Community",
  "Tool",
  "Freebie",
  "Project"
] as const;

export type Category = (typeof categories)[number];

export const statuses = ["Active", "Upcoming", "Expired"] as const;

export type Status = (typeof statuses)[number];

export const creationStatuses = ["Active", "Upcoming"] as const;

export const dateFilters = ["All Dates", "Upcoming", "Ending Soon", "Deadline Passed"] as const;

export type DateFilter = (typeof dateFilters)[number];

export const qualityOptions = ["High", "Medium", "Low"] as const;

export type Quality = (typeof qualityOptions)[number];

export const sourceTypeOptions = ["Official", "Curated", "Community"] as const;

export type SourceType = (typeof sourceTypeOptions)[number];

export type Resource = {
  id: string;
  title: string;
  category: Category;
  type: string | null;
  link: string | null;
  description: string | null;
  difficulty: string | null;
  india_friendly: string | null;
  status: Status;
  postedBy: string;
  createdAt: string;
  startDate: string | null;
  endDate: string | null;
  deadlineDate: string | null;
  quality: Quality;
  sourceType: SourceType;
  featured?: boolean;
};

export type ResourceRow = {
  id: string;
  title: string;
  category: string;
  type: string | null;
  link: string | null;
  description: string | null;
  difficulty: string | null;
  india_friendly: string | null;
  status: string | null;
  posted_by?: string | null;
  created_at?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  deadline_date?: string | null;
  quality?: string | null;
  source_type?: string | null;
  postedBy?: string | null;
  createdAt?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  deadlineDate?: string | null;
  sourceType?: string | null;
  featured?: boolean | null;
};

export type NewResource = Omit<Resource, "id">;

export type NewResourcePayload = {
  title: string;
  category: Category;
  type: string | null;
  link: string | null;
  description: string | null;
  difficulty: string | null;
  india_friendly: string | null;
  status: Status;
  posted_by: string;
  created_at: string;
  start_date: string | null;
  end_date: string | null;
  deadline_date: string | null;
  quality: Quality;
  source_type: SourceType;
};

export type ResourceFormData = {
  title: string;
  category: Category;
  type: string;
  link: string;
  description: string;
  difficulty: string;
  india_friendly: string;
  status: Status;
  postedBy: string;
  startDate: string;
  endDate: string;
  deadlineDate: string;
  quality: Quality;
  sourceType: SourceType;
};

export const defaultPostedBy = "BuildNest Member";

export const emptyResourceForm: ResourceFormData = {
  title: "",
  category: "Internship",
  type: "",
  link: "",
  description: "",
  difficulty: "",
  india_friendly: "Yes",
  status: "Active",
  postedBy: defaultPostedBy,
  startDate: "",
  endDate: "",
  deadlineDate: "",
  quality: "Medium",
  sourceType: "Curated"
};

function dateOffset(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export const categoryBadgeClasses: Record<Category, string> = {
  Internship: "border-[#6D94C5]/35 bg-[#CBDCEB] text-ink",
  Hackathon: "border-[#6D94C5]/35 bg-[#CBDCEB] text-ink",
  "Open Source": "border-[#6D94C5]/35 bg-[#CBDCEB] text-ink",
  Learning: "border-[#D8CCB8] bg-[#E8DFCA] text-ink",
  Community: "border-[#6D94C5]/35 bg-[#CBDCEB] text-ink",
  Tool: "border-[#D8CCB8] bg-[#F5EFE6] text-ink",
  Freebie: "border-[#D8CCB8] bg-[#F5EFE6] text-ink",
  Project: "border-[#D8CCB8] bg-white text-ink"
};

export const statusBadgeClasses: Record<Status, string> = {
  Active: "border-[#6D94C5]/40 bg-[#CBDCEB] text-ink",
  Upcoming: "border-[#D8CCB8] bg-[#E8DFCA] text-ink",
  Expired: "border-danger/30 bg-dangerSoft text-danger"
};

export const qualityBadgeClasses: Record<Quality, string> = {
  High: "border-[#6D94C5]/45 bg-[#CBDCEB] text-ink",
  Medium: "border-line bg-page text-muted",
  Low: "border-line bg-white text-muted"
};

export const sourceTypeBadgeClasses: Record<SourceType, string> = {
  Official: "border-brand/40 bg-brandSoft text-[#304FB8]",
  Curated: "border-[#6D94C5]/35 bg-[#CBDCEB] text-ink",
  Community: "border-line bg-page text-muted"
};

export const demoResources: Resource[] = [
  {
    id: "demo-github-student-developer-pack",
    title: "GitHub Student Developer Pack",
    category: "Freebie",
    type: "Student benefits",
    link: "https://education.github.com/pack",
    description: "Free developer tools, credits, and learning resources for verified students.",
    difficulty: "Beginner",
    india_friendly: "Yes",
    status: "Active",
    postedBy: defaultPostedBy,
    createdAt: new Date().toISOString(),
    startDate: null,
    endDate: null,
    deadlineDate: null,
    quality: "High",
    sourceType: "Official"
  },
  {
    id: "demo-google-developer-student-clubs",
    title: "Google Developer Student Clubs",
    category: "Community",
    type: "Campus community",
    link: "https://gdsc.community.dev/",
    description: "Student-led developer communities with events, projects, and peer learning.",
    difficulty: "Beginner",
    india_friendly: "Yes",
    status: "Active",
    postedBy: defaultPostedBy,
    createdAt: new Date().toISOString(),
    startDate: dateOffset(12),
    endDate: dateOffset(13),
    deadlineDate: null,
    quality: "Medium",
    sourceType: "Official"
  },
  {
    id: "demo-google-summer-of-code",
    title: "Google Summer of Code",
    category: "Open Source",
    type: "Open source program",
    link: "https://summerofcode.withgoogle.com/",
    description: "A global program where contributors work with open source organizations.",
    difficulty: "Advanced",
    india_friendly: "Yes",
    status: "Upcoming",
    postedBy: defaultPostedBy,
    createdAt: new Date().toISOString(),
    startDate: dateOffset(30),
    endDate: dateOffset(120),
    deadlineDate: dateOffset(21),
    quality: "High",
    sourceType: "Official"
  },
  {
    id: "demo-mlh-fellowship",
    title: "MLH Fellowship",
    category: "Internship",
    type: "Remote fellowship",
    link: "https://fellowship.mlh.io/",
    description: "A remote fellowship for developers to contribute to real projects in teams.",
    difficulty: "Intermediate",
    india_friendly: "Yes",
    status: "Expired",
    postedBy: defaultPostedBy,
    createdAt: new Date().toISOString(),
    startDate: dateOffset(-30),
    endDate: dateOffset(-2),
    deadlineDate: dateOffset(-7),
    quality: "Medium",
    sourceType: "Curated"
  },
  {
    id: "demo-kaggle-competitions",
    title: "Kaggle Competitions",
    category: "Hackathon",
    type: "Data science challenge",
    link: "https://www.kaggle.com/competitions",
    description: "Competitions for practicing machine learning, analytics, and problem solving.",
    difficulty: "Intermediate",
    india_friendly: "Yes",
    status: "Active",
    postedBy: defaultPostedBy,
    createdAt: new Date().toISOString(),
    startDate: dateOffset(2),
    endDate: dateOffset(6),
    deadlineDate: dateOffset(6),
    quality: "Medium",
    sourceType: "Community"
  }
];

export function normalizeCategory(category: string): Category {
  return categories.includes(category as Category) ? (category as Category) : "Learning";
}

export function normalizeStatus(status: string | null | undefined): Status {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "upcoming") {
    return "Upcoming";
  }

  if (normalizedStatus === "expired") {
    return "Expired";
  }

  return "Active";
}

export function normalizeQuality(quality: string | null | undefined): Quality {
  return qualityOptions.includes(quality as Quality) ? (quality as Quality) : "Medium";
}

export function normalizeSourceType(sourceType: string | null | undefined): SourceType {
  return sourceTypeOptions.includes(sourceType as SourceType)
    ? (sourceType as SourceType)
    : "Curated";
}

export function normalizeResource(resource: Resource | ResourceRow): Resource {
  return {
    id: resource.id,
    title: resource.title,
    category: normalizeCategory(resource.category),
    type: resource.type ?? null,
    link: resource.link ?? null,
    description: resource.description ?? null,
    difficulty: resource.difficulty ?? null,
    india_friendly: resource.india_friendly ?? null,
    status: normalizeStatus(resource.status),
    postedBy:
      ("postedBy" in resource ? resource.postedBy : resource.posted_by)?.trim() ||
      defaultPostedBy,
    createdAt:
      ("createdAt" in resource ? resource.createdAt : resource.created_at) ||
      new Date().toISOString(),
    startDate: ("startDate" in resource ? resource.startDate : resource.start_date) || null,
    endDate: ("endDate" in resource ? resource.endDate : resource.end_date) || null,
    deadlineDate:
      ("deadlineDate" in resource ? resource.deadlineDate : resource.deadline_date) || null,
    quality: normalizeQuality(resource.quality),
    sourceType: normalizeSourceType(
      "sourceType" in resource ? resource.sourceType : resource.source_type
    ),
    featured: Boolean(resource.featured)
  };
}

export function toResourceFormPayload(form: ResourceFormData): NewResource {
  return {
    title: form.title.trim(),
    category: form.category,
    type: form.type.trim() || null,
    link: form.link.trim() || null,
    description: form.description.trim() || null,
    difficulty: form.difficulty.trim() || null,
    india_friendly: form.india_friendly.trim() || null,
    status: form.status,
    postedBy: form.postedBy.trim() || defaultPostedBy,
    createdAt: new Date().toISOString(),
    startDate: form.startDate || null,
    endDate: form.endDate || null,
    deadlineDate: form.deadlineDate || null,
    quality: form.quality,
    sourceType: form.sourceType
  };
}

export function toSupabaseResourcePayload(resource: NewResource): NewResourcePayload {
  return {
    title: resource.title,
    category: resource.category,
    type: resource.type,
    link: resource.link,
    description: resource.description,
    difficulty: resource.difficulty,
    india_friendly: resource.india_friendly,
    status: resource.status,
    posted_by: resource.postedBy,
    created_at: resource.createdAt,
    start_date: resource.startDate,
    end_date: resource.endDate,
    deadline_date: resource.deadlineDate,
    quality: resource.quality,
    source_type: resource.sourceType
  };
}

function parseDateOnly(dateValue: string | null | undefined) {
  if (!dateValue) {
    return null;
  }

  const [year, month, day] = dateValue.slice(0, 10).split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function todayStart() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function isDatePassed(dateValue: string | null | undefined) {
  const date = parseDateOnly(dateValue);
  return Boolean(date && date < todayStart());
}

export function isResourceDatePassed(resource: Resource) {
  return isDatePassed(resource.deadlineDate) || isDatePassed(resource.endDate);
}

export function isResourceEndingSoon(resource: Resource) {
  const today = todayStart();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  return [resource.deadlineDate, resource.endDate].some((dateValue) => {
    const date = parseDateOnly(dateValue);
    return Boolean(date && date >= today && date <= nextWeek);
  });
}

export function isResourceUpcoming(resource: Resource) {
  const startDate = parseDateOnly(resource.startDate);
  return resource.status === "Upcoming" || Boolean(startDate && startDate > todayStart());
}

export function matchesDateFilter(resource: Resource, dateFilter: DateFilter) {
  if (dateFilter === "Upcoming") {
    return isResourceUpcoming(resource);
  }

  if (dateFilter === "Ending Soon") {
    return isResourceEndingSoon(resource);
  }

  if (dateFilter === "Deadline Passed") {
    return isResourceDatePassed(resource);
  }

  return true;
}

export function getResourceSortScore(resource: Resource) {
  if (resource.featured) {
    return 0;
  }

  if (resource.status === "Active") {
    return isResourceEndingSoon(resource) ? 1 : 2;
  }

  if (resource.status === "Upcoming" || isResourceUpcoming(resource)) {
    return 3;
  }

  return 4;
}

export function formatDateLabel(dateValue: string | null | undefined) {
  const date = parseDateOnly(dateValue);

  if (!date) {
    return null;
  }

  const day = date.getDate();
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

function formatDateWithoutYear(dateValue: string) {
  const date = parseDateOnly(dateValue);

  if (!date) {
    return null;
  }

  const day = date.getDate();
  const month = date.toLocaleString("en-GB", { month: "short" });

  return `${day} ${month}`;
}

export function formatTimelineLabel(resource: Resource) {
  if (resource.startDate && resource.endDate) {
    const startDate = parseDateOnly(resource.startDate);
    const endDate = parseDateOnly(resource.endDate);
    const startLabel = startDate && endDate && startDate.getFullYear() === endDate.getFullYear()
      ? formatDateWithoutYear(resource.startDate)
      : formatDateLabel(resource.startDate);
    const endLabel = formatDateLabel(resource.endDate);

    return startLabel && endLabel ? `${startLabel} - ${endLabel}` : null;
  }

  if (resource.startDate) {
    return `Starts: ${formatDateLabel(resource.startDate)}`;
  }

  if (resource.endDate) {
    return `Ends: ${formatDateLabel(resource.endDate)}`;
  }

  return null;
}

export function formatRelativeTime(timestamp: string) {
  const createdTime = new Date(timestamp).getTime();

  if (Number.isNaN(createdTime)) {
    return "just now";
  }

  const diffInSeconds = Math.max(0, Math.floor((Date.now() - createdTime) / 1000));
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return "just now";
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  return `${diffInDays}d ago`;
}

export function formatDiscordPost(resource: Resource) {
  const timelineLabel = formatTimelineLabel(resource);
  const deadlineLabel = formatDateLabel(resource.deadlineDate);

  return [
    `📌 ${resource.title}`,
    "",
    `🧩 Category: ${resource.category}`,
    resource.difficulty ? `📈 Difficulty: ${resource.difficulty}` : null,
    `📍 Status: ${resource.status}`,
    `\u2B50 Quality: ${resource.quality}`,
    `\uD83D\uDD0E Source: ${resource.sourceType}`,
    timelineLabel ? `🗓️ Timeline: ${timelineLabel}` : null,
    deadlineLabel ? `⏳ Deadline: ${deadlineLabel}` : null,
    resource.india_friendly === "Yes"
      ? "🇮🇳 India Friendly"
      : resource.india_friendly
        ? `🇮🇳 India Friendly: ${resource.india_friendly}`
        : null,
    resource.description ? `\n${resource.description}` : null,
    resource.link ? `\n🔗 ${resource.link}` : null
  ]
    .filter(Boolean)
    .join("\n");
}
