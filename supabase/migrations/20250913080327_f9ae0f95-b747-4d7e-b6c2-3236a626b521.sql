-- Fix function search path issue by setting search_path
CREATE OR REPLACE FUNCTION public.increment_upvotes(issue_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.issues 
  SET upvotes = upvotes + 1
  WHERE id = issue_id;
END;
$$;