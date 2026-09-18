export interface User {
  id: string;
  email: string;
}

export interface Subject {
  id: string;
  name: string;
  exam_date: string;
}

export interface Topic {
  id: string;
  title: string;
  status: 'pending' | 'completed' | 'review';
  is_weak: boolean;
}

export interface Doubt {
  id: string;
  question_text: string;
  answer_text: string;
  created_at: string;
}
