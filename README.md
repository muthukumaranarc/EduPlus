# EduPlus 🚀

**EduPlus** is a next-generation, AI-driven educational and study platform designed to revolutionize the way students interact with learning material. By perfectly blending personal study progression with gamification and generative AI, EduPlus acts as a personalized, 24/7 tutor, analyst, and motivator.

This application uses the power of **Google's Gemini AI** to understand your specific syllabus, generate dynamic tests in real-time, instantly grade your answers, provide analytics on your weak areas, and gamify the whole process to keep you coming back every day!

---

## 🌟 Core Features

### 🧩 1. The Study AI Arsenal

- **Smart Test Builder**: Automatically construct practice tests specifically around your uploaded syllabus material. Generate Multiple Choice Questions (MCQs), Short Answers (2-Marks), or Detailed Essays (10-Marks) dynamically.
- **AI Analytics Engine**: The system interprets your submitted test results over time and securely passes the history to Gemini. It returns a personalized breakdown of your **"Strong Topics"**, **"Weak Topics"**, and actionable **"Recommendations"** to focus your future sessions.
- **AI Revision Notes**: Input a topic or unit, and EduPlus produces formatted, concise, exam-ready revision notes that abstract the fluff into pure study value.
- **AI Chat Assistant**: An interactive study buddy built right into the platform. Ask complex educational queries without ever opening a new tab.

### 🎮 2. Gamification & Progression

- **Trophy System**: Nothing drives motivation like achievement. EduPlus tracks criteria like "Tests Completed" and "Current Day Streak" to unlock exclusive user trophies automatically.
- **Dynamic Dashboard**: A beautiful daily hub tracking your task completion strip, your current day streak, your trophies earned, and a progress bar of your daily custom-defined tasks.
- **Social & Friends**: Search for friends by username and compare your trophy counts and study habits!

### 🔐 3. Security & Seamless Access

- **Passwordless Google OAuth 2.0**: Completely skip the registration hurdle. Users can seamlessly create accounts, merge profiles, and fetch their Google profile picture out of the box.
- **Cross-Origin JWT Cookies**: Authenticated sessions utilize Spring Security 6 stateless JWT tokens delivered via `HttpOnly`, `Secure=true`, `SameSite=None` cookies for impenetrable cross-domain security.

### 📚 4. Custom Syllabus Configuration

- **Syllabus Manager**: EduPlus is only as smart as you tell it to be. Upload your precise `.txt` materials or manually type your syllabus structure. The backend parses this exact text to boundary the AI, ensuring it only generates tests based on what your professor actually teaches.

---

## 🛠 Tech Stack Details

**EduPlus is built completely on a decoupled Modern Web Architecture (SPA client + REST server).**

### 💻 Frontend (Client)

- **Framework**: React.js (Bootstrapped rapidly via Vite)
- **Styling**: Highly responsive **Vanilla CSS** featuring modern interactive elements: Glassmorphism, smooth micro-animations, theme-aware inputs, and complex flex/grid layouts.
- **State & Navigation**: React Router DOM (with isolated `<Outlet/>` contexts), and Context API (`UserContext`).
- **HTTP Client**: `axios` injected with `withCredentials: true` globally via interceptors to smoothly securely process authentication cookies without CORS issues across domains.

### ⚙️ Backend (Server)

- **Framework**: Java Spring Boot 3 / JDK 21
- **Data Persistence**: Spring Data MongoDB (`spring-boot-starter-data-mongodb`) cleanly organized into Repositories and Document Models.
- **Security Architecture**: Spring Security 6 completely customized for REST architecture. Drops default session states (`SessionCreationPolicy.STATELESS`), establishes a custom `JwtFilter`, intercepts unauthorized exceptions to return HTTP `401` gracefully instead of redirects, and seamlessly merges OAuth2 user parameters dynamically into the internal User ecosystem via `OAuth2SuccessHandler.java`.
- **AI Provider Integration**: Direct REST logic parsing `Google Gemini API` requests synchronously returning JSON schemas natively formatted back to the client (`AiAnalysisResponse.java`, `GeminiResponse.java`).

---

## 🏗 Domain Models & Architecture

The application abstracts functionality into explicitly decoupled collections in MongoDB:

