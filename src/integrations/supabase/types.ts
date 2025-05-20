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
      cessions: {
        Row: {
          buyer_contact: string | null
          buyer_name: string
          created_at: string | null
          document_url: string | null
          id: string
          notes: string | null
          sale_amount: number
          sale_date: string
          updated_at: string | null
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          buyer_contact?: string | null
          buyer_name: string
          created_at?: string | null
          document_url?: string | null
          id?: string
          notes?: string | null
          sale_amount: number
          sale_date: string
          updated_at?: string | null
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          buyer_contact?: string | null
          buyer_name?: string
          created_at?: string | null
          document_url?: string | null
          id?: string
          notes?: string | null
          sale_amount?: number
          sale_date?: string
          updated_at?: string | null
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cessions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          postal_code: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          postal_code?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          postal_code?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      expertise_reports: {
        Row: {
          amount: number | null
          client_id: string | null
          created_at: string | null
          document_url: string | null
          expert_name: string | null
          id: string
          notes: string | null
          reference: string
          status: string | null
          updated_at: string | null
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          amount?: number | null
          client_id?: string | null
          created_at?: string | null
          document_url?: string | null
          expert_name?: string | null
          id?: string
          notes?: string | null
          reference: string
          status?: string | null
          updated_at?: string | null
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          amount?: number | null
          client_id?: string | null
          created_at?: string | null
          document_url?: string | null
          expert_name?: string | null
          id?: string
          notes?: string | null
          reference?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expertise_reports_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expertise_reports_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      fleet_reservations: {
        Row: {
          client_id: string | null
          created_at: string | null
          end_date: string
          fleet_vehicle_id: string
          id: string
          notes: string | null
          repair_order_id: string | null
          start_date: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          end_date: string
          fleet_vehicle_id: string
          id?: string
          notes?: string | null
          repair_order_id?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          end_date?: string
          fleet_vehicle_id?: string
          id?: string
          notes?: string | null
          repair_order_id?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fleet_reservations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleet_reservations_fleet_vehicle_id_fkey"
            columns: ["fleet_vehicle_id"]
            isOneToOne: false
            referencedRelation: "fleet_vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleet_reservations_repair_order_id_fkey"
            columns: ["repair_order_id"]
            isOneToOne: false
            referencedRelation: "repair_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      fleet_vehicles: {
        Row: {
          brand: string
          created_at: string | null
          id: string
          license_plate: string
          model: string
          notes: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          year: number | null
        }
        Insert: {
          brand: string
          created_at?: string | null
          id?: string
          license_plate: string
          model: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          year?: number | null
        }
        Update: {
          brand?: string
          created_at?: string | null
          id?: string
          license_plate?: string
          model?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          year?: number | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string | null
          document_url: string | null
          due_date: string | null
          id: string
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          reference: string
          repair_order_id: string | null
          status: string | null
          tax_rate: number | null
          updated_at: string | null
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string | null
          document_url?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          reference: string
          repair_order_id?: string | null
          status?: string | null
          tax_rate?: number | null
          updated_at?: string | null
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string | null
          document_url?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          reference?: string
          repair_order_id?: string | null
          status?: string | null
          tax_rate?: number | null
          updated_at?: string | null
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_repair_order_id_fkey"
            columns: ["repair_order_id"]
            isOneToOne: false
            referencedRelation: "repair_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string | null
          document_url: string | null
          id: string
          notes: string | null
          reference: string
          status: string | null
          tax_rate: number | null
          updated_at: string | null
          user_id: string
          valid_until: string | null
          vehicle_id: string | null
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string | null
          document_url?: string | null
          id?: string
          notes?: string | null
          reference: string
          status?: string | null
          tax_rate?: number | null
          updated_at?: string | null
          user_id: string
          valid_until?: string | null
          vehicle_id?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string | null
          document_url?: string | null
          id?: string
          notes?: string | null
          reference?: string
          status?: string | null
          tax_rate?: number | null
          updated_at?: string | null
          user_id?: string
          valid_until?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_orders: {
        Row: {
          client_id: string | null
          created_at: string | null
          document_url: string | null
          end_date: string | null
          estimated_hours: number | null
          id: string
          notes: string | null
          quote_id: string | null
          reference: string
          start_date: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          document_url?: string | null
          end_date?: string | null
          estimated_hours?: number | null
          id?: string
          notes?: string | null
          quote_id?: string | null
          reference: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          document_url?: string | null
          end_date?: string | null
          estimated_hours?: number | null
          id?: string
          notes?: string | null
          quote_id?: string | null
          reference?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repair_orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_orders_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_orders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          brand: string
          client_id: string | null
          color: string | null
          created_at: string | null
          fuel_type: string | null
          id: string
          license_plate: string
          mileage: number | null
          model: string
          updated_at: string | null
          user_id: string
          vin: string | null
          year: number | null
        }
        Insert: {
          brand: string
          client_id?: string | null
          color?: string | null
          created_at?: string | null
          fuel_type?: string | null
          id?: string
          license_plate: string
          mileage?: number | null
          model: string
          updated_at?: string | null
          user_id: string
          vin?: string | null
          year?: number | null
        }
        Update: {
          brand?: string
          client_id?: string | null
          color?: string | null
          created_at?: string | null
          fuel_type?: string | null
          id?: string
          license_plate?: string
          mileage?: number | null
          model?: string
          updated_at?: string | null
          user_id?: string
          vin?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
