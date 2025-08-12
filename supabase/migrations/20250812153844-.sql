-- Phase 1: Critical Database Security Fixes

-- 1. Fix Database Function Security - Update existing functions with proper search paths
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.find_or_create_patient_by_email(patient_email text, patient_name text, relationship_type text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
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

-- 2. Complete RLS Policy Coverage

-- Alerts table - Add missing INSERT, UPDATE, DELETE policies
CREATE POLICY "Caregivers can create alerts for their patients" 
ON public.alerts 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM caregiver_patient_relationships cpr
    JOIN profiles p ON p.id = cpr.caregiver_id
    WHERE cpr.patient_id = alerts.patient_id 
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Caregivers can update alerts for their patients" 
ON public.alerts 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1
    FROM caregiver_patient_relationships cpr
    JOIN profiles p ON p.id = cpr.caregiver_id
    WHERE cpr.patient_id = alerts.patient_id 
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Providers can manage alerts for their patients" 
ON public.alerts 
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM patients pt
    JOIN profiles pr ON pr.id = pt.primary_provider_id
    WHERE pt.profile_id = alerts.patient_id 
    AND pr.user_id = auth.uid()
  )
);

-- Caregiver Patient Relationships - Add UPDATE policy
CREATE POLICY "Caregivers can update their patient relationships" 
ON public.caregiver_patient_relationships 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = caregiver_patient_relationships.caregiver_id 
    AND profiles.user_id = auth.uid()
  )
);

-- Patients table - Add DELETE policy with proper authorization
CREATE POLICY "Patients can delete their own data" 
ON public.patients 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = patients.profile_id 
    AND profiles.user_id = auth.uid()
  )
);

-- 3. Add constraints to ensure data integrity
ALTER TABLE public.profiles 
ADD CONSTRAINT check_role_valid 
CHECK (role IN ('patient', 'caregiver', 'provider'));

ALTER TABLE public.alerts 
ADD CONSTRAINT check_severity_valid 
CHECK (severity IN ('low', 'medium', 'high', 'critical'));

ALTER TABLE public.alerts 
ADD CONSTRAINT check_alert_type_valid 
CHECK (alert_type IN ('medication', 'vital', 'appointment', 'emergency', 'system'));

-- Make user_id non-nullable for security (this ensures RLS works properly)
-- Note: This might fail if there's existing data, but it's important for security
ALTER TABLE public.profiles 
ALTER COLUMN user_id SET NOT NULL;

-- Add email validation constraint
ALTER TABLE public.profiles 
ADD CONSTRAINT check_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add phone number validation constraint  
ALTER TABLE public.profiles 
ADD CONSTRAINT check_phone_format 
CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$');