- **`User` & `AboutUser`**: Manages credentials, OAuth providers, profile data, linked friends, and tokens.
- **`Test` & `Question` & `UserTest`**: Complex abstraction of user-generated study materials categorized by complexity.
- **`Syllabus`**: Holds the dynamic context text needed by Gemini API's prompt engineering to frame test generation.
- **`ProgressTrack` & `Task`**: Modulates the daily checklist displayed directly on the Dashboard.
- **`UserTrophy`**: A master ledger storing boolean state unlocks of various tracked gamification achievements.

---

## 🚀 Getting Started (Local Development)

To run this application, ensure you have **Node.js**, **Java 21**, **Maven**, and a **MongoDB instance** (local or Atlas) ready.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/muthukumaranarc/EduPlus.git
cd EduPlus
```

### 2️⃣ Backend Configuration & Startup

1. Move to the Backend: `cd Backend/EduPlus`
2. Configure **Environment Variables**. You can plug these right into `application-dev.properties` or your IDE's run configuration:
   - `MONGODB_URL`: The full connection string for your MongoDB database (e.g., `mongodb+srv://...`)
   - `GEMINI_API_KEY`: Your Google Developer Gemini API Key
   - `JWT_SECRET`: A highly secure 256-bit base64 alphanumeric string used to sign user tokens.
   - `EDUPLUS_OAUTH2_CLIENT_ID` & `EDUPLUS_OAUTH2_CLIENT_SECRET`: Generated securely from the Google Cloud Console credential manager.
3. Run the Spring Boot application utilizing the DEV profile:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```
   _The server spins up isolated on `http://localhost:5000`_

### 3️⃣ Frontend Configuration & Startup

1. Move to the Frontend: `cd Frount/EduPlus`
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Establish your Development Environment `.env.development` file globally at the root of `Frount/EduPlus`:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_ENV=development
   ```
4. Start the Vite server:
   ```bash
   npm run dev
   ```
   _The React Web-App spins up on `http://localhost:5173`. CORS logic is intrinsically bound to trust these ports!_

---

## 🚢 Publishing & Deployment (Production Ready)

EduPlus is pre-configured for aggressive cross-origin production deployment.

### Backend (Render / Docker Hub / Heroku)

There is a fully working `Dockerfile` at the root of the backend utilizing `eclipse-temurin:21-jdk-alpine`.

1. Make sure to package the project using Maven: `mvn clean package -DskipTests`
2. Build the Docker image natively: `docker build -t your-org/eduplus-application:latest .`
3. Push the image or auto-deploy using Render pipelines.
   _Note: In Production, Spring Boot naturally falls back to `application.properties`/`application-prod.properties` ensuring cookies enforce strictly securely (`Secure=true; SameSite=None`) so cross-site domain APIs aren't dropped._

### Frontend (Firebase Hosting / Vercel / Netlify)

The React client operates perfectly under SPA parameters.

1. Run `npm run build` in the `Frount/EduPlus` folder referencing your `.env.production` URLs.
2. Push your `dist` uncompiled folder to Firebase using the `firebase deploy --only hosting` CLI or simply attach your repository CI/CD.
3. Verify your routing rewrites (`"rewrites": [ { "source": "**", "destination": "/index.html" } ]`) to prevent `404` refresh issues.

---

## ✨ Endpoint Map Preview

A highly robust REST layer maps traffic accordingly:

- `GET /oauth2/authorization/google` ➜ Intercepts authentication directly via Spring Security Filter Chain.
- `POST /user/login` ➜ Authenticates raw passwords and attaches Bearer Tokens to response cookies.
- `GET /pro/ensure-defaults` ➜ Ensures new user dashboards populate tasks to start tracking their progress.
- `GET /trophy/get-user-trophies` ➜ Validates unlocked trophies instantly.
- `POST /syllabus/extract-unit` ➜ Takes uploaded `.txt` files and seamlessly converts structure into MongoDB nodes.
- `POST /ai/analyze-progress` ➜ Executes generative prompt logic and awaits structural AI payload returns on performance topics.

---

## 🤝 Contributing / Found an Issue?

We’re always accepting pull requests or problem evaluations! Simply submit an issue clearly outlining the bug or the feature request to track implementations.

## 📄 License

This open-source project is available free under the [MIT License](LICENSE).
