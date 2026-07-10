# PixelGamez 

https://www.pixelgamez.com/ PixelGamez is a modern, feature-rich web platform for playing, discovering, and publishing web games (like .io games, HTML5 games, and Flash emulations). 

Built with Next.js 14, React, and a lightweight JSON-based backend, the platform is designed to be extremely fast, easily extendable, and highly community-driven!!

##  Key Features

- **Massive Game Library:** Browse and search through games categorized by genre (Action, Adventure, Puzzle, .io, etc.).
- **Developer Portal:** Anyone can submit a game Developers can embed their games, add descriptions, and link out to their Discord or Steam pages.
- **Admin & Moderation:** A dedicated dashboard for Owners and Moderators to review pending game submissions, ensuring only quality games reach the homepage.
- **AdSense & Custom Ads:** A built-in, highly customizable advertisement system. Owners can upload ad banners, assign them to specific page placements (e.g., sidebar, profile, game-below), and track impressions and clicks
- **Global Localization:** The platform supports **28 languages**, auto-detecting the user's browser language with instantaneous switching powered by a custom React Context and a Python-powered translation backend.
- **User Profiles:** Players can create accounts, customize their bio, upload avatars, and personalize their profile banners with custom images or CSS gradients. Players can also like/dislike games and add them to their favorites list
- **Notice & Inbox System:** A site-wide announcement system allows Owners and Moderators to broadcast updates to all users via a notification bell in the navigation bar.

##  Technology Stack

- **Frontend:** Next.js 14 (App Router), React, standard CSS (`app/globals.css`).
- **Backend:** Express-like routing via a custom `server.ts` entry point running alongside Next.js.
- **Database:** Lightweight, JSON-based file storage located in the `/data` directory (no external database required to get started).
- **Authentication:** Custom cookie-based session management (`lib/sessions.ts`).
- **Translation:** Deep-Translator (Python) scripting used to populate `lib/translations.ts`.

## Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Run the Development Server:**
   ```bash
   npm run dev
   ```
3. **Open the App:** Navigate to `http://localhost:3000` in your browser.

## Documentation

For a deep dive into how everything works under the hood (including how to grant yourself the Owner role, how the Ad system works, and how data is managed), please check out our comprehensive guide:

👉 **[Read the Developer Guide](docs/GUIDE.md)**
