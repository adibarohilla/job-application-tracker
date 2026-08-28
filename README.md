# Career Compass — Job Application Tracker

A clean, local-first dashboard for managing a personal job search. Add applications, track their progress, filter the list, and keep interview notes in one place.

## Features

- Create, edit, and delete job applications
- Track Applied, Interview, Offer, and Rejected statuses
- Search by company, role, or location
- Dashboard metrics and responsive design
- Browser storage: works immediately without accounts, APIs, or paid services
- Optional Supabase schema for free authentication and cloud syncing later

## Run locally

```bash
npm install
npm run dev
```

## Free Supabase upgrade path

The app works without Supabase. When you want accounts and cloud data, create a free Supabase project, run [`supabase/schema.sql`](supabase/schema.sql) in its SQL Editor, and add the project URL and anon key to `.env` using `.env.example`.

## Tech stack

React, Vite, Lucide React, CSS, and browser local storage.
