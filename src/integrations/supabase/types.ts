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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      bank_accounts: {
        Row: {
          balance: number | null
          bank: string
          bic: string
          created_at: string
          iban: string
          id: string
          last_sync: string | null
          name: string
          status: string | null
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number | null
          bank: string
          bic: string
          created_at?: string
          iban: string
          id?: string
          last_sync?: string | null
          name: string
          status?: string | null
          type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number | null
          bank?: string
          bic?: string
          created_at?: string
          iban?: string
          id?: string
          last_sync?: string | null
          name?: string
          status?: string | null
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      car_brands: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      car_models: {
        Row: {
          brand_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "car_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "car_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      cessions: {
        Row: {
          bank_account_id: string | null
          buyer_contact: string | null
          buyer_name: string | null
          created_at: string
          document_url: string | null
          expert_name: string | null
          id: string
          incident_date: string | null
          incident_number: string | null
          insurance_company_id: string | null
          notes: string | null
          policy_number: string | null
          reference: string
          repair_order_id: string | null
          report_number: string | null
          sale_amount: number | null
          sale_date: string | null
          sale_price: number | null
          status: string | null
          updated_at: string
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          bank_account_id?: string | null
          buyer_contact?: string | null
          buyer_name?: string | null
          created_at?: string
          document_url?: string | null
          expert_name?: string | null
          id?: string
          incident_date?: string | null
          incident_number?: string | null
          insurance_company_id?: string | null
          notes?: string | null
          policy_number?: string | null
          reference?: string
          repair_order_id?: string | null
          report_number?: string | null
          sale_amount?: number | null
          sale_date?: string | null
          sale_price?: number | null
          status?: string | null
          updated_at?: string
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          bank_account_id?: string | null
          buyer_contact?: string | null
          buyer_name?: string | null
          created_at?: string
          document_url?: string | null
          expert_name?: string | null
          id?: string
          incident_date?: string | null
          incident_number?: string | null
          insurance_company_id?: string | null
          notes?: string | null
          policy_number?: string | null
          reference?: string
          repair_order_id?: string | null
          report_number?: string | null
          sale_amount?: number | null
          sale_date?: string | null
          sale_price?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cessions_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cessions_insurance_company_id_fkey"
            columns: ["insurance_company_id"]
            isOneToOne: false
            referencedRelation: "insurance_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cessions_repair_order_id_fkey"
            columns: ["repair_order_id"]
            isOneToOne: false
            referencedRelation: "repair_orders"
            referencedColumns: ["id"]
          },
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
          created_at: string
          driver_license_back_url: string | null
          driver_license_front_url: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          postal_code: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          driver_license_back_url?: string | null
          driver_license_front_url?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          postal_code?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          driver_license_back_url?: string | null
          driver_license_front_url?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          postal_code?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      company_info: {
        Row: {
          address: string
          city: string
          created_at: string
          email: string
          id: string
          logo_url: string | null
          name: string
          notifications: Json
          phone: string
          siren: string
          siret: string
          tva: string
          updated_at: string
          user_id: string
          zipcode: string
        }
        Insert: {
          address?: string
          city?: string
          created_at?: string
          email?: string
          id?: string
          logo_url?: string | null
          name?: string
          notifications?: Json
          phone?: string
          siren?: string
          siret?: string
          tva?: string
          updated_at?: string
          user_id: string
          zipcode?: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          email?: string
          id?: string
          logo_url?: string | null
          name?: string
          notifications?: Json
          phone?: string
          siren?: string
          siret?: string
          tva?: string
          updated_at?: string
          user_id?: string
          zipcode?: string
        }
        Relationships: []
      }
      credits: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string | null
          items_data: Json | null
          notes: string | null
          reference: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string | null
          items_data?: Json | null
          notes?: string | null
          reference: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string | null
          items_data?: Json | null
          notes?: string | null
          reference?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credits_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          assign_to_vehicle: boolean
          category: string
          created_at: string
          date: string
          id: string
          proof_url: string | null
          status: string
          supplier: string
          total_amount: number
          type: string
          updated_at: string
          user_id: string
          vat_amount: number
          vehicle_id: string | null
        }
        Insert: {
          assign_to_vehicle?: boolean
          category: string
          created_at?: string
          date: string
          id?: string
          proof_url?: string | null
          status?: string
          supplier: string
          total_amount?: number
          type?: string
          updated_at?: string
          user_id: string
          vat_amount?: number
          vehicle_id?: string | null
        }
        Update: {
          assign_to_vehicle?: boolean
          category?: string
          created_at?: string
          date?: string
          id?: string
          proof_url?: string | null
          status?: string
          supplier?: string
          total_amount?: number
          type?: string
          updated_at?: string
          user_id?: string
          vat_amount?: number
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      expertise_reports: {
        Row: {
          amount: number | null
          claim_number: string | null
          client_id: string | null
          created_at: string
          document_url: string | null
          expert_name: string | null
          id: string
          incident_date: string | null
          parts_data: string | null
          policy_number: string | null
          repairs_data: string | null
          report_date: string | null
          report_number: string | null
          status: string | null
          updated_at: string
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          amount?: number | null
          claim_number?: string | null
          client_id?: string | null
          created_at?: string
          document_url?: string | null
          expert_name?: string | null
          id?: string
          incident_date?: string | null
          parts_data?: string | null
          policy_number?: string | null
          repairs_data?: string | null
          report_date?: string | null
          report_number?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          amount?: number | null
          claim_number?: string | null
          client_id?: string | null
          created_at?: string
          document_url?: string | null
          expert_name?: string | null
          id?: string
          incident_date?: string | null
          parts_data?: string | null
          policy_number?: string | null
          repairs_data?: string | null
          report_date?: string | null
          report_number?: string | null
          status?: string | null
          updated_at?: string
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
          actual_return_date: string | null
          attestation_accepted: boolean | null
          client_id: string
          client_insurance: boolean | null
          client_signature: string | null
          created_at: string
          damages: Json | null
          date_of_birth: string | null
          driver_license_back_url: string | null
          driver_license_front_url: string | null
          end_mileage: number | null
          expected_return_date: string | null
          fleet_vehicle_id: string
          fuel_level_end: number | null
          fuel_level_start: number
          holder_info: string | null
          id: string
          insurance_address: string | null
          insurance_city: string | null
          insurance_company_name: string | null
          insurance_contract_number: string | null
          insurance_email: string | null
          insurance_phone: string | null
          insurance_postal_code: string | null
          license_issue_date: string | null
          license_number: string | null
          notes: string | null
          place_of_birth: string | null
          prefecture: string | null
          start_date: string
          start_mileage: number
          status: string
          updated_at: string
          user_id: string
          vehicle_images: Json | null
        }
        Insert: {
          actual_return_date?: string | null
          attestation_accepted?: boolean | null
          client_id: string
          client_insurance?: boolean | null
          client_signature?: string | null
          created_at?: string
          damages?: Json | null
          date_of_birth?: string | null
          driver_license_back_url?: string | null
          driver_license_front_url?: string | null
          end_mileage?: number | null
          expected_return_date?: string | null
          fleet_vehicle_id: string
          fuel_level_end?: number | null
          fuel_level_start?: number
          holder_info?: string | null
          id?: string
          insurance_address?: string | null
          insurance_city?: string | null
          insurance_company_name?: string | null
          insurance_contract_number?: string | null
          insurance_email?: string | null
          insurance_phone?: string | null
          insurance_postal_code?: string | null
          license_issue_date?: string | null
          license_number?: string | null
          notes?: string | null
          place_of_birth?: string | null
          prefecture?: string | null
          start_date: string
          start_mileage?: number
          status?: string
          updated_at?: string
          user_id: string
          vehicle_images?: Json | null
        }
        Update: {
          actual_return_date?: string | null
          attestation_accepted?: boolean | null
          client_id?: string
          client_insurance?: boolean | null
          client_signature?: string | null
          created_at?: string
          damages?: Json | null
          date_of_birth?: string | null
          driver_license_back_url?: string | null
          driver_license_front_url?: string | null
          end_mileage?: number | null
          expected_return_date?: string | null
          fleet_vehicle_id?: string
          fuel_level_end?: number | null
          fuel_level_start?: number
          holder_info?: string | null
          id?: string
          insurance_address?: string | null
          insurance_city?: string | null
          insurance_company_name?: string | null
          insurance_contract_number?: string | null
          insurance_email?: string | null
          insurance_phone?: string | null
          insurance_postal_code?: string | null
          license_issue_date?: string | null
          license_number?: string | null
          notes?: string | null
          place_of_birth?: string | null
          prefecture?: string | null
          start_date?: string
          start_mileage?: number
          status?: string
          updated_at?: string
          user_id?: string
          vehicle_images?: Json | null
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
            foreignKeyName: "fleet_reservations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fleet_returns: {
        Row: {
          attestation_accepted: boolean | null
          client_id: string
          client_name: string | null
          client_signature: string | null
          created_at: string
          damages: Json | null
          fleet_reservation_id: string
          fleet_vehicle_id: string
          fuel_level_return: number
          id: string
          notes: string | null
          return_date: string
          return_mileage: number
          status: string
          updated_at: string
          user_id: string
          vehicle_images: Json | null
        }
        Insert: {
          attestation_accepted?: boolean | null
          client_id: string
          client_name?: string | null
          client_signature?: string | null
          created_at?: string
          damages?: Json | null
          fleet_reservation_id: string
          fleet_vehicle_id: string
          fuel_level_return?: number
          id?: string
          notes?: string | null
          return_date?: string
          return_mileage?: number
          status?: string
          updated_at?: string
          user_id: string
          vehicle_images?: Json | null
        }
        Update: {
          attestation_accepted?: boolean | null
          client_id?: string
          client_name?: string | null
          client_signature?: string | null
          created_at?: string
          damages?: Json | null
          fleet_reservation_id?: string
          fleet_vehicle_id?: string
          fuel_level_return?: number
          id?: string
          notes?: string | null
          return_date?: string
          return_mileage?: number
          status?: string
          updated_at?: string
          user_id?: string
          vehicle_images?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "fleet_returns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleet_returns_fleet_reservation_id_fkey"
            columns: ["fleet_reservation_id"]
            isOneToOne: false
            referencedRelation: "fleet_reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleet_returns_fleet_vehicle_id_fkey"
            columns: ["fleet_vehicle_id"]
            isOneToOne: false
            referencedRelation: "fleet_vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleet_returns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fleet_vehicles: {
        Row: {
          brand_id: string
          color: string | null
          created_at: string
          engine_number: string | null
          id: string
          insurance_card_url: string | null
          license_plate: string
          mileage: number | null
          model_id: string
          registration_back_url: string | null
          registration_front_url: string | null
          status: string | null
          updated_at: string
          user_id: string
          vin: string | null
          year: number | null
        }
        Insert: {
          brand_id: string
          color?: string | null
          created_at?: string
          engine_number?: string | null
          id?: string
          insurance_card_url?: string | null
          license_plate: string
          mileage?: number | null
          model_id: string
          registration_back_url?: string | null
          registration_front_url?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
          vin?: string | null
          year?: number | null
        }
        Update: {
          brand_id?: string
          color?: string | null
          created_at?: string
          engine_number?: string | null
          id?: string
          insurance_card_url?: string | null
          license_plate?: string
          mileage?: number | null
          model_id?: string
          registration_back_url?: string | null
          registration_front_url?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
          vin?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_fleet_vehicles_brand"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "car_brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_fleet_vehicles_model"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "car_models"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_companies: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          claim_number: string | null
          client_id: string | null
          created_at: string
          date: string | null
          discounts_data: Json | null
          document_url: string | null
          due_date: string | null
          expert_name: string | null
          id: string
          incident_date: string | null
          notes: string | null
          parts_data: Json | null
          payment_details: string | null
          policy_number: string | null
          reference: string
          repair_order_id: string | null
          repairs_data: Json | null
          report_date: string | null
          report_number: string | null
          status: string | null
          tax_rate: number | null
          updated_at: string
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          amount?: number
          claim_number?: string | null
          client_id?: string | null
          created_at?: string
          date?: string | null
          discounts_data?: Json | null
          document_url?: string | null
          due_date?: string | null
          expert_name?: string | null
          id?: string
          incident_date?: string | null
          notes?: string | null
          parts_data?: Json | null
          payment_details?: string | null
          policy_number?: string | null
          reference: string
          repair_order_id?: string | null
          repairs_data?: Json | null
          report_date?: string | null
          report_number?: string | null
          status?: string | null
          tax_rate?: number | null
          updated_at?: string
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          amount?: number
          claim_number?: string | null
          client_id?: string | null
          created_at?: string
          date?: string | null
          discounts_data?: Json | null
          document_url?: string | null
          due_date?: string | null
          expert_name?: string | null
          id?: string
          incident_date?: string | null
          notes?: string | null
          parts_data?: Json | null
          payment_details?: string | null
          policy_number?: string | null
          reference?: string
          repair_order_id?: string | null
          repairs_data?: Json | null
          report_date?: string | null
          report_number?: string | null
          status?: string | null
          tax_rate?: number | null
          updated_at?: string
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
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          amount: number
          claim_number: string | null
          client_id: string | null
          created_at: string
          discounts_data: string | null
          document_url: string | null
          expert_name: string | null
          id: string
          incident_date: string | null
          notes: string | null
          parts_data: string | null
          policy_number: string | null
          reference: string
          repairs_data: string | null
          report_date: string | null
          report_id: string | null
          report_number: string | null
          status: string | null
          tax_rate: number | null
          updated_at: string
          user_id: string
          valid_until: string | null
          vehicle_id: string | null
        }
        Insert: {
          amount: number
          claim_number?: string | null
          client_id?: string | null
          created_at?: string
          discounts_data?: string | null
          document_url?: string | null
          expert_name?: string | null
          id?: string
          incident_date?: string | null
          notes?: string | null
          parts_data?: string | null
          policy_number?: string | null
          reference: string
          repairs_data?: string | null
          report_date?: string | null
          report_id?: string | null
          report_number?: string | null
          status?: string | null
          tax_rate?: number | null
          updated_at?: string
          user_id: string
          valid_until?: string | null
          vehicle_id?: string | null
        }
        Update: {
          amount?: number
          claim_number?: string | null
          client_id?: string | null
          created_at?: string
          discounts_data?: string | null
          document_url?: string | null
          expert_name?: string | null
          id?: string
          incident_date?: string | null
          notes?: string | null
          parts_data?: string | null
          policy_number?: string | null
          reference?: string
          repairs_data?: string | null
          report_date?: string | null
          report_id?: string | null
          report_number?: string | null
          status?: string | null
          tax_rate?: number | null
          updated_at?: string
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
            foreignKeyName: "quotes_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "expertise_reports"
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
      receipts: {
        Row: {
          amount: number
          bank_account: string
          created_at: string
          date: string
          id: string
          invoice_id: string | null
          notes: string | null
          payment_method: string
          payment_proofs: string[] | null
          reference: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          bank_account: string
          created_at?: string
          date: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_method: string
          payment_proofs?: string[] | null
          reference?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          bank_account?: string
          created_at?: string
          date?: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_method?: string
          payment_proofs?: string[] | null
          reference?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "receipts_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_orders: {
        Row: {
          claim_number: string | null
          client_id: string | null
          client_name_signature: string | null
          client_signature: string | null
          created_at: string
          discounts_data: Json | null
          document_url: string | null
          expert_name: string | null
          id: string
          incident_date: string | null
          notes: string | null
          order_date: string | null
          parts_data: Json | null
          policy_number: string | null
          quote_id: string | null
          reference: string
          repairs_data: Json | null
          report_date: string | null
          report_number: string | null
          signature_date: string | null
          status: string | null
          updated_at: string
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          claim_number?: string | null
          client_id?: string | null
          client_name_signature?: string | null
          client_signature?: string | null
          created_at?: string
          discounts_data?: Json | null
          document_url?: string | null
          expert_name?: string | null
          id?: string
          incident_date?: string | null
          notes?: string | null
          order_date?: string | null
          parts_data?: Json | null
          policy_number?: string | null
          quote_id?: string | null
          reference: string
          repairs_data?: Json | null
          report_date?: string | null
          report_number?: string | null
          signature_date?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          claim_number?: string | null
          client_id?: string | null
          client_name_signature?: string | null
          client_signature?: string | null
          created_at?: string
          discounts_data?: Json | null
          document_url?: string | null
          expert_name?: string | null
          id?: string
          incident_date?: string | null
          notes?: string | null
          order_date?: string | null
          parts_data?: Json | null
          policy_number?: string | null
          quote_id?: string | null
          reference?: string
          repairs_data?: Json | null
          report_date?: string | null
          report_number?: string | null
          signature_date?: string | null
          status?: string | null
          updated_at?: string
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
          arrival_date: string | null
          brand_id: string | null
          client_id: string | null
          color: string | null
          created_at: string
          end_date: string | null
          engine_number: string | null
          fuel_level: number | null
          id: string
          insurance_company_id: string | null
          insurance_expiry_date: string | null
          license_plate: string
          mileage: number | null
          model_id: string | null
          pre_accident_defects: string | null
          registration_document_back_url: string | null
          registration_document_front_url: string | null
          road_test: string | null
          road_test_notes: string | null
          start_date: string | null
          status: string | null
          updated_at: string
          user_id: string
          vehicle_image_url: string | null
          vehicle_images: Json | null
          vin: string | null
          work_items: Json | null
          year: number | null
        }
        Insert: {
          arrival_date?: string | null
          brand_id?: string | null
          client_id?: string | null
          color?: string | null
          created_at?: string
          end_date?: string | null
          engine_number?: string | null
          fuel_level?: number | null
          id?: string
          insurance_company_id?: string | null
          insurance_expiry_date?: string | null
          license_plate: string
          mileage?: number | null
          model_id?: string | null
          pre_accident_defects?: string | null
          registration_document_back_url?: string | null
          registration_document_front_url?: string | null
          road_test?: string | null
          road_test_notes?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
          vehicle_image_url?: string | null
          vehicle_images?: Json | null
          vin?: string | null
          work_items?: Json | null
          year?: number | null
        }
        Update: {
          arrival_date?: string | null
          brand_id?: string | null
          client_id?: string | null
          color?: string | null
          created_at?: string
          end_date?: string | null
          engine_number?: string | null
          fuel_level?: number | null
          id?: string
          insurance_company_id?: string | null
          insurance_expiry_date?: string | null
          license_plate?: string
          mileage?: number | null
          model_id?: string | null
          pre_accident_defects?: string | null
          registration_document_back_url?: string | null
          registration_document_front_url?: string | null
          road_test?: string | null
          road_test_notes?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
          vehicle_image_url?: string | null
          vehicle_images?: Json | null
          vin?: string | null
          work_items?: Json | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "car_brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_insurance_company_id_fkey"
            columns: ["insurance_company_id"]
            isOneToOne: false
            referencedRelation: "insurance_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "car_models"
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
