import { BaseTable, UUID, Timestamp } from '../types'

export interface UserProfilesRow {
  avatar_url: string | null
  bio: string | null
  created_at: Timestamp | null
  display_name: string | null
  id: UUID
  location: string | null
  updated_at: Timestamp | null
  username: string | null
}

export interface UserProfilesInsert {
  avatar_url?: string | null
  bio?: string | null
  created_at?: Timestamp | null
  display_name?: string | null
  id: UUID
  location?: string | null
  updated_at?: Timestamp | null
  username?: string | null
}

export interface UserProfilesUpdate {
  avatar_url?: string | null
  bio?: string | null
  created_at?: Timestamp | null
  display_name?: string | null
  id?: UUID
  location?: string | null
  updated_at?: Timestamp | null
  username?: string | null
}

export interface UserProfilesTable extends BaseTable<UserProfilesRow, UserProfilesInsert, UserProfilesUpdate> {
  Relationships: [
    {
      foreignKeyName: "user_profiles_id_fkey"
      columns: ["id"]
      referencedRelation: "users"
      referencedColumns: ["id"]
    },
  ]
}
