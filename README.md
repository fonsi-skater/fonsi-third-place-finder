\# Fonsi Third Place Finder



A hyperlocal directory of recurring community groups - hiking crews, cycling clubs, board game nights, tech meetups, faith groups, and more - built to help people discover real gatherings near them instead of scrolling dead group chats.



Named after the idea of a "third place": not home, not work, but the casual spot where community actually happens.



\## What it does



\- \*\*Automatically discovers venues\*\* near a chosen location using OpenStreetMap - no manual data entry, no paid APIs

\- \*\*Search by area\*\* - type any place name and find listings within an 8km radius

\- \*\*Filter by category\*\* - sports, hobbies, faith, tech, arts, and more

\- \*\*Community submissions\*\* - anyone can submit a group; every submission is reviewed before going live

\- \*\*"I'm interested" signal\*\* - see how many people are interested in a listing before deciding to show up

\- \*\*Direct shareable links\*\* - every listing has its own permanent URL, easy to send to a friend

\- \*\*One-tap WhatsApp sharing\*\*

\- \*\*Runs on its own\*\* - a daily scheduled job keeps listings fresh with zero manual maintenance



\## Tech stack



\- \*\*Next.js 14\*\* (App Router) + TypeScript

\- \*\*Supabase\*\* (Postgres + Row Level Security) for data storage

\- \*\*Tailwind CSS\*\* for styling

\- \*\*OpenStreetMap\*\* (Overpass API + Nominatim) for free, automated venue data

\- \*\*Vercel Cron\*\* for the daily automated fetch job



\## Why OpenStreetMap instead of Google Places or Eventbrite



Eventbrite closed its public event-search API in 2019, and Google Places requires a billing account with real charge risk beyond a limited free tier. OpenStreetMap's Overpass and Nominatim APIs are free, keyless, and require no billing account - the trade-off is community-maintained data coverage rather than a commercial dataset.



\## Getting started



1\. Clone the repo and install dependencies:

```bash

&#x20;  npm install

```



2\. Copy `.env.example` to `.env.local` and fill in your Supabase project's keys.



3\. Run the SQL files in `supabase/migrations/` (in order) via the Supabase SQL Editor.



4\. Start the dev server:

```bash

&#x20;  npm run dev

```



5\. Visit `http://localhost:3000`.



\## Project structure

