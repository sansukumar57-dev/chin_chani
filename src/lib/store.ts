'use client';

import {
  StudyDocument,
  QuizQuestion,
  QuizAttempt,
  Flashcard,
  ChatMessage,
  TopicMastery,
  StudyPlanItem,
  UserProfile,
} from '@/types';
import {
  INITIAL_DOCUMENTS,
  INITIAL_QUIZ_QUESTIONS,
  INITIAL_FLASHCARDS,
  INITIAL_TOPIC_MASTERY,
  INITIAL_STUDY_PLAN,
  INITIAL_CHAT_MESSAGES,
  INITIAL_USER_PROFILE,
} from './mock-data';

export {
  INITIAL_DOCUMENTS,
  INITIAL_QUIZ_QUESTIONS,
  INITIAL_FLASHCARDS,
  INITIAL_TOPIC_MASTERY,
  INITIAL_STUDY_PLAN,
  INITIAL_CHAT_MESSAGES,
  INITIAL_USER_PROFILE,
};

const STORAGE_KEYS = {
  DOCS: 'studygenie_documents',
  QUIZZES: 'studygenie_quizzes',
  ATTEMPTS: 'studygenie_quiz_attempts',
  FLASHCARDS: 'studygenie_flashcards',
  MASTERY: 'studygenie_topic_mastery',
  PLAN: 'studygenie_study_plan',
  CHATS: 'studygenie_chats',
  PROFILE: 'studygenie_user_profile',
};

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Local storage write failed', e);
  }
}

export function getDocuments(): StudyDocument[] {
  return safeGet(STORAGE_KEYS.DOCS, INITIAL_DOCUMENTS);
}

export function getDocumentById(id: string): StudyDocument | undefined {
  const docs = getDocuments();
  return docs.find((d) => d.id === id);
}

export function saveDocument(doc: StudyDocument): void {
  const docs = getDocuments();
  const existingIdx = docs.findIndex((d) => d.id === doc.id);
  let updated: StudyDocument[];
  if (existingIdx >= 0) {
    updated = [...docs];
    updated[existingIdx] = doc;
  } else {
    updated = [doc, ...docs];
  }
  safeSet(STORAGE_KEYS.DOCS, updated);

  // Update profile doc count
  const profile = getUserProfile();
  profile.documentsCount = updated.length;
  safeSet(STORAGE_KEYS.PROFILE, profile);
}

export function getQuizQuestions(docId: string): QuizQuestion[] {
  const allQuizzes = safeGet<Record<string, QuizQuestion[]>>(
    STORAGE_KEYS.QUIZZES,
    INITIAL_QUIZ_QUESTIONS
  );
  return allQuizzes[docId] || [];
}

export function saveQuizQuestions(docId: string, questions: QuizQuestion[]): void {
  const allQuizzes = safeGet<Record<string, QuizQuestion[]>>(
    STORAGE_KEYS.QUIZZES,
    INITIAL_QUIZ_QUESTIONS
  );
  allQuizzes[docId] = questions;
  safeSet(STORAGE_KEYS.QUIZZES, allQuizzes);
}

export function getFlashcards(docId?: string): Flashcard[] {
  const allCards = safeGet<Record<string, Flashcard[]>>(
    STORAGE_KEYS.FLASHCARDS,
    INITIAL_FLASHCARDS
  );
  if (docId) {
    return allCards[docId] || [];
  }
  // Return all combined
  return Object.values(allCards).flat();
}

export function updateFlashcardStatus(
  docId: string,
  cardId: string,
  status: 'unseen' | 'learning' | 'mastered'
): void {
  const allCards = safeGet<Record<string, Flashcard[]>>(
    STORAGE_KEYS.FLASHCARDS,
    INITIAL_FLASHCARDS
  );
  const deck = allCards[docId] || [];
  const card = deck.find((c) => c.id === cardId);
  if (card) {
    card.status = status;
    allCards[docId] = deck;
    safeSet(STORAGE_KEYS.FLASHCARDS, allCards);
  }
}

