export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      classes: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
          teacher_id: string | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
          teacher_id?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
          teacher_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      combine_game_sessions: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          last_accessed: string | null
          max_score: number | null
          score: number | null
          student_id: string
          unit_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          max_score?: number | null
          score?: number | null
          student_id: string
          unit_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          max_score?: number | null
          score?: number | null
          student_id?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "combine_game_sessions_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      decks: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      exam_questions: {
        Row: {
          correct_answer: string
          created_at: string | null
          exam_session_id: string
          explanation: string | null
          id: string
          options: Json | null
          original_qa_id: string | null
          question: string
          question_data: Json | null
          question_type: string
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          exam_session_id: string
          explanation?: string | null
          id?: string
          options?: Json | null
          original_qa_id?: string | null
          question: string
          question_data?: Json | null
          question_type: string
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          exam_session_id?: string
          explanation?: string | null
          id?: string
          options?: Json | null
          original_qa_id?: string | null
          question?: string
          question_data?: Json | null
          question_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_questions_exam_session_id_fkey"
            columns: ["exam_session_id"]
            isOneToOne: false
            referencedRelation: "exam_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_questions_original_qa_id_fkey"
            columns: ["original_qa_id"]
            isOneToOne: false
            referencedRelation: "questions_answers"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_sessions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          max_score: number | null
          num_questions: number | null
          question_types: string[]
          responses: Json | null
          score: number | null
          student_id: string
          unit_code: string | null
          unit_id: string
          unit_title: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          max_score?: number | null
          num_questions?: number | null
          question_types: string[]
          responses?: Json | null
          score?: number | null
          student_id: string
          unit_code?: string | null
          unit_id: string
          unit_title?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          max_score?: number | null
          num_questions?: number | null
          question_types?: string[]
          responses?: Json | null
          score?: number | null
          student_id?: string
          unit_code?: string | null
          unit_id?: string
          unit_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_sessions_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcard_sessions: {
        Row: {
          completed_cards: number | null
          created_at: string | null
          id: string
          last_accessed: string | null
          student_id: string
          total_cards: number | null
          unit_id: string
        }
        Insert: {
          completed_cards?: number | null
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          student_id: string
          total_cards?: number | null
          unit_id: string
        }
        Update: {
          completed_cards?: number | null
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          student_id?: string
          total_cards?: number | null
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcard_sessions_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcards: {
        Row: {
          answer: string
          created_at: string | null
          deck_id: string
          id: string
          question: string
        }
        Insert: {
          answer: string
          created_at?: string | null
          deck_id: string
          id?: string
          question: string
        }
        Update: {
          answer?: string
          created_at?: string | null
          deck_id?: string
          id?: string
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "decks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      questions_answers: {
        Row: {
          answer: string
          created_at: string | null
          id: string
          question: string
          unit_id: string
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: string
          question: string
          unit_id: string
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: string
          question?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_answers_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      student_class_enrollments: {
        Row: {
          class_id: string | null
          enrolled_at: string | null
          id: string
          student_id: string | null
        }
        Insert: {
          class_id?: string | null
          enrolled_at?: string | null
          id?: string
          student_id?: string | null
        }
        Update: {
          class_id?: string | null
          enrolled_at?: string | null
          id?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_class_enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_class_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          specialization: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name: string
          specialization: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          specialization?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      units: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          teacher_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          teacher_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          teacher_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "units_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          specialization: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          specialization?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          specialization?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_unit_code: {
        Args: Record<PropertyKey, never>
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
