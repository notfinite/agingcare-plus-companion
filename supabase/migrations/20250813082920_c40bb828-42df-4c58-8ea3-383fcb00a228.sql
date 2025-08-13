-- Create real-time messaging system
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('patient_provider', 'patient_caregiver', 'group', 'emergency')),
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.conversation_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  role TEXT NOT NULL CHECK (role IN ('patient', 'provider', 'caregiver', 'admin')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'voice', 'emergency')),
  metadata JSONB DEFAULT '{}',
  is_urgent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create insurance and claims system
CREATE TABLE public.insurance_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('health', 'dental', 'vision', 'prescription')),
  contact_info JSONB DEFAULT '{}',
  coverage_details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.patient_insurance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES profiles(id),
  insurance_provider_id UUID NOT NULL REFERENCES insurance_providers(id),
  policy_number TEXT NOT NULL,
  group_number TEXT,
  member_id TEXT,
  coverage_start DATE,
  coverage_end DATE,
  is_primary BOOLEAN DEFAULT FALSE,
  copay_amount DECIMAL(10,2),
  deductible_amount DECIMAL(10,2),
  out_of_pocket_max DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.insurance_claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES profiles(id),
  insurance_provider_id UUID NOT NULL REFERENCES insurance_providers(id),
  claim_number TEXT NOT NULL,
  service_date DATE NOT NULL,
  provider_name TEXT,
  service_description TEXT,
  billed_amount DECIMAL(10,2),
  covered_amount DECIMAL(10,2),
  patient_responsibility DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'processed', 'appealing')),
  claim_details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enhanced emergency system
CREATE TABLE public.emergency_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES profiles(id),
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  priority_order INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.emergency_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES profiles(id),
  incident_type TEXT NOT NULL CHECK (incident_type IN ('fall', 'chest_pain', 'breathing', 'medication', 'other')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  location_data JSONB DEFAULT '{}',
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'responded', 'resolved', 'false_alarm')),
  response_time_seconds INTEGER,
  responders_notified TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create patient education system
CREATE TABLE public.education_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.education_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES education_categories(id),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('article', 'video', 'infographic', 'quiz', 'checklist')),
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_read_time INTEGER,
  tags TEXT[],
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.patient_education_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES profiles(id),
  resource_id UUID NOT NULL REFERENCES education_resources(id),
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percentage INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(patient_id, resource_id)
);

-- Create clinical decision support system
CREATE TABLE public.clinical_guidelines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  condition TEXT NOT NULL,
  guideline_title TEXT NOT NULL,
  description TEXT,
  recommendations JSONB NOT NULL,
  evidence_level TEXT CHECK (evidence_level IN ('A', 'B', 'C', 'D')),
  source TEXT,
  version TEXT,
  last_updated DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.clinical_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES profiles(id),
  provider_id UUID REFERENCES profiles(id),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('drug_interaction', 'lab_critical', 'vital_abnormal', 'care_gap', 'guideline_reminder')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT,
  recommendation TEXT,
  is_acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_by UUID REFERENCES profiles(id),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create device integration system
CREATE TABLE public.connected_devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES profiles(id),
  device_type TEXT NOT NULL CHECK (device_type IN ('glucose_meter', 'blood_pressure', 'weight_scale', 'fitness_tracker', 'heart_monitor', 'pulse_oximeter')),
  brand TEXT,
  model TEXT,
  device_id TEXT,
  last_sync TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  sync_frequency_hours INTEGER DEFAULT 24,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_education_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connected_devices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for conversations
CREATE POLICY "Users can view conversations they participate in" 
ON public.conversations 
FOR SELECT 
USING (id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()));

CREATE POLICY "Users can create conversations" 
ON public.conversations 
FOR INSERT 
WITH CHECK (true);

-- Create RLS policies for conversation participants
CREATE POLICY "Users can view participants in their conversations" 
ON public.conversation_participants 
FOR SELECT 
USING (conversation_id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()));

CREATE POLICY "Users can join conversations" 
ON public.conversation_participants 
FOR INSERT 
WITH CHECK (true);

-- Create RLS policies for messages
CREATE POLICY "Users can view messages in their conversations" 
ON public.messages 
FOR SELECT 
USING (conversation_id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()));

CREATE POLICY "Users can send messages to their conversations" 
ON public.messages 
FOR INSERT 
WITH CHECK (conversation_id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()));

-- Create RLS policies for insurance (patient data)
CREATE POLICY "Patients can view their own insurance" 
ON public.patient_insurance 
FOR SELECT 
USING (patient_id = auth.uid());

CREATE POLICY "Patients can manage their own insurance" 
ON public.patient_insurance 
FOR ALL 
USING (patient_id = auth.uid());

-- Create RLS policies for insurance claims
CREATE POLICY "Patients can view their own claims" 
ON public.insurance_claims 
FOR SELECT 
USING (patient_id = auth.uid());

CREATE POLICY "Patients can create their own claims" 
ON public.insurance_claims 
FOR INSERT 
WITH CHECK (patient_id = auth.uid());

-- Create RLS policies for emergency contacts
CREATE POLICY "Patients can manage their emergency contacts" 
ON public.emergency_contacts 
FOR ALL 
USING (patient_id = auth.uid());

-- Create RLS policies for emergency incidents
CREATE POLICY "Patients can view their emergency incidents" 
ON public.emergency_incidents 
FOR SELECT 
USING (patient_id = auth.uid());

CREATE POLICY "Patients can create emergency incidents" 
ON public.emergency_incidents 
FOR INSERT 
WITH CHECK (patient_id = auth.uid());

-- Create RLS policies for education resources (public read)
CREATE POLICY "Education categories are publicly readable" 
ON public.education_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Education resources are publicly readable" 
ON public.education_resources 
FOR SELECT 
USING (true);

-- Create RLS policies for patient education progress
CREATE POLICY "Patients can view their own education progress" 
ON public.patient_education_progress 
FOR SELECT 
USING (patient_id = auth.uid());

CREATE POLICY "Patients can update their own education progress" 
ON public.patient_education_progress 
FOR ALL 
USING (patient_id = auth.uid());

-- Create RLS policies for clinical guidelines (public read)
CREATE POLICY "Clinical guidelines are publicly readable" 
ON public.clinical_guidelines 
FOR SELECT 
USING (true);

-- Create RLS policies for clinical alerts
CREATE POLICY "Users can view alerts for their patients or themselves" 
ON public.clinical_alerts 
FOR SELECT 
USING (patient_id = auth.uid() OR provider_id = auth.uid());

-- Create RLS policies for connected devices
CREATE POLICY "Patients can manage their connected devices" 
ON public.connected_devices 
FOR ALL 
USING (patient_id = auth.uid());

-- Create triggers for updated_at columns
CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_education_resources_updated_at
BEFORE UPDATE ON public.education_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_conversation_participants_user_id ON public.conversation_participants(user_id);
CREATE INDEX idx_patient_insurance_patient_id ON public.patient_insurance(patient_id);
CREATE INDEX idx_insurance_claims_patient_id ON public.insurance_claims(patient_id);
CREATE INDEX idx_emergency_contacts_patient_id ON public.emergency_contacts(patient_id);
CREATE INDEX idx_emergency_incidents_patient_id ON public.emergency_incidents(patient_id);
CREATE INDEX idx_patient_education_progress_patient_id ON public.patient_education_progress(patient_id);
CREATE INDEX idx_clinical_alerts_patient_id ON public.clinical_alerts(patient_id);
CREATE INDEX idx_connected_devices_patient_id ON public.connected_devices(patient_id);