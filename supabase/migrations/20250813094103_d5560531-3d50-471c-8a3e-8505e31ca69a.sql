-- Create emotional support tables for compassionate care
CREATE TABLE public.mood_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
  mood_type TEXT NOT NULL,
  notes TEXT,
  triggers JSONB DEFAULT '[]'::jsonb,
  coping_strategies JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for mood entries
CREATE POLICY "Patients can manage their mood entries"
ON public.mood_entries
FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = mood_entries.patient_id 
  AND profiles.user_id = auth.uid()
));

CREATE POLICY "Caregivers can view mood entries"
ON public.mood_entries
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM caregiver_patient_relationships cpr
  JOIN profiles p ON p.id = cpr.caregiver_id
  WHERE cpr.patient_id = mood_entries.patient_id
  AND p.user_id = auth.uid()
));

-- Create AI conversation history table
CREATE TABLE public.ai_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  conversation_type TEXT NOT NULL DEFAULT 'emotional_support',
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  sentiment_analysis JSONB,
  session_duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- Create policies for AI conversations
CREATE POLICY "Users can manage their AI conversations"
ON public.ai_conversations
FOR ALL
USING (user_id = auth.uid());

-- Create voice accessibility settings table
CREATE TABLE public.voice_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  voice_enabled BOOLEAN DEFAULT false,
  preferred_voice TEXT DEFAULT 'alloy',
  speech_rate NUMERIC DEFAULT 1.0 CHECK (speech_rate >= 0.5 AND speech_rate <= 2.0),
  voice_language TEXT DEFAULT 'en-US',
  accessibility_features JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.voice_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for voice settings
CREATE POLICY "Users can manage their voice settings"
ON public.voice_settings
FOR ALL
USING (user_id = auth.uid());

-- Create family connections table
CREATE TABLE public.family_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  family_member_id UUID,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  emergency_contact BOOLEAN DEFAULT false,
  notification_preferences JSONB DEFAULT '{}'::jsonb,
  connection_status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.family_connections ENABLE ROW LEVEL SECURITY;

-- Create policies for family connections
CREATE POLICY "Patients can manage their family connections"
ON public.family_connections
FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = family_connections.patient_id 
  AND profiles.user_id = auth.uid()
));

CREATE POLICY "Family members can view their connection"
ON public.family_connections
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = family_connections.family_member_id 
  AND profiles.user_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_ai_conversations_updated_at
  BEFORE UPDATE ON public.ai_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_voice_settings_updated_at
  BEFORE UPDATE ON public.voice_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();