export function saveFlashcards(docId: string, cards: Flashcard[]): void {
  const allCards = safeGet<Record<string, Flashcard[]>>(
    STORAGE_KEYS.FLASHCARDS,
    INITIAL_FLASHCARDS
  );
  allCards[docId] = cards;
  safeSet(STORAGE_KEYS.FLASHCARDS, allCards);
}

export function recordQuizAttempt(attempt: QuizAttempt): void {
  const attempts = safeGet<QuizAttempt[]>(STORAGE_KEYS.ATTEMPTS, []);
  safeSet(STORAGE_KEYS.ATTEMPTS, [attempt, ...attempts]);

  // Update topic mastery
  const masteryList = getTopicMastery();
  Object.entries(attempt.topicBreakdown).forEach(([topic, score]) => {
    const item = masteryList.find((m) => m.topic.toLowerCase() === topic.toLowerCase());
    if (item) {
      item.correctAnswers += score.correct;
      item.totalQuestions += score.total;
      item.accuracy = Math.round((item.correctAnswers / item.totalQuestions) * 100);
      item.status =
        item.accuracy >= 80 ? 'Mastered' : item.accuracy >= 60 ? 'Improving' : 'Needs Revision';
      item.recommendation =
        item.status === 'Mastered'
          ? 'Great job! Strong conceptual understanding.'
          : item.status === 'Improving'
          ? 'Making solid progress. Practice a few more questions.'
          : 'Priority weak topic. Review flashcards and consult AI Tutor.';
    } else {
      const accuracy = Math.round((score.correct / score.total) * 100);
      masteryList.push({
        topic,
        subject: attempt.documentTitle.split(' ')[0] || 'General',
        accuracy,
        totalQuestions: score.total,
        correctAnswers: score.correct,
        status: accuracy >= 80 ? 'Mastered' : accuracy >= 60 ? 'Improving' : 'Needs Revision',
        recommendation:
          accuracy < 60
            ? 'Priority focus needed. Review fundamentals.'
            : 'Good initial start.',
      });
    }
  });
  safeSet(STORAGE_KEYS.MASTERY, masteryList);

  // Update profile
  const profile = getUserProfile();
  profile.quizzesCount += 1;
  const allMastery = getTopicMastery();
  if (allMastery.length > 0) {
    const sum = allMastery.reduce((acc, curr) => acc + curr.accuracy, 0);
    profile.avgAccuracy = Math.round(sum / allMastery.length);
  }
  safeSet(STORAGE_KEYS.PROFILE, profile);
}

export function getQuizAttempts(): QuizAttempt[] {
  return safeGet<QuizAttempt[]>(STORAGE_KEYS.ATTEMPTS, []);
}

export function getTopicMastery(): TopicMastery[] {
  return safeGet(STORAGE_KEYS.MASTERY, INITIAL_TOPIC_MASTERY);
}

export function getStudyPlan(): StudyPlanItem[] {
  return safeGet(STORAGE_KEYS.PLAN, INITIAL_STUDY_PLAN);
}

export function toggleStudyPlanItem(id: string): StudyPlanItem[] {
  const plan = getStudyPlan();
  const updated = plan.map((p) => (p.id === id ? { ...p, completed: !p.completed } : p));
  safeSet(STORAGE_KEYS.PLAN, updated);
  return updated;
}

export function getChatMessages(docId: string): ChatMessage[] {
  const allChats = safeGet<Record<string, ChatMessage[]>>(
    STORAGE_KEYS.CHATS,
    INITIAL_CHAT_MESSAGES
  );
  return allChats[docId] || [];
}

export function addChatMessage(docId: string, message: ChatMessage): void {
  const allChats = safeGet<Record<string, ChatMessage[]>>(
    STORAGE_KEYS.CHATS,
    INITIAL_CHAT_MESSAGES
  );
  const docChats = allChats[docId] || [];
  allChats[docId] = [...docChats, message];
  safeSet(STORAGE_KEYS.CHATS, allChats);
}

export function getUserProfile(): UserProfile {
  return safeGet(STORAGE_KEYS.PROFILE, INITIAL_USER_PROFILE);
}

export function resetDemoData(): void {
  if (typeof window === 'undefined') return;
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
}
