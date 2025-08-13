-- Enable realtime for family messaging
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.conversations REPLICA IDENTITY FULL;
ALTER TABLE public.conversation_participants REPLICA IDENTITY FULL;

-- Add the tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_participants;

-- Create family messaging views and functions
CREATE OR REPLACE FUNCTION public.get_user_conversations(user_uuid uuid)
RETURNS TABLE (
  conversation_id uuid,
  conversation_title text,
  conversation_type text,
  last_message_content text,
  last_message_timestamp timestamptz,
  participant_count bigint
) 
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
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
$$;

-- Create function to get family members for a patient
CREATE OR REPLACE FUNCTION public.get_family_members(patient_uuid uuid)
RETURNS TABLE (
  id uuid,
  name text,
  relationship text,
  email text,
  phone text,
  emergency_contact boolean,
  connection_status text,
  family_member_id uuid
) 
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
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
$$;

-- Create function to create family conversation
CREATE OR REPLACE FUNCTION public.create_family_conversation(
  patient_uuid uuid,
  conversation_title text DEFAULT 'Family Care Chat'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;