# 🎓 EduPlus — Full Project Documentation

> **EduPlus** is a full-stack educational platform that helps students learn smarter through AI-powered study tools, quizzes, progress tracking, a social friends leaderboard, and a gamified weekly trophy system.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [Repository Structure](#4-repository-structure)
5. [Frontend (React + Vite)](#5-frontend-react--vite)
   - [Pages & Routing](#pages--routing)
   - [Context Providers](#context-providers)
   - [Reusable Components](#reusable-components)
6. [Backend (Spring Boot)](#6-backend-spring-boot)
   - [Security & Authentication](#security--authentication)
   - [API Reference](#api-reference)
7. [Data Models](#7-data-models)
8. [Trophy System](#8-trophy-system)
9. [Environment Variables & Configuration](#9-environment-variables--configuration)
10. [Local Development Setup](#10-local-development-setup)
11. [Deployment](#11-deployment)

---

## 1. Project Overview

EduPlus is designed to make studying interactive and engaging. Core features include:

| Feature | Description |
|---|---|
| **AI Chat Assistant** | Ask questions and get AI-powered answers (Gemini API) |
| **Study Plan Generator** | Upload study material (text / file) and generate a structured plan |
| **Quiz / Test Module** | Create, save, and take AI-generated multiple-choice quizzes |
| **Grammar Explorer** | Browse and search grammar topics powered by AI |
| **Progress Tracker** | Daily task checklist with completion tracking |
| **Friends & Leaderboard** | Follow friends and compare weekly trophy counts |
| **Trophy System** | Gamified weekly achievement system (50 trophies, resets every Monday) |
| **Settings** | Full profile management (username, password, name, DOB, gender, etc.) |
| **Light / Dark Theme** | System-wide theme toggle persisted in `localStorage` |
| **OAuth2 Login** | Sign in with Google (in addition to traditional username/password) |

---

## 2. Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 7 | Build tool & dev server |
| React Router DOM | 7 | Client-side routing |
| Axios | 1.x | HTTP client |
| react-markdown | 10 | Render AI markdown responses |
| pdfjs-dist | 5 | Extract text from uploaded PDFs |
| @fontsource/inter | 5 | Inter font (offline) |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Spring Boot | 3.5.5 | Application framework |
| Spring Security | 6 | Authentication & authorisation |
| Spring Data MongoDB | 4 | Database ORM |
| JJWT | 0.12.5 | JSON Web Token (JWT) |
| Spring OAuth2 Client | 6 | Google OAuth2 sign-in |
| Apache Tika | 2.9.1 | PDF / document text extraction |
| WebFlux (WebClient) | 3.5.5 | Reactive HTTP client for Gemini API |
| Java | 21 | Runtime |

### Infrastructure
| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud database |
| Google Firebase Hosting | Frontend hosting |
| Docker (Eclipse Temurin 21) | Backend containerisation |
| Google Gemini API | AI language model |

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                       Browser                           │
│                                                         │
│   React SPA (Vite)  ──────────────────────────────────► │
│   Firebase Hosting                                      │
└────────────────────────────┬────────────────────────────┘
                             │ HTTPS + JWT Cookie
                             ▼
┌─────────────────────────────────────────────────────────┐
│               Spring Boot REST API (Port 8080)          │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │Controllers│  │ Services │  │  Configurations      │  │
│  │          │──►│          │  │  (Auth, JWT, CORS,   │  │
│  │ /user    │  │ Business │  │   OAuth2)             │  │
│  │ /trophy  │  │  Logic   │  └──────────────────────┘  │
│  │ /test    │  │          │                             │
│  │ /pro     │  └────┬─────┘                            │
│  │ /friends │       │                                  │
│  │ /stu     │       ▼                                  │
│  │ /ass     │  ┌──────────┐   ┌──────────────────────┐ │
│  │ /grammar │  │Repositories│  │  External APIs       │ │
│  │ /about   │  │ (MongoDB │  │  Google Gemini AI     │ │
│  └──────────┘  │  Atlas)  │  └──────────────────────┘ │
│                └──────────┘                             │
└─────────────────────────────────────────────────────────┘
```

**Authentication Flow:**
- Credentials are verified and a **JWT is set as an `HttpOnly` cookie** (`auth`) with a 30-day expiry.
- Every subsequent request carries the cookie, which the `JwtFilter` extracts and validates.
- For **Google OAuth2**, Spring Security handles the OAuth handshake. On success, `OAuth2SuccessHandler` mints a JWT cookie and redirects the user to the frontend.

---

## 4. Repository Structure

```
EduPlus/
├── Back/
│   └── EduPlus/                      # Spring Boot backend
│       ├── Dockerfile
│       ├── pom.xml
│       └── src/main/
│           ├── java/com/Muthu/EduPlus/
│           │   ├── Configurations/   # Security, JWT filter, CORS, OAuth2
│           │   ├── Controllers/      # REST endpoints
│           │   ├── Models/           # MongoDB document models
│           │   ├── Repositories/     # MongoRepository interfaces
│           │   ├── Services/         # Business logic
│           │   └── EduPlusApplication.java
│           └── resources/
│               ├── application.properties        # Base config
│               ├── application-dev.properties    # Dev overrides
│               └── application-prod.properties   # Prod overrides
│
└── Frount/
    └── EduPlus/                      # React + Vite frontend
        ├── package.json
        ├── vite.config.js
        └── src/
            ├── App.jsx               # Root redirect guard
            ├── main.jsx              # Router + provider setup
            ├── index.css             # Global CSS variables & reset
            ├── assets/               # Icons, logos, images
            ├── context/              # React context (User, Theme, Image)
            ├── components/           # Shared UI components
            └── pages/
                ├── login/            # Login, Register, OAuth info collect
                └── home/             # Main app shell + all feature pages
                    ├── action/       # Study Plan + Test module
                    ├── ai/           # AI Chat
                    ├── dashboard/    # Dashboard + task tracker
                    ├── friends/      # Friends & leaderboard
                    ├── settings/     # Profile settings
                    └── trophies/     # Trophy showcase
```

---

## 5. Frontend (React + Vite)

### Pages & Routing

All routes are defined in `src/main.jsx` using `createBrowserRouter`.

| Route | Component | Description |
|---|---|---|
| `/` | `App` | Auth guard — redirects to `/home` or `/account-login` |
| `/account-login` | `Login` | Username/password login + Google OAuth button |
| `/create-new-account` | `CollectInfo` | New account registration form |
| `/get-info-oauth` | `CollectInfoOAuth` | Extra info for first-time OAuth users |
| `/home` | `Home` | App shell with sidebar nav (Outlet layout) |
| `/home/dashboard` | `Dashboard` | Daily task checklist + overview |
| `/home/action` | `Action` | Entry hub for study actions |
| `/home/action/plan` | `Plan` | AI study plan generator (text / file upload) |
| `/home/action/test` | `TestBuilder` | Test group & test management hub |
| `/home/action/test/generate` | `GenerateTest` | AI quiz generator |
| `/home/action/test/saved` | `SavedTest` | Saved quiz browser & quiz runner |
| `/home/ai` | `Ai` | AI Chat (context-aware conversation) |
| `/home/friend` | `Friend` | Friends list + trophy leaderboard |
| `/home/trophies` | `Trophies` | Weekly trophy showcase |
| `/home/setting` | `Settings` | Profile management |
| `*` | `NotFound` | 404 page |

#### Home Shell (`Home.jsx`)

The `Home` component renders the **fixed left sidebar** on desktop (182 px wide) and a **slide-out drawer** on mobile. It contains:

- **Logo** (top of nav)
- **Navigation links** — Dashboard, Actions, AI Chat, Friends, Trophies, Settings
- **Trophy counter widget** (`<Trophy />`) — pinned to the **bottom-left of the nav** via `margin-top: auto`
- A hamburger menu button on mobile that slides the drawer in

---

### Context Providers

Three React Contexts wrap the entire application (defined in `src/context/`):

#### `ThemeProvider` / `ThemeContext`
- Reads the user's preferred theme from `localStorage`.
- Sets `data-theme="light"` or `data-theme="dark"` on `<html>`.
- Exposes `{ theme, toggleTheme }`.

#### `UserProvider` / `UserContext`
- On mount, calls `GET /user/get-user` to hydrate the logged-in user object.
- Exposes `{ user, loading, setUser }`.
- Used by `App.jsx` for the initial auth redirect guard.

#### `ImageProvider` / `ImageContext`
- Stores the user's profile picture URL globally so all components that need it can access it without re-fetching.

---

### Reusable Components

| Component | File | Description |
|---|---|---|
| `Trophy` | `components/Trophy.jsx` | Clickable trophy counter badge in the nav sidebar. Fetches `earned/total` from `/trophy/get-user-trophies` and navigates to `/home/trophies`. Observes `data-theme` to switch between light/dark trophy icons. |
| `ConfirmAlert` | `components/ConfirmAlert.jsx` | Custom modal for destructive-action confirmation dialogs. |
| `UpdateModal` | `components/UpdateModal.jsx` | Generic edit modal used across the Settings page for field updates. |
| `ChatHistoryBlock` | `components/ChatHistoryBlock.jsx` | Renders a single AI conversation turn (user message + AI markdown). |
| `ShinyText` | `components/ShinyText.jsx` | Animated shiny-text effect used for decorative headings. |
| `ListData` | `components/ListData.jsx` | Generic list renderer. |
| `ScrollToTop` | `pages/home/ScrollToTop.jsx` | Resets the outlet scroll position to 0 on every route change. |

---

## 6. Backend (Spring Boot)

### Security & Authentication

#### JWT (JSON Web Token)
- **Secret key**: injected from `${JWT_SECRET}` environment variable.
- **Token lifetime**: 30 days (cookie expiry).
- **Storage**: `HttpOnly` cookie named `auth`. Never exposed to JavaScript.
- **JwtFilter** (`Configurations/JwtFilter.java`): Runs on every request, extracts the token from the cookie or `Authorization` header, validates it, and populates the `SecurityContext`.

#### Public Endpoints (no token required)
```
POST /user/create
POST /user/login
POST /user/is-user-exist
GET  /user/are-you-alive
GET  /oauth2/**
GET  /login/**
```

#### Password Encoding
Passwords are stored using **BCrypt with strength 12** (`BCryptPasswordEncoder`).

#### OAuth2 (Google Sign-In)
- Spring Security handles the `/oauth2/authorization/google` redirect.
- On success, `OAuth2SuccessHandler`:
  1. Extracts the email and profile picture from the Google token.
  2. Creates a new `User` if first-time login, or updates the profile picture for existing accounts.
  3. Generates a JWT and sets it as an `HttpOnly` cookie.
  4. Redirects to `/get-info-oauth` (new user) or `/home` (returning user).

#### CORS
Allowed origins (configured in `SecurityCorsConfig`):
- `http://localhost:5173` (development)
- `https://eduplus-education.web.app` (production)

Allowed methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`.  
Credentials (`withCredentials: true`) are allowed so cookies are transmitted cross-origin.

---

### API Reference

All endpoints require the `auth` JWT cookie unless marked **public**.

---

#### 👤 User — `/user`

| Method | Path | Description |
|---|---|---|
| `POST` | `/user/login` ⬛ | Login with username + password. Sets `auth` cookie. |
| `GET` | `/user/logout` | Clears the `auth` cookie. |
| `POST` | `/user/create` ⬛ | Create a new user account. |
| `GET` | `/user/get-user` | Get current logged-in user's profile. |
| `POST` | `/user/get-user-username` | Get a user's public profile by username. |
| `GET` | `/user/get-all` | Get all users (admin). |
| `GET` | `/user/get-username` | Get current user's username. |
| `POST` | `/user/is-user-exist` ⬛ | Check if a username is taken. |
| `POST` | `/user/update-oauth` | Update OAuth user info after first login. |
| `POST` | `/user/update-username` | Update username (requires password). |
| `POST` | `/user/update-password` | Update password (requires current password). |
| `POST` | `/user/update-firstname` | Update first name (requires password). |
| `POST` | `/user/update-lastname` | Update last name (requires password). |
| `POST` | `/user/update-mobile-number` | Update mobile number (requires password). |
| `POST` | `/user/update-mail-id` | Update email (requires password). |
| `POST` | `/user/update-dob` | Update date of birth (requires password). |
| `POST` | `/user/update-gender` | Update gender (requires password). |
| `POST` | `/user/update-linkedin` | Update LinkedIn URL (requires password). |
| `POST` | `/user/update-profile-picture` | Update profile picture URL (requires password). |
| `DELETE` | `/user/delete` | Delete current user account. |
| `DELETE` | `/user/delete-by-username` | Delete a user by username. |
| `DELETE` | `/user/delete-all` | Delete all users (admin). |
| `POST` | `/user/trophies-add` | Add N trophies to current user (internal). |
| `POST` | `/user/trophies-sub` | Subtract N trophies from current user. |
| `GET` | `/user/are-you-alive` ⬛ | Health-check endpoint. Returns `true`. |

> ⬛ = Public (no authentication required)

---

#### 🏆 Trophy — `/trophy`

| Method | Path | Description |
|---|---|---|
| `GET` | `/trophy/get-user-trophies` | Returns the current user's `UserTrophy` document (with weekly reset check). |
| `POST` | `/trophy/get-user-trophies-by-username` | Returns another user's trophy data by username. |
| `GET` | `/trophy/get-earned-trophies` | Returns a list of earned `Trophy` objects. |
| `GET` | `/trophy/get-unearned-trophies` | Returns a list of unearned `Trophy` objects. |
| `GET` | `/trophy/get-total-earned` | Returns the integer count of earned trophies this week. |
| `POST` | `/trophy/increment-test-completed` | Called when a user completes a quiz. |
| `POST` | `/trophy/record-high-score` | Called when a user scores ≥ 90% on a quiz. |
| `POST` | `/trophy/update-streak` | Called to update the user's consecutive-day streak. Body: `{ "streak": N }`. |
| `POST` | `/trophy/increment-material-uploaded` | Called when study material is uploaded. |
| `POST` | `/trophy/increment-milestone` | Called when a dashboard milestone task is completed. |

---

#### 📝 Test — `/test`

| Method | Path | Description |
|---|---|---|
| `POST` | `/test/generate/{questionCount}` | Generate an AI quiz from plain text. Body: `{ "groupName", "testTitle", "text" }`. |
| `POST` | `/test/generate-from-text` | Generate a quiz from an uploaded file (multipart). |
| `GET` | `/test/get-all-group` | Get all test groups, tests, and questions for the current user. |
| `POST` | `/test/create-group` | Create a new test group. Body: group name string. |
| `DELETE` | `/test/delete-group` | Delete a test group and all its tests. Body: group name string. |
| `POST` | `/test/add-test` | Add a test to a group. Body: `{ "groupName", "title" }`. |
| `DELETE` | `/test/delete-test` | Remove a test from a group. Body: `{ "groupName", "title" }`. |
| `POST` | `/test/group/{groupName}/test/{testTitle}` | Add a question to a test. Body: `Question` JSON. |
| `DELETE` | `/test/group/{groupName}/test/{testTitle}/question/{questionIndex}` | Delete a question by index. |

---

#### 📚 Study Plan — `/stu`

| Method | Path | Description |
|---|---|---|
| `POST` | `/stu/send` | Generate a study plan from base64-encoded text + query. Body: `StudyPlanRequest`. |
| `POST` | `/stu/extract-text` | Upload a file (multipart) and extract its raw text. |
| `POST` | `/stu/send-direct-file` | Upload a file and query for a plan directly. |

---

#### 🤖 AI Assistant — `/ass`

| Method | Path | Description |
|---|---|---|
| `POST` | `/ass/ask` | Send a message to the Gemini AI assistant. Body: message string. Returns `ChatResponse`. |

---

#### 📖 Grammar — `/grammar`

| Method | Path | Description |
|---|---|---|
| `POST` | `/grammar/send-ai` | Ask the AI a grammar question. Body: message string. |
| `GET` | `/grammar/get-all-topics` | List all stored grammar topics. |
| `POST` | `/grammar/add-topic` | Add a grammar topic. Body: `{ "title", "content" }`. |
| `GET` | `/grammar/get-topic/{title}` | Get a grammar topic by title. |
| `PUT` | `/grammar/update-title` | Rename a grammar topic. Body: `{ "oldTitle", "newTitle" }`. |
| `PUT` | `/grammar/update-content` | Update a topic's content. Body: `{ "title", "content" }`. |
| `DELETE` | `/grammar/delete-title/{title}` | Delete a topic by title. |
| `DELETE` | `/grammar/delete-all-topics` | Delete all grammar topics (admin). |

---

#### 👥 Friends — `/friends`

| Method | Path | Description |
|---|---|---|
| `POST` | `/friends/create` | Create a friends profile. Body: username string. |
| `GET` | `/friends/me` | Get current user's friends profile (username + list). |
| `POST` | `/friends/change-username` | Rename the friends profile. Body: new username string. |
| `DELETE` | `/friends/delete/{username}` | Delete a friends profile. |
| `POST` | `/friends/add/{friendId}` | Add a friend by username. |
| `DELETE` | `/friends/remove/{friendId}` | Remove a friend by username. |

---

#### 📊 Progress Tracker — `/pro`

| Method | Path | Description |
|---|---|---|
| `POST` | `/pro/create` | Create a progress track for a user. Body: username string. |
| `GET` | `/pro/get` | Get the current user's task list. |
| `GET` | `/pro/ensure-defaults` | Seed default tasks if the user has none (called on dashboard mount). |
| `POST` | `/pro/add` | Add a task. Body: task name string. |
| `DELETE` | `/pro/remove` | Remove a task. Body: task name string. |
| `POST` | `/pro/toggle` | Toggle a task's completion status. Body: task name string. |
| `DELETE` | `/pro/delete` | Delete a user's entire progress track. Body: username string. |
| `POST` | `/pro/change-username` | Rename a progress track. Body: `{ "currentUsername", "newUsername" }`. |

---

#### ℹ️ About User — `/about`

| Method | Path | Description |
|---|---|---|
| `POST` | `/about/create` | Create an "about" profile. Body: `{ "username", "name" }`. |
| `GET` | `/about/get` | Get current user's about data (list of info strings). |
| `POST` | `/about/add` | Add an info entry. Body: info string. |
| `DELETE` | `/about/delete` | Remove an info entry. Body: info string. |
| `PUT` | `/about/replace` | Replace an entry. Body: `{ "old", "new" }`. |
| `DELETE` | `/about/remove` | Delete a user's entire about profile. Body: username string. |
| `DELETE` | `/about/delete-all` | Delete all about profiles (admin). |

---

## 7. Data Models

### `User` (MongoDB collection: `User`)

| Field | Type | Description |
|---|---|---|
| `username` | `String` (ID) | Unique identifier and primary key |
| `password` | `String` | BCrypt-hashed password |
| `firstName` | `String` | First name |
| `lastName` | `String` | Last name |
| `dob` | `LocalDate` | Date of birth |
| `gender` | `String` | Gender |
| `mobileNumber` | `String` | Mobile number |
| `mailId` | `String` | Email address |
| `linkedIn` | `String` | LinkedIn profile URL |
| `profilePicture` | `String` | Profile picture URL (base64 or external URL for OAuth) |
| `trophy` | `Integer` | Cached total earned trophies (kept in sync with `UserTrophy`) |
| `friends` | `Integer` | Cached friend count |

---

### `UserTrophy` (MongoDB collection: `userTrophies`)

| Field | Type | Description |
|---|---|---|
| `username` | `String` (ID) | Owner of this trophy record |
| `trophies` | `List<Trophy>` | The full set of 50 trophies with progress |
| `testsCompleted` | `int` | Tests completed this week |
| `highScoreCount` | `int` | 90%+ scores this week |
| `currentStreak` | `int` | Consecutive study-day streak (global, not weekly) |
| `materialsUploaded` | `int` | Materials uploaded this week |
| `milestonesReached` | `int` | Dashboard milestones completed this week |
| `totalEarned` | `int` | Count of currently earned trophies |
| `weekStartDate` | `String` | ISO date of the Monday that started the current week (`yyyy-MM-dd`) |

---

### `Trophy` (embedded in `UserTrophy`)

| Field | Type | Description |
|---|---|---|
| `id` | `String` | e.g. `"test_5"`, `"score_3"` |
| `name` | `String` | Display name, e.g. `"Achiever"` |
| `description` | `String` | How to earn it |
| `icon` | `String` | Emoji icon |
| `earned` | `boolean` | Whether the trophy has been awarded |
| `earnedDate` | `String` | Timestamp when earned (`yyyy-MM-dd HH:mm:ss`) |
| `currentProgress` | `int` | Current stat value |
| `requiredProgress` | `int` | Threshold to unlock |
| `category` | `String` | `test`, `score`, `consistency`, `contribution`, `milestone` |

---

### `ProgressTrack` (MongoDB collection: `progress-track`)

| Field | Type | Description |
|---|---|---|
| `username` | `String` (ID) | Owner |
| `tasks` | `List<Task>` | List of daily tasks |

### `Task` (embedded)

| Field | Type | Description |
|---|---|---|
| `name` | `String` | Task label |
| `completed` | `boolean` | Completion flag |

---

### `Friends` (MongoDB collection: `friends`)

| Field | Type | Description |
|---|---|---|
| `username` | `String` (ID) | Owner |
| `friends` | `List<String>` | List of friend usernames |

---

### `UserTest` (MongoDB collection: inferred)

A hierarchical document containing test groups → tests → questions:

```
UserTest
 └── username (ID)
 └── groups: List<TestGroup>
      └── groupName
      └── tests: List<Test>
           └── title
           └── questions: List<Question>
                └── questionText
                └── options: List<String>
                └── correctAnswer: String
```

---

## 8. Trophy System

### Weekly Reset

The trophy system resets **every Monday at 00:00** (detected on the first request after the week boundary):

- All 50 trophies are re-seeded (unearned, progress = 0).
- Weekly counters are zeroed: `testsCompleted`, `highScoreCount`, `materialsUploaded`, `milestonesReached`, `totalEarned`.
- **`currentStreak` is preserved** — it is a global consecutive-day streak.

### Trophy Categories

| Category | Count | Reset? | Trigger |
|---|---|---|---|
| **Test** | 12 | ✅ Weekly | Complete a quiz |
| **Score** | 10 | ✅ Weekly | Score ≥ 90% on a quiz |
| **Consistency** | 7 | ❌ (global streak) | Log in / study daily |
| **Contribution** | 9 | ✅ Weekly | Upload study material |
| **Milestone** | 12 | ✅ Weekly | Complete dashboard milestone tasks |
| **Total** | **50** | — | — |

### Trophy Award Flow

1. An award trigger endpoint is called (e.g., `POST /trophy/increment-test-completed`).
2. `TrophyService` increments the relevant counter on `UserTrophy`.
3. `checkAndAwardTrophies()` loops all 50 trophies, updates `currentProgress`, and sets `earned = true` if the threshold is met.
4. `totalEarned` is recalculated and saved to `UserTrophy`.
5. `syncTrophyCountToUser()` mirrors the new count to `User.trophy` for the leaderboard.

---

## 9. Environment Variables & Configuration

### Backend (`application.properties`)

| Variable | Description |
|---|---|
| `MONGODB_URL` | Full MongoDB connection URI (Atlas) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `JWT_SECRET` | Secret key for HMAC-SHA JWT signing |
| `EDUPLUS_OAUTH2_CLIENT_ID` | Google OAuth2 client ID |
| `EDUPLUS_OAUTH2_CLIENT_SECRET` | Google OAuth2 client secret |
| `PORT` | Server port (default: `8080`) |

#### Profile-specific properties

| Property | `dev` value | `prod` value |
|---|---|---|
| `app.cookie.secure` | `false` | `true` |
| `app.cookie.samesite` | `Lax` | `None` |
| `app.frontend.url` | `http://localhost:5173` | `https://eduplus-education.web.app` |

Activate a profile with:
```bash
# Dev
java -jar app.jar --spring.profiles.active=dev

# Prod
java -jar app.jar --spring.profiles.active=prod
```

### Frontend (Vite `.env`)

Create a `.env` file in `Frount/EduPlus/`:

```env
VITE_API_URL=http://localhost:8080
```

In production, set `VITE_API_URL` to your deployed backend URL.

---

## 10. Local Development Setup

### Prerequisites

| Tool | Minimum Version |
|---|---|
| Node.js | 18+ |
| npm | 9+ |
| Java JDK | 21 |
| Maven | 3.9+ |
| MongoDB Atlas | (cloud) or local MongoDB 7+ |

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/EduPlus.git
cd EduPlus
```

---

### 2. Backend Setup

```bash
cd Back/EduPlus
```

Create/configure the required environment variables. The easiest way locally is to set them in your shell or use an IDE run configuration:

```bash
# Windows PowerShell example
$env:MONGODB_URL="mongodb+srv://<user>:<pass>@cluster.mongodb.net/"
$env:GEMINI_API_KEY="AIza..."
$env:JWT_SECRET="your-very-long-secret-key"
$env:EDUPLUS_OAUTH2_CLIENT_ID="your-client-id.apps.googleusercontent.com"
$env:EDUPLUS_OAUTH2_CLIENT_SECRET="GOCSPX-..."
```

Run the backend with the dev profile:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

The API will be available at `http://localhost:8080`.

---

### 3. Frontend Setup

```bash
cd Frount/EduPlus
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8080
```

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

### 4. Verify Everything Works

- Open `http://localhost:5173` — you should be redirected to `/account-login`.
- The API health check: `GET http://localhost:8080/user/are-you-alive` → should return `true`.

---

## 11. Deployment

### Backend — Docker

```bash
cd Back/EduPlus

# Build the JAR
mvn clean package -DskipTests

# Build the Docker image
docker build -t eduplus-backend .

# Run with environment variables
docker run -p 8080:8080 \
  -e MONGODB_URL="..." \
  -e GEMINI_API_KEY="..." \
  -e JWT_SECRET="..." \
  -e EDUPLUS_OAUTH2_CLIENT_ID="..." \
  -e EDUPLUS_OAUTH2_CLIENT_SECRET="..." \
  -e SPRING_PROFILES_ACTIVE=prod \
  eduplus-backend
```

The `Dockerfile` uses `eclipse-temurin:21-jdk-alpine` and exposes port `8080`.

---

### Frontend — Firebase Hosting

```bash
cd Frount/EduPlus

# Set production API URL
echo "VITE_API_URL=https://your-backend.com" > .env.production

# Build
npm run build

# Deploy (requires Firebase CLI)
firebase deploy --only hosting
```

The production frontend is hosted at: **`https://eduplus-education.web.app`**

---

### OAuth2 Redirect URIs

When deploying, add the following URIs to your Google Cloud OAuth2 client:

**Authorised redirect URIs:**
- `http://localhost:8080/login/oauth2/code/google` *(development)*
- `https://your-backend.com/login/oauth2/code/google` *(production)*

---

*Documentation last updated: February 2026*
