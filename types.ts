
export enum ToolType {
  DASHBOARD = 'DASHBOARD',
  TEXTBOOK = 'TEXTBOOK',
  CAREER = 'CAREER',
  EXAM = 'EXAM',
  NOTES = 'NOTES',
  AUDIO = 'AUDIO',
  VISUAL = 'VISUAL',
  AR_LAB = 'AR_LAB',
  TUTOR = 'TUTOR',
  KIDS = 'KIDS',
  DETECTOR = 'DETECTOR',
  INFOGRAPHIC = 'INFOGRAPHIC',
  MINDMAP = 'MINDMAP'
}

export interface User {
  id: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
}

export interface Flashcard {
  question: string;
  answer: string;
  source?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface CareerPlan {
  role: string;
  description: string;
  skillsNeeded: string[];
  learningSteps: string[];
}

export interface ExamResult {
  id: string;
  topic: string;
  difficulty: string;
  score: number;
  total: number;
  date: string;
  questions: QuizQuestion[];
  userAnswers: (string | null)[];
}

export interface MindMapNode {
  id: string;
  label: string;
  description?: string;
  children?: MindMapNode[];
}
