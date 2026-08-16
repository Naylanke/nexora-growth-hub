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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          body: string
          created_at: string
          id: string
          is_published: boolean
          title: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_published?: boolean
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_published?: boolean
          title?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          key_hash: string
          key_prefix: string
          label: string | null
          last_used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          key_hash: string
          key_prefix: string
          label?: string | null
          last_used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          key_hash?: string
          key_prefix?: string
          label?: string | null
          last_used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          metadata: Json
          reason: string | null
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          reason?: string | null
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          reason?: string | null
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          category: string | null
          charge: number
          created_at: string
          currency: string
          id: string
          link: string
          provider_order_id: string | null
          provider_status: string | null
          quantity: number
          refunded: boolean
          remains: number | null
          service_id: string | null
          service_name: string
          start_count: number | null
          status: Database["public"]["Enums"]["order_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          charge: number
          created_at?: string
          currency?: string
          id?: string
          link: string
          provider_order_id?: string | null
          provider_status?: string | null
          quantity: number
          refunded?: boolean
          remains?: number | null
          service_id?: string | null
          service_name: string
          start_count?: number | null
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          charge?: number
          created_at?: string
          currency?: string
          id?: string
          link?: string
          provider_order_id?: string | null
          provider_status?: string | null
          quantity?: number
          refunded?: boolean
          remains?: number | null
          service_id?: string | null
          service_name?: string
          start_count?: number | null
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          credited: boolean
          currency: string
          id: string
          metadata: Json
          provider: string
          provider_txn_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          credited?: boolean
          currency?: string
          id?: string
          metadata?: Json
          provider?: string
          provider_txn_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          credited?: boolean
          currency?: string
          id?: string
          metadata?: Json
          provider?: string
          provider_txn_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          balance: number
          created_at: string
          currency: string
          email: string | null
          full_name: string | null
          id: string
          referral_code: string | null
          referral_earnings: number
          referred_by: string | null
          status: string
          updated_at: string
          username: string | null
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          email?: string | null
          full_name?: string | null
          id: string
          referral_code?: string | null
          referral_earnings?: number
          referred_by?: string | null
          status?: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          email?: string | null
          full_name?: string | null
          id?: string
          referral_code?: string | null
          referral_earnings?: number
          referred_by?: string | null
          status?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      provider_sync_logs: {
        Row: {
          created_at: string
          details: Json
          id: string
          kind: string
          ok: boolean
          provider: string
        }
        Insert: {
          created_at?: string
          details?: Json
          id?: string
          kind: string
          ok?: boolean
          provider: string
        }
        Update: {
          created_at?: string
          details?: Json
          id?: string
          kind?: string
          ok?: boolean
          provider?: string
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      services: {
        Row: {
          avg_delivery_time: string | null
          cancel: boolean
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          markup_percent: number
          max_quantity: number
          min_quantity: number
          name: string
          orders_count: number
          provider: string
          provider_rate: number
          provider_service_id: string | null
          rate: number
          refill: boolean
          service_type: string
          updated_at: string
        }
        Insert: {
          avg_delivery_time?: string | null
          cancel?: boolean
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          markup_percent?: number
          max_quantity?: number
          min_quantity?: number
          name: string
          orders_count?: number
          provider?: string
          provider_rate?: number
          provider_service_id?: string | null
          rate?: number
          refill?: boolean
          service_type?: string
          updated_at?: string
        }
        Update: {
          avg_delivery_time?: string | null
          cancel?: boolean
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          markup_percent?: number
          max_quantity?: number
          min_quantity?: number
          name?: string
          orders_count?: number
          provider?: string
          provider_rate?: number
          provider_service_id?: string | null
          rate?: number
          refill?: boolean
          service_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      support_messages: {
        Row: {
          created_at: string
          id: string
          is_staff: boolean
          message: string
          ticket_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_staff?: boolean
          message: string
          ticket_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_staff?: boolean
          message?: string
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          category: string
          created_at: string
          id: string
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          created_by: string | null
          currency: string
          description: string | null
          id: string
          reference_id: string | null
          type: Database["public"]["Enums"]["txn_type"]
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          type: Database["public"]["Enums"]["txn_type"]
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          type?: Database["public"]["Enums"]["txn_type"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_wallet_change: {
        Args: {
          _amount: number
          _created_by?: string
          _description?: string
          _reference_id?: string
          _type: Database["public"]["Enums"]["txn_type"]
          _user_id: string
        }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "reseller" | "admin"
      order_status:
        | "pending"
        | "processing"
        | "in_progress"
        | "completed"
        | "partial"
        | "cancelled"
        | "failed"
      payment_status: "pending" | "completed" | "failed" | "cancelled"
      ticket_status: "open" | "pending" | "answered" | "closed"
      txn_type: "deposit" | "order" | "refund" | "referral" | "adjustment"
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
      app_role: ["user", "reseller", "admin"],
      order_status: [
        "pending",
        "processing",
        "in_progress",
        "completed",
        "partial",
        "cancelled",
        "failed",
      ],
      payment_status: ["pending", "completed", "failed", "cancelled"],
      ticket_status: ["open", "pending", "answered", "closed"],
      txn_type: ["deposit", "order", "refund", "referral", "adjustment"],
    },
  },
} as const
