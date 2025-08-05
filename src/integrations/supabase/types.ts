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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
