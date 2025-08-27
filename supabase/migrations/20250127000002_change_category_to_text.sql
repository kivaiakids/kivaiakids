-- Change category column from enum to text to allow free text
ALTER TABLE public.courses ALTER COLUMN category TYPE TEXT;

-- Drop the enum type if it's no longer used
DROP TYPE IF EXISTS public.course_category;

-- Add comment to document the change
COMMENT ON COLUMN public.courses.category IS 'Course category (free text)';
