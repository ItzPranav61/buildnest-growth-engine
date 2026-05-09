# BuildNest Growth Engine

A lightweight resource dashboard for curating useful opportunities for the BuildNest Discord community.

The app is intentionally simple: add resources, browse/filter them, copy a Discord-ready post, and manage data through Supabase when connected. If Supabase is unavailable, the app stays usable with local in-memory demo resources.

## Features

- Resource cards for internships, hackathons, open source, learning, communities, tools, freebies, and projects
- Add/delete resources with Supabase CRUD
- Local demo mode fallback when Supabase env vars are missing or fetch fails
- Search by title, description, or category
- Filter by category and status
- Status system: `Open`, `Upcoming`, `Expired`
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
  status text default 'open',
  created_at timestamp with time zone default now()
);
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

create policy "Anyone can delete resources"
on resources for delete
using (true);
```

Optional seed data:

```sql
insert into resources (title, category, type, link, description, difficulty, india_friendly, status)
values
  ('GitHub Student Developer Pack', 'Freebie', 'Student benefits', 'https://education.github.com/pack', 'Free developer tools, credits, and learning resources for verified students.', 'Beginner', 'Yes', 'Open'),
  ('Google Developer Student Clubs', 'Community', 'Campus community', 'https://gdsc.community.dev/', 'Student-led developer communities with events, projects, and peer learning.', 'Beginner', 'Yes', 'Open'),
  ('Google Summer of Code', 'Open Source', 'Open source program', 'https://summerofcode.withgoogle.com/', 'A global program where contributors work with open source organizations.', 'Advanced', 'Yes', 'Upcoming'),
  ('MLH Fellowship', 'Internship', 'Remote fellowship', 'https://fellowship.mlh.io/', 'A remote fellowship for developers to contribute to real projects in teams.', 'Intermediate', 'Yes', 'Open'),
  ('Kaggle Competitions', 'Hackathon', 'Data science challenge', 'https://www.kaggle.com/competitions', 'Competitions for practicing machine learning, analytics, and problem solving.', 'Intermediate', 'Yes', 'Open');
```

## Demo Mode

When Supabase env vars are missing or fetching resources fails, the app shows:

`Database not connected yet. Using local demo mode.`

Demo mode uses five in-memory fallback resources. Add/delete works locally for the current browser session only.

## Screenshots

Add screenshots here before deployment:

- Dashboard resource view
- Add resource form
- Search/filter state

## Known Limitations

- No authentication or permissions
- No edit/update flow yet
- Demo mode data is not persisted
- Public insert/delete policies are only appropriate for an early no-auth MVP
- No Discord bot, AI enrichment, scraping, analytics, or payments

## Future Roadmap

- Add auth and role-based moderation
- Add edit resource flow
- Add saved Discord post templates
- Add Discord bot publishing
- Add AI-assisted summarization after core workflows are stable
