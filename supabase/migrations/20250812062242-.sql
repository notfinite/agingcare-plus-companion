-- Create sustainability metrics table to track carbon footprint data
CREATE TABLE public.sustainability_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  metric_type TEXT NOT NULL, -- 'medication', 'appointment', 'device', 'transport', 'energy'
  category TEXT NOT NULL, -- 'local_pharmacy', 'shipped_medication', 'telehealth', 'in_person', etc.
  carbon_footprint_kg DECIMAL(10,4) NOT NULL, -- CO2 equivalent in kg
  green_alternative_used BOOLEAN DEFAULT false,
  carbon_saved_kg DECIMAL(10,4) DEFAULT 0, -- CO2 saved by green choice
  data JSONB, -- Additional context data
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sustainability_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for sustainability metrics
CREATE POLICY "Patients can manage their sustainability metrics" 
ON public.sustainability_metrics 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = sustainability_metrics.patient_id 
  AND profiles.user_id = auth.uid()
));

CREATE POLICY "Caregivers can view sustainability metrics" 
ON public.sustainability_metrics 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM caregiver_patient_relationships cpr
  JOIN profiles p ON p.id = cpr.caregiver_id
  WHERE cpr.patient_id = sustainability_metrics.patient_id 
  AND p.user_id = auth.uid()
));

-- Create sustainability goals table
CREATE TABLE public.sustainability_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  goal_type TEXT NOT NULL, -- 'monthly_carbon_reduction', 'green_choices', 'energy_savings'
  target_value DECIMAL(10,4) NOT NULL,
  current_value DECIMAL(10,4) DEFAULT 0,
  target_date DATE NOT NULL,
  is_achieved BOOLEAN DEFAULT false,
  achievement_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for goals
ALTER TABLE public.sustainability_goals ENABLE ROW LEVEL SECURITY;

-- Create policies for sustainability goals
CREATE POLICY "Patients can manage their sustainability goals" 
ON public.sustainability_goals 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = sustainability_goals.patient_id 
  AND profiles.user_id = auth.uid()
));

CREATE POLICY "Caregivers can view sustainability goals" 
ON public.sustainability_goals 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM caregiver_patient_relationships cpr
  JOIN profiles p ON p.id = cpr.caregiver_id
  WHERE cpr.patient_id = sustainability_goals.patient_id 
  AND p.user_id = auth.uid()
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_sustainability_goals_updated_at
BEFORE UPDATE ON public.sustainability_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_sustainability_metrics_patient_id ON public.sustainability_metrics(patient_id);
CREATE INDEX idx_sustainability_metrics_metric_type ON public.sustainability_metrics(metric_type);
CREATE INDEX idx_sustainability_metrics_recorded_at ON public.sustainability_metrics(recorded_at);
CREATE INDEX idx_sustainability_goals_patient_id ON public.sustainability_goals(patient_id);

-- Insert sample sustainability goals for demonstration
INSERT INTO public.sustainability_goals (patient_id, goal_type, target_value, target_date) 
SELECT 
  profiles.id,
  'monthly_carbon_reduction',
  5.0, -- 5kg CO2 reduction target
  DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day'
FROM profiles 
WHERE role = 'patient'
LIMIT 3;