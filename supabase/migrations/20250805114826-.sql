-- Create user profiles table with role-based access
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('patient', 'caregiver', 'provider')),
  phone TEXT,
  date_of_birth DATE,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  medical_record_number TEXT,
  preferred_language TEXT DEFAULT 'en',
  accessibility_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patients table for patient-specific data
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  primary_diagnosis TEXT[],
  allergies TEXT[],
  medications JSONB DEFAULT '[]',
  primary_provider_id UUID REFERENCES public.profiles(id),
  insurance_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create caregiver_patient_relationships table
CREATE TABLE public.caregiver_patient_relationships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  caregiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL,
  permissions JSONB DEFAULT '{"view_health_data": true, "receive_alerts": true, "manage_medications": false}',
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(caregiver_id, patient_id)
);

-- Create health_metrics table for tracking vital signs
CREATE TABLE public.health_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('blood_pressure', 'glucose', 'heart_rate', 'weight', 'temperature', 'oxygen_saturation')),
  value JSONB NOT NULL,
  unit TEXT NOT NULL,
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'device', 'healthkit', 'fhir')),
  device_id TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medication_schedules table
CREATE TABLE public.medication_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  times_per_day INTEGER NOT NULL,
  schedule_times TIME[],
  start_date DATE NOT NULL,
  end_date DATE,
  instructions TEXT,
  prescriber_id UUID REFERENCES public.profiles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medication_logs table
CREATE TABLE public.medication_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  medication_schedule_id UUID NOT NULL REFERENCES public.medication_schedules(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  taken_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'taken', 'missed', 'skipped')),
  notes TEXT,
  logged_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alerts table for various types of notifications
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('medication', 'vital_signs', 'emergency', 'appointment', 'ai_risk')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  acknowledged_by UUID REFERENCES public.profiles(id),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregiver_patient_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for patients
CREATE POLICY "Patients can view their own data" 
ON public.patients FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = patients.profile_id 
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Caregivers can view their patients data" 
ON public.patients FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.caregiver_patient_relationships cpr
    JOIN public.profiles p ON p.id = cpr.caregiver_id
    WHERE cpr.patient_id = patients.profile_id 
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Providers can view their patients data" 
ON public.patients FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = patients.primary_provider_id 
    AND profiles.user_id = auth.uid()
  )
);

-- RLS Policies for health_metrics
CREATE POLICY "Patients can manage their health metrics" 
ON public.health_metrics FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = health_metrics.patient_id 
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Caregivers can view health metrics" 
ON public.health_metrics FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.caregiver_patient_relationships cpr
    JOIN public.profiles p ON p.id = cpr.caregiver_id
    WHERE cpr.patient_id = health_metrics.patient_id 
    AND p.user_id = auth.uid()
  )
);

-- RLS Policies for medication_schedules
CREATE POLICY "Patients can manage their medication schedules" 
ON public.medication_schedules FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = medication_schedules.patient_id 
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Caregivers can view medication schedules" 
ON public.medication_schedules FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.caregiver_patient_relationships cpr
    JOIN public.profiles p ON p.id = cpr.caregiver_id
    WHERE cpr.patient_id = medication_schedules.patient_id 
    AND p.user_id = auth.uid()
  )
);

-- RLS Policies for alerts
CREATE POLICY "Users can view alerts for their patients" 
ON public.alerts FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = alerts.patient_id 
    AND profiles.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.caregiver_patient_relationships cpr
    JOIN public.profiles p ON p.id = cpr.caregiver_id
    WHERE cpr.patient_id = alerts.patient_id 
    AND p.user_id = auth.uid()
  )
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medication_schedules_updated_at
  BEFORE UPDATE ON public.medication_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_health_metrics_patient_id ON public.health_metrics(patient_id);
CREATE INDEX idx_health_metrics_type_date ON public.health_metrics(patient_id, metric_type, recorded_at);
CREATE INDEX idx_medication_logs_patient_date ON public.medication_logs(patient_id, scheduled_time);
CREATE INDEX idx_alerts_patient_unread ON public.alerts(patient_id, is_read);
CREATE INDEX idx_caregiver_relationships ON public.caregiver_patient_relationships(caregiver_id, patient_id);