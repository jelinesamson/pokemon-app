# PokéDex Manager — Pokémon Card Management System

A complete, fully functional Pokémon card management web application built with **React + Vite + React Router DOM + Firebase Authentication + Firebase Realtime Database**.

Trainers can register, sign in, create Pokémon cards from a validated form, browse them as a responsive card grid, open a details page, edit records, and delete them. Every record is stored in and streamed from Firebase Realtime Database — there is no mock data, no static array acting as the database, and no localStorage fallback.

> **Important:** this repository does **not** include Firebase credentials. The app is fully wired for Firebase and will show a setup notice until you add your own project values to `.env.local`. Follow **§8 Firebase setup** below.

---

## Table of contents

1. [Project overview](#1-project-overview)
2. [Features](#2-features)
3. [Technology stack](#3-technology-stack)
4. [Routes](#4-routes)
5. [Project structure](#5-project-structure)
6. [Prerequisites](#6-prerequisites)
7. [Install dependencies](#7-install-dependencies)
8. [Firebase setup (required)](#8-firebase-setup-required)
9. [Environment variables](#9-environment-variables)
10. [Database structure](#10-database-structure)
11. [Security rules](#11-security-rules)
12. [How CRUD works](#12-how-crud-works)
13. [Search and filtering](#13-search-and-filtering)
14. [Run the project](#14-run-the-project)
15. [Manual testing checklist](#15-manual-testing-checklist)
16. [Mini demonstration video checklist](#16-mini-demonstration-video-checklist)
17. [Demonstrating Firebase](#17-demonstrating-firebase)
18. [Production build](#18-production-build)
19. [Troubleshooting](#19-troubleshooting)
20. [Notes and limitations](#20-notes-and-limitations)
21. [School submission checklist](#21-school-submission-checklist)

---

## 1. Project overview

PokéDex Manager is a Pokédex-inspired dashboard and card collection manager.

The core requirement is met end-to-end:

1. A signed-in trainer fills out the Pokémon form.
2. The app validates the input.
3. A unique Firebase key is generated with `push()`.
4. The complete record is written to `pokemon/{pushId}` with `set()`.
5. The record contains the trainer's UID in `createdBy`.
6. `onValue()` streams the trainer's records back into the UI as cards in real time.
7. Cards can be viewed, edited (`update()`) and deleted (`remove()`).

---

## 2. Features

### Authentication

- Email/password registration with full name, email, password and confirm password.
- Login with email and password.
- Logout from the sidebar, profile page and account panel.
- Authentication state monitored with `onAuthStateChanged()`.
- React Context (`AuthContext`) exposes the current user to the whole app.
- Protected routes redirect unauthenticated visitors to `/login`.
- Public-only routes redirect signed-in users to `/dashboard`.
- Friendly, specific error messages for Firebase Authentication error codes.
- Password show/hide toggle and password strength meter.
- Display name can be updated from the profile page.

### CRUD

- **Create:** validated Pokémon form → unique Firebase key → saved to Realtime Database.
- **Read:** real-time collection (`onValue`) + individual record fetch (`get`).
- **Update:** existing record loaded and pre-filled, `createdAt` preserved, `updatedAt` refreshed.
- **Delete:** confirmation dialog showing the Pokémon name, with cancel support.
- Ownership checks in the UI **and** in Firebase security rules.

### UI / UX

- Modern dark Pokédex-themed design with type colours and gradients.
- Responsive sidebar (desktop) and top bar with slide-out navigation (mobile).
- Live Pokémon card preview while creating/editing.
- Artwork added by pasting a direct image URL, with a live card preview.
- Responsive card grid with type illustrations, stat bars and level/dex badges.
- Search by name and filter by all 18 Pokémon types; combined search + filter.
- Total and filtered result counts; clear filters button.
- Loading skeletons, spinners, empty states, error states and success/error toasts.
- Details page with full stats, timestamps, owner UID and Firebase path.
- Accessible labels, focus states, keyboard-dismissible modal and reduced-motion support.
- Works without images: each type has an emoji illustration and colour gradient.

### Data

- Firebase Realtime Database only (not Firestore).
- No localStorage database and no hardcoded Pokémon array used as the collection.
- Real-time updates: changes made elsewhere appear without a page refresh.
- Strict, owner-based security rules included in [`database.rules.json`](./database.rules.json).

---

## 3. Technology stack

| Layer | Technology |
| --- | --- |
| UI library | React 19 (functional components + hooks) |
| Build tool | Vite 8 |
| Language | JavaScript (JSX) |
| Routing | React Router DOM 7 |
| Auth | Firebase Authentication (email/password) |
| Database | Firebase Realtime Database |
| Image links | Direct HTTP/HTTPS image URLs |
| Firebase SDK | Firebase JS SDK 13 |
| Styling | Hand-written CSS (no UI framework) |
| Markup | HTML5 |
| State | React Context API + hooks + Firebase listeners |

---

## 4. Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/login` | Public (redirects signed-in users) | Email/password login |
| `/register` | Public (redirects signed-in users) | Create a trainer account |
| `/dashboard` | Protected | Welcome, stats, recent cards, search/filter preview |
| `/pokemon` | Protected | Full collection with search, filter, view/edit/delete |
| `/pokemon/create` | Protected | Create form; saves to Firebase |
| `/pokemon/:id` | Protected | Full details of one Pokémon |
| `/pokemon/edit/:id` | Protected | Pre-filled edit form; updates Firebase |
| `/profile` | Protected | Name, email, UID, account metadata, stats, logout |
| `/` | — | Redirects to `/dashboard` (then login if needed) |
| `*` | — | Friendly 404 page |

---

## 5. Project structure

```text
pokemon-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AppLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   ├── DeleteConfirmation.jsx
│   │   ├── EmptyState.jsx
│   │   ├── FirebaseSetupNotice.jsx
│   │   ├── Icon.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   ├── Pokeball.jsx
│   │   ├── PokemonCard.jsx
│   │   ├── PokemonForm.jsx
│   │   ├── PokemonGridSkeleton.jsx
│   │   ├── PokemonPreview.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── PublicOnlyRoute.jsx
│   │   ├── SearchBar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatCard.jsx
│   │   ├── ToastContainer.jsx
│   │   └── TypeBadge.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ToastContext.jsx
│   ├── firebase/
│   │   └── firebaseConfig.js
│   ├── hooks/
│   │   ├── useDeletePokemon.js
│   │   ├── usePokemonCollection.js
│   │   └── usePokemonRecord.js
│   ├── pages/
│   │   ├── CreatePokemon.jsx
│   │   ├── Dashboard.jsx
│   │   ├── EditPokemon.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   ├── PokemonDetails.jsx
│   │   ├── PokemonList.jsx
│   │   ├── Profile.jsx
│   │   └── Register.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx
│   ├── services/
│   │   ├── authService.js
│   │   ├── pokemonService.js
│   │   └── storageService.js
│   ├── styles/
│   │   ├── auth.css
│   │   ├── dashboard.css
│   │   ├── global.css
│   │   └── pokemon.css
│   ├── utils/
│   │   ├── clipboard.js
│   │   ├── format.js
│   │   ├── pokemonCollection.js
│   │   ├── pokemonTypes.js
│   │   └── validation.js
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── database.rules.json
├── eslint.config.js
├── firebase.json
├── index.html
├── package.json
├── README.md
├── storage.rules
└── vite.config.js
```

Firebase logic lives in `src/firebase` and `src/services`; UI components never call the database directly.

---

## 6. Prerequisites

- **Node.js 20.19+ or 22.12+** (required by Vite 8; developed with Node 26).
- npm 10+.
- A free [Firebase](https://console.firebase.google.com/) account.
- A modern browser.

Check your versions:

```bash
node --version
npm --version
```

---

## 7. Install dependencies

From the project root:

```bash
npm install
```

This installs React, React Router DOM, Firebase, Vite and ESLint.

---

## 8. Firebase setup (required)

You must connect your own Firebase project. The app will not fake authentication or database operations.

### 8.1 Create a Firebase project

1. Go to <https://console.firebase.google.com/>.
2. Click **Add project** (or **Create a project**).
3. Enter a project name (e.g. `pokemon-card-manager`), continue and create it.
4. Google Analytics is optional; it is not required by this app.

### 8.2 Register a web app

1. In the project overview, click the **Web** icon (`</>`).
2. Register the app with a nickname (e.g. `PokéDex Web`).
3. Firebase shows a `firebaseConfig` object. Keep this tab open — you will copy these values in §8.5.
4. Do **not** enable Firebase Hosting unless you want to deploy later.

### 8.3 Enable Email/Password authentication

1. In the left sidebar, open **Build → Authentication**.
2. Click **Get started**.
3. Open the **Sign-in method** tab.
4. Select **Email/Password**, enable it, and click **Save**.
5. Open **Authentication → Settings → Authorized domains** and confirm `localhost` is listed (it is by default). Add your production domain later if you deploy.

> If you skip this step, registration/login will fail with `auth/operation-not-allowed`.

### 8.4 Create the Realtime Database

1. In the left sidebar, open **Build → Realtime Database**.
2. Click **Create Database**.
3. Choose a database location close to you.
4. Choose **Start in locked mode** (recommended). The app's rules are applied in §8.6.
5. After the database is created, copy the URL shown at the top of the Data tab. It looks like:
   - `https://your-project-default-rtdb.firebaseio.com`
   - or a regional URL such as `https://your-project-default-rtdb.europe-west1.firebasedatabase.app`

> Make sure you create **Realtime Database**, not Firestore. This app uses `firebase/database`.

### 8.5 Add your credentials to `.env.local`

Copy the example file:

**Windows PowerShell**

```powershell
Copy-Item .env.example .env.local
```

**macOS / Linux**

```bash
cp .env.example .env.local
```

Open `.env.local` and map your Firebase web app config:

| Firebase config key | `.env.local` variable |
| --- | --- |
| `apiKey` | `VITE_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `databaseURL` | `VITE_FIREBASE_DATABASE_URL` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` |

Example:

```env
VITE_FIREBASE_API_KEY=AIzaSyC...your-real-key
VITE_FIREBASE_AUTH_DOMAIN=pokemon-card-manager.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://pokemon-card-manager-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=pokemon-card-manager
VITE_FIREBASE_STORAGE_BUCKET=pokemon-card-manager.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

> Newer Firebase projects use a `<project>.firebasestorage.app` bucket; older projects use `<project>.appspot.com`. Use the `storageBucket` value shown in **Project settings → Your apps**.

`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_DATABASE_URL`, `VITE_FIREBASE_PROJECT_ID` and `VITE_FIREBASE_APP_ID` are required. If any are missing, the login page displays a configuration notice and sign-in is disabled.

> Firebase web API keys are public identifiers, not server secrets. Real protection comes from the Realtime Database security rules in §11. Never commit `.env.local`; it is ignored by `.gitignore`.

### 8.6 Publish the security rules

New artwork uses a direct image URL, so Firebase Storage is not required. Existing Firebase Storage images can still be cleaned up on replacement or deletion if `VITE_FIREBASE_STORAGE_BUCKET` is configured.

**Option A — Firebase Console (easiest):**

1. Open **Realtime Database → Rules** and replace the default rules with [`database.rules.json`](./database.rules.json); click **Publish**.
2. To keep cleanup support for images uploaded by older app versions, open **Storage → Rules** and publish [`storage.rules`](./storage.rules).

**Option B — Firebase CLI:**

```bash
npm install -g firebase-tools
firebase login
firebase use --add          # choose your project
firebase deploy --only database,storage
```

The included `firebase.json` points the CLI at both rules files. Storage setup is optional for new artwork.

### 8.7 Restart the dev server

Environment variables are read at build/start time, so restart:

```bash
npm run dev
```

The setup notice should disappear and you can register your first trainer.

---

## 9. Environment variables

All variables are client-side Vite variables and must start with `VITE_`.

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_FIREBASE_API_KEY` | Yes | Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes | Auth domain (`project.firebaseapp.com`) |
| `VITE_FIREBASE_DATABASE_URL` | Yes | Realtime Database URL (with region if applicable) |
| `VITE_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | No | Optional; enables cleanup of legacy Firebase Storage images |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | No | Sender ID (not used yet) |
| `VITE_FIREBASE_APP_ID` | Yes | Firebase web app ID |
| `VITE_FIREBASE_AUTH_EMULATOR_URL` | No | Optional Auth Emulator URL, e.g. `http://127.0.0.1:9099` |
| `VITE_FIREBASE_DATABASE_EMULATOR_HOST` | No | Optional Database Emulator host/port, e.g. `127.0.0.1:9000` |
| `VITE_FIREBASE_STORAGE_EMULATOR_HOST` | No | Optional Storage Emulator host/port, e.g. `127.0.0.1:9199` |

---

## 10. Database structure

Records are stored under a flat `pokemon` node, one child per card. Keys are generated by Firebase `push()`.

```json
{
  "pokemon": {
    "-NxAbCdEfGhIjKlMnOp": {
      "id": "-NxAbCdEfGhIjKlMnOp",
      "name": "Pikachu",
      "type": "Electric",
      "description": "An Electric-type Pokémon that stores electricity in its cheeks.",
      "level": 25,
      "hp": 100,
      "attack": 55,
      "defense": 40,
      "imageUrl": "",
      "createdBy": "firebaseAuthUidOfTheOwner",
      "createdAt": 1767225600000,
      "updatedAt": 1767225600000
    },
    "-NxQrStUvWxYzAbCdEf": {
      "id": "-NxQrStUvWxYzAbCdEf",
      "name": "Charmander",
      "type": "Fire",
      "description": "A Fire-type Pokémon with a flame burning at the tip of its tail.",
      "level": 15,
      "hp": 80,
      "attack": 60,
      "defense": 45,
      "imageUrl": "",
      "createdBy": "firebaseAuthUidOfTheOwner",
      "createdAt": 1767225660000,
      "updatedAt": 1767225660000
    }
  }
}
```

### Field reference

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Firebase push key; also stored inside the record |
| `name` | string | 2–40 characters |
| `type` | string | One of the 18 supported types |
| `description` | string | 10–500 characters |
| `level` | number | Whole number 1–100 |
| `hp` | number | Whole number 1–999 |
| `attack` | number | Whole number 1–999 |
| `defense` | number | Whole number 1–999 |
| `imageUrl` | string | Optional direct image URL; empty string when unused |
| `createdBy` | string | Firebase Auth UID of the owner; immutable |
| `createdAt` | number | Unix timestamp in milliseconds; preserved on edit |
| `updatedAt` | number | Unix timestamp in milliseconds; refreshed on edit |

The app also adds a `.indexOn: ["createdBy"]` index so it can query only the signed-in trainer's records.

---

## 11. Security rules

Complete rules are in [`database.rules.json`](./database.rules.json):

```json
{
  "rules": {
    ".read": false,
    ".write": false,
    "pokemon": {
      ".indexOn": ["createdBy"],
      ".read": "auth != null && query.orderByChild == 'createdBy' && query.equalTo == auth.uid",
      "$pokemonId": {
        ".read": "auth != null && (!data.exists() || data.child('createdBy').val() === auth.uid)",
        ".write": "auth != null && ((!data.exists() && newData.child('createdBy').val() === auth.uid) || (data.exists() && data.child('createdBy').val() === auth.uid && (!newData.exists() || newData.child('createdBy').val() === auth.uid)))",
        ".validate": "newData.hasChildren(['id','name','type','description','level','hp','attack','defense','imageUrl','createdBy','createdAt','updatedAt']) && newData.child('id').val() === $pokemonId && newData.child('name').isString() && newData.child('name').val().length >= 2 && newData.child('name').val().length <= 40 && newData.child('type').isString() && newData.child('type').val().matches(/^(Normal|Fire|Water|Grass|Electric|Ice|Fighting|Poison|Ground|Flying|Psychic|Bug|Rock|Ghost|Dragon|Dark|Steel|Fairy)$/) && newData.child('description').isString() && newData.child('description').val().length >= 10 && newData.child('description').val().length <= 500 && newData.child('level').isNumber() && newData.child('level').val() >= 1 && newData.child('level').val() <= 100 && newData.child('hp').isNumber() && newData.child('hp').val() >= 1 && newData.child('hp').val() <= 999 && newData.child('attack').isNumber() && newData.child('attack').val() >= 1 && newData.child('attack').val() <= 999 && newData.child('defense').isNumber() && newData.child('defense').val() >= 1 && newData.child('defense').val() <= 999 && newData.child('imageUrl').isString() && newData.child('imageUrl').val().length <= 500 && newData.child('createdBy').val() === auth.uid && newData.child('createdAt').isNumber() && newData.child('updatedAt').isNumber()"
      }
    }
  }
}
```

### What the rules enforce

- **No public access.** Root read/write are denied.
- **Read only your own collection.** The `/pokemon` read rule only allows a query filtered by `createdBy == auth.uid`; the client uses exactly that query with `orderByChild('createdBy').equalTo(uid)`. Direct reads of `/pokemon/{id}` are allowed only if that record's `createdBy` equals the caller's UID (or the node does not exist, which reveals no data and lets the app show a clean “not found” state).
- **Create only for yourself.** A new record must contain `createdBy` equal to `auth.uid`.
- **Update only your own records.** Existing records can only be written by their owner.
- **Delete only your own records.** An owner may remove a record, but nobody else can.
- **`createdBy` cannot be changed.** Every write must still have `createdBy == auth.uid`, and the owner check prevents hijacking.
- **Field validation.** Required fields, types, numeric ranges, the 18 allowed type names and string length limits are validated server-side.
- **Defence in depth.** The UI also checks `createdBy` before update/delete and handles `PERMISSION_DENIED` with a readable message.

> The rules enforce ownership on the server. Frontend route protection alone is not relied on.

### Image URLs

The form accepts a direct HTTP or HTTPS link to an image. The URL is validated and saved in Realtime Database; the image itself remains hosted at its original URL. Firebase Storage rules apply only to legacy files already uploaded there.

---

## 12. How CRUD works

### Create

1. `/pokemon/create` renders `PokemonForm`.
2. Client-side validation runs (`src/utils/validation.js`).
3. If an image URL was entered, it is validated and saved with the record. The live preview shows the linked image.
4. `createPokemon(uid, values)` creates a reference with `push(ref(db, 'pokemon'))`.
5. The full record (including `id`, `createdBy`, `createdAt`, `updatedAt`) is written with `set()`.
6. A toast confirms success and the app navigates to `/pokemon/{newId}`.
7. The collection's `onValue()` listener updates instantly everywhere.

### Read

- `subscribeToUserPokemon(uid, …)` runs a real-time `onValue()` query:
  `pokemon` ordered by `createdBy`, equal to the signed-in UID.
- `usePokemonCollection` exposes the records to the dashboard and collection page.
- The details and edit pages use `get(ref(db, 'pokemon/{id}'))` for a single record.

### Update

1. `/pokemon/edit/:id` loads the record and checks ownership.
2. `PokemonForm` is pre-filled with the existing values.
3. On submit, `updatePokemon(id, uid, values)` verifies ownership, then calls `update()`.
4. Only editable fields plus `updatedAt` are written — `createdAt` and `createdBy` are preserved.
5. A success toast appears and the app navigates back to the details page.

### Delete

1. Any Delete button opens `DeleteConfirmation` with the Pokémon's name.
2. Cancel closes the dialog without changes.
3. Confirm calls `deletePokemon(id, uid)`, which verifies ownership and calls `remove()`.
4. The real-time listener removes the card immediately.
5. A success toast is shown; from the details page the app returns to `/pokemon`.

---

## 13. Search and filtering

- **Search:** case-insensitive match on Pokémon name, applied to Firebase data already loaded in real time.
- **Filter:** dropdown with all 18 types plus **All types**.
- **Combined:** search and type filter apply together.
- **Clear:** the "Clear filters" button and the small × in the search input reset everything.
- **Counts:** the filter bar shows how many cards are shown out of the total.
- **Empty results:** a dedicated "No Pokémon match those filters" state with a clear button.

---

## 14. Run the project

```bash
npm run dev
```

Open the URL printed by Vite (normally <http://localhost:5173>).

Useful scripts:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

On first use:

1. Open `/register`.
2. Create an account.
3. You are redirected to `/dashboard`.
4. Click **Add a Pokémon**, fill the form, submit.
5. The card is saved to Firebase and appears on the dashboard and collection pages.

### Optional: test with the Firebase Emulator Suite

The app can run against local Firebase emulators, which is useful for testing without touching your production data. The emulator ports are already configured in `firebase.json`.

1. Create a temporary `.env.local` using any placeholder project values plus the emulator endpoints:

   ```env
   VITE_FIREBASE_API_KEY=demo-key
   VITE_FIREBASE_AUTH_DOMAIN=demo-pokemon.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://demo-pokemon-default-rtdb.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=demo-pokemon
   VITE_FIREBASE_APP_ID=1:000000000000:web:demo
   VITE_FIREBASE_STORAGE_BUCKET=demo-pokemon.appspot.com
   VITE_FIREBASE_AUTH_EMULATOR_URL=http://127.0.0.1:9099
   VITE_FIREBASE_DATABASE_EMULATOR_HOST=127.0.0.1:9000
   VITE_FIREBASE_STORAGE_EMULATOR_HOST=127.0.0.1:9199
   ```

2. Start the emulators (requires Java):

   ```bash
   npx firebase-tools emulators:start --project demo-pokemon --only auth,database,storage
   ```

3. Start the app with `npm run dev`. Register a test trainer and exercise the CRUD flow; no real Firebase project is needed.

4. Delete `.env.local` (or remove the two emulator variables) when you return to the real Firebase project.

---

## 15. Manual testing checklist

Use this checklist to verify the school requirements.

| # | Test | Expected result |
| --- | --- | --- |
| 1 | Register with a new email | Account is created; redirected to dashboard; toast appears |
| 2 | Register with an existing email | Inline error: email already registered |
| 3 | Register with mismatched passwords | Confirm-password validation error |
| 4 | Log in with valid credentials | Redirected to the dashboard |
| 5 | Log in with a wrong password | Readable Firebase error; no crash |
| 6 | Log out from sidebar/profile | Redirected to `/login`; protected routes inaccessible |
| 7 | Visit `/dashboard` while signed out | Redirected to `/login` |
| 8 | Visit `/login` while signed in | Redirected to `/dashboard` |
| 9 | Submit an empty create form | All required-field errors shown; nothing saved |
| 10 | Enter negative or non-numeric stats | Validation blocks submission |
| 11 | Create a valid Pokémon | Saved to RTDB; toast; details page shows the record |
| 12 | Check Firebase Console | Record exists under `pokemon/{pushId}`, includes `id`, `createdBy`, timestamps |
| 13 | Create several Pokémon | Multiple cards display in the responsive grid |
| 14 | Refresh the page | Data persists (comes from Firebase) |
| 15 | Open details | Full data, stats, timestamps, owner UID and Firebase path are shown |
| 16 | Edit a Pokémon | Form is pre-filled; save updates the same record (no duplicate); `createdAt` unchanged, `updatedAt` changes |
| 17 | Delete a Pokémon and cancel | Dialog closes; record remains |
| 18 | Delete and confirm | Record removed from DB and card disappears immediately |
| 19 | Search by name | Only matching cards remain; count updates |
| 20 | Filter by type | Only that type remains; combined with search |
| 21 | Clear filters | All cards return |
| 22 | Search for nonsense | Dedicated empty-results state |
| 23 | New account with no Pokémon | Empty state with create CTA |
| 24 | Open another user's record URL | Access denied / not found; rules block the read |
| 25 | Try to delete another user's record | UI blocks it and rules return `PERMISSION_DENIED` |
| 26 | Temporarily break the network | Error state and retry button; app does not crash |
| 27 | Resize to mobile | Sidebar becomes a slide-out menu; cards and forms stack correctly |
| 28 | Upload a non-image or a file over 5 MB | Inline validation error; nothing is uploaded |
| 29 | Upload a valid image | Progress is shown; artwork appears in the live preview and on the saved card |
| 30 | Replace or remove artwork on an existing card | New image is saved; the old Storage file is cleaned up |

### Two-account ownership test

1. Register `/register` with account **A**; create a Pokémon.
2. Open **Firebase Console → Authentication** and copy account A's UID.
3. Copy the Pokémon's Firebase key (`pokemon/{key}`).
4. Log out, register account **B**.
5. Manually navigate to `/pokemon/{key}`.
6. The read is denied by the rules and the app shows an error/not-found state.
7. Account B's collection shows only B's records.
8. In the Firebase Console, try editing that record's `createdBy` to B's UID — the rules reject the write.

### Rules sanity test

In the Realtime Database **Rules** playground or via the REST API, confirm that writing without authentication is rejected and that the app's own writes succeed only for the owner.

---

## 16. Mini demonstration video checklist

Target duration: **3–5 minutes**. Record at 1280×720 or higher. Keep the Firebase Console tab ready.

| Time | Step |
| --- | --- |
| 0:00–0:20 | Show the app title, login/register screens, and explain the stack: React, React Router, Firebase Auth, Firebase Realtime Database. |
| 0:20–0:40 | Register a new trainer (or log in). Show the validation and the redirect to the dashboard. |
| 0:40–1:00 | Tour the dashboard: welcome message, total Pokémon, type count, average level, total power, recently added, collection. |
| 1:00–1:15 | Open **Collection** and demonstrate search + type filtering, including the result count. |
| 1:15–1:55 | Create a Pokémon: fill every field, submit, show the loading state, success toast and automatic redirect. |
| 1:55–2:20 | Switch to **Firebase Console → Realtime Database** and show the new `pokemon/{pushId}` record, its fields, the generated key and the `createdBy` UID. |
| 2:20–2:40 | Return to the app and show the new card in the collection. Optionally refresh to prove persistence. |
| 2:40–3:00 | Open the details page: description, stats, level, timestamps, record ID and owner UID. |
| 3:00–3:25 | Edit the Pokémon, change several fields, save, and show the updated details page. Point out `createdAt` is preserved and `updatedAt` changed. |
| 3:25–3:45 | Delete the Pokémon, show the confirmation dialog, confirm, and show the card disappear. Show the record is gone from Firebase. |
| 3:45–4:00 | Open **Profile**: name, email, UID, account metadata, stats and logout. |
| 4:00–4:15 | Log out and prove a protected route (`/dashboard`) redirects to `/login`. |

Tips:

- Prepare 3–4 Pokémon beforehand so the dashboard looks populated.
- Keep both the app and Firebase Console open in separate tabs/windows.
- Show the browser URL bar so routes are visible.
- Do not speed up or fake the flow; the video should show real Firebase writes.

---

## 17. Demonstrating Firebase

During the video or live demo:

1. Open **Firebase Console → Realtime Database → Data**.
2. Show the `pokemon` node with several generated push keys (e.g. `-NxAbCd...`).
3. Expand one record and point out:
   - `id` — same as the key,
   - `name`, `type`, level and stats,
   - `createdBy` — matches the **UID** on the Profile page,
   - `createdAt` and `updatedAt` timestamps.
4. Show **Authentication → Users** and match the logged-in email + UID.
5. Edit or delete a record directly in the Firebase Console; the app updates in real time via `onValue()`.
6. Show the **Rules** tab with the deployed owner-based rules.
7. Show the browser Network tab if you want to prove requests go to `firebaseio.com` / the regional RTDB URL.

---

## 18. Production build

```bash
npm run build
npm run preview
```

The production files are in `dist/`. `npm run build` must complete without errors.

If you deploy to a static host, configure SPA fallback so deep links such as `/pokemon/:id` load `index.html`:

- **Netlify:** add `public/_redirects` with `/* /index.html 200`.
- **Vercel:** add a rewrite of `/(.*)` to `/index.html`.
- **Firebase Hosting:** add a hosting section to `firebase.json` with `"rewrites": [{ "source": "**", "destination": "/index.html" }]`.

Remember to add your production domain to **Authentication → Settings → Authorized domains**.

---

## 19. Troubleshooting

### "Firebase is not configured yet" notice

- The file must be named exactly `.env.local` in the project root (next to `package.json`).
- Every required key must be non-empty.
- Restart `npm run dev` after editing env files.
- Confirm the keys start with `VITE_`.

### `PERMISSION_DENIED` when loading the collection

- The security rules were not published. Paste `database.rules.json` into **Realtime Database → Rules → Publish**.
- The `.indexOn: ["createdBy"]` index is required for the query. It is included in the rules file.
- The authenticated user's UID must equal the record's `createdBy`.
- If you changed the data model, update both the query and the rules.

### `auth/operation-not-allowed`

Enable **Email/Password** under **Authentication → Sign-in method**.

### `auth/invalid-api-key` / `api-key-not-valid`

The API key in `.env.local` is wrong or belongs to another project. Copy the web app config again and restart the dev server.

### `auth/unauthorized-domain`

Add `localhost` or your deployed domain under **Authentication → Settings → Authorized domains**.

### Database URL errors

- Use the exact Realtime Database URL, not the project ID.
- Regional databases use a URL like `https://project-default-rtdb.europe-west1.firebasedatabase.app`.
- Make sure Realtime Database (not Firestore) was created.

### Record saved but the collection is empty

- Confirm the record's `createdBy` equals the current user's UID.
- Confirm the rules allow the query.
- Check the browser console for a permission error.
- Try the **Try again** button on the error state.

### Blank page after deploying / refreshing a deep link

Configure SPA fallback as described in §18.

### Image does not load

- Use a direct URL to an image that starts with `http://` or `https://`.
- Confirm the image host allows displaying the image on other websites.

### Images do not appear

The app falls back to a type illustration if the URL is invalid or the image cannot load. This is expected and keeps the UI functional without images.

---

## 20. Notes and limitations

- Firebase credentials are **not** included. This is intentional; add your own project values as described above.
- The app does not use localStorage as a database and does not ship fake CRUD operations.
- Artwork is optional; the form saves a direct image URL in Realtime Database without uploading or copying the image.
- The profile display name is stored in Firebase Authentication (`updateProfile`), not in the Realtime Database.
- Pokémon records are intentionally flat under `/pokemon` to match the required structure, with a `createdBy` index and query-based rules for private reads.
- `createdAt`/`updatedAt` are stored as millisecond timestamps for simple formatting and sorting.

---

## 21. School submission checklist

- [x] Complete React + Vite source code
- [x] Firebase Authentication (register, login, logout, auth state, protected routes)
- [x] Firebase Realtime Database integration (not Firestore)
- [x] Direct image URLs with validation and live preview
- [x] Create, Read, Update, Delete for Pokémon records
- [x] Unique push IDs and `createdBy` ownership
- [x] Multiple routes with React Router DOM
- [x] Search and type filtering
- [x] Responsive Pokémon-themed design with loading/empty/error states and notifications
- [x] Firebase security rules (`database.rules.json`)
- [x] `.env.example`, `.gitignore`, `package.json`
- [x] Setup, database and demo documentation (this README)
- [ ] Add your own Firebase credentials to `.env.local` (student step)
- [ ] Publish the security rules (student step)
- [ ] Manually complete the testing checklist in §15
- [ ] Record the 3–5 minute demonstration video using §16
- [ ] Submit the source code + README + video

---

Built as a school project to demonstrate React, routing, authentication and full CRUD with Firebase Realtime Database. Gotta catch ’em all. 🔴
