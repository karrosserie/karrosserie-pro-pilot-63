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
      ai_messages_history: {
        Row: {
          created_at: string
          id: number
          message: Json | null
          read: boolean
          session_id: string | null
        }
        Insert: {
          created_at?: string
          id?: never
          message?: Json | null
          read?: boolean
          session_id?: string | null
        }
        Update: {
          created_at?: string
          id?: never
          message?: Json | null
          read?: boolean
          session_id?: string | null
        }
        Relationships: []
      }
      articles: {
        Row: {
          article: string | null
          created_at: string
          haastag: string | null
          id: number
        }
        Insert: {
          article?: string | null
          created_at?: string
          haastag?: string | null
          id?: number
        }
        Update: {
          article?: string | null
          created_at?: string
          haastag?: string | null
          id?: number
        }
        Relationships: []
      }
      bad_user_after_call: {
        Row: {
          company_id: string | null
          created_at: string
          id: number
          module: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: number
          module?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: number
          module?: string | null
        }
        Relationships: []
      }
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
      body_parts: {
        Row: {
          base_surface_m2: number
          created_at: string
          id: string
          name: string
          surface_coefficient: number
          updated_at: string
        }
        Insert: {
          base_surface_m2: number
          created_at?: string
          id?: string
          name: string
          surface_coefficient?: number
          updated_at?: string
        }
        Update: {
          base_surface_m2?: number
          created_at?: string
          id?: string
          name?: string
          surface_coefficient?: number
          updated_at?: string
        }
        Relationships: []
      }
      bon_commande: {
        Row: {
          client_id: string | null
          company_id: string
          created_at: string
          file_name: string
          file_type: string | null
          file_url: string
          id: string
          quote_id: string | null
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          company_id: string
          created_at?: string
          file_name: string
          file_type?: string | null
          file_url: string
          id?: string
          quote_id?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          company_id?: string
          created_at?: string
          file_name?: string
          file_type?: string | null
          file_url?: string
          id?: string
          quote_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bon_commande_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bon_commande_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      bon_livraison: {
        Row: {
          bon_commande_id: string
          client_id: string | null
          company_id: string
          created_at: string
          date_livraison_prevue: string | null
          date_livraison_reelle: string | null
          file_name: string | null
          file_type: string | null
          file_url: string | null
          id: string
          notes: string | null
          statut: string
          transporteur: string | null
          updated_at: string
        }
        Insert: {
          bon_commande_id: string
          client_id?: string | null
          company_id: string
          created_at?: string
          date_livraison_prevue?: string | null
          date_livraison_reelle?: string | null
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          notes?: string | null
          statut?: string
          transporteur?: string | null
          updated_at?: string
        }
        Update: {
          bon_commande_id?: string
          client_id?: string | null
          company_id?: string
          created_at?: string
          date_livraison_prevue?: string | null
          date_livraison_reelle?: string | null
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          notes?: string | null
          statut?: string
          transporteur?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bon_livraison_bon_commande_id_fkey"
            columns: ["bon_commande_id"]
            isOneToOne: false
            referencedRelation: "bon_commande"
            referencedColumns: ["id"]
          },
        ]
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
      campaign_assets: {
        Row: {
          asset_type: string
          created_at: string
          created_by: string | null
          description: string | null
          file_path: string
          file_size: number | null
          id: string
          last_used_at: string | null
          mime_type: string | null
          name: string
          tags: string[] | null
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          asset_type: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_path: string
          file_size?: number | null
          id?: string
          last_used_at?: string | null
          mime_type?: string | null
          name: string
          tags?: string[] | null
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          asset_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_path?: string
          file_size?: number | null
          id?: string
          last_used_at?: string | null
          mime_type?: string | null
          name?: string
          tags?: string[] | null
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      campaign_interactions: {
        Row: {
          campaign_log_id: string
          created_at: string
          id: string
          interaction_data: Json | null
          interaction_type: string
        }
        Insert: {
          campaign_log_id: string
          created_at?: string
          id?: string
          interaction_data?: Json | null
          interaction_type: string
        }
        Update: {
          campaign_log_id?: string
          created_at?: string
          id?: string
          interaction_data?: Json | null
          interaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_interactions_campaign_log_id_fkey"
            columns: ["campaign_log_id"]
            isOneToOne: false
            referencedRelation: "campaign_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_logs: {
        Row: {
          anomaly_type: string | null
          campaign_type: string
          channels: string[] | null
          clicked_at: string | null
          company_id: string
          company_metrics: Json | null
          content: Json | null
          created_at: string
          delivered_at: string | null
          external_campaign_id: string | null
          id: string
          opened_at: string | null
          sent_at: string | null
          severity: string | null
          status: string | null
          tracking_url: string | null
          updated_at: string
        }
        Insert: {
          anomaly_type?: string | null
          campaign_type?: string
          channels?: string[] | null
          clicked_at?: string | null
          company_id: string
          company_metrics?: Json | null
          content?: Json | null
          created_at?: string
          delivered_at?: string | null
          external_campaign_id?: string | null
          id?: string
          opened_at?: string | null
          sent_at?: string | null
          severity?: string | null
          status?: string | null
          tracking_url?: string | null
          updated_at?: string
        }
        Update: {
          anomaly_type?: string | null
          campaign_type?: string
          channels?: string[] | null
          clicked_at?: string | null
          company_id?: string
          company_metrics?: Json | null
          content?: Json | null
          created_at?: string
          delivered_at?: string | null
          external_campaign_id?: string | null
          id?: string
          opened_at?: string | null
          sent_at?: string | null
          severity?: string | null
          status?: string | null
          tracking_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_metrics_30d"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "campaign_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "campaign_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_info"
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
          signed_document_url: string | null
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
          signed_document_url?: string | null
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
          signed_document_url?: string | null
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
            referencedRelation: "company_business_metrics_30d"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "fk_client_relances_company_id"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_summary"
            referencedColumns: ["company_id"]
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
          date_of_birth: string | null
          driver_license_back_url: string | null
          driver_license_front_url: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          license_issue_date: string | null
          license_number: string | null
          oodrive_recipient_id: string | null
          phone: string | null
          place_of_birth: string | null
          postal_code: string | null
          prefecture: string | null
          updated_at: string
          whatsapp_consent: boolean | null
        }
        Insert: {
          address?: string | null
          auto_relances_disabled?: boolean
          city?: string | null
          company_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          driver_license_back_url?: string | null
          driver_license_front_url?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          license_issue_date?: string | null
          license_number?: string | null
          oodrive_recipient_id?: string | null
          phone?: string | null
          place_of_birth?: string | null
          postal_code?: string | null
          prefecture?: string | null
          updated_at?: string
          whatsapp_consent?: boolean | null
        }
        Update: {
          address?: string | null
          auto_relances_disabled?: boolean
          city?: string | null
          company_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          driver_license_back_url?: string | null
          driver_license_front_url?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          license_issue_date?: string | null
          license_number?: string | null
          oodrive_recipient_id?: string | null
          phone?: string | null
          place_of_birth?: string | null
          postal_code?: string | null
          prefecture?: string | null
          updated_at?: string
          whatsapp_consent?: boolean | null
        }
        Relationships: []
      }
      company_contract_documents: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          document_type: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          document_type?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_contract_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_metrics_30d"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_contract_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_contract_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_info"
            referencedColumns: ["id"]
          },
        ]
      }
      company_info: {
        Row: {
          address: string
          city: string
          created_at: string
          email: string
          gocardless_customer_id: string | null
          gocardless_mandate_id: string | null
          gocardless_mandate_status: string | null
          id: string
          is_merged: boolean | null
          latitude: number | null
          location_radius: number | null
          logo_url: string | null
          longitude: number | null
          name: string
          notifications: Json
          oodrive_recipient_id: string | null
          phone: string
          sepa_enabled: boolean | null
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
          gocardless_customer_id?: string | null
          gocardless_mandate_id?: string | null
          gocardless_mandate_status?: string | null
          id?: string
          is_merged?: boolean | null
          latitude?: number | null
          location_radius?: number | null
          logo_url?: string | null
          longitude?: number | null
          name?: string
          notifications?: Json
          oodrive_recipient_id?: string | null
          phone?: string
          sepa_enabled?: boolean | null
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
          gocardless_customer_id?: string | null
          gocardless_mandate_id?: string | null
          gocardless_mandate_status?: string | null
          id?: string
          is_merged?: boolean | null
          latitude?: number | null
          location_radius?: number | null
          logo_url?: string | null
          longitude?: number | null
          name?: string
          notifications?: Json
          oodrive_recipient_id?: string | null
          phone?: string
          sepa_enabled?: boolean | null
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
          ai_relance_auto_mise_en_demeure: boolean | null
          ai_relance_channels_email: boolean | null
          ai_relance_channels_mail: boolean | null
          ai_relance_channels_phone: boolean | null
          ai_relance_channels_sms: boolean | null
          ai_relance_channels_whatsapp: boolean | null
          ai_relance_delay_before_first: number | null
          ai_relance_enabled: boolean
          ai_relance_max_relances: number | null
          ai_relance_prompt: string | null
          ai_relance_tonality: string | null
          cloture_livraison_time: string | null
          company_details: string | null
          company_id: string
          controle_technique_securite_time: string | null
          created_at: string
          currency: string
          finitions_remontage_time: string | null
          id: string
          invoice_non_engagement_clause: string | null
          invoice_template: string
          language: string
          late_payment_penalties: string | null
          mise_en_peinture_time: string | null
          n8n_webhook_url: string | null
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
          ai_relance_auto_mise_en_demeure?: boolean | null
          ai_relance_channels_email?: boolean | null
          ai_relance_channels_mail?: boolean | null
          ai_relance_channels_phone?: boolean | null
          ai_relance_channels_sms?: boolean | null
          ai_relance_channels_whatsapp?: boolean | null
          ai_relance_delay_before_first?: number | null
          ai_relance_enabled?: boolean
          ai_relance_max_relances?: number | null
          ai_relance_prompt?: string | null
          ai_relance_tonality?: string | null
          cloture_livraison_time?: string | null
          company_details?: string | null
          company_id: string
          controle_technique_securite_time?: string | null
          created_at?: string
          currency?: string
          finitions_remontage_time?: string | null
          id?: string
          invoice_non_engagement_clause?: string | null
          invoice_template?: string
          language?: string
          late_payment_penalties?: string | null
          mise_en_peinture_time?: string | null
          n8n_webhook_url?: string | null
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
          ai_relance_auto_mise_en_demeure?: boolean | null
          ai_relance_channels_email?: boolean | null
          ai_relance_channels_mail?: boolean | null
          ai_relance_channels_phone?: boolean | null
          ai_relance_channels_sms?: boolean | null
          ai_relance_channels_whatsapp?: boolean | null
          ai_relance_delay_before_first?: number | null
          ai_relance_enabled?: boolean
          ai_relance_max_relances?: number | null
          ai_relance_prompt?: string | null
          ai_relance_tonality?: string | null
          cloture_livraison_time?: string | null
          company_details?: string | null
          company_id?: string
          controle_technique_securite_time?: string | null
          created_at?: string
          currency?: string
          finitions_remontage_time?: string | null
          id?: string
          invoice_non_engagement_clause?: string | null
          invoice_template?: string
          language?: string
          late_payment_penalties?: string | null
          mise_en_peinture_time?: string | null
          n8n_webhook_url?: string | null
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
          auto_billing_enabled: boolean | null
          company_id: string
          created_at: string
          end_date: string | null
          gocardless_subscription_id: string | null
          id: string
          last_payment_date: string | null
          last_payment_status: string | null
          next_billing_date: string | null
          next_payment_attempt: string | null
          payment_failures_count: number | null
          payment_method: string | null
          start_date: string
          status: string
          subscription_plan_id: string
          tokens_remaining: number
          tokens_used: number
          updated_at: string
        }
        Insert: {
          auto_billing_enabled?: boolean | null
          company_id: string
          created_at?: string
          end_date?: string | null
          gocardless_subscription_id?: string | null
          id?: string
          last_payment_date?: string | null
          last_payment_status?: string | null
          next_billing_date?: string | null
          next_payment_attempt?: string | null
          payment_failures_count?: number | null
          payment_method?: string | null
          start_date?: string
          status?: string
          subscription_plan_id: string
          tokens_remaining?: number
          tokens_used?: number
          updated_at?: string
        }
        Update: {
          auto_billing_enabled?: boolean | null
          company_id?: string
          created_at?: string
          end_date?: string | null
          gocardless_subscription_id?: string | null
          id?: string
          last_payment_date?: string | null
          last_payment_status?: string | null
          next_billing_date?: string | null
          next_payment_attempt?: string | null
          payment_failures_count?: number | null
          payment_method?: string | null
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
          archived: boolean
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
          archived?: boolean
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
          archived?: boolean
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
      document_sav: {
        Row: {
          content: string
          created_at: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
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
          color_code: string | null
          company_id: string
          created_at: string
          detailed_instructions: Json | null
          end_datetime: string
          id: string
          paint_brand: string | null
          real_end_datetime: string | null
          real_start_datetime: string | null
          start_datetime: string
          status: Database["public"]["Enums"]["task_status"]
          task_type: Database["public"]["Enums"]["schedule_task_type"]
          updated_at: string
          user_id: string
          vehicle_id: string | null
          waiting_reason: string | null
        }
        Insert: {
          color_code?: string | null
          company_id: string
          created_at?: string
          detailed_instructions?: Json | null
          end_datetime: string
          id?: string
          paint_brand?: string | null
          real_end_datetime?: string | null
          real_start_datetime?: string | null
          start_datetime: string
          status?: Database["public"]["Enums"]["task_status"]
          task_type: Database["public"]["Enums"]["schedule_task_type"]
          updated_at?: string
          user_id: string
          vehicle_id?: string | null
          waiting_reason?: string | null
        }
        Update: {
          color_code?: string | null
          company_id?: string
          created_at?: string
          detailed_instructions?: Json | null
          end_datetime?: string
          id?: string
          paint_brand?: string | null
          real_end_datetime?: string | null
          real_start_datetime?: string | null
          start_datetime?: string
          status?: Database["public"]["Enums"]["task_status"]
          task_type?: Database["public"]["Enums"]["schedule_task_type"]
          updated_at?: string
          user_id?: string
          vehicle_id?: string | null
          waiting_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_schedule_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_metrics_30d"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "employee_schedule_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "employee_schedule_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_schedule_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_employee_schedule_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_timesheets: {
        Row: {
          clock_in_latitude: number | null
          clock_in_longitude: number | null
          clock_in_time: string
          clock_out_time: string | null
          company_id: string
          created_at: string
          date: string
          id: string
          location_verified: boolean | null
          total_work_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          clock_in_latitude?: number | null
          clock_in_longitude?: number | null
          clock_in_time?: string
          clock_out_time?: string | null
          company_id: string
          created_at?: string
          date?: string
          id?: string
          location_verified?: boolean | null
          total_work_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          clock_in_latitude?: number | null
          clock_in_longitude?: number | null
          clock_in_time?: string
          clock_out_time?: string | null
          company_id?: string
          created_at?: string
          date?: string
          id?: string
          location_verified?: boolean | null
          total_work_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      expert_relance: {
        Row: {
          company_id: string | null
          created_at: string
          date_rdv: string | null
          heure_rdv: string | null
          id: number
          mail_expert: string | null
          nom_expert: string | null
          phone_expert: string | null
          poll_id: string | null
          prenom_expert: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          date_rdv?: string | null
          heure_rdv?: string | null
          id?: number
          mail_expert?: string | null
          nom_expert?: string | null
          phone_expert?: string | null
          poll_id?: string | null
          prenom_expert?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          date_rdv?: string | null
          heure_rdv?: string | null
          id?: number
          mail_expert?: string | null
          nom_expert?: string | null
          phone_expert?: string | null
          poll_id?: string | null
          prenom_expert?: string | null
        }
        Relationships: []
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
          notes: string | null
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
          notes?: string | null
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
          notes?: string | null
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
      fleet_violations: {
        Row: {
          borrower_email: string | null
          borrower_name: string | null
          borrower_phone: string | null
          company_id: string
          created_at: string
          document_url: string | null
          due_date: string | null
          fine_amount: number | null
          fleet_vehicle_id: string
          id: string
          license_plate: string
          location: string | null
          notes: string | null
          payment_status: string
          points_lost: number | null
          reference_number: string | null
          updated_at: string
          violation_date: string
          violation_time: string | null
          violation_type: string
        }
        Insert: {
          borrower_email?: string | null
          borrower_name?: string | null
          borrower_phone?: string | null
          company_id: string
          created_at?: string
          document_url?: string | null
          due_date?: string | null
          fine_amount?: number | null
          fleet_vehicle_id: string
          id?: string
          license_plate: string
          location?: string | null
          notes?: string | null
          payment_status?: string
          points_lost?: number | null
          reference_number?: string | null
          updated_at?: string
          violation_date: string
          violation_time?: string | null
          violation_type: string
        }
        Update: {
          borrower_email?: string | null
          borrower_name?: string | null
          borrower_phone?: string | null
          company_id?: string
          created_at?: string
          document_url?: string | null
          due_date?: string | null
          fine_amount?: number | null
          fleet_vehicle_id?: string
          id?: string
          license_plate?: string
          location?: string | null
          notes?: string | null
          payment_status?: string
          points_lost?: number | null
          reference_number?: string | null
          updated_at?: string
          violation_date?: string
          violation_time?: string | null
          violation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_fleet_violations_fleet_vehicle_id"
            columns: ["fleet_vehicle_id"]
            isOneToOne: false
            referencedRelation: "fleet_vehicles"
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
      gocardless_customers: {
        Row: {
          address_line1: string
          city: string
          company_id: string
          country_code: string
          created_at: string
          email: string
          family_name: string
          given_name: string
          gocardless_customer_id: string
          id: string
          phone_number: string | null
          postal_code: string
          status: string
          updated_at: string
        }
        Insert: {
          address_line1: string
          city: string
          company_id: string
          country_code?: string
          created_at?: string
          email: string
          family_name: string
          given_name: string
          gocardless_customer_id: string
          id?: string
          phone_number?: string | null
          postal_code: string
          status?: string
          updated_at?: string
        }
        Update: {
          address_line1?: string
          city?: string
          company_id?: string
          country_code?: string
          created_at?: string
          email?: string
          family_name?: string
          given_name?: string
          gocardless_customer_id?: string
          id?: string
          phone_number?: string | null
          postal_code?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gocardless_customers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_business_metrics_30d"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "gocardless_customers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_business_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "gocardless_customers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_info"
            referencedColumns: ["id"]
          },
        ]
      }
      gocardless_mandates: {
        Row: {
          account_holder_name: string
          cancelled_at: string | null
          company_id: string
          created_at: string
          expires_at: string | null
          gocardless_customer_id: string
          gocardless_mandate_id: string
          iban: string
          id: string
          reference: string
          scheme: string
          status: string
          updated_at: string
        }
        Insert: {
          account_holder_name: string
          cancelled_at?: string | null
          company_id: string
          created_at?: string
          expires_at?: string | null
          gocardless_customer_id: string
          gocardless_mandate_id: string
          iban: string
          id?: string
          reference: string
          scheme?: string
          status?: string
          updated_at?: string
        }
        Update: {
          account_holder_name?: string
          cancelled_at?: string | null
          company_id?: string
          created_at?: string
          expires_at?: string | null
          gocardless_customer_id?: string
          gocardless_mandate_id?: string
          iban?: string
          id?: string
          reference?: string
          scheme?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gocardless_mandates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_business_metrics_30d"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "gocardless_mandates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_business_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "gocardless_mandates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gocardless_mandates_gocardless_customer_id_fkey"
            columns: ["gocardless_customer_id"]
            isOneToOne: false
            referencedRelation: "gocardless_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      gocardless_payments: {
        Row: {
          amount_cents: number
          charge_date: string
          company_id: string
          confirmed_at: string | null
          created_at: string
          currency: string
          description: string
          failed_at: string | null
          failure_reason: string | null
          gocardless_mandate_id: string
          gocardless_payment_id: string
          id: string
          metadata: Json | null
          paid_out_at: string | null
          status: string
          subscription_id: string | null
          updated_at: string
        }
        Insert: {
          amount_cents: number
          charge_date: string
          company_id: string
          confirmed_at?: string | null
          created_at?: string
          currency?: string
          description: string
          failed_at?: string | null
          failure_reason?: string | null
          gocardless_mandate_id: string
          gocardless_payment_id: string
          id?: string
          metadata?: Json | null
          paid_out_at?: string | null
          status?: string
          subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          charge_date?: string
          company_id?: string
          confirmed_at?: string | null
          created_at?: string
          currency?: string
          description?: string
          failed_at?: string | null
          failure_reason?: string | null
          gocardless_mandate_id?: string
          gocardless_payment_id?: string
          id?: string
          metadata?: Json | null
          paid_out_at?: string | null
          status?: string
          subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gocardless_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_metrics_30d"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "gocardless_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "gocardless_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gocardless_payments_gocardless_mandate_id_fkey"
            columns: ["gocardless_mandate_id"]
            isOneToOne: false
            referencedRelation: "gocardless_mandates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gocardless_payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "company_subscriptions"
            referencedColumns: ["id"]
          },
        ]
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
          archived: boolean
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
          archived?: boolean
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
          archived?: boolean
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
      "job scrap": {
        Row: {
          created_at: string
          execution_count: number
          heshtags: string | null
          id: number
          limite: string | null
          pays: string | null
          reseau: string | null
        }
        Insert: {
          created_at?: string
          execution_count?: number
          heshtags?: string | null
          id?: number
          limite?: string | null
          pays?: string | null
          reseau?: string | null
        }
        Update: {
          created_at?: string
          execution_count?: number
          heshtags?: string | null
          id?: number
          limite?: string | null
          pays?: string | null
          reseau?: string | null
        }
        Relationships: []
      }
      job_message: {
        Row: {
          article_id: number | null
          asset_id: string | null
          created_at: string
          execution_count: number
          id: string
          job_scrap_id: number
          reseau: string
          updated_at: string
        }
        Insert: {
          article_id?: number | null
          asset_id?: string | null
          created_at?: string
          execution_count?: number
          id?: string
          job_scrap_id: number
          reseau: string
          updated_at?: string
        }
        Update: {
          article_id?: number | null
          asset_id?: string | null
          created_at?: string
          execution_count?: number
          id?: string
          job_scrap_id?: number
          reseau?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_message_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_message_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "campaign_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_message_job_scrap_id_fkey"
            columns: ["job_scrap_id"]
            isOneToOne: false
            referencedRelation: "job scrap"
            referencedColumns: ["id"]
          },
        ]
      }
      judicial_cases: {
        Row: {
          chronologie: string | null
          client_id: string | null
          company_id: string
          contexte: string | null
          created_at: string
          defendeur: string | null
          demandes: string | null
          demandeur: string | null
          depens: boolean | null
          depens_details: string | null
          id: string
          interets: boolean | null
          interets_details: string | null
          invoice_id: string | null
          montant_dossier: number | null
          obligations: string | null
          pieces: string | null
          reference: string
          references_legales: string | null
          relation: string | null
          status: string
          updated_at: string
        }
        Insert: {
          chronologie?: string | null
          client_id?: string | null
          company_id: string
          contexte?: string | null
          created_at?: string
          defendeur?: string | null
          demandes?: string | null
          demandeur?: string | null
          depens?: boolean | null
          depens_details?: string | null
          id?: string
          interets?: boolean | null
          interets_details?: string | null
          invoice_id?: string | null
          montant_dossier?: number | null
          obligations?: string | null
          pieces?: string | null
          reference: string
          references_legales?: string | null
          relation?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          chronologie?: string | null
          client_id?: string | null
          company_id?: string
          contexte?: string | null
          created_at?: string
          defendeur?: string | null
          demandes?: string | null
          demandeur?: string | null
          depens?: boolean | null
          depens_details?: string | null
          id?: string
          interets?: boolean | null
          interets_details?: string | null
          invoice_id?: string | null
          montant_dossier?: number | null
          obligations?: string | null
          pieces?: string | null
          reference?: string
          references_legales?: string | null
          relation?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      message_erp: {
        Row: {
          agent_type: Database["public"]["Enums"]["agent_type"]
          canal: Database["public"]["Enums"]["communication_channel_type"]
          corps_message: string
          created_at: string
          id: string
          is_read: boolean
          metadata: Json | null
          processed: boolean
          read_at: string | null
          resolved: boolean | null
          sender_id: string | null
          ticket_erp_id: string
        }
        Insert: {
          agent_type: Database["public"]["Enums"]["agent_type"]
          canal: Database["public"]["Enums"]["communication_channel_type"]
          corps_message: string
          created_at?: string
          id?: string
          is_read?: boolean
          metadata?: Json | null
          processed?: boolean
          read_at?: string | null
          resolved?: boolean | null
          sender_id?: string | null
          ticket_erp_id: string
        }
        Update: {
          agent_type?: Database["public"]["Enums"]["agent_type"]
          canal?: Database["public"]["Enums"]["communication_channel_type"]
          corps_message?: string
          created_at?: string
          id?: string
          is_read?: boolean
          metadata?: Json | null
          processed?: boolean
          read_at?: string | null
          resolved?: boolean | null
          sender_id?: string | null
          ticket_erp_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_erp_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_erp_ticket_erp_id_fkey"
            columns: ["ticket_erp_id"]
            isOneToOne: false
            referencedRelation: "ticket_erp"
            referencedColumns: ["id"]
          },
        ]
      }
      message_mobile_client: {
        Row: {
          client_id: string | null
          company_id: string | null
          created_at: string
          employé_id: string | null
          horaire: Json | null
          "horaire selectionné": string | null
          id: number
          message: string | null
          vehicule_id: string | null
        }
        Insert: {
          client_id?: string | null
          company_id?: string | null
          created_at?: string
          employé_id?: string | null
          horaire?: Json | null
          "horaire selectionné"?: string | null
          id?: number
          message?: string | null
          vehicule_id?: string | null
        }
        Update: {
          client_id?: string | null
          company_id?: string | null
          created_at?: string
          employé_id?: string | null
          horaire?: Json | null
          "horaire selectionné"?: string | null
          id?: number
          message?: string | null
          vehicule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_message_mobile_client_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_message_mobile_client_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_metrics_30d"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "fk_message_mobile_client_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "fk_message_mobile_client_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_info"
            referencedColumns: ["id"]
          },
        ]
      }
      messageries: {
        Row: {
          archived: boolean
          channel: string
          company_id: string
          contact: string | null
          created_at: string
          date: string
          eta: string
          id: string
          message: string
          priority: number
          reponse: string | null
          resolved: boolean
          summary: string
          tags: string[] | null
          time: string
          title: string
          updated_at: string
        }
        Insert: {
          archived?: boolean
          channel: string
          company_id: string
          contact?: string | null
          created_at?: string
          date?: string
          eta: string
          id?: string
          message: string
          priority: number
          reponse?: string | null
          resolved?: boolean
          summary: string
          tags?: string[] | null
          time?: string
          title: string
          updated_at?: string
        }
        Update: {
          archived?: boolean
          channel?: string
          company_id?: string
          contact?: string | null
          created_at?: string
          date?: string
          eta?: string
          id?: string
          message?: string
          priority?: number
          reponse?: string | null
          resolved?: boolean
          summary?: string
          tags?: string[] | null
          time?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      migration_errors: {
        Row: {
          company_id: string
          created_at: string
          error_details: Json | null
          error_message: string
          error_type: Database["public"]["Enums"]["migration_error_type"]
          id: string
          resolved: boolean | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          error_details?: Json | null
          error_message: string
          error_type: Database["public"]["Enums"]["migration_error_type"]
          id?: string
          resolved?: boolean | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          error_details?: Json | null
          error_message?: string
          error_type?: Database["public"]["Enums"]["migration_error_type"]
          id?: string
          resolved?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "migration_errors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_metrics_30d"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "migration_errors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "migration_errors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_info"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_chat_histories: {
        Row: {
          created_at: string
          id: number
          message: Json | null
          session_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          message?: Json | null
          session_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          message?: Json | null
          session_id?: string | null
        }
        Relationships: []
      }
      onboarding_state: {
        Row: {
          created_at: string
          id: string
          state: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          state?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          state?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      open_mail: {
        Row: {
          created_at: string
          id: number
          is_open: boolean | null
          mail_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_open?: boolean | null
          mail_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_open?: boolean | null
          mail_id?: string | null
        }
        Relationships: []
      }
      otp_codes: {
        Row: {
          attempts: number
          code: string
          created_at: string
          expires_at: string
          id: string
          telephone: string
          used: boolean
          used_at: string | null
        }
        Insert: {
          attempts?: number
          code: string
          created_at?: string
          expires_at?: string
          id?: string
          telephone: string
          used?: boolean
          used_at?: string | null
        }
        Update: {
          attempts?: number
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          telephone?: string
          used?: boolean
          used_at?: string | null
        }
        Relationships: []
      }
      page_visit_durations: {
        Row: {
          company_id: string | null
          created_at: string
          duration_seconds: number | null
          enter_time: string
          exit_time: string | null
          id: string
          interactions_count: number | null
          page_url: string
          scroll_depth_percent: number | null
          session_id: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          duration_seconds?: number | null
          enter_time?: string
          exit_time?: string | null
          id?: string
          interactions_count?: number | null
          page_url: string
          scroll_depth_percent?: number | null
          session_id: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          duration_seconds?: number | null
          enter_time?: string
          exit_time?: string | null
          id?: string
          interactions_count?: number | null
          page_url?: string
          scroll_depth_percent?: number | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_visit_durations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_metrics_30d"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "page_visit_durations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "page_visit_durations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_info"
            referencedColumns: ["id"]
          },
        ]
      }
      paint_types: {
        Row: {
          brand: string
          color_code: string | null
          company_id: string
          coverage_per_liter: number | null
          created_at: string
          density: number
          dilution_ratio: number
          id: string
          is_active: boolean
          name: string
          price_per_liter: number
          thinner_price_per_liter: number
          updated_at: string
        }
        Insert: {
          brand: string
          color_code?: string | null
          company_id: string
          coverage_per_liter?: number | null
          created_at?: string
          density?: number
          dilution_ratio?: number
          id?: string
          is_active?: boolean
          name: string
          price_per_liter?: number
          thinner_price_per_liter?: number
          updated_at?: string
        }
        Update: {
          brand?: string
          color_code?: string | null
          company_id?: string
          coverage_per_liter?: number | null
          created_at?: string
          density?: number
          dilution_ratio?: number
          id?: string
          is_active?: boolean
          name?: string
          price_per_liter?: number
          thinner_price_per_liter?: number
          updated_at?: string
        }
        Relationships: []
      }
      peinture_info: {
        Row: {
          color_code: string
          company_id: string
          created_at: string
          id: string
          paint_brand: string
          task_id: string
          updated_at: string
          vehicle_brand: string | null
          vehicle_id: string
          vehicle_model: string | null
        }
        Insert: {
          color_code: string
          company_id: string
          created_at?: string
          id?: string
          paint_brand: string
          task_id: string
          updated_at?: string
          vehicle_brand?: string | null
          vehicle_id: string
          vehicle_model?: string | null
        }
        Update: {
          color_code?: string
          company_id?: string
          created_at?: string
          id?: string
          paint_brand?: string
          task_id?: string
          updated_at?: string
          vehicle_brand?: string | null
          vehicle_id?: string
          vehicle_model?: string | null
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          calculated_at: string
          company_id: string
          created_at: string
          id: string
          metric_type: string
          metric_unit: string | null
          metric_value: number
          period_end: string | null
          period_start: string | null
          updated_at: string
        }
        Insert: {
          calculated_at?: string
          company_id: string
          created_at?: string
          id?: string
          metric_type: string
          metric_unit?: string | null
          metric_value: number
          period_end?: string | null
          period_start?: string | null
          updated_at?: string
        }
        Update: {
          calculated_at?: string
          company_id?: string
          created_at?: string
          id?: string
          metric_type?: string
          metric_unit?: string | null
          metric_value?: number
          period_end?: string | null
          period_start?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      planning_patron: {
        Row: {
          company_id: string
          created_at: string
          date: string
          description: string | null
          duration: number
          id: string
          mail: string | null
          name: string
          nom: string | null
          prenom: string | null
          telephone: string | null
          time: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          date: string
          description?: string | null
          duration: number
          id?: string
          mail?: string | null
          name: string
          nom?: string | null
          prenom?: string | null
          telephone?: string | null
          time?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          date?: string
          description?: string | null
          duration?: number
          id?: string
          mail?: string | null
          name?: string
          nom?: string | null
          prenom?: string | null
          telephone?: string | null
          time?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      process_templates: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          estimated_total_duration: number
          id: string
          is_default: boolean
          name: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          estimated_total_duration?: number
          id?: string
          is_default?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          estimated_total_duration?: number
          id?: string
          is_default?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
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
          archived: boolean
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
          archived?: boolean
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
          archived?: boolean
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
          archived: boolean
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
          estimated_hours: number | null
          expert_name: string | null
          general_condition: string | null
          id: string
          incident_date: string | null
          notes: string | null
          oodrive_contract_id: string | null
          operator_name: string | null
          order_date: string | null
          parts_data: Json | null
          personal_items: string | null
          pieces_array: string[] | null
          policy_number: string | null
          quote_id: string | null
          reference: string
          repairs_data: Json | null
          report_date: string | null
          report_number: string | null
          signature_date: string | null
          signed_document_url: string | null
          start_date: string | null
          status: string | null
          total_surface_m2: number | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          archived?: boolean
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
          estimated_hours?: number | null
          expert_name?: string | null
          general_condition?: string | null
          id?: string
          incident_date?: string | null
          notes?: string | null
          oodrive_contract_id?: string | null
          operator_name?: string | null
          order_date?: string | null
          parts_data?: Json | null
          personal_items?: string | null
          pieces_array?: string[] | null
          policy_number?: string | null
          quote_id?: string | null
          reference: string
          repairs_data?: Json | null
          report_date?: string | null
          report_number?: string | null
          signature_date?: string | null
          signed_document_url?: string | null
          start_date?: string | null
          status?: string | null
          total_surface_m2?: number | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          archived?: boolean
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
          estimated_hours?: number | null
          expert_name?: string | null
          general_condition?: string | null
          id?: string
          incident_date?: string | null
          notes?: string | null
          oodrive_contract_id?: string | null
          operator_name?: string | null
          order_date?: string | null
          parts_data?: Json | null
          personal_items?: string | null
          pieces_array?: string[] | null
          policy_number?: string | null
          quote_id?: string | null
          reference?: string
          repairs_data?: Json | null
          report_date?: string | null
          report_number?: string | null
          signature_date?: string | null
          signed_document_url?: string | null
          start_date?: string | null
          status?: string | null
          total_surface_m2?: number | null
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
      resume_call: {
        Row: {
          client_id: string | null
          company_id: string | null
          created_at: string
          id: number
          phone_number: string | null
          resume: string | null
        }
        Insert: {
          client_id?: string | null
          company_id?: string | null
          created_at?: string
          id?: number
          phone_number?: string | null
          resume?: string | null
        }
        Update: {
          client_id?: string | null
          company_id?: string | null
          created_at?: string
          id?: number
          phone_number?: string | null
          resume?: string | null
        }
        Relationships: []
      }
      scrapped_profiles: {
        Row: {
          completed_registration: boolean
          created_at: string
          execution_number: number
          id: string
          job_scrap_id: number
          name: string
          profile_url: string | null
          social_network: string | null
          updated_at: string
          visited_demo_site: boolean
        }
        Insert: {
          completed_registration?: boolean
          created_at?: string
          execution_number?: number
          id?: string
          job_scrap_id: number
          name: string
          profile_url?: string | null
          social_network?: string | null
          updated_at?: string
          visited_demo_site?: boolean
        }
        Update: {
          completed_registration?: boolean
          created_at?: string
          execution_number?: number
          id?: string
          job_scrap_id?: number
          name?: string
          profile_url?: string | null
          social_network?: string | null
          updated_at?: string
          visited_demo_site?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "scrapped_profiles_job_scrap_id_fkey"
            columns: ["job_scrap_id"]
            isOneToOne: false
            referencedRelation: "job scrap"
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
      "suivi action user": {
        Row: {
          action: string | null
          created_at: string
          id: string
          userid: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string
          id?: string
          userid?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string
          id?: string
          userid?: string | null
        }
        Relationships: []
      }
      system_alerts: {
        Row: {
          alert_type: string
          clock_in_time: string | null
          company_id: string
          created_at: string
          employee_id: string | null
          entity_type: string
          id: string
          message: string
          messagerie_id: string | null
          reason: string | null
          repair_order_id: string | null
          resolved: boolean
          resolved_at: string | null
          title: string
          vehicle_id: string | null
        }
        Insert: {
          alert_type?: string
          clock_in_time?: string | null
          company_id: string
          created_at?: string
          employee_id?: string | null
          entity_type?: string
          id?: string
          message: string
          messagerie_id?: string | null
          reason?: string | null
          repair_order_id?: string | null
          resolved?: boolean
          resolved_at?: string | null
          title: string
          vehicle_id?: string | null
        }
        Update: {
          alert_type?: string
          clock_in_time?: string | null
          company_id?: string
          created_at?: string
          employee_id?: string | null
          entity_type?: string
          id?: string
          message?: string
          messagerie_id?: string | null
          reason?: string | null
          repair_order_id?: string | null
          resolved?: boolean
          resolved_at?: string | null
          title?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_alerts_messagerie_id_fkey"
            columns: ["messagerie_id"]
            isOneToOne: false
            referencedRelation: "messageries"
            referencedColumns: ["id"]
          },
        ]
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
          vehicle_id: string | null
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
          vehicle_id?: string | null
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
          vehicle_id?: string | null
        }
        Relationships: []
      }
      templates: {
        Row: {
          category: string
          company_id: string
          content: string
          created_at: string
          description: string | null
          id: string
          name: string
          performance_data: Json | null
          status: string
          type: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          category: string
          company_id: string
          content: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          performance_data?: Json | null
          status?: string
          type?: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          category?: string
          company_id?: string
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          performance_data?: Json | null
          status?: string
          type?: string
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      ticket_erp: {
        Row: {
          company_id: string
          created_at: string
          description: string
          id: string
          module_type: string
          priority: Database["public"]["Enums"]["ticket_priority_type"]
          resolved_at: string | null
          status: Database["public"]["Enums"]["ticket_status_type"]
          trigger_cause: Database["public"]["Enums"]["trigger_cause_type"]
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description: string
          id?: string
          module_type: string
          priority?: Database["public"]["Enums"]["ticket_priority_type"]
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status_type"]
          trigger_cause: Database["public"]["Enums"]["trigger_cause_type"]
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string
          id?: string
          module_type?: string
          priority?: Database["public"]["Enums"]["ticket_priority_type"]
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status_type"]
          trigger_cause?: Database["public"]["Enums"]["trigger_cause_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_erp_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_metrics_30d"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "ticket_erp_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "ticket_erp_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_info"
            referencedColumns: ["id"]
          },
        ]
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
      user_activity_logs: {
        Row: {
          company_id: string | null
          component_name: string | null
          created_at: string
          event_category: string
          event_name: string
          event_type: string
          id: string
          metadata: Json | null
          page_url: string
          session_id: string
          timestamp: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          component_name?: string | null
          created_at?: string
          event_category: string
          event_name: string
          event_type: string
          id?: string
          metadata?: Json | null
          page_url: string
          session_id: string
          timestamp?: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          component_name?: string | null
          created_at?: string
          event_category?: string
          event_name?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          page_url?: string
          session_id?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_metrics_30d"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "user_activity_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "user_activity_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_info"
            referencedColumns: ["id"]
          },
        ]
      }
      user_companies: {
        Row: {
          active: boolean
          company_id: string
          created_at: string
          id: string
          qualifications: Json | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          company_id: string
          created_at?: string
          id?: string
          qualifications?: Json | null
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          company_id?: string
          created_at?: string
          id?: string
          qualifications?: Json | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_metrics_30d"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "user_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "user_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_info"
            referencedColumns: ["id"]
          },
        ]
      }
      user_errors_abandons: {
        Row: {
          company_id: string | null
          component_name: string | null
          created_at: string
          error_message: string | null
          error_type: string
          form_data: Json | null
          funnel_name: string | null
          id: string
          metadata: Json | null
          page_url: string
          session_id: string
          stack_trace: string | null
          step_name: string | null
          timestamp: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          component_name?: string | null
          created_at?: string
          error_message?: string | null
          error_type: string
          form_data?: Json | null
          funnel_name?: string | null
          id?: string
          metadata?: Json | null
          page_url: string
          session_id: string
          stack_trace?: string | null
          step_name?: string | null
          timestamp?: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          component_name?: string | null
          created_at?: string
          error_message?: string | null
          error_type?: string
          form_data?: Json | null
          funnel_name?: string | null
          id?: string
          metadata?: Json | null
          page_url?: string
          session_id?: string
          stack_trace?: string | null
          step_name?: string | null
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_errors_abandons_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_metrics_30d"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "user_errors_abandons_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "user_errors_abandons_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_info"
            referencedColumns: ["id"]
          },
        ]
      }
      user_funnel_progress: {
        Row: {
          company_id: string | null
          created_at: string
          duration_seconds: number | null
          end_time: string | null
          form_data: Json | null
          funnel_name: string
          id: string
          metadata: Json | null
          session_id: string
          start_time: string
          status: string
          step_name: string
          step_order: number
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          duration_seconds?: number | null
          end_time?: string | null
          form_data?: Json | null
          funnel_name: string
          id?: string
          metadata?: Json | null
          session_id: string
          start_time?: string
          status?: string
          step_name: string
          step_order: number
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          duration_seconds?: number | null
          end_time?: string | null
          form_data?: Json | null
          funnel_name?: string
          id?: string
          metadata?: Json | null
          session_id?: string
          start_time?: string
          status?: string
          step_name?: string
          step_order?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_funnel_progress_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_metrics_30d"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "user_funnel_progress_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "user_funnel_progress_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_info"
            referencedColumns: ["id"]
          },
        ]
      }
      user_onboarding_progress: {
        Row: {
          cession_help_seen: boolean
          cession_initialize_button_help_seen: boolean
          cession_select_order_help_seen: boolean
          company_id: string | null
          created_at: string
          expertise_report_prompt_seen: boolean
          fleet_reservation_guide_completed: boolean
          fleet_reservation_help_seen: boolean
          id: string
          quote_convert_help_seen: boolean
          repair_order_help_seen: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          cession_help_seen?: boolean
          cession_initialize_button_help_seen?: boolean
          cession_select_order_help_seen?: boolean
          company_id?: string | null
          created_at?: string
          expertise_report_prompt_seen?: boolean
          fleet_reservation_guide_completed?: boolean
          fleet_reservation_help_seen?: boolean
          id?: string
          quote_convert_help_seen?: boolean
          repair_order_help_seen?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          cession_help_seen?: boolean
          cession_initialize_button_help_seen?: boolean
          cession_select_order_help_seen?: boolean
          company_id?: string | null
          created_at?: string
          expertise_report_prompt_seen?: boolean
          fleet_reservation_guide_completed?: boolean
          fleet_reservation_help_seen?: boolean
          id?: string
          quote_convert_help_seen?: boolean
          repair_order_help_seen?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_onboarding_progress_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_metrics_30d"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "user_onboarding_progress_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "user_onboarding_progress_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_info"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          actions_performed: number | null
          company_id: string | null
          created_at: string
          device_info: Json | null
          duration_seconds: number | null
          end_time: string | null
          id: string
          pages_visited: number | null
          session_id: string
          start_time: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          actions_performed?: number | null
          company_id?: string | null
          created_at?: string
          device_info?: Json | null
          duration_seconds?: number | null
          end_time?: string | null
          id?: string
          pages_visited?: number | null
          session_id: string
          start_time?: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          actions_performed?: number | null
          company_id?: string | null
          created_at?: string
          device_info?: Json | null
          duration_seconds?: number | null
          end_time?: string | null
          id?: string
          pages_visited?: number | null
          session_id?: string
          start_time?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_metrics_30d"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "user_sessions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "user_sessions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_info"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_part_surfaces: {
        Row: {
          body_part_id: string
          created_at: string
          id: string
          is_calculated: boolean
          surface_m2: number
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          body_part_id: string
          created_at?: string
          id?: string
          is_calculated?: boolean
          surface_m2: number
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          body_part_id?: string
          created_at?: string
          id?: string
          is_calculated?: boolean
          surface_m2?: number
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_part_surfaces_body_part_id_fkey"
            columns: ["body_part_id"]
            isOneToOne: false
            referencedRelation: "body_parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_part_surfaces_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_photos: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          employee_id: string
          file_name: string
          file_url: string
          id: string
          photo_type: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          employee_id: string
          file_name: string
          file_url: string
          id?: string
          photo_type?: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          employee_id?: string
          file_name?: string
          file_url?: string
          id?: string
          photo_type?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: []
      }
      vehicle_specifications: {
        Row: {
          brand_id: string | null
          category: string
          created_at: string
          height_mm: number | null
          id: string
          length_mm: number | null
          model_id: string | null
          updated_at: string
          variant: string | null
          width_mm: number | null
          year_end: number | null
          year_start: number | null
        }
        Insert: {
          brand_id?: string | null
          category?: string
          created_at?: string
          height_mm?: number | null
          id?: string
          length_mm?: number | null
          model_id?: string | null
          updated_at?: string
          variant?: string | null
          width_mm?: number | null
          year_end?: number | null
          year_start?: number | null
        }
        Update: {
          brand_id?: string | null
          category?: string
          created_at?: string
          height_mm?: number | null
          id?: string
          length_mm?: number | null
          model_id?: string | null
          updated_at?: string
          variant?: string | null
          width_mm?: number | null
          year_end?: number | null
          year_start?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_specifications_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "car_brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_specifications_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "car_models"
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
          vehicle_specification_id: string | null
          vin: string | null
          waiting_reason: string | null
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
          vehicle_specification_id?: string | null
          vin?: string | null
          waiting_reason?: string | null
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
          vehicle_specification_id?: string | null
          vin?: string | null
          waiting_reason?: string | null
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
          {
            foreignKeyName: "vehicles_vehicle_specification_id_fkey"
            columns: ["vehicle_specification_id"]
            isOneToOne: false
            referencedRelation: "vehicle_specifications"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_configurations: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          n8n_webhook_url: string
          updated_at: string | null
          usage_threshold: number | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          n8n_webhook_url: string
          updated_at?: string | null
          usage_threshold?: number | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          n8n_webhook_url?: string
          updated_at?: string | null
          usage_threshold?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_configurations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_metrics_30d"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "webhook_configurations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_business_summary"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "webhook_configurations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_info"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_executions: {
        Row: {
          alerts_sent: number | null
          clients_analyzed: number | null
          created_at: string | null
          error_message: string | null
          execution_date: string | null
          execution_details: Json | null
          id: string
          status: string | null
          webhook_config_id: string | null
        }
        Insert: {
          alerts_sent?: number | null
          clients_analyzed?: number | null
          created_at?: string | null
          error_message?: string | null
          execution_date?: string | null
          execution_details?: Json | null
          id?: string
          status?: string | null
          webhook_config_id?: string | null
        }
        Update: {
          alerts_sent?: number | null
          clients_analyzed?: number | null
          created_at?: string | null
          error_message?: string | null
          execution_date?: string | null
          execution_details?: Json | null
          id?: string
          status?: string | null
          webhook_config_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_executions_webhook_config_id_fkey"
            columns: ["webhook_config_id"]
            isOneToOne: false
            referencedRelation: "webhook_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      weighing_reports: {
        Row: {
          actual_weight: number
          company_id: string
          created_at: string
          id: string
          notes: string | null
          operator_name: string | null
          paint_cost: number | null
          paint_type_id: string
          repair_order_reference: string | null
          surface_area: number | null
          theoretical_weight: number
          total_cost: number | null
          updated_at: string
          variance: number | null
          variance_percentage: number | null
          vehicle_id: string | null
          weighing_timestamp: string
        }
        Insert: {
          actual_weight: number
          company_id: string
          created_at?: string
          id?: string
          notes?: string | null
          operator_name?: string | null
          paint_cost?: number | null
          paint_type_id: string
          repair_order_reference?: string | null
          surface_area?: number | null
          theoretical_weight: number
          total_cost?: number | null
          updated_at?: string
          variance?: number | null
          variance_percentage?: number | null
          vehicle_id?: string | null
          weighing_timestamp?: string
        }
        Update: {
          actual_weight?: number
          company_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          operator_name?: string | null
          paint_cost?: number | null
          paint_type_id?: string
          repair_order_reference?: string | null
          surface_area?: number | null
          theoretical_weight?: number
          total_cost?: number | null
          updated_at?: string
          variance?: number | null
          variance_percentage?: number | null
          vehicle_id?: string | null
          weighing_timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "weighing_reports_paint_type_id_fkey"
            columns: ["paint_type_id"]
            isOneToOne: false
            referencedRelation: "paint_types"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_steps: {
        Row: {
          can_run_in_parallel: boolean
          color: string
          created_at: string
          dependencies: string[] | null
          description: string | null
          estimated_duration: number
          id: string
          is_required: boolean
          name: string
          process_template_id: string
          required_qualifications: string[] | null
          step_key: string
          step_order: number
          updated_at: string
        }
        Insert: {
          can_run_in_parallel?: boolean
          color?: string
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          estimated_duration?: number
          id?: string
          is_required?: boolean
          name: string
          process_template_id: string
          required_qualifications?: string[] | null
          step_key: string
          step_order?: number
          updated_at?: string
        }
        Update: {
          can_run_in_parallel?: boolean
          color?: string
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          estimated_duration?: number
          id?: string
          is_required?: boolean
          name?: string
          process_template_id?: string
          required_qualifications?: string[] | null
          step_key?: string
          step_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_steps_process_template_id_fkey"
            columns: ["process_template_id"]
            isOneToOne: false
            referencedRelation: "process_templates"
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
      company_business_metrics_30d: {
        Row: {
          acceptance_rate: number | null
          accepted_count: number | null
          avg_amount: number | null
          company_id: string | null
          completion_rate: number | null
          count: number | null
          entity_type: string | null
          payment_rate: number | null
          total_amount: number | null
        }
        Relationships: []
      }
      company_business_summary: {
        Row: {
          business_usage_score: number | null
          company_id: string | null
          company_name: string | null
          created_at: string | null
          days_since_creation: number | null
          email: string | null
          is_new_company: boolean | null
          low_cessions_usage: boolean | null
          low_clients_usage: boolean | null
          low_fleet_usage: boolean | null
          low_invoices_usage: boolean | null
          low_quotes_usage: boolean | null
          low_repair_orders_usage: boolean | null
          metrics_by_type: Json | null
          phone: string | null
          total_operations: number | null
          total_revenue: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      bytea_to_text: {
        Args: { data: string }
        Returns: string
      }
      calculate_repair_order_surface: {
        Args: { repair_order_id: string }
        Returns: number
      }
      check_token_for_upload: {
        Args: { file_path: string }
        Returns: boolean
      }
      cleanup_expired_otp_codes: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_campaign_log: {
        Args: {
          p_anomaly_type?: string
          p_campaign_type?: string
          p_channels?: string[]
          p_company_id: string
          p_company_metrics?: Json
          p_content?: Json
          p_severity?: string
        }
        Returns: string
      }
      current_setting: {
        Args: { setting_name: string }
        Returns: string
      }
      get_available_employees: {
        Args: { p_company_id: string; p_task_type: string }
        Returns: {
          availability_score: number
          qualifications: Json
          role_priority: number
          user_id: string
        }[]
      }
      get_campaign_stats: {
        Args: { p_company_id?: string; p_days?: number }
        Returns: {
          campaigns_clicked: number
          campaigns_converted: number
          campaigns_opened: number
          campaigns_sent: number
          click_rate: number
          conversion_rate: number
          open_rate: number
          total_campaigns: number
        }[]
      }
      get_companies_with_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          days_since_creation: number
          email: string
          id: string
          name: string
          phone: string
          total_users: number
        }[]
      }
      get_company_activities: {
        Args: { p_company_id: string; p_days?: number }
        Returns: {
          activity_count: number
          company_id: string
          event_type: string
          page_path: string
          unique_users: number
        }[]
      }
      get_company_business_metrics: {
        Args: { p_company_id: string; p_days?: number }
        Returns: {
          avg_amount: number
          count: number
          entity_type: string
        }[]
      }
      get_company_sessions: {
        Args: { p_company_id: string; p_days?: number }
        Returns: {
          active_users: number
          avg_session_duration_minutes: number
          company_id: string
          total_sessions: number
        }[]
      }
      get_company_usage_score: {
        Args: { p_company_id: string; p_days?: number }
        Returns: {
          activity_metrics: Json
          business_metrics: Json
          company_id: string
          global_score: number
          module_scores: Json
          recommendations: string[]
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_effective_company_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
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
      is_valid_token: {
        Args: { token_id: string }
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_documents: {
        Args: { filter?: Json; match_count: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      record_campaign_interaction: {
        Args: {
          p_campaign_id: string
          p_interaction_data?: Json
          p_interaction_type: string
        }
        Returns: string
      }
      refresh_company_business_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      set_config: {
        Args: {
          is_local?: boolean
          setting_name: string
          setting_value: string
        }
        Returns: undefined
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      test_geocoding: {
        Args: { address_param: string }
        Returns: Json
      }
      text_to_bytea: {
        Args: { data: string }
        Returns: string
      }
      update_campaign_status: {
        Args: {
          p_campaign_id: string
          p_external_campaign_id?: string
          p_status: string
          p_tracking_url?: string
        }
        Returns: boolean
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
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      agent_type: "sav" | "marketing" | "system" | "client"
      communication_channel_type:
        | "email"
        | "sms"
        | "whatsapp"
        | "phone"
        | "internal"
      migration_error_type:
        | "invalid_phone_number"
        | "invalid_email"
        | "invalid_siren"
        | "geocoding_failed"
        | "insee_api_error"
        | "other"
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
        | "Contrôle technique de sécurité"
      task_status: "En attente" | "En cours" | "Terminé" | "En pause"
      ticket_priority_type: "basse" | "normale" | "haute" | "critique"
      ticket_status_type: "ouvert" | "en_cours" | "resolu" | "ferme"
      trigger_cause_type:
        | "mauvaise_utilisation"
        | "sous_utilisation"
        | "opportunite"
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
      agent_type: ["sav", "marketing", "system", "client"],
      communication_channel_type: [
        "email",
        "sms",
        "whatsapp",
        "phone",
        "internal",
      ],
      migration_error_type: [
        "invalid_phone_number",
        "invalid_email",
        "invalid_siren",
        "geocoding_failed",
        "insee_api_error",
        "other",
      ],
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
        "Contrôle technique de sécurité",
      ],
      task_status: ["En attente", "En cours", "Terminé", "En pause"],
      ticket_priority_type: ["basse", "normale", "haute", "critique"],
      ticket_status_type: ["ouvert", "en_cours", "resolu", "ferme"],
      trigger_cause_type: [
        "mauvaise_utilisation",
        "sous_utilisation",
        "opportunite",
      ],
    },
  },
} as const
