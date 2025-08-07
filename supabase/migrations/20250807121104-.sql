-- Enable RLS policies for caregiver patient management
CREATE POLICY "Caregivers can insert patient relationships" 
ON public.caregiver_patient_relationships 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = caregiver_patient_relationships.caregiver_id 
  AND profiles.user_id = auth.uid()
));

CREATE POLICY "Caregivers can view their patient relationships" 
ON public.caregiver_patient_relationships 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = caregiver_patient_relationships.caregiver_id 
  AND profiles.user_id = auth.uid()
));

CREATE POLICY "Caregivers can delete their patient relationships" 
ON public.caregiver_patient_relationships 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = caregiver_patient_relationships.caregiver_id 
  AND profiles.user_id = auth.uid()
));

-- Enable RLS policies for patients table
CREATE POLICY "Patients can insert their own data" 
ON public.patients 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = patients.profile_id 
  AND profiles.user_id = auth.uid()
));

CREATE POLICY "Patients can update their own data" 
ON public.patients 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = patients.profile_id 
  AND profiles.user_id = auth.uid()
));

-- Enable policies for medication logs
CREATE POLICY "Patients can manage their medication logs" 
ON public.medication_logs 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = medication_logs.patient_id 
  AND profiles.user_id = auth.uid()
));

CREATE POLICY "Caregivers can view medication logs" 
ON public.medication_logs 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM caregiver_patient_relationships cpr
  JOIN profiles p ON p.id = cpr.caregiver_id
  WHERE cpr.patient_id = medication_logs.patient_id 
  AND p.user_id = auth.uid()
));

-- Create a function to find or create patient profile
CREATE OR REPLACE FUNCTION public.find_or_create_patient_by_email(
  patient_email text,
  patient_name text,
  relationship_type text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  patient_profile_id uuid;
  caregiver_profile_id uuid;
BEGIN
  -- Get the caregiver's profile ID
  SELECT id INTO caregiver_profile_id
  FROM profiles
  WHERE user_id = auth.uid();
  
  IF caregiver_profile_id IS NULL THEN
    RAISE EXCEPTION 'Caregiver profile not found';
  END IF;
  
  -- Try to find existing patient profile by email
  SELECT id INTO patient_profile_id
  FROM profiles
  WHERE email = patient_email;
  
  -- If patient doesn't exist, create a placeholder profile
  IF patient_profile_id IS NULL THEN
    INSERT INTO profiles (user_id, email, full_name, role)
    VALUES (gen_random_uuid(), patient_email, patient_name, 'patient')
    RETURNING id INTO patient_profile_id;
    
    -- Create patient record
    INSERT INTO patients (profile_id)
    VALUES (patient_profile_id);
  END IF;
  
  -- Create or update caregiver-patient relationship
  INSERT INTO caregiver_patient_relationships (
    caregiver_id, 
    patient_id, 
    relationship_type
  )
  VALUES (caregiver_profile_id, patient_profile_id, relationship_type)
  ON CONFLICT (caregiver_id, patient_id) 
  DO UPDATE SET relationship_type = EXCLUDED.relationship_type;
  
  RETURN patient_profile_id;
END;
$$;