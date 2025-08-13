-- Fix 1: Add search_path to all database functions to prevent SQL injection
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_conversations(user_uuid uuid)
RETURNS TABLE(conversation_id uuid, conversation_title text, conversation_type text, last_message_content text, last_message_timestamp timestamp with time zone, participant_count bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT 
    c.id,
    c.title,
    c.type,
    m.content,
    m.created_at,
    COUNT(cp.user_id) as participant_count
  FROM conversations c
  INNER JOIN conversation_participants cp ON c.id = cp.conversation_id
  LEFT JOIN messages m ON c.id = m.conversation_id
  WHERE cp.user_id = user_uuid
  AND m.created_at = (
    SELECT MAX(created_at) 
    FROM messages 
    WHERE conversation_id = c.id
  )
  GROUP BY c.id, c.title, c.type, m.content, m.created_at
  ORDER BY m.created_at DESC NULLS LAST;
$function$;

CREATE OR REPLACE FUNCTION public.get_family_members(patient_uuid uuid)
RETURNS TABLE(id uuid, name text, relationship text, email text, phone text, emergency_contact boolean, connection_status text, family_member_id uuid)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT 
    fc.id,
    fc.name,
    fc.relationship,
    fc.email,
    fc.phone,
    fc.emergency_contact,
    fc.connection_status,
    fc.family_member_id
  FROM family_connections fc
  WHERE fc.patient_id = patient_uuid
  AND fc.connection_status = 'active'
  ORDER BY fc.emergency_contact DESC, fc.name;
$function$;

CREATE OR REPLACE FUNCTION public.create_family_conversation(patient_uuid uuid, conversation_title text DEFAULT 'Family Care Chat'::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  new_conversation_id uuid;
  family_member record;
BEGIN
  -- Create the conversation
  INSERT INTO conversations (title, type)
  VALUES (conversation_title, 'family')
  RETURNING id INTO new_conversation_id;
  
  -- Add patient as participant
  INSERT INTO conversation_participants (conversation_id, user_id, role)
  VALUES (new_conversation_id, patient_uuid, 'patient');
  
  -- Add family members as participants
  FOR family_member IN 
    SELECT family_member_id 
    FROM family_connections 
    WHERE patient_id = patient_uuid 
    AND connection_status = 'active'
    AND family_member_id IS NOT NULL
  LOOP
    INSERT INTO conversation_participants (conversation_id, user_id, role)
    VALUES (new_conversation_id, family_member.family_member_id, 'family_member')
    ON CONFLICT (conversation_id, user_id) DO NOTHING;
  END LOOP;
  
  RETURN new_conversation_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.find_or_create_patient_by_email(patient_email text, patient_name text, relationship_type text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;

-- Fix 2: Create security definer function to fix conversation recursion
CREATE OR REPLACE FUNCTION public.get_user_conversation_ids(user_uuid uuid)
RETURNS TABLE(conversation_id uuid)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT cp.conversation_id
  FROM conversation_participants cp
  WHERE cp.user_id = user_uuid;
$function$;

-- Fix 3: Drop and recreate conversation_participants policies to fix recursion
DROP POLICY IF EXISTS "Users can view participants in their conversations" ON public.conversation_participants;

CREATE POLICY "Users can view participants in their conversations"
ON public.conversation_participants
FOR SELECT
USING (conversation_id IN (SELECT public.get_user_conversation_ids(auth.uid())));

-- Fix 4: Add missing RLS policies for insurance_providers table
CREATE POLICY "Insurance providers are publicly readable"
ON public.insurance_providers
FOR SELECT
USING (true);

CREATE POLICY "Admin users can manage insurance providers"
ON public.insurance_providers
FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));