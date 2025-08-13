export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          created_at: string
          data: Json | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          patient_id: string
          severity: string
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          created_at?: string
          data?: Json | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          patient_id: string
          severity?: string
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          created_at?: string
          data?: Json | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          patient_id?: string
          severity?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_acknowledged_by_fkey"
            columns: ["acknowledged_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      caregiver_patient_relationships: {
        Row: {
          caregiver_id: string
          created_at: string
          id: string
          is_primary: boolean | null
          patient_id: string
          permissions: Json | null
          relationship_type: string
        }
        Insert: {
          caregiver_id: string
          created_at?: string
          id?: string
          is_primary?: boolean | null
          patient_id: string
          permissions?: Json | null
          relationship_type: string
        }
        Update: {
          caregiver_id?: string
          created_at?: string
          id?: string
          is_primary?: boolean | null
          patient_id?: string
          permissions?: Json | null
          relationship_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "caregiver_patient_relationships_caregiver_id_fkey"
            columns: ["caregiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "caregiver_patient_relationships_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          created_at: string
          description: string | null
          id: string
          is_acknowledged: boolean | null
          patient_id: string
          provider_id: string | null
          recommendation: string | null
          severity: string
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          created_at?: string
          description?: string | null
          id?: string
          is_acknowledged?: boolean | null
          patient_id: string
          provider_id?: string | null
          recommendation?: string | null
          severity: string
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_acknowledged?: boolean | null
          patient_id?: string
          provider_id?: string | null
          recommendation?: string | null
          severity?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinical_alerts_acknowledged_by_fkey"
            columns: ["acknowledged_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_alerts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_alerts_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_guidelines: {
        Row: {
          condition: string
          created_at: string
          description: string | null
          evidence_level: string | null
          guideline_title: string
          id: string
          last_updated: string | null
          recommendations: Json
          source: string | null
          version: string | null
        }
        Insert: {
          condition: string
          created_at?: string
          description?: string | null
          evidence_level?: string | null
          guideline_title: string
          id?: string
          last_updated?: string | null
          recommendations: Json
          source?: string | null
          version?: string | null
        }
        Update: {
          condition?: string
          created_at?: string
          description?: string | null
          evidence_level?: string | null
          guideline_title?: string
          id?: string
          last_updated?: string | null
          recommendations?: Json
          source?: string | null
          version?: string | null
        }
        Relationships: []
      }
      connected_devices: {
        Row: {
          brand: string | null
          created_at: string
          device_id: string | null
          device_type: string
          id: string
          is_active: boolean | null
          last_sync: string | null
          model: string | null
          patient_id: string
          sync_frequency_hours: number | null
        }
        Insert: {
          brand?: string | null
          created_at?: string
          device_id?: string | null
          device_type: string
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          model?: string | null
          patient_id: string
          sync_frequency_hours?: number | null
        }
        Update: {
          brand?: string | null
          created_at?: string
          device_id?: string | null
          device_type?: string
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          model?: string | null
          patient_id?: string
          sync_frequency_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "connected_devices_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          last_read_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          last_read_at?: string | null
          role: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
          last_read_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          title: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      education_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      education_resources: {
        Row: {
          category_id: string
          content: string | null
          created_at: string
          description: string | null
          difficulty_level: string
          estimated_read_time: number | null
          id: string
          is_featured: boolean | null
          resource_type: string
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          category_id: string
          content?: string | null
          created_at?: string
          description?: string | null
          difficulty_level: string
          estimated_read_time?: number | null
          id?: string
          is_featured?: boolean | null
          resource_type: string
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          category_id?: string
          content?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string
          estimated_read_time?: number | null
          id?: string
          is_featured?: boolean | null
          resource_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "education_resources_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "education_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          patient_id: string
          phone_number: string
          priority_order: number | null
          relationship: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          patient_id: string
          phone_number: string
          priority_order?: number | null
          relationship: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          patient_id?: string
          phone_number?: string
          priority_order?: number | null
          relationship?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_incidents: {
        Row: {
          created_at: string
          description: string | null
          id: string
          incident_type: string
          location_data: Json | null
          patient_id: string
          resolved_at: string | null
          responders_notified: string[] | null
          response_time_seconds: number | null
          severity: string
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          incident_type: string
          location_data?: Json | null
          patient_id: string
          resolved_at?: string | null
          responders_notified?: string[] | null
          response_time_seconds?: number | null
          severity: string
          status?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          incident_type?: string
          location_data?: Json | null
          patient_id?: string
          resolved_at?: string | null
          responders_notified?: string[] | null
          response_time_seconds?: number | null
          severity?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_incidents_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_metrics: {
        Row: {
          created_at: string
          device_id: string | null
          id: string
          metric_type: string
          notes: string | null
          patient_id: string
          recorded_at: string
          source: string | null
          unit: string
          value: Json
        }
        Insert: {
          created_at?: string
          device_id?: string | null
          id?: string
          metric_type: string
          notes?: string | null
          patient_id: string
          recorded_at?: string
          source?: string | null
          unit: string
          value: Json
        }
        Update: {
          created_at?: string
          device_id?: string | null
          id?: string
          metric_type?: string
          notes?: string | null
          patient_id?: string
          recorded_at?: string
          source?: string | null
          unit?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "health_metrics_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_claims: {
        Row: {
          billed_amount: number | null
          claim_details: Json | null
          claim_number: string
          covered_amount: number | null
          created_at: string
          id: string
          insurance_provider_id: string
          patient_id: string
          patient_responsibility: number | null
          provider_name: string | null
          service_date: string
          service_description: string | null
          status: string
        }
        Insert: {
          billed_amount?: number | null
          claim_details?: Json | null
          claim_number: string
          covered_amount?: number | null
          created_at?: string
          id?: string
          insurance_provider_id: string
          patient_id: string
          patient_responsibility?: number | null
          provider_name?: string | null
          service_date: string
          service_description?: string | null
          status?: string
        }
        Update: {
          billed_amount?: number | null
          claim_details?: Json | null
          claim_number?: string
          covered_amount?: number | null
          created_at?: string
          id?: string
          insurance_provider_id?: string
          patient_id?: string
          patient_responsibility?: number | null
          provider_name?: string | null
          service_date?: string
          service_description?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_claims_insurance_provider_id_fkey"
            columns: ["insurance_provider_id"]
            isOneToOne: false
            referencedRelation: "insurance_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_claims_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_providers: {
        Row: {
          contact_info: Json | null
          coverage_details: Json | null
          created_at: string
          id: string
          name: string
          type: string
        }
        Insert: {
          contact_info?: Json | null
          coverage_details?: Json | null
          created_at?: string
          id?: string
          name: string
          type: string
        }
        Update: {
          contact_info?: Json | null
          coverage_details?: Json | null
          created_at?: string
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      medication_logs: {
        Row: {
          created_at: string
          id: string
          logged_by: string | null
          medication_schedule_id: string
          notes: string | null
          patient_id: string
          scheduled_time: string
          status: string
          taken_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          logged_by?: string | null
          medication_schedule_id: string
          notes?: string | null
          patient_id: string
          scheduled_time: string
          status?: string
          taken_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logged_by?: string | null
          medication_schedule_id?: string
          notes?: string | null
          patient_id?: string
          scheduled_time?: string
          status?: string
          taken_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medication_logs_logged_by_fkey"
            columns: ["logged_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medication_logs_medication_schedule_id_fkey"
            columns: ["medication_schedule_id"]
            isOneToOne: false
            referencedRelation: "medication_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medication_logs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medication_schedules: {
        Row: {
          created_at: string
          dosage: string
          end_date: string | null
          frequency: string
          id: string
          instructions: string | null
          is_active: boolean | null
          medication_name: string
          patient_id: string
          prescriber_id: string | null
          schedule_times: string[] | null
          start_date: string
          times_per_day: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          dosage: string
          end_date?: string | null
          frequency: string
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          medication_name: string
          patient_id: string
          prescriber_id?: string | null
          schedule_times?: string[] | null
          start_date: string
          times_per_day: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          dosage?: string
          end_date?: string | null
          frequency?: string
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          medication_name?: string
          patient_id?: string
          prescriber_id?: string | null
          schedule_times?: string[] | null
          start_date?: string
          times_per_day?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_schedules_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medication_schedules_prescriber_id_fkey"
            columns: ["prescriber_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_urgent: boolean | null
          message_type: string
          metadata: Json | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_urgent?: boolean | null
          message_type?: string
          metadata?: Json | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_urgent?: boolean | null
          message_type?: string
          metadata?: Json | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_education_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          patient_id: string
          progress_percentage: number | null
          resource_id: string
          status: string
          time_spent_minutes: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          patient_id: string
          progress_percentage?: number | null
          resource_id: string
          status?: string
          time_spent_minutes?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          patient_id?: string
          progress_percentage?: number | null
          resource_id?: string
          status?: string
          time_spent_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_education_progress_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_education_progress_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "education_resources"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_insurance: {
        Row: {
          copay_amount: number | null
          coverage_end: string | null
          coverage_start: string | null
          created_at: string
          deductible_amount: number | null
          group_number: string | null
          id: string
          insurance_provider_id: string
          is_primary: boolean | null
          member_id: string | null
          out_of_pocket_max: number | null
          patient_id: string
          policy_number: string
        }
        Insert: {
          copay_amount?: number | null
          coverage_end?: string | null
          coverage_start?: string | null
          created_at?: string
          deductible_amount?: number | null
          group_number?: string | null
          id?: string
          insurance_provider_id: string
          is_primary?: boolean | null
          member_id?: string | null
          out_of_pocket_max?: number | null
          patient_id: string
          policy_number: string
        }
        Update: {
          copay_amount?: number | null
          coverage_end?: string | null
          coverage_start?: string | null
          created_at?: string
          deductible_amount?: number | null
          group_number?: string | null
          id?: string
          insurance_provider_id?: string
          is_primary?: boolean | null
          member_id?: string | null
          out_of_pocket_max?: number | null
          patient_id?: string
          policy_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_insurance_insurance_provider_id_fkey"
            columns: ["insurance_provider_id"]
            isOneToOne: false
            referencedRelation: "insurance_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_insurance_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          allergies: string[] | null
          created_at: string
          id: string
          insurance_info: Json | null
          medications: Json | null
          primary_diagnosis: string[] | null
          primary_provider_id: string | null
          profile_id: string
          updated_at: string
        }
        Insert: {
          allergies?: string[] | null
          created_at?: string
          id?: string
          insurance_info?: Json | null
          medications?: Json | null
          primary_diagnosis?: string[] | null
          primary_provider_id?: string | null
          profile_id: string
          updated_at?: string
        }
        Update: {
          allergies?: string[] | null
          created_at?: string
          id?: string
          insurance_info?: Json | null
          medications?: Json | null
          primary_diagnosis?: string[] | null
          primary_provider_id?: string | null
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_primary_provider_id_fkey"
            columns: ["primary_provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accessibility_settings: Json | null
          created_at: string
          date_of_birth: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string
          id: string
          medical_record_number: string | null
          phone: string | null
          preferred_language: string | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accessibility_settings?: Json | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name: string
          id?: string
          medical_record_number?: string | null
          phone?: string | null
          preferred_language?: string | null
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          accessibility_settings?: Json | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string
          id?: string
          medical_record_number?: string | null
          phone?: string | null
          preferred_language?: string | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sustainability_goals: {
        Row: {
          achievement_date: string | null
          created_at: string
          current_value: number | null
          goal_type: string
          id: string
          is_achieved: boolean | null
          patient_id: string
          target_date: string
          target_value: number
          updated_at: string
        }
        Insert: {
          achievement_date?: string | null
          created_at?: string
          current_value?: number | null
          goal_type: string
          id?: string
          is_achieved?: boolean | null
          patient_id: string
          target_date: string
          target_value: number
          updated_at?: string
        }
        Update: {
          achievement_date?: string | null
          created_at?: string
          current_value?: number | null
          goal_type?: string
          id?: string
          is_achieved?: boolean | null
          patient_id?: string
          target_date?: string
          target_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      sustainability_metrics: {
        Row: {
          carbon_footprint_kg: number
          carbon_saved_kg: number | null
          category: string
          created_at: string
          data: Json | null
          green_alternative_used: boolean | null
          id: string
          metric_type: string
          patient_id: string
          recorded_at: string
        }
        Insert: {
          carbon_footprint_kg: number
          carbon_saved_kg?: number | null
          category: string
          created_at?: string
          data?: Json | null
          green_alternative_used?: boolean | null
          id?: string
          metric_type: string
          patient_id: string
          recorded_at?: string
        }
        Update: {
          carbon_footprint_kg?: number
          carbon_saved_kg?: number | null
          category?: string
          created_at?: string
          data?: Json | null
          green_alternative_used?: boolean | null
          id?: string
          metric_type?: string
          patient_id?: string
          recorded_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      find_or_create_patient_by_email: {
        Args: {
          patient_email: string
          patient_name: string
          relationship_type: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
