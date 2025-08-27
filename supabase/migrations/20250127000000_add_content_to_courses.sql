-- Add content column to courses table
ALTER TABLE public.courses 
ADD COLUMN content TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.courses.content IS 'Course content in Markdown format';
