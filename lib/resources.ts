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
  postedBy?: string | null;
  createdAt?: string | null;
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
  postedBy: defaultPostedBy
};

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
    createdAt: new Date().toISOString()
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
    createdAt: new Date().toISOString()
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
    createdAt: new Date().toISOString()
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
    createdAt: new Date().toISOString()
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
    createdAt: new Date().toISOString()
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
      new Date().toISOString()
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
    createdAt: new Date().toISOString()
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
    created_at: resource.createdAt
  };
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
  return [
    `📌 ${resource.title}`,
    "",
    `🧩 Category: ${resource.category}`,
    resource.difficulty ? `📈 Difficulty: ${resource.difficulty}` : null,
    `📍 Status: ${resource.status}`,
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
