export interface StudyDocument {
  id: string;
  title: string;
  subject: string;
  uploadDate: string;
  fileSize: string;
  content: string;
  tags: string[];
  summary?: DocumentSummary;
}

export interface DocumentSummary {
  mainTopic: string;
  overview: string;
  keyConcepts: Array<{
    term: string;
    explanation: string;
    importance: 'Critical' | 'High' | 'Medium';
  }>;
  definitions: Array<{
    term: string;
    definition: string;
  }>;
  highYieldTakeaways: string[];
  examTips: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
}

export interface QuizAttempt {
  id: string;
  documentId: string;
  documentTitle: string;
  date: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  topicBreakdown: Record<string, { correct: number; total: number }>;
}

export interface Flashcard {
  id: string;
  documentId: string;
  topic: string;
  front: string;
  back: string;
  status: 'unseen' | 'learning' | 'mastered';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: string[];
}

export interface TopicMastery {
  topic: string;
  subject: string;
  accuracy: number;
  totalQuestions: number;
  correctAnswers: number;
  status: 'Mastered' | 'Improving' | 'Needs Revision';
  recommendation: string;
}

export interface StudyPlanItem {
  id: string;
  day: string;
  topic: string;
  durationMinutes: number;
  type: 'Quiz' | 'Flashcards' | 'AI Tutor' | 'Review';
  completed: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  streakDays: number;
  totalStudyHours: number;
  documentsCount: number;
  quizzesCount: number;
  avgAccuracy: number;
}
