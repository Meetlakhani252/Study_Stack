export interface Subject {
  id: string;
  user_id: string;
  name: string;
  exam_date: string | null;
  created_at: string;
}

export interface Topic {
  id: string;
  subject_id: string;
  title: string;
  status: 'Not Started' | 'In Progress' | 'Done';
  is_weak: boolean;
  created_at: string;
}
