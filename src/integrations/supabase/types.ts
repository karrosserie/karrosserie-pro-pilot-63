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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      bank_accounts: {
        Row: {
          balance: number | null
          bank: string
          bic: string
          company_id: string | null
          created_at: string
          iban: string
          id: string
          last_sync: string | null
          name: string
          status: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          balance?: number | null
          bank: string
          bic: string
          company_id?: string | null
          created_at?: string
          iban: string
          id?: string
          last_sync?: string | null
          name: string
          status?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          balance?: number | null
          bank?: string
          bic?: string
          company_id?: string | null
          created_at?: string
          iban?: string
          id?: string
          last_sync?: string | null
          name?: string
          status?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      bridge: {
        Row: {
          access_token: string
          account_id: string | null
          bridge_id: string
          company_id: string | null
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          access_token: string
          account_id?: string | null
          bridge_id: string
          company_id?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          access_token?: string
          account_id?: string | null
          bridge_id?: string
          company_id?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bridge_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
        ]
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
          company_id: string | null
          created_at: string
          document_url: string | null
          expert_name: string | null
          id: string
          incident_date: string | null
          incident_number: string | null
          insurance_company_id: string | null
          oodrive_contract_id: string | null
          policy_number: string | null
          reference: string
          repair_order_id: string | null
          report_number: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          bank_account_id?: string | null
          company_id?: string | null
          created_at?: string
          document_url?: string | null
          expert_name?: string | null
          id?: string
          incident_date?: string | null
          incident_number?: string | null
          insurance_company_id?: string | null
          oodrive_contract_id?: string | null
          policy_number?: string | null
          reference?: string
          repair_order_id?: string | null
          report_number?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          bank_account_id?: string | null
          company_id?: string | null
          created_at?: string
          document_url?: string | null
          expert_name?: string | null
          id?: string
          incident_date?: string | null
          incident_number?: string | null
          insurance_company_id?: string | null
          oodrive_contract_id?: string | null
          policy_number?: string | null
          reference?: string
          repair_order_id?: string | null
          report_number?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
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
        ]
      }
      client_relances: {
        Row: {
          channel: Database["public"]["Enums"]["relance_channel"]
          channel_data: Json | null
          client_id: string
          client_response: string | null
          company_id: string
          created_at: string
          cycle_day: number | null
          id: string
          invoice_id: string | null
          is_automated: boolean
          message: string | null
          objective: string | null
          quote_id: string | null
          received_at: string | null
          responded_at: string | null
          response_read: boolean
          scheduled_at: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["relance_status"]
          step_number: number | null
          subject: string | null
          tone: Database["public"]["Enums"]["relance_tone"]
          updated_at: string
        }
        Insert: {
          channel: Database["public"]["Enums"]["relance_channel"]
          channel_data?: Json | null
          client_id: string
          client_response?: string | null
          company_id: string
          created_at?: string
          cycle_day?: number | null
          id?: string
          invoice_id?: string | null
          is_automated?: boolean
          message?: string | null
          objective?: string | null
          quote_id?: string | null
          received_at?: string | null
          responded_at?: string | null
          response_read?: boolean
          scheduled_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["relance_status"]
          step_number?: number | null
          subject?: string | null
          tone: Database["public"]["Enums"]["relance_tone"]
          updated_at?: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["relance_channel"]
          channel_data?: Json | null
          client_id?: string
          client_response?: string | null
          company_id?: string
          created_at?: string
          cycle_day?: number | null
          id?: string
          invoice_id?: string | null
          is_automated?: boolean
          message?: string | null
          objective?: string | null
          quote_id?: string | null
          received_at?: string | null
          responded_at?: string | null
          response_read?: boolean
          scheduled_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["relance_status"]
          step_number?: number | null
          subject?: string | null
          tone?: Database["public"]["Enums"]["relance_tone"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_client_relances_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_relances_company_id"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_relances_invoice_id"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_relances_quote_id"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          auto_relances_disabled: boolean
          city: string | null
          company_id: string | null
          created_at: string
          driver_license_back_url: string | null
          driver_license_front_url: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          oodrive_recipient_id: string | null
          phone: string | null
          postal_code: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          auto_relances_disabled?: boolean
          city?: string | null
          company_id?: string | null
          created_at?: string
          driver_license_back_url?: string | null
          driver_license_front_url?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          oodrive_recipient_id?: string | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          auto_relances_disabled?: boolean
          city?: string | null
          company_id?: string | null
          created_at?: string
          driver_license_back_url?: string | null
          driver_license_front_url?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          oodrive_recipient_id?: string | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string
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
          oodrive_recipient_id: string | null
          phone: string
          siren: string
          siret: string
          tva: string
          updated_at: string
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
          oodrive_recipient_id?: string | null
          phone?: string
          siren?: string
          siret?: string
          tva?: string
          updated_at?: string
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
          oodrive_recipient_id?: string | null
          phone?: string
          siren?: string
          siret?: string
          tva?: string
          updated_at?: string
          zipcode?: string
        }
        Relationships: []
      }
      company_preferences: {
        Row: {
          accueil_preparation_time: string | null
          ai_relance_enabled: boolean
          cloture_livraison_time: string | null
          company_details: string | null
          company_id: string
          created_at: string
          currency: string
          finitions_remontage_time: string | null
          id: string
          invoice_non_engagement_clause: string | null
          invoice_template: string
          language: string
          late_payment_penalties: string | null
          mise_en_peinture_time: string | null
          next_credit_ref: string
          next_invoice_ref: string
          next_repair_order_ref: string
          payment_conditions: string | null
          payment_details: string | null
          preparation_peinture_time: string | null
          remplacement_debosselage_time: string | null
          repair_order_non_engagement_clause: string | null
          set_activities_as_homepage: boolean
          show_client_signature: boolean
          show_client_signature_repair_orders: boolean
          show_payment_details: boolean
          show_repair_order_details: boolean
          show_repair_order_on_documents: boolean
          show_warning_text: boolean
          show_zero_price_products: boolean
          timezone: string
          updated_at: string
          use_date_based_reference: boolean
        }
        Insert: {
          accueil_preparation_time?: string | null
          ai_relance_enabled?: boolean
          cloture_livraison_time?: string | null
          company_details?: string | null
          company_id: string
          created_at?: string
          currency?: string
          finitions_remontage_time?: string | null
          id?: string
          invoice_non_engagement_clause?: string | null
          invoice_template?: string
          language?: string
          late_payment_penalties?: string | null
          mise_en_peinture_time?: string | null
          next_credit_ref?: string
          next_invoice_ref?: string
          next_repair_order_ref?: string
          payment_conditions?: string | null
          payment_details?: string | null
          preparation_peinture_time?: string | null
          remplacement_debosselage_time?: string | null
          repair_order_non_engagement_clause?: string | null
          set_activities_as_homepage?: boolean
          show_client_signature?: boolean
          show_client_signature_repair_orders?: boolean
          show_payment_details?: boolean
          show_repair_order_details?: boolean
          show_repair_order_on_documents?: boolean
          show_warning_text?: boolean
          show_zero_price_products?: boolean
          timezone?: string
          updated_at?: string
          use_date_based_reference?: boolean
        }
        Update: {
          accueil_preparation_time?: string | null
          ai_relance_enabled?: boolean
          cloture_livraison_time?: string | null
          company_details?: string | null
          company_id?: string
          created_at?: string
          currency?: string
          finitions_remontage_time?: string | null
          id?: string
          invoice_non_engagement_clause?: string | null
          invoice_template?: string
          language?: string
          late_payment_penalties?: string | null
          mise_en_peinture_time?: string | null
          next_credit_ref?: string
          next_invoice_ref?: string
          next_repair_order_ref?: string
          payment_conditions?: string | null
          payment_details?: string | null
          preparation_peinture_time?: string | null
          remplacement_debosselage_time?: string | null
          repair_order_non_engagement_clause?: string | null
          set_activities_as_homepage?: boolean
          show_client_signature?: boolean
          show_client_signature_repair_orders?: boolean
          show_payment_details?: boolean
          show_repair_order_details?: boolean
          show_repair_order_on_documents?: boolean
          show_warning_text?: boolean
          show_zero_price_products?: boolean
          timezone?: string
          updated_at?: string
          use_date_based_reference?: boolean
        }
        Relationships: []
      }
      company_subscriptions: {
        Row: {
          company_id: string
          created_at: string
          end_date: string | null
          id: string
          next_billing_date: string | null
          start_date: string
          status: string
          subscription_plan_id: string
          tokens_remaining: number
          tokens_used: number
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          next_billing_date?: string | null
          start_date?: string
          status?: string
          subscription_plan_id: string
          tokens_remaining?: number
          tokens_used?: number
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          next_billing_date?: string | null
          start_date?: string
          status?: string
          subscription_plan_id?: string
          tokens_remaining?: number
          tokens_used?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_subscriptions_subscription_plan_id_fkey"
            columns: ["subscription_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      credits: {
        Row: {
          amount: number
          company_id: string | null
          created_at: string
          id: string
          invoice_id: string | null
          items_data: Json | null
          notes: string | null
          reference: string
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          company_id?: string | null
          created_at?: string
          id?: string
          invoice_id?: string | null
          items_data?: Json | null
          notes?: string | null
          reference: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          company_id?: string | null
          created_at?: string
          id?: string
          invoice_id?: string | null
          items_data?: Json | null
          notes?: string | null
          reference?: string
          status?: string
          updated_at?: string
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
      employee_breaks: {
        Row: {
          break_end_time: string | null
          break_start_time: string
          created_at: string
          duration_minutes: number | null
          id: string
          timesheet_id: string
          updated_at: string
        }
        Insert: {
          break_end_time?: string | null
          break_start_time?: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          timesheet_id: string
          updated_at?: string
        }
        Update: {
          break_end_time?: string | null
          break_start_time?: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          timesheet_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_breaks_timesheet_id_fkey"
            columns: ["timesheet_id"]
            isOneToOne: false
            referencedRelation: "employee_timesheets"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_schedule: {
        Row: {
          company_id: string
          created_at: string
          employee_id: string
          end_datetime: string
          id: string
          real_end_datetime: string | null
          real_start_datetime: string | null
          start_datetime: string
          status: Database["public"]["Enums"]["task_status"]
          task_type: Database["public"]["Enums"]["schedule_task_type"]
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          employee_id: string
          end_datetime: string
          id?: string
          real_end_datetime?: string | null
          real_start_datetime?: string | null
          start_datetime: string
          status?: Database["public"]["Enums"]["task_status"]
          task_type: Database["public"]["Enums"]["schedule_task_type"]
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          employee_id?: string
          end_datetime?: string
          id?: string
          real_end_datetime?: string | null
          real_start_datetime?: string | null
          start_datetime?: string
          status?: Database["public"]["Enums"]["task_status"]
          task_type?: Database["public"]["Enums"]["schedule_task_type"]
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_schedule_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_schedule_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_schedule_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_timesheets: {
        Row: {
          clock_in_time: string
          clock_out_time: string | null
          company_id: string
          created_at: string
          date: string
          employee_id: string
          id: string
          total_work_minutes: number | null
          updated_at: string
        }
        Insert: {
          clock_in_time?: string
          clock_out_time?: string | null
          company_id: string
          created_at?: string
          date?: string
          employee_id: string
          id?: string
          total_work_minutes?: number | null
          updated_at?: string
        }
        Update: {
          clock_in_time?: string
          clock_out_time?: string | null
          company_id?: string
          created_at?: string
          date?: string
          employee_id?: string
          id?: string
          total_work_minutes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_timesheets_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          company_id: string
          created_at: string
          id: string
          qualifications: Json
          team_member_id: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          qualifications?: Json
          team_member_id?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          qualifications?: Json
          team_member_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "user_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      environment: {
        Row: {
          asynchronous_import: boolean
          average_timing: number | null
          created_at: string
          id: string
          import_count: number | null
          updated_at: string
        }
        Insert: {
          asynchronous_import?: boolean
          average_timing?: number | null
          created_at?: string
          id?: string
          import_count?: number | null
          updated_at?: string
        }
        Update: {
          asynchronous_import?: boolean
          average_timing?: number | null
          created_at?: string
          id?: string
          import_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          assign_to_vehicle: boolean
          category: string
          company_id: string | null
          created_at: string
          date: string
          id: string
          proof_url: string | null
          status: string
          supplier: string
          total_amount: number
          type: string
          updated_at: string
          vat_amount: number
          vehicle_id: string | null
        }
        Insert: {
          assign_to_vehicle?: boolean
          category: string
          company_id?: string | null
          created_at?: string
          date: string
          id?: string
          proof_url?: string | null
          status?: string
          supplier: string
          total_amount?: number
          type?: string
          updated_at?: string
          vat_amount?: number
          vehicle_id?: string | null
        }
        Update: {
          assign_to_vehicle?: boolean
          category?: string
          company_id?: string | null
          created_at?: string
          date?: string
          id?: string
          proof_url?: string | null
          status?: string
          supplier?: string
          total_amount?: number
          type?: string
          updated_at?: string
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
          company_id: string | null
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
          vehicle_id: string | null
        }
        Insert: {
          amount?: number | null
          claim_number?: string | null
          client_id?: string | null
          company_id?: string | null
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
          vehicle_id?: string | null
        }
        Update: {
          amount?: number | null
          claim_number?: string | null
          client_id?: string | null
          company_id?: string | null
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
          company_id: string | null
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
          vehicle_images: Json | null
        }
        Insert: {
          actual_return_date?: string | null
          attestation_accepted?: boolean | null
          client_id: string
          client_insurance?: boolean | null
          client_signature?: string | null
          company_id?: string | null
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
          vehicle_images?: Json | null
        }
        Update: {
          actual_return_date?: string | null
          attestation_accepted?: boolean | null
          client_id?: string
          client_insurance?: boolean | null
          client_signature?: string | null
          company_id?: string | null
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
        ]
      }
      fleet_returns: {
        Row: {
          attestation_accepted: boolean | null
          client_id: string
          client_name: string | null
          client_signature: string | null
          company_id: string | null
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
          vehicle_images: Json | null
        }
        Insert: {
          attestation_accepted?: boolean | null
          client_id: string
          client_name?: string | null
          client_signature?: string | null
          company_id?: string | null
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
          vehicle_images?: Json | null
        }
        Update: {
          attestation_accepted?: boolean | null
          client_id?: string
          client_name?: string | null
          client_signature?: string | null
          company_id?: string | null
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
        ]
      }
      fleet_vehicles: {
        Row: {
          brand_id: string
          color: string | null
          company_id: string | null
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
          vin: string | null
          year: number | null
        }
        Insert: {
          brand_id: string
          color?: string | null
          company_id?: string | null
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
          vin?: string | null
          year?: number | null
        }
        Update: {
          brand_id?: string
          color?: string | null
          company_id?: string | null
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
      generated_reports: {
        Row: {
          company_id: string | null
          created_at: string
          file_url: string | null
          from_date: string
          generated_at: string
          id: string
          name: string
          to_date: string
          type: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          file_url?: string | null
          from_date: string
          generated_at?: string
          id?: string
          name: string
          to_date: string
          type: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          file_url?: string | null
          from_date?: string
          generated_at?: string
          id?: string
          name?: string
          to_date?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      imports: {
        Row: {
          company_id: string | null
          created_at: string
          document: string | null
          id: string
          report_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          document?: string | null
          id?: string
          report_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          document?: string | null
          id?: string
          report_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "imports_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "expertise_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_companies: {
        Row: {
          address: string | null
          address2: string | null
          city: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
          zipcode: string | null
        }
        Insert: {
          address?: string | null
          address2?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          zipcode?: string | null
        }
        Update: {
          address?: string | null
          address2?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          zipcode?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          claim_number: string | null
          client_id: string | null
          company_id: string | null
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
          vehicle_id: string | null
        }
        Insert: {
          amount?: number
          claim_number?: string | null
          client_id?: string | null
          company_id?: string | null
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
          vehicle_id?: string | null
        }
        Update: {
          amount?: number
          claim_number?: string | null
          client_id?: string | null
          company_id?: string | null
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
          company_id: string | null
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
          valid_until: string | null
          vehicle_id: string | null
        }
        Insert: {
          amount: number
          claim_number?: string | null
          client_id?: string | null
          company_id?: string | null
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
          valid_until?: string | null
          vehicle_id?: string | null
        }
        Update: {
          amount?: number
          claim_number?: string | null
          client_id?: string | null
          company_id?: string | null
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
          company_id: string | null
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
        }
        Insert: {
          amount: number
          bank_account: string
          company_id?: string | null
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
        }
        Update: {
          amount?: number
          bank_account?: string
          company_id?: string | null
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
          arrival_date: string | null
          claim_number: string | null
          cleanliness_condition: string | null
          client_id: string | null
          client_name_signature: string | null
          client_signature: string | null
          company_id: string | null
          created_at: string
          discounts_data: Json | null
          document_url: string | null
          end_date: string | null
          expert_name: string | null
          general_condition: string | null
          id: string
          incident_date: string | null
          notes: string | null
          order_date: string | null
          parts_data: Json | null
          personal_items: string | null
          policy_number: string | null
          quote_id: string | null
          reference: string
          repairs_data: Json | null
          report_date: string | null
          report_number: string | null
          signature_date: string | null
          start_date: string | null
          status: string | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          arrival_date?: string | null
          claim_number?: string | null
          cleanliness_condition?: string | null
          client_id?: string | null
          client_name_signature?: string | null
          client_signature?: string | null
          company_id?: string | null
          created_at?: string
          discounts_data?: Json | null
          document_url?: string | null
          end_date?: string | null
          expert_name?: string | null
          general_condition?: string | null
          id?: string
          incident_date?: string | null
          notes?: string | null
          order_date?: string | null
          parts_data?: Json | null
          personal_items?: string | null
          policy_number?: string | null
          quote_id?: string | null
          reference: string
          repairs_data?: Json | null
          report_date?: string | null
          report_number?: string | null
          signature_date?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          arrival_date?: string | null
          claim_number?: string | null
          cleanliness_condition?: string | null
          client_id?: string | null
          client_name_signature?: string | null
          client_signature?: string | null
          company_id?: string | null
          created_at?: string
          discounts_data?: Json | null
          document_url?: string | null
          end_date?: string | null
          expert_name?: string | null
          general_condition?: string | null
          id?: string
          incident_date?: string | null
          notes?: string | null
          order_date?: string | null
          parts_data?: Json | null
          personal_items?: string | null
          policy_number?: string | null
          quote_id?: string | null
          reference?: string
          repairs_data?: Json | null
          report_date?: string | null
          report_number?: string | null
          signature_date?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
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
      subscription_plans: {
        Row: {
          billing_period: string
          created_at: string
          description: string | null
          features: Json
          id: string
          is_active: boolean
          name: string
          price: number
          tokens_included: number
          updated_at: string
        }
        Insert: {
          billing_period: string
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          name: string
          price: number
          tokens_included?: number
          updated_at?: string
        }
        Update: {
          billing_period?: string
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          tokens_included?: number
          updated_at?: string
        }
        Relationships: []
      }
      task_photos: {
        Row: {
          company_id: string
          created_at: string
          employee_id: string
          file_name: string
          file_url: string
          id: string
          photo_type: string
          task_id: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          employee_id: string
          file_name: string
          file_url: string
          id?: string
          photo_type: string
          task_id: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          employee_id?: string
          file_name?: string
          file_url?: string
          id?: string
          photo_type?: string
          task_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      token_packages: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          price: number
          token_count: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          price: number
          token_count: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          token_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      token_usage: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          operation_type: string
          subscription_id: string
          tokens_consumed: number
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          operation_type: string
          subscription_id: string
          tokens_consumed?: number
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          operation_type?: string
          subscription_id?: string
          tokens_consumed?: number
        }
        Relationships: [
          {
            foreignKeyName: "token_usage_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "company_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      tokens: {
        Row: {
          client_id: string | null
          company_id: string | null
          created_at: string
          id: string
          updated_at: string
          vehicule_id: string | null
        }
        Insert: {
          client_id?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          vehicule_id?: string | null
        }
        Update: {
          client_id?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          vehicule_id?: string | null
        }
        Relationships: []
      }
      user_companies: {
        Row: {
          active: boolean
          company_id: string
          created_at: string
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          company_id: string
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          company_id?: string
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_info"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_workflow_steps: {
        Row: {
          company_id: string
          created_at: string
          current_step: string
          estimated_completion_date: string | null
          id: string
          notes: string | null
          progress_percentage: number
          technician_id: string | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          current_step?: string
          estimated_completion_date?: string | null
          id?: string
          notes?: string | null
          progress_percentage?: number
          technician_id?: string | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          current_step?: string
          estimated_completion_date?: string | null
          id?: string
          notes?: string | null
          progress_percentage?: number
          technician_id?: string | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          brand_id: string | null
          client_id: string | null
          color: string | null
          company_id: string | null
          created_at: string
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
          status: string | null
          updated_at: string
          vehicle_image_url: string | null
          vehicle_images: Json | null
          vin: string | null
          work_items: Json | null
          year: number | null
        }
        Insert: {
          brand_id?: string | null
          client_id?: string | null
          color?: string | null
          company_id?: string | null
          created_at?: string
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
          status?: string | null
          updated_at?: string
          vehicle_image_url?: string | null
          vehicle_images?: Json | null
          vin?: string | null
          work_items?: Json | null
          year?: number | null
        }
        Update: {
          brand_id?: string | null
          client_id?: string | null
          color?: string | null
          company_id?: string | null
          created_at?: string
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
          status?: string | null
          updated_at?: string
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
      workshop_schedule: {
        Row: {
          afternoon_end: string | null
          afternoon_start: string | null
          company_id: string
          created_at: string
          day_of_week: string
          enabled: boolean
          full_day: boolean
          id: string
          morning_end: string | null
          morning_start: string | null
          updated_at: string
        }
        Insert: {
          afternoon_end?: string | null
          afternoon_start?: string | null
          company_id: string
          created_at?: string
          day_of_week: string
          enabled?: boolean
          full_day?: boolean
          id?: string
          morning_end?: string | null
          morning_start?: string | null
          updated_at?: string
        }
        Update: {
          afternoon_end?: string | null
          afternoon_start?: string | null
          company_id?: string
          created_at?: string
          day_of_week?: string
          enabled?: boolean
          full_day?: boolean
          id?: string
          morning_end?: string | null
          morning_start?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bytea_to_text: {
        Args: { data: string }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_delete: {
        Args:
          | { content: string; content_type: string; uri: string }
          | { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_get: {
        Args: { data: Json; uri: string } | { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_head: {
        Args: { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_post: {
        Args:
          | { content: string; content_type: string; uri: string }
          | { data: Json; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_put: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      is_admin_impersonating: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      text_to_bytea: {
        Args: { data: string }
        Returns: string
      }
      urlencode: {
        Args: { data: Json } | { string: string } | { string: string }
        Returns: string
      }
      user_belongs_to_company: {
        Args: { p_company_id: string; p_user_id: string }
        Returns: boolean
      }
      user_is_company_owner: {
        Args: { p_company_id: string; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      relance_channel:
        | "phone"
        | "email"
        | "sms"
        | "whatsapp"
        | "vms"
        | "courrier"
        | "courrier_recommande"
      relance_status:
        | "en_attente"
        | "en_cours"
        | "envoye"
        | "recu"
        | "repondu"
        | "echec"
        | "annule"
      relance_tone: "amical" | "ferme" | "serieux" | "menacant"
      schedule_task_type:
        | "Accueil & Préparation du dossier"
        | "Remplacement ou débosselage"
        | "Préparation peinture"
        | "Mise en peinture"
        | "Finitions & remontage"
        | "Clôture & livraison"
        | "Absence"
      task_status: "En attente" | "En cours" | "Terminé"
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
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
      relance_channel: [
        "phone",
        "email",
        "sms",
        "whatsapp",
        "vms",
        "courrier",
        "courrier_recommande",
      ],
      relance_status: [
        "en_attente",
        "en_cours",
        "envoye",
        "recu",
        "repondu",
        "echec",
        "annule",
      ],
      relance_tone: ["amical", "ferme", "serieux", "menacant"],
      schedule_task_type: [
        "Accueil & Préparation du dossier",
        "Remplacement ou débosselage",
        "Préparation peinture",
        "Mise en peinture",
        "Finitions & remontage",
        "Clôture & livraison",
        "Absence",
      ],
      task_status: ["En attente", "En cours", "Terminé"],
    },
  },
} as const
