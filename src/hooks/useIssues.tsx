import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Issue {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: 'roads' | 'water' | 'electricity' | 'garbage' | 'streetlights' | 'drainage' | 'parks' | 'other';
  status: 'reported' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  location_lat: number | null;
  location_lng: number | null;
  location_address: string | null;
  photo_url: string | null;
  video_url: string | null;
  voice_note_url: string | null;
  upvotes: number;
  department_assigned: string | null;
  assigned_to: string | null;
  estimated_resolution_date: string | null;
  actual_resolution_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateIssueData {
  title: string;
  description?: string;
  category: Issue['category'];
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  photo_url?: string;
  video_url?: string;
  voice_note_url?: string;
}

export const useIssues = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ['issues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Issue[];
    },
  });

  const { data: myIssues = [], isLoading: isLoadingMyIssues } = useQuery({
    queryKey: ['myIssues', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Issue[];
    },
    enabled: !!user?.id,
  });

  const createIssueMutation = useMutation({
    mutationFn: async (issueData: CreateIssueData) => {
      if (!user?.id) throw new Error('Must be logged in to create issues');
      
      const { data, error } = await supabase
        .from('issues')
        .insert({
          user_id: user.id,
          ...issueData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (newIssue) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['myIssues'] });
      
      // Update user profile stats
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      toast({
        title: "Issue reported successfully!",
        description: "Your civic issue has been submitted and will be reviewed soon.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to report issue",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const upvoteIssueMutation = useMutation({
    mutationFn: async (issueId: string) => {
      const { data, error } = await supabase.rpc('increment_upvotes', {
        issue_id: issueId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });

  return {
    issues,
    myIssues,
    isLoading,
    isLoadingMyIssues,
    createIssue: createIssueMutation.mutate,
    isCreatingIssue: createIssueMutation.isPending,
    upvoteIssue: upvoteIssueMutation.mutate,
  };
};