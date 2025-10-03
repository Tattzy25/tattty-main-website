/**
 * TypeScript representation of the public database schema.
 */
export interface Database {
  /**
   * The `public` property is structured this way to match the expected format used by Supabase client libraries.
   * If this interface is not auto-generated, this structure helps maintain compatibility with Supabase client libraries.
   */
  public: {
    Tables: {
      album_images: {
        Row: {
          album_id: string | null
          created_at: string | null
          id: string
          image_url: string
          title: string | null
          description: string | null
        }
        Insert: {
          album_id?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          title?: string | null
          description?: string | null
        }
        Update: {
          album_id?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          title?: string | null
          description?: string | null
        }
        Relationships: [

        ]
      }
      analytics: {
        Row: {
          count: number | null
          created_at: string | null
          id: string
          style: string | null
          theme: string | null
          updated_at: string | null
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          id?: string
          style?: string | null
          theme?: string | null
          updated_at?: string | null
        }
        Update: {
          count?: number | null
          created_at?: string | null
          id?: string
          style?: string | null
          theme?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          business_name: string | null
          cover_image_url: string | null
          created_at: string | null
          id: string
          instagram: string | null
          is_verified: boolean | null
          location: string | null
          specialties: string[] | null
          tier: string | null
          updated_at: string | null
          verification_document_url: string | null
          website: string | null
          years_experience: number | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          business_name?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          id: string
          instagram?: string | null
          is_verified?: boolean | null
          location?: string | null
          specialties?: string[] | null
          tier?: string | null
          updated_at?: string | null
          verification_document_url?: string | null
          website?: string | null
          years_experience?: number | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          business_name?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          id?: string
          instagram?: string | null
          is_verified?: boolean | null
          location?: string | null
          specialties?: string[] | null
          tier?: string | null
          updated_at?: string | null
          verification_document_url?: string | null
          website?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          sender_id: string | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tattoo_designs: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_path: string | null
          image_url: string
          is_ai_generated: boolean | null
          is_public: boolean | null
          likes_count: number | null
          prompt: string | null
          style: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_path?: string | null
          image_url: string
          is_ai_generated?: boolean | null
          is_public?: boolean | null
          likes_count?: number | null
          prompt?: string | null
          style?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_path?: string | null
          image_url?: string
          is_ai_generated?: boolean | null
          is_public?: boolean | null
          likes_count?: number | null
          prompt?: string | null
          style?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tattoo_designs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string
          location: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          location?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          location?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    // The following empty mapped types prevent excess property checks in TypeScript.
    // See: https://github.com/microsoft/TypeScript/issues/12936
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

