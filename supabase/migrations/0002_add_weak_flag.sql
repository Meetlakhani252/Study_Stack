-- Add is_weak boolean to topics table
ALTER TABLE topics ADD COLUMN is_weak BOOLEAN DEFAULT false;

