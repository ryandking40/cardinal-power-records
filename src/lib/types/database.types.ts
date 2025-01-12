export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      divisions: {
        Row: {
          id: string
          name: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          display_order: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          display_order?: number
          created_at?: string
        }
      }
      weight_classes: {
        Row: {
          id: string
          division_id: string
          weight: number | 'PWR'
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          division_id: string
          weight: number | 'PWR'
          display_order: number
          created_at?: string
        }
        Update: {
          id?: string
          division_id?: string
          weight?: number | 'PWR'
          display_order?: number
          created_at?: string
        }
      }
      records: {
        Row: {
          id: string
          weight_class_id: string
          lift_type: 'SQUAT' | 'BENCH' | 'CLEAN'
          athlete_name: string
          school: string
          weight_achieved: number
          year: number
          created_at: string
        }
        Insert: {
          id?: string
          weight_class_id: string
          lift_type: 'SQUAT' | 'BENCH' | 'CLEAN'
          athlete_name: string
          school: string
          weight_achieved: number
          year: number
          created_at?: string
        }
        Update: {
          id?: string
          weight_class_id?: string
          lift_type?: 'SQUAT' | 'BENCH' | 'CLEAN'
          athlete_name?: string
          school?: string
          weight_achieved?: number
          year?: number
          created_at?: string
        }
      }
      display_settings: {
        Row: {
          id: string
          scroll_speed: number
          transition_duration: number
          records_visible_time: number
          background_text_line1: string
          background_text_line2: string
          created_at: string
        }
        Insert: {
          id?: string
          scroll_speed: number
          transition_duration: number
          records_visible_time: number
          background_text_line1: string
          background_text_line2: string
          created_at?: string
        }
        Update: {
          id?: string
          scroll_speed?: number
          transition_duration?: number
          records_visible_time?: number
          background_text_line1?: string
          background_text_line2?: string
          created_at?: string
        }
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
  }
} 