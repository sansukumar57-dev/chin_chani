# StudyGenie – AI-Powered Personalized Learning & Study Assistant
**Shinchan Online Hackathon 2026 (24-Hour Hackathon) by Devengers**  
**Theme:** Open Innovation (EdTech / AI & Machine Learning)  
**Track:** Solo Developer 24-Hour Build  
**Tech Stack:** Next.js 16 (App Router + Turbopack), Supabase (PostgreSQL, Auth, RLS, Storage), TypeScript, Tailwind CSS, OpenAI / Context-Grounded RAG.

---

## 1. Problem Statement
Students face four fundamental hurdles in modern education:
1. **Information Overload:** Long, dense textbook PDFs and lecture slides are difficult to distill into exam-relevant points.
2. **Passive vs. Active Learning:** Students passively highlight notes without active recall, resulting in poor test retention.
3. **One-Size-Fits-All Platforms:** Generic educational platforms treat every learner identically, failing to identify personal knowledge gaps.
4. **Hallucination in Generic AI:** General-purpose AI chatbots often invent equations or answer outside the scope of the student's syllabus.

---

## 2. Our Solution: StudyGenie
StudyGenie is an end-to-end, document-grounded personalized study companion that transforms static lecture materials into an adaptive learning system:

```
[ Upload PDF / Notes ]
        │
        ▼
[ Structured Pedagogical Summary ] ──► Key Concepts, Definitions & Exam Tips
        │
        ▼
[ Grounded AI Doubt Solver ] ───────► Citations strictly referenced from your document
        │
        ▼
[ 5-Question MCQ Quiz Arena ] ──────► Real-time timer, instant explanations & celebration
        │
        ▼
[ Adaptive Weak-Topic Diagnostics ] ─► Accuracy = (Correct / Total) * 100
        │
        ▼
[ Personalized Weekly Study Plan ] ──► Dynamically scheduled review tasks for weak areas
```

---

## 3. Key Differentiating Features
1. **Document-Grounded Doubt Solver (Zero Hallucination):**  
   Every explanation from the AI tutor cites exact sections of the student's notes, accompanied by real-world analogies and speech synthesis.
2. **Adaptive Weak-Topic Diagnostic Matrix:**  
   Calculates live topic accuracy after every quiz session ($<40\%$ Needs Revision, $40\%-70\%$ Improving, $>70\%$ Mastered) and pairs it with rule-based pedagogical recommendations.
3. **Automated 3D Flip Flashcards & Quizzes:**  
   Generates Zod-validated structured JSON multiple choice questions with explanations and interactive flip flashcards for active recall.
4. **Dual Engine Reliability (Judge-Ready):**  
   Operates connected to Supabase PostgreSQL & Storage with Row Level Security, while featuring a graceful in-memory sandbox preloaded with AP Physics, Operating Systems, and Biochemistry decks for zero-friction evaluation.

---

## 4. System Architecture
- **Frontend:** Next.js 16 with React 19, TypeScript, Tailwind CSS, Lucide icons, Canvas Confetti.
- **Backend API Routes:**
  - `POST /api/upload`: PDF buffer parsing via `pdf-parse` & private storage.
  - `POST /api/summarize`: Pedagogical extraction of core concepts, definitions, and takeaways.
  - `POST /api/chat`: Context-grounded tutor QA with document section citations.
  - `POST /api/quiz`: Zod-validated 5-question MCQ generation.
  - `POST /api/flashcards`: Question-and-answer revision deck generator.
- **Database & Storage:** Supabase PostgreSQL with 6 relational tables (`profiles`, `documents`, `study_outputs`, `chat_messages`, `quiz_attempts`, `topic_mastery`) protected by strict Row Level Security (RLS) policies.

---

## 5. Live Demo Script (2-Minute Judge Walkthrough)
1. **Landing Page (`/`):** View the Shinchan Hackathon Devengers presentation and click **"Open Interactive Dashboard"**.
2. **Dashboard (`/dashboard`):** Check the daily streak counter, key metrics, and notice the **"Adaptive Diagnostic Alert"** identifying weak topics.
3. **Document Study (`/study/doc-physics-101` or `/library`):**
   - View the generated **Pedagogical Summary** with importance badges.
   - Switch to **AI Tutor** and click quick prompts like *"Explain this like I'm a beginner (ELIF5)"*.
   - Switch to **Quiz Arena** and answer the questions to trigger the confetti celebration and topic diagnostics.
   - Flip through **3D Flashcards** for active recall.
4. **Weak-Topic Analytics (`/analytics`):** Inspect the topic mastery matrix and toggle off tasks in the personalized study schedule.
5. **System Blueprint Modal:** Click **"Blueprint"** in the top navbar to inspect the live system flow and database schema.

---

## 6. How to Run Locally
```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open in browser
http://localhost:3000
```
*(Runs out of the box with preloaded test decks. To connect your own Supabase or OpenAI instance, copy `.env.example` to `.env.local` and add your keys!)*
