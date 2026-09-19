-- ==========================================
-- STUDYSTACK DATABASE SETUP
-- ==========================================

-- 1. Clean up existing tables (if any) to ensure a fresh start
DROP TABLE IF EXISTS paper_questions CASCADE;
DROP TABLE IF EXISTS papers CASCADE;
DROP TABLE IF EXISTS doubts CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. Create Subjects Table
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    exam_date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Topics Table
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'Not Started',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Doubts Table (for future phases)
CREATE TABLE doubts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    image_url TEXT,
    answer_text TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create Papers Table (for future phases)
CREATE TABLE papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Create Paper Questions Table (for future phases)
CREATE TABLE paper_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paper_id UUID REFERENCES papers(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    matched_topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
    raw_topic_label TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE doubts ENABLE ROW LEVEL SECURITY;
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_questions ENABLE ROW LEVEL SECURITY;

-- Subjects Policies
CREATE POLICY "Users can view their own subjects"
ON subjects FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subjects"
ON subjects FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subjects"
ON subjects FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subjects"
ON subjects FOR DELETE USING (auth.uid() = user_id);

-- Topics Policies
CREATE POLICY "Users can view topics of their own subjects"
ON topics FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM subjects
    WHERE subjects.id = topics.subject_id
    AND subjects.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert topics into their own subjects"
ON topics FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM subjects
    WHERE subjects.id = subject_id
    AND subjects.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update topics of their own subjects"
ON topics FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM subjects
    WHERE subjects.id = topics.subject_id
    AND subjects.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete topics of their own subjects"
ON topics FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM subjects
    WHERE subjects.id = topics.subject_id
    AND subjects.user_id = auth.uid()
  )
);

-- Doubts Policies
-- "ALL" is not supported in some Supabase versions; splitting into individual policies
CREATE POLICY "Users can view their own doubts"
ON doubts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own doubts"
ON doubts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own doubts"
ON doubts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own doubts"
ON doubts FOR DELETE USING (auth.uid() = user_id);

-- Papers Policies
CREATE POLICY "Users can view papers of their own subjects"
ON papers FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM subjects
    WHERE subjects.id = papers.subject_id
    AND subjects.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert papers into their own subjects"
ON papers FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM subjects
    WHERE subjects.id = subject_id
    AND subjects.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update papers of their own subjects"
ON papers FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM subjects
    WHERE subjects.id = papers.subject_id
    AND subjects.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete papers of their own subjects"
ON papers FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM subjects
    WHERE subjects.id = papers.subject_id
    AND subjects.user_id = auth.uid()
  )
);

-- Paper Questions Policies
CREATE POLICY "Users can view questions of their own papers"
ON paper_questions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM papers
    WHERE papers.id = paper_questions.paper_id
    AND EXISTS (
      SELECT 1 FROM subjects
      WHERE subjects.id = papers.subject_id
      AND subjects.user_id = auth.uid()
    )
  )
);
