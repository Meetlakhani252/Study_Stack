-- ==========================================
-- STUDYSTACK NEON POSTGRESQL SETUP
-- ==========================================

-- 1. Clean up existing tables (if re-running)
DROP TABLE IF EXISTS paper_questions CASCADE;
DROP TABLE IF EXISTS papers CASCADE;
DROP TABLE IF EXISTS doubts CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;

-- 2. Subjects Table (user_id stores Clerk user id, e.g., 'user_2xyz...')
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    exam_date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Topics Table
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'Not Started',
    is_weak BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Doubts Table
CREATE TABLE doubts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    question_text TEXT NOT NULL,
    image_url TEXT,
    answer_text TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Papers Table
CREATE TABLE papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Paper Questions Table
CREATE TABLE paper_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paper_id UUID REFERENCES papers(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    matched_topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
    raw_topic_label TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_subjects_user_id ON subjects(user_id);
CREATE INDEX idx_topics_subject_id ON topics(subject_id);
CREATE INDEX idx_doubts_subject_id ON doubts(subject_id);
CREATE INDEX idx_doubts_user_id ON doubts(user_id);
CREATE INDEX idx_papers_subject_id ON papers(subject_id);
CREATE INDEX idx_paper_questions_paper_id ON paper_questions(paper_id);

