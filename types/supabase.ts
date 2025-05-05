export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
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
          {
            foreignKeyName: "album_images_album_id_fkey"
            columns: ["album_id"]
            referencedRelation: "artist_albums"
            referencedColumns: ["id"]
          },
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
      appointments: {
        Row: {
          artist_id: string | null
          created_at: string | null
          design_id: string | null
          id: string
          notes: string | null
          status: string | null
          user_id: string | null
          date: string | null
          updated_at: string | null
        }
        Insert: {
          artist_id?: string | null
          created_at?: string | null
          design_id?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          user_id?: string | null
          date?: string | null
          updated_at?: string | null
        }
        Update: {
          artist_id?: string | null
          created_at?: string | null
          design_id?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          user_id?: string | null
          date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_artist_id_fkey"
            columns: ["artist_id"]
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_design_id_fkey"
            columns: ["design_id"]
            referencedRelation: "tattoo_designs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_albums: {
        Row: {
          artist_id: string | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          id: string
          title: string
        }
        Insert: {
          artist_id?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          artist_id?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "artist_albums_artist_id_fkey"
            columns: ["artist_id"]
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_of_the_month: {
        Row: {
          artist_id: string | null
          created_at: string | null
          description: string | null
          featured_image_id: string | null
          id: string
          month: number
          year: number
        }
        Insert: {
          artist_id?: string | null
          created_at?: string | null
          description?: string | null
          featured_image_id?: string | null
          id?: string
          month: number
          year: number
        }
        Update: {
          artist_id?: string | null
          created_at?: string | null
          description?: string | null
          featured_image_id?: string | null
          id?: string
          month?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "artist_of_the_month_artist_id_fkey"
            columns: ["artist_id"]
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artist_of_the_month_featured_image_id_fkey"
            columns: ["featured_image_id"]
            referencedRelation: "artist_portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_portfolios: {
        Row: {
          artist_id: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string
          likes_count: number | null
          style: string | null
          tags: string[] | null
          title: string
        }
        Insert: {
          artist_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url: string
          likes_count?: number | null
          style?: string | null
          tags?: string[] | null
          title: string
        }
        Update: {
          artist_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string
          likes_count?: number | null
          style?: string | null
          tags?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "artist_portfolios_artist_id_fkey"
            columns: ["artist_id"]
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_profiles: {
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
            foreignKeyName: "artist_profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          artist_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
          updated_at: string | null
        }
        Insert: {
          artist_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
          updated_at?: string | null
        }
        Update: {
          artist_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_artist_id_fkey"
            columns: ["artist_id"]
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
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
