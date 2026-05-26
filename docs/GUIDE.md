# PixelGamez: The Complete Guide

Welcome to the comprehensive technical and administrative guide for **PixelGamez**. This document covers everything you need to know about the architecture, features, database migrations, monetization, and managing the platform as an Owner.

---

## 1. Core Architecture & Database

PixelGamez is built on **Next.js 14** using the modern App Router architecture. To support complex API routing, file uploads (like avatars and ad images), and custom database connectivity, the application boots through a custom **Express Server (`server.ts`)**.

### Relational PostgreSQL Database
We have migrated the core data layer from flat JSON files to a robust, scalable **PostgreSQL database** using **Prisma ORM**.
- The Prisma schema is located at `prisma/schema.prisma`.
- When deploying or after updating models, always sync your database by running:
  ```bash
  npx prisma db push
  ```

Your database completely manages:
- **Users & Sessions**
- **Approved Games & Submissions**
- **Favorites & Analytics**
- **Ads & Site Notifications**

*To explore the database graphically, you can run `npx prisma studio`.*

---

## 2. Authentication & Email Verification

Security and user validation are natively built into PixelGamez.

### Sessions
When a user logs in, the backend creates an encrypted session token stored directly in the PostgreSQL database. The user receives a secure, HTTP-only cookie (`pixelgamez_session`) that the application verifies across every page load via `AuthContext.tsx`.

### Email Verification (OTP)
When a user registers for an account, they must verify their email address. We use **Resend** to securely email them a 6-digit One-Time Password (OTP).
- You MUST provide your Resend API Key inside the `.env` file (`RESEND_API_KEY`).
- The OTP lasts for a limited time and must be validated before the account creation is finalized in the database.

### Managing Roles (Owner vs Moderator)
By default, everyone who signs up is a standard `user`.
To elevate a user to **Owner** or **Moderator**, you modify `lib/users.ts`.
Look for these constants at the top of the file:
```typescript
const OWNER_EMAILS = ['owner@example.com'];
const MOD_EMAILS = ['mod@example.com'];
```
Add your registered email address to `OWNER_EMAILS`. The next time you refresh, your session will automatically sync and upgrade your account to Owner.

* **Owners** have unrestricted access: Approving games, managing Ads, viewing analytics, and sending Notices.
* **Moderators** can approve/reject games and send Notices.

---

## 3. Game Submission & Approval

The platform thrives on community content.
1. **Developer Portal:** Any logged-in user can visit the Developer portal to submit a game. They provide a Title, Description, iFrame Embed URL, Category, and optional Steam/Discord links.
2. **Pending State:** The submission is securely inserted into the PostgreSQL `Submission` table with a status of `pending`.
3. **Approval:** Owners/Moderators visit the **Admin Dashboard** to review submissions. Upon clicking "Approve", the game is authorized, tagged with the reviewer's ID, and becomes instantly playable on the site.

---

## 4. User Interaction Systems

We have fully fleshed out features to maximize user engagement on the site.

### The Favorite System
Users can curate their own library by clicking the **Heart Icon** located on the game player control bar. This action creates a relational tie in the Postgres database linking the `User` and the `Game`. Favorited games instantly appear in a specialized "Favorites" grid on their public user profile.

### The Voting System
Instead of simplistic local storage tracking, every "Like" and "Dislike" cast on a game securely maps directly to the authenticated user ID. A user cannot double-vote, ensuring accurate global ratings.

---

## 5. Monetization & Advertisements

PixelGamez provides both an internal, customizable Ad Server and seamless external integration for providers like Google AdSense.

### 1. Internal Ad Server
You can run your own sponsorships or direct ads without relying on Google.
1. Go to the **Admin Dashboard** > **Ad Management** tab (Owner only).
2. Upload an image banner (e.g., 728x90, 300x250).
3. Provide the destination `URL`.
4. Select a **Placement** (`banner-home`, `sidebar`, `game-side`, `profile`).

**Ad Tracking:**
Every time an ad renders on screen, the platform silently pings an impression endpoint. Clicking the ad pings a click-tracker. You can view the **Impressions, Clicks, and Click-Through Rate (CTR)** directly inside your Admin Dashboard.

### 2. Google AdSense Integration
If you wish to supplement your site with AdSense, we have made it incredibly easy. You do not need to alter any code!
1. Open your `.env` file at the root of the project.
2. Provide your AdSense Client Publisher ID to the dedicated variable:
   ```env
   NEXT_PUBLIC_ADSENSE_CLIENT_ID="ca-pub-XXXXXXXXXXXXX"
   ```
3. The platform will automatically inject the required Google AdSense JavaScript tags into the global layout if that variable exists.

---

## 6. Site Analytics

For Owners wanting to understand player behavior, a dedicated **Analytics Panel** exists on the Admin Dashboard.
This dashboard aggressively sorts your database to show you the most popular titles. You can instantly view:
- **Total Plays** per game.
- **Global Ratings** (Upvote to Downvote ratio).
- **Total Favorites** globally accumulated for a game.

---

## 7. Notice & Inbox System

Need to tell the community about a new feature or a massive game drop?
1. Go to the **Admin Dashboard** > **Notices & Inbox**.
2. Create a Notice with a Title and Message.
3. It instantly broadcasts to all users. 
4. A red badge with the unread count will appear on the bell icon in their navigation bar. Once they click the bell, it marks them as read.

---

## 8. Multi-Language Support (I18n)

PixelGamez supports **28 languages**.
The system works using `I18nContext.tsx` which wraps the entire app. It defaults to checking the user's browser language (`navigator.language`) and falling back to English.

**Translations Dictionary:**
All translations are stored in `lib/translations.ts`.
If you ever add a new button or text to the site, add a key to the `en` (English) dictionary. To translate it to the other 27 languages, run:
```bash
python translate.py
```
This script automatically scans for missing keys and uses Google Translate to populate them.

---

## 9. User Profiles & Customization

Every user has a personalized public profile. They can:
* Upload a custom **Avatar** (saved securely and referenced in the DB).
* Change their Display Name and **Bio** (which includes "About Me", "Country", and "Working On").
* Set a custom **Profile Banner**. They can provide standard CSS colors (e.g., `red`, `#ff0000`) or specific gradient strings directly through the UI.

---

### Conclusion
You are fully equipped to run and manage PixelGamez. Leverage the robust Postgres backend, monitor your custom ad CTRs or plug in your AdSense, keep an eye on user analytics, and build an incredible gaming community!
