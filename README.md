# StudyGenie – AI-Powered Personalized Learning Assistant

**🌐 Live Demo:** https://studygenie-ai-one.vercel.app/library

> **Devengers Shinchan Online Hackathon 2026**  
> **Theme:** Open Innovation (AI / EdTech / Social Impact)  
> **Stack:** Next.js 16 (App Router) • Supabase (Auth, PostgreSQL, Storage) • TypeScript • Tailwind CSS v4 • OpenAI GPT-4o-mini

---

[Continue with the remaining sections exactly as provided.]
## 🎯 1. Problem Statement
Students are constantly overwhelmed by dense textbooks, unstructured lecture notes, and lengthy syllabus handouts. Existing AI tools often provide generic, detached answers prone to hallucinations, while conventional e-learning portals offer static, one-size-fits-all quizzes that fail to diagnose where a student is actually struggling.

## 💡 2. Proposed Solution
**StudyGenie** is an intelligent, document-grounded personalized study companion that turns academic notes into an active mastery loop:
1. **Upload & Catalog:** Ingests textbook PDFs, markdown notes, and syllabi into an organized student library.
2. **AI Structured Synthesis:** Generates high-yield overviews, critical concepts with importance tags, core definitions, and high-probability exam tips.
3. **Practice Quiz Arena:** Automatically generates multiple-choice questions with instant scoring, feedback, and confetti animations (`canvas-confetti`).
4. **Weak-Topic Analyzer & Adaptive Planner:** Automatically tracks quiz accuracy per topic, classifies mastery (`Mastered`, `Improving`, `Needs Revision`), and generates an adaptive 7-day study timetable.
5. **Interactive 3D Flashcards:** Active recall cards with Spaced Repetition (SRS / Leitner method) mastery tracking.
6. **24/7 AI Doubt Solver:** Natural language tutor grounded in the student's exact course notes with citations, real-world analogies, and ELI5 explanations.

---

## 🚀 3. Quick Start & Running Locally

### Prerequisites
- Node.js 18+ (tested on Node.js 20 & 22)
- npm or pnpm

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Environment Variables (Optional for Demo Mode)
Copy the example environment file:
```bash
copy .env.example .env.local
```
Add your credentials if you wish to connect a live Supabase backend or live OpenAI key:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-publishable-key
SUPABASE_SECRET_KEY=your-service-role-key

OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```
*Note: If no API keys are provided, StudyGenie automatically runs in **Instant Demo Mode** with preloaded courses (Newtonian Mechanics, Cellular Biology, CS Big-O Algorithms) so judges and evaluators can experience the full app without setup!*

### Step 3: Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 4: Production Build
```bash
npm run build
npm start
```

---

## 🗄️ 4. Supabase Database Schema
The complete production SQL schema is provided in [`supabase/schema.sql`](./supabase/schema.sql). To deploy:
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) -> **SQL Editor**.
2. Paste the contents of `supabase/schema.sql` and click **Run**.
3. It creates:
   - `public.profiles`: Student profile & study streaks
   - `public.documents`: Cataloged notes & PDFs
   - `public.study_outputs`: AI-generated summaries, quizzes, flashcards
   - `public.chat_messages`: Grounded doubt solver conversation history
   - `public.quiz_attempts`: Scores, percentages, and topic breakdowns
   - `public.topic_mastery`: Adaptive accuracy per topic with AI recommendations
   - `public.flashcards`: SRS cards with mastery status
   - Private Supabase Storage bucket `study-materials` with folder-level Row Level Security (RLS) policies.

---

## 🏛️ 5. System Architecture & Routes

```
STUDENT BROWSER
       │
       ▼
Next.js 16 Frontend (App Router + React 19)
 ├── / (Landing Page & Feature Highlights)
 ├── /login & /signup (Supabase Auth + Instant Demo Access)
 ├── /dashboard (Daily Streak, Weak Topic Alert, Recent Docs)
 ├── /library (Document Search, Subject Filters, Upload Modal)
 ├── /study/[id] (AI Summary, Practice Quiz, Flashcards, AI Tutor)
 ├── /quiz (Quiz Arena with Live Scoring & History)
 ├── /flashcards (3D Flip Deck with SRS Mastery Tracking)
 ├── /analytics (Weak-Topic Gap Identifier & 7-Day Timetable)
 └── /chat (Document-Grounded Doubt Solver)
       │
       ▼
Next.js API Route Handlers
 ├── /api/upload (Document parsing & instant AI synthesis)
 ├── /api/summarize (Structured executive summary generation)
 ├── /api/quiz (Structured MCQ generation with answer validation)
 ├── /api/flashcards (High-yield recall cards)
 └── /api/chat (Grounded contextual tutor with citations)
       │
       ▼
Supabase PostgreSQL & Storage / OpenAI GPT-4o-mini
```

---

## 🏆 6. Competitive Differentiators for Judges

| Feature | Generic Study Tools | StudyGenie |
| :--- | :--- | :--- |
| **Grounding** | Hallucinates or brings external unverified facts | 100% Grounded in student's uploaded notes |
| **Evaluation** | Single static score | Granular topic mastery breakdown per question |
| **Adaptivity** | Static quiz banks | Identifies weak topics and schedules priority revision |
| **Pedagogy** | Simple text response | Multi-modal: Summary, Quiz, 3D Flashcards & Doubt Chat |
| **Judge Access** | Requires email confirmation & API setup | Instant 1-click Demo mode with preloaded STEM materials |

---

## 🎤 7. 3-Minute Hackathon Demo Script
1. **Introduction (30s):** Introduce the problem—students drowning in PDFs without knowing their actual knowledge gaps.
2. **Dashboard & Library (45s):** Show the 5-day streak, the 3 cataloged textbooks (Physics, Biology, CS), and upload a new document or load sample chemistry notes.
3. **AI Structured Summary & 3D Flashcards (45s):** Open *Newtonian Mechanics*, review the critical concepts and exam tips, then flip 3D flashcards with Leitner mastery tagging.
4. **Interactive Quiz Arena (30s):** Take the quiz, demonstrate instant feedback and the celebration confetti burst upon 80%+ score.
5. **Standout Feature – Weak-Topic Analyzer (30s):** Show how *Friction & Normal Forces (45%)* was automatically detected as a knowledge gap, triggering personalized AI suggestions and a 7-day adaptive timetable.
