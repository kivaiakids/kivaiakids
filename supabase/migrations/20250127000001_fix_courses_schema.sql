-- Fix courses table schema
-- Add created_by column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'courses' AND column_name = 'created_by') THEN
        ALTER TABLE public.courses ADD COLUMN created_by UUID REFERENCES public.profiles(id);
    END IF;
END $$;

-- Add content column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'courses' AND column_name = 'content') THEN
        ALTER TABLE public.courses ADD COLUMN content TEXT;
    END IF;
END $$;

-- Add comment for documentation
COMMENT ON COLUMN public.courses.content IS 'Course content in rich text format';
