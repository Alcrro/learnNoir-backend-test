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
      exercise_attempts: {
        Row: {
          code: string
          created_at: string | null
          execution_time_ms: number | null
          exercise_id: string
          hints_used: number
          id: string
          passed_tests: number
          score: number
          status: string
          total_tests: number
          user_id: string
        }
        Insert: {
          code?: string
          created_at?: string | null
          execution_time_ms?: number | null
          exercise_id: string
          hints_used?: number
          id?: string
          passed_tests?: number
          score?: number
          status: string
          total_tests?: number
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          execution_time_ms?: number | null
          exercise_id?: string
          hints_used?: number
          id?: string
          passed_tests?: number
          score?: number
          status?: string
          total_tests?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_attempts_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          algorithm_id: string
          constraints: Json
          created_at: string | null
          description: string
          difficulty: string
          examples: Json
          hints: Json
          id: string
          lesson_id: string
          position: number
          starter_code: string
          tags: string[]
          test_cases: Json
          title: string
        }
        Insert: {
          algorithm_id: string
          constraints?: Json
          created_at?: string | null
          description?: string
          difficulty: string
          examples?: Json
          hints?: Json
          id?: string
          lesson_id: string
          position?: number
          starter_code?: string
          tags?: string[]
          test_cases?: Json
          title: string
        }
        Update: {
          algorithm_id?: string
          constraints?: Json
          created_at?: string | null
          description?: string
          difficulty?: string
          examples?: Json
          hints?: Json
          id?: string
          lesson_id?: string
          position?: number
          starter_code?: string
          tags?: string[]
          test_cases?: Json
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_options: {
        Row: {
          component_type: string
          id: string
          is_active: boolean
          label: string
          position: number
        }
        Insert: {
          component_type: string
          id?: string
          is_active?: boolean
          label: string
          position?: number
        }
        Update: {
          component_type?: string
          id?: string
          is_active?: boolean
          label?: string
          position?: number
        }
        Relationships: []
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
          component_type: string | null
          created_at: string | null
          id: string
          lesson_block_id: string | null
          lesson_id: string
          position: number
          required: boolean
          theory_interaction_id: string | null
          title: string
          type: Database["public"]["Enums"]["activity_type"]
          weight: number
        }
        Insert: {
          component_type?: string | null
          created_at?: string | null
          id?: string
          lesson_block_id?: string | null
          lesson_id: string
          position: number
          required?: boolean
          theory_interaction_id?: string | null
          title: string
          type: Database["public"]["Enums"]["activity_type"]
          weight: number
        }
        Update: {
          component_type?: string | null
          created_at?: string | null
          id?: string
          lesson_block_id?: string | null
          lesson_id?: string
          position?: number
          required?: boolean
          theory_interaction_id?: string | null
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
          {
            foreignKeyName: "lesson_activities_theory_interaction_id_fkey"
            columns: ["theory_interaction_id"]
            isOneToOne: false
            referencedRelation: "lesson_theory_interactions"
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
      lesson_audio: {
        Row: {
          audio_url: string
          generated_at: string | null
          id: string
          lesson_id: string
          script: Json
        }
        Insert: {
          audio_url: string
          generated_at?: string | null
          id?: string
          lesson_id: string
          script: Json
        }
        Update: {
          audio_url?: string
          generated_at?: string | null
          id?: string
          lesson_id?: string
          script?: Json
        }
        Relationships: [
          {
            foreignKeyName: "lesson_audio_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: true
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_authors: {
        Row: {
          created_at: string | null
          lesson_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          lesson_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          lesson_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_authors_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_authors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      lesson_component_feedback: {
        Row: {
          component_id: string
          created_at: string
          id: string
          lesson_id: string
          message: string | null
          selected_option_ids: string[]
          updated_at: string
          user_id: string
          vote: string
        }
        Insert: {
          component_id: string
          created_at?: string
          id?: string
          lesson_id: string
          message?: string | null
          selected_option_ids?: string[]
          updated_at?: string
          user_id: string
          vote: string
        }
        Update: {
          component_id?: string
          created_at?: string
          id?: string
          lesson_id?: string
          message?: string | null
          selected_option_ids?: string[]
          updated_at?: string
          user_id?: string
          vote?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_component_feedback_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_component_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_edit_history: {
        Row: {
          changed_at: string
          changes: Json
          editor_id: string
          id: string
          lesson_id: string
        }
        Insert: {
          changed_at?: string
          changes: Json
          editor_id: string
          id?: string
          lesson_id: string
        }
        Update: {
          changed_at?: string
          changes?: Json
          editor_id?: string
          id?: string
          lesson_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_edit_history_editor_id_fkey"
            columns: ["editor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_edit_history_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
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
      lesson_theory_interactions: {
        Row: {
          component_type: string
          content: Json
          created_at: string
          created_by: string | null
          id: string
          lesson_id: string
          status: string
          updated_at: string
          version: number
        }
        Insert: {
          component_type: string
          content: Json
          created_at?: string
          created_by?: string | null
          id?: string
          lesson_id: string
          status?: string
          updated_at?: string
          version?: number
        }
        Update: {
          component_type?: string
          content?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          lesson_id?: string
          status?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_theory_interactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_theory_interactions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
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
          lesson_id: string
          pedagogy_style: string | null
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
          lesson_id: string
          pedagogy_style?: string | null
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
          lesson_id?: string
          pedagogy_style?: string | null
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
            foreignKeyName: "lesson_versions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_video: {
        Row: {
          generated_at: string | null
          id: string
          lesson_id: string
          provider: string | null
          script: Json
          video_url: string
        }
        Insert: {
          generated_at?: string | null
          id?: string
          lesson_id: string
          provider?: string | null
          script?: Json
          video_url: string
        }
        Update: {
          generated_at?: string | null
          id?: string
          lesson_id?: string
          provider?: string | null
          script?: Json
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_video_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: true
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          created_at: string | null
          description: string | null
          duration_seconds: number
          grade_level_id: string | null
          id: string
          is_active: boolean | null
          language: 'python' | 'javascript' | 'java' | 'cpp' | null
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
          grade_level_id?: string | null
          id?: string
          is_active?: boolean | null
          language?: 'python' | 'javascript' | 'java' | 'cpp' | null
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
          grade_level_id?: string | null
          id?: string
          is_active?: boolean | null
          language?: 'python' | 'javascript' | 'java' | 'cpp' | null
          module_id?: string
          position?: number | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_grade_level_id_fkey"
            columns: ["grade_level_id"]
            isOneToOne: false
            referencedRelation: "grade_levels"
            referencedColumns: ["id"]
          },
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
        Relationships: [
          {
            foreignKeyName: "modules_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          id: string
          joined_at: string
          org_id: string
          role: Database["public"]["Enums"]["org_member_role"]
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          org_id: string
          role?: Database["public"]["Enums"]["org_member_role"]
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          org_id?: string
          role?: Database["public"]["Enums"]["org_member_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          org_id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          started_at: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          org_id: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          started_at?: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          org_id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_subscriptions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      quiz_block_scores: {
        Row: {
          attempts: number
          created_at: string | null
          id: string
          lesson_block_id: string
          passed: boolean
          score: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          attempts?: number
          created_at?: string | null
          id?: string
          lesson_block_id: string
          passed?: boolean
          score?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          attempts?: number
          created_at?: string | null
          id?: string
          lesson_block_id?: string
          passed?: boolean
          score?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_block_scores_lesson_block_id_fkey"
            columns: ["lesson_block_id"]
            isOneToOne: false
            referencedRelation: "lesson_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_block_scores_user_id_fkey"
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
      creator_subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          started_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          started_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          started_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          started_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      theory_interaction_attempts: {
        Row: {
          attempt_number: number
          chosen_answer: Json
          correct_answer: Json | null
          created_at: string
          id: string
          interaction_id: string
          is_correct: boolean | null
          user_id: string
        }
        Insert: {
          attempt_number?: number
          chosen_answer: Json
          correct_answer?: Json | null
          created_at?: string
          id?: string
          interaction_id: string
          is_correct?: boolean | null
          user_id: string
        }
        Update: {
          attempt_number?: number
          chosen_answer?: Json
          correct_answer?: Json | null
          created_at?: string
          id?: string
          interaction_id?: string
          is_correct?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "theory_interaction_attempts_interaction_id_fkey"
            columns: ["interaction_id"]
            isOneToOne: false
            referencedRelation: "lesson_theory_interactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theory_interaction_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          last_reviewed_at: string | null
          lesson_id: string
          next_review_at: string | null
          output_score: number
          quiz_score: number
          read_score: number
          review_count: number
          status: Database["public"]["Enums"]["progress_status"]
          updated_at: string | null
          user_id: string
          weighted_score: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_activity_at?: string | null
          last_reviewed_at?: string | null
          lesson_id: string
          next_review_at?: string | null
          output_score?: number
          quiz_score?: number
          read_score?: number
          review_count?: number
          status?: Database["public"]["Enums"]["progress_status"]
          updated_at?: string | null
          user_id: string
          weighted_score?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          last_activity_at?: string | null
          last_reviewed_at?: string | null
          lesson_id?: string
          next_review_at?: string | null
          output_score?: number
          quiz_score?: number
          read_score?: number
          review_count?: number
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
      org_member_role: "owner" | "admin" | "member"
      progress_status: "not_started" | "in_progress" | "completed"
      subscription_plan: "free" | "pro"
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
  public: {
    Enums: {
      activity_type: ["content", "quiz", "exercise", "critical_thinking"],
      org_member_role: ["owner", "admin", "member"],
      progress_status: ["not_started", "in_progress", "completed"],
      subscription_plan: ["free", "pro"],
      user_role: ["student", "teacher", "admin"],
    },
  },
} as const
