# BuildNest Growth Engine

A lightweight resource dashboard for curating useful opportunities for the BuildNest Discord community.

The app is intentionally simple: add resources, browse/filter them, copy a Discord-ready post, and manage data through Supabase when connected. If Supabase is unavailable, the app stays usable with local in-memory demo resources.

## Features

- Resource cards for internships, hackathons, open source, learning, communities, tools, freebies, and projects
- Add/delete resources with Supabase CRUD
- Local demo mode fallback when Supabase env vars are missing or fetch fails
- Search by title, description, or category
- Filter by category, status, quality, saved resources, and date state
- Status system: create `Active`/`Upcoming` resources and mark resources as `Expired` or `Active`
- Optional start, end, and deadline dates with a compact timeline display
- Quality and source trust labels for lightweight curation
- Bulk JSON import for AI-generated resource arrays, with duplicate checks
- Export current resources as JSON
- Community metadata: posted-by label and lightweight relative time
- Browser-local saved resources with a Saved Only filter
- Copy formatted Discord posts
- Loading skeletons, empty states, inline form validation, and toast notifications

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Only use the public anon key in this app. Do not expose Supabase service-role or secret keys in browser code.

## Supabase Setup

Create the table:

```sql
create table resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  type text,
  link text,
  description text,
  difficulty text,
  india_friendly text,
  status text default 'Active',
  quality text default 'Medium',
  source_type text default 'Curated',
  posted_by text default 'BuildNest Member',
  start_date date,
  end_date date,
  deadline_date date,
  created_at timestamp with time zone default now()
);
```

If your table already exists, run this migration:

```sql
alter table resources
add column if not exists posted_by text default 'BuildNest Member';

alter table resources
add column if not exists created_at timestamp with time zone default now();

alter table resources
add column if not exists start_date date;

alter table resources
add column if not exists end_date date;

alter table resources
add column if not exists deadline_date date;

alter table resources
add column if not exists quality text default 'Medium';

alter table resources
add column if not exists source_type text default 'Curated';

update resources
set posted_by = 'BuildNest Member'
where posted_by is null or posted_by = '';

update resources
set quality = 'Medium'
where quality is null or quality = '';

update resources
set source_type = 'Curated'
where source_type is null or source_type = '';

update resources
set created_at = now()
where created_at is null;
```

For this no-auth MVP, enable simple development policies:

```sql
alter table resources enable row level security;

create policy "Anyone can read resources"
on resources for select
using (true);

create policy "Anyone can insert resources"
on resources for insert
with check (true);

create policy "Anyone can update resources"
on resources for update
using (true)
with check (true);

create policy "Anyone can delete resources"
on resources for delete
using (true);
```

Optional seed data:

```sql
insert into resources (title, category, type, link, description, difficulty, india_friendly, status, posted_by, start_date, end_date, deadline_date, quality, source_type)
values
  ('GitHub Student Developer Pack', 'Freebie', 'Student benefits', 'https://education.github.com/pack', 'Free developer tools, credits, and learning resources for verified students.', 'Beginner', 'Yes', 'Active', 'BuildNest Member', null, null, null, 'High', 'Official'),
  ('Google Developer Student Clubs', 'Community', 'Campus community', 'https://gdsc.community.dev/', 'Student-led developer communities with events, projects, and peer learning.', 'Beginner', 'Yes', 'Active', 'BuildNest Member', current_date + 12, current_date + 13, null, 'Medium', 'Official'),
  ('Google Summer of Code', 'Open Source', 'Open source program', 'https://summerofcode.withgoogle.com/', 'A global program where contributors work with open source organizations.', 'Advanced', 'Yes', 'Upcoming', 'BuildNest Member', current_date + 30, current_date + 120, current_date + 21, 'High', 'Official'),
  ('MLH Fellowship', 'Internship', 'Remote fellowship', 'https://fellowship.mlh.io/', 'A remote fellowship for developers to contribute to real projects in teams.', 'Intermediate', 'Yes', 'Expired', 'BuildNest Member', current_date - 30, current_date - 2, current_date - 7, 'Medium', 'Curated'),
  ('Kaggle Competitions', 'Hackathon', 'Data science challenge', 'https://www.kaggle.com/competitions', 'Competitions for practicing machine learning, analytics, and problem solving.', 'Intermediate', 'Yes', 'Active', 'BuildNest Member', current_date + 2, current_date + 6, current_date + 6, 'Medium', 'Community');
```

## Demo Mode

When Supabase env vars are missing or fetching resources fails, the app shows:

`Database not connected yet. Using local demo mode.`

Demo mode uses five in-memory fallback resources. Add/delete works locally for the current browser session only.

## Bulk Import Format

Paste a JSON array into the Bulk Import panel. The importer requires `title`, `category`, `description`, and `link`. Optional or invalid values safely fall back to app defaults, and duplicate titles or links are skipped.

```json
[
  {
    "title": "Google Summer of Code",
    "category": "Open Source",
    "description": "A global program where contributors work with open source organizations.",
    "whyValuable": "Strong open-source portfolio value.",
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
]
```

Supported category aliases from AI output are normalized into the app categories. For example, `Tool / Freebie` becomes `Freebie`, `Learning Platform` becomes `Learning`, and `Startup Resource` becomes `Project`.

## Screenshots

Add screenshots here before deployment:

- Dashboard resource view
- Add resource form
- Search/filter state

## Known Limitations

- No authentication or permissions
- No edit/update flow yet
- No CSV or file upload import yet
- Demo mode data is not persisted
- Saved resources are stored per browser/device with `localStorage`
- Public insert/delete policies are only appropriate for an early no-auth MVP
- No Discord bot, AI enrichment, scraping, analytics, or payments

## Future Roadmap

- Add auth and role-based moderation
- Add edit resource flow
- Add saved Discord post templates
- Add Discord bot publishing
- Add AI-assisted summarization after core workflows are stable
