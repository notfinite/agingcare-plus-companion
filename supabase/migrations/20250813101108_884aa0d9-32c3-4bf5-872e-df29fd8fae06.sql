-- Create mood tracking system with proper RLS policies

-- Update mood_entries table to match interface
ALTER TABLE public.mood_entries 
ADD COLUMN IF NOT EXISTS energy_level integer DEFAULT 5 CHECK (energy_level >= 1 AND energy_level <= 5),
ADD COLUMN IF NOT EXISTS stress_level integer DEFAULT 3 CHECK (stress_level >= 1 AND stress_level <= 5),
ADD COLUMN IF NOT EXISTS sleep_quality integer DEFAULT 5 CHECK (sleep_quality >= 1 AND sleep_quality <= 5);

-- Create mental health resources table
CREATE TABLE IF NOT EXISTS public.mental_health_resources (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  resource_type text NOT NULL CHECK (resource_type IN ('meditation', 'breathing', 'article', 'video', 'exercise')),
  duration_minutes integer NOT NULL DEFAULT 5,
  description text NOT NULL,
  content jsonb DEFAULT '{}',
  difficulty_level text DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  category text DEFAULT 'general',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on mental health resources
ALTER TABLE public.mental_health_resources ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to mental health resources
CREATE POLICY "Mental health resources are publicly readable"
ON public.mental_health_resources
FOR SELECT
USING (is_active = true);

-- Create user mood analytics view
CREATE OR REPLACE VIEW public.user_mood_analytics AS
SELECT 
  patient_id,
  DATE_TRUNC('week', recorded_at) as week_start,
  AVG(mood_score::numeric) as avg_mood,
  AVG(energy_level::numeric) as avg_energy,
  AVG(stress_level::numeric) as avg_stress,
  AVG(sleep_quality::numeric) as avg_sleep,
  COUNT(*) as entry_count,
  ARRAY_AGG(DISTINCT jsonb_array_elements_text(triggers)) FILTER (WHERE triggers IS NOT NULL) as common_triggers
FROM public.mood_entries
WHERE recorded_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY patient_id, DATE_TRUNC('week', recorded_at)
ORDER BY week_start DESC;

-- Create function to get mood insights
CREATE OR REPLACE FUNCTION public.get_mood_insights(user_uuid uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  insights jsonb := '{}';
  avg_mood numeric;
  mood_trend text;
  recent_entries integer;
BEGIN
  -- Get user's profile ID
  SELECT INTO user_uuid p.id 
  FROM profiles p 
  WHERE p.user_id = user_uuid;
  
  -- Calculate average mood over last 7 days
  SELECT AVG(mood_score::numeric) INTO avg_mood
  FROM mood_entries 
  WHERE patient_id = user_uuid 
  AND recorded_at >= CURRENT_DATE - INTERVAL '7 days';
  
  -- Count recent entries
  SELECT COUNT(*) INTO recent_entries
  FROM mood_entries 
  WHERE patient_id = user_uuid 
  AND recorded_at >= CURRENT_DATE - INTERVAL '7 days';
  
  -- Determine trend
  IF avg_mood >= 4 THEN
    mood_trend := 'positive';
  ELSIF avg_mood >= 3 THEN
    mood_trend := 'stable';
  ELSE
    mood_trend := 'needs_attention';
  END IF;
  
  -- Build insights object
  insights := jsonb_build_object(
    'average_mood', COALESCE(avg_mood, 0),
    'mood_trend', mood_trend,
    'recent_entries', recent_entries,
    'tracking_consistency', CASE 
      WHEN recent_entries >= 5 THEN 'excellent'
      WHEN recent_entries >= 3 THEN 'good'
      WHEN recent_entries >= 1 THEN 'fair'
      ELSE 'needs_improvement'
    END
  );
  
  RETURN insights;
END;
$$;

-- Insert default mental health resources
INSERT INTO public.mental_health_resources (title, resource_type, duration_minutes, description, content, category) VALUES
('Gentle Breathing Exercise', 'breathing', 5, 'A calming breathing technique to reduce anxiety and promote relaxation', '{"steps": ["Sit comfortably", "Breathe in for 4 counts", "Hold for 4 counts", "Breathe out for 6 counts", "Repeat 10 times"]}', 'anxiety'),
('Mindful Body Scan', 'meditation', 10, 'Progressive relaxation to release tension and increase awareness', '{"guide": "Focus on each part of your body from head to toe, noticing any tension and letting it go"}', 'stress'),
('Gratitude Reflection', 'exercise', 5, 'Simple practice to shift focus to positive aspects of your day', '{"prompts": ["What am I grateful for today?", "Who made me smile?", "What small victory did I have?"]}', 'mood'),
('Managing Health Anxiety', 'article', 8, 'Practical strategies for coping with health-related worries', '{"tips": ["Focus on what you can control", "Practice grounding techniques", "Limit health-related internet searches", "Talk to trusted healthcare providers"]}', 'anxiety'),
('Progressive Muscle Relaxation', 'meditation', 15, 'Systematic tensing and relaxing of muscle groups to reduce physical stress', '{"instructions": "Tense each muscle group for 5 seconds, then relax for 10 seconds"}', 'stress'),
('5-4-3-2-1 Grounding Technique', 'exercise', 3, 'Quick sensory grounding exercise to manage overwhelming feelings', '{"method": "Name 5 things you see, 4 things you hear, 3 things you feel, 2 things you smell, 1 thing you taste"}', 'anxiety')
ON CONFLICT (title) DO NOTHING;

-- Create trigger for updated_at on mental health resources
CREATE TRIGGER update_mental_health_resources_updated_at
BEFORE UPDATE ON public.mental_health_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();