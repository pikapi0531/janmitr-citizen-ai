-- Create function to increment upvotes for an issue
CREATE OR REPLACE FUNCTION public.increment_upvotes(issue_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.issues 
  SET upvotes = upvotes + 1
  WHERE id = issue_id;
END;
$$;