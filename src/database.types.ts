export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          position: number
          slug: string
          subject_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          position?: number
          slug: string
          subject_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          position?: number
          slug?: string
          subject_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      concepts: {
        Row: {
          canonical_definition: string
          created_at: string | null
          difficulty_base: number | null
          id: string
          slug: string
          subject_id: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          canonical_definition: string
          created_at?: string | null
          difficulty_base?: number | null
          id?: string
          slug: string
          subject_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          canonical_definition?: string
          created_at?: string | null
          difficulty_base?: number | null
          id?: string
          slug?: string
          subject_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "concepts_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      grade_levels: {
        Row: {
          age_range: string | null
          created_at: string | null
          curriculum_region: string | null
          education_stage: string | null
          id: string
          name: string
        }
        Insert: {
          age_range?: string | null
          created_at?: string | null
          curriculum_region?: string | null
          education_stage?: string | null
          id?: string
          name: string
        }
        Update: {
          age_range?: string | null
          created_at?: string | null
          curriculum_region?: string | null
          education_stage?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      lesson_activities: {
        Row: {
          created_at: string | null
          id: string
          lesson_block_id: string | null
          lesson_id: string
          position: number
          required: boolean
          title: string
          type: Database["public"]["Enums"]["activity_type"]
          weight: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          lesson_block_id?: string | null
          lesson_id: string
          position: number
          required?: boolean
          title: string
          type: Database["public"]["Enums"]["activity_type"]
          weight: number
        }
        Update: {
          created_at?: string | null
          id?: string
          lesson_block_id?: string | null
          lesson_id?: string
          position?: number
          required?: boolean
          title?: string
          type?: Database["public"]["Enums"]["activity_type"]
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_activities_lesson_block_id_fkey"
            columns: ["lesson_block_id"]
            isOneToOne: false
            referencedRelation: "lesson_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_activities_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_analytics: {
        Row: {
          avg_score: number | null
          avg_time_spent: number | null
          completion_rate: number | null
          dropout_rate: number | null
          id: string
          lesson_version_id: string | null
          satisfaction_rating: number | null
          total_views: number | null
          updated_at: string | null
        }
        Insert: {
          avg_score?: number | null
          avg_time_spent?: number | null
          completion_rate?: number | null
          dropout_rate?: number | null
          id?: string
          lesson_version_id?: string | null
          satisfaction_rating?: number | null
          total_views?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_score?: number | null
          avg_time_spent?: number | null
          completion_rate?: number | null
          dropout_rate?: number | null
          id?: string
          lesson_version_id?: string | null
          satisfaction_rating?: number | null
          total_views?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_analytics_lesson_version_id_fkey"
            columns: ["lesson_version_id"]
            isOneToOne: false
            referencedRelation: "lesson_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_authors: {
        Row: {
          lesson_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          lesson_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          lesson_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: []
      }
      lesson_block_feedback: {
        Row: {
          created_at: string | null
          id: string
          lesson_block_id: string
          message: string | null
          rating: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lesson_block_id: string
          message?: string | null
          rating: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lesson_block_id?: string
          message?: string | null
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_block_feedback_lesson_block_id_fkey"
            columns: ["lesson_block_id"]
            isOneToOne: false
            referencedRelation: "lesson_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_block_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_block_views: {
        Row: {
          created_at: string | null
          id: string
          lesson_block_id: string
          time_spent_seconds: number
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lesson_block_id: string
          time_spent_seconds: number
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lesson_block_id?: string
          time_spent_seconds?: number
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_block_views_lesson_block_id_fkey"
            columns: ["lesson_block_id"]
            isOneToOne: false
            referencedRelation: "lesson_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_block_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_blocks: {
        Row: {
          created_at: string | null
          data: Json
          engine: string | null
          id: string
          lesson_id: string
          position: number
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data: Json
          engine?: string | null
          id: string
          lesson_id: string
          position: number
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json
          engine?: string | null
          id?: string
          lesson_id?: string
          position?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_blocks_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_feedback: {
        Row: {
          created_at: string | null
          feedback_text: string | null
          id: string
          lesson_version_id: string | null
          rating: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          lesson_version_id?: string | null
          rating?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          lesson_version_id?: string | null
          rating?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_feedback_lesson_version_id_fkey"
            columns: ["lesson_version_id"]
            isOneToOne: false
            referencedRelation: "lesson_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_media_assets: {
        Row: {
          asset_type: string
          content: Json
          created_at: string | null
          id: string
          lesson_version_id: string | null
          provider: string | null
          version: number | null
        }
        Insert: {
          asset_type: string
          content: Json
          created_at?: string | null
          id?: string
          lesson_version_id?: string | null
          provider?: string | null
          version?: number | null
        }
        Update: {
          asset_type?: string
          content?: Json
          created_at?: string | null
          id?: string
          lesson_version_id?: string | null
          provider?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_media_assets_lesson_version_id_fkey"
            columns: ["lesson_version_id"]
            isOneToOne: false
            referencedRelation: "lesson_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_processed_versions: {
        Row: {
          concept_id: string | null
          created_at: string | null
          id: string
          keywords: string[] | null
          learning_objectives: string[] | null
          model_version: string | null
          processed_content: Json
          prompt_version: string | null
          raw_version_id: string | null
          summary: string | null
          version: number
        }
        Insert: {
          concept_id?: string | null
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          learning_objectives?: string[] | null
          model_version?: string | null
          processed_content: Json
          prompt_version?: string | null
          raw_version_id?: string | null
          summary?: string | null
          version?: number
        }
        Update: {
          concept_id?: string | null
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          learning_objectives?: string[] | null
          model_version?: string | null
          processed_content?: Json
          prompt_version?: string | null
          raw_version_id?: string | null
          summary?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_processed_versions_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_processed_versions_raw_version_id_fkey"
            columns: ["raw_version_id"]
            isOneToOne: false
            referencedRelation: "lesson_raw_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_raw_versions: {
        Row: {
          concept_id: string | null
          created_at: string | null
          id: string
          raw_content: string
          source_metadata: Json | null
          source_type: string
          title: string | null
          uploaded_by: string | null
          version: number
        }
        Insert: {
          concept_id?: string | null
          created_at?: string | null
          id?: string
          raw_content: string
          source_metadata?: Json | null
          source_type: string
          title?: string | null
          uploaded_by?: string | null
          version?: number
        }
        Update: {
          concept_id?: string | null
          created_at?: string | null
          id?: string
          raw_content?: string
          source_metadata?: Json | null
          source_type?: string
          title?: string | null
          uploaded_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_raw_versions_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_versions: {
        Row: {
          concept_id: string | null
          created_at: string | null
          description: string | null
          difficulty_level: number | null
          estimated_duration_minutes: number | null
          grade_level_id: string | null
          id: string
          is_published: boolean | null
          pedagogy_style: string | null
          processed_version_id: string | null
          title: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          concept_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: number | null
          estimated_duration_minutes?: number | null
          grade_level_id?: string | null
          id?: string
          is_published?: boolean | null
          pedagogy_style?: string | null
          processed_version_id?: string | null
          title: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          concept_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: number | null
          estimated_duration_minutes?: number | null
          grade_level_id?: string | null
          id?: string
          is_published?: boolean | null
          pedagogy_style?: string | null
          processed_version_id?: string | null
          title?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_versions_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_versions_grade_level_id_fkey"
            columns: ["grade_level_id"]
            isOneToOne: false
            referencedRelation: "grade_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_versions_processed_version_id_fkey"
            columns: ["processed_version_id"]
            isOneToOne: false
            referencedRelation: "lesson_processed_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          created_at: string | null
          description: string | null
          duration_seconds: number
          id: string
          is_active: boolean | null
          module_id: string
          position: number | null
          slug: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_seconds?: number
          id?: string
          is_active?: boolean | null
          module_id: string
          position?: number | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_seconds?: number
          id?: string
          is_active?: boolean | null
          module_id?: string
          position?: number | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          category_id: string | null
          created_at: string | null
          id: string
          name: string
          position: number | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          position?: number | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          position?: number | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answer: Json | null
          attempts_count: number
          created_at: string | null
          id: string
          is_correct: boolean
          lesson_block_id: string
          time_spent_seconds: number | null
          user_id: string
        }
        Insert: {
          answer?: Json | null
          attempts_count?: number
          created_at?: string | null
          id?: string
          is_correct: boolean
          lesson_block_id: string
          time_spent_seconds?: number | null
          user_id: string
        }
        Update: {
          answer?: Json | null
          attempts_count?: number
          created_at?: string | null
          id?: string
          is_correct?: boolean
          lesson_block_id?: string
          time_spent_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_lesson_block_id_fkey"
            columns: ["lesson_block_id"]
            isOneToOne: false
            referencedRelation: "lesson_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          order: number | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          order?: number | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          order?: number | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_activity_progress: {
        Row: {
          activity_id: string
          id: string
          score: number | null
          status: Database["public"]["Enums"]["progress_status"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activity_id: string
          id?: string
          score?: number | null
          status?: Database["public"]["Enums"]["progress_status"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activity_id?: string
          id?: string
          score?: number | null
          status?: Database["public"]["Enums"]["progress_status"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_progress_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "lesson_activities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_lesson_progress: {
        Row: {
          created_at: string | null
          id: string
          last_activity_at: string | null
          lesson_id: string
          output_score: number
          quiz_score: number
          read_score: number
          status: Database["public"]["Enums"]["progress_status"]
          updated_at: string | null
          user_id: string
          weighted_score: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_activity_at?: string | null
          lesson_id: string
          output_score?: number
          quiz_score?: number
          read_score?: number
          status?: Database["public"]["Enums"]["progress_status"]
          updated_at?: string | null
          user_id: string
          weighted_score?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          last_activity_at?: string | null
          lesson_id?: string
          output_score?: number
          quiz_score?: number
          read_score?: number
          status?: Database["public"]["Enums"]["progress_status"]
          updated_at?: string | null
          user_id?: string
          weighted_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_subject_cards: {
        Args: never
        Returns: {
          id: string
          lessons_count: number
          modules_count: number
          title: string
          total_hours: number
        }[]
      }
    }
    Enums: {
      activity_type: "content" | "quiz" | "exercise" | "critical_thinking"
      progress_status: "not_started" | "in_progress" | "completed"
      user_role: "student" | "teacher" | "admin"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      activity_type: ["content", "quiz", "exercise", "critical_thinking"],
      progress_status: ["not_started", "in_progress", "completed"],
      user_role: ["student", "teacher", "admin"],
    },
  },
} as const
