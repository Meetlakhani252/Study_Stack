-- Enable RLS
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

-- Subjects Policies
CREATE POLICY "Users can view their own subjects"
ON subjects FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subjects"
ON subjects FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subjects"
ON subjects FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subjects"
ON subjects FOR DELETE
USING (auth.uid() = user_id);

-- Topics Policies
CREATE POLICY "Users can view topics of their own subjects"
ON topics FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM subjects
    WHERE subjects.id = topics.subject_id
    AND subjects.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert topics into their own subjects"
ON topics FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM subjects
    WHERE subjects.id = subject_id
    AND subjects.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update topics of their own subjects"
ON topics FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM subjects
    WHERE subjects.id = topics.subject_id
    AND subjects.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete topics of their own subjects"
ON topics FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM subjects
    WHERE subjects.id = topics.subject_id
    AND subjects.user_id = auth.uid()
  )
);
