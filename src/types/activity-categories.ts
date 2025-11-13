export type ActionType = 
  // Gestion des documents
  | 'document_upload'
  | 'document_view'
  | 'document_delete'
  | 'document_attached'
  
  // Devis
  | 'quote_created'
  | 'quote_updated'
  | 'quote_deleted'
  | 'quote_sent'
  | 'quote_approved'
  | 'quote_pdf_generated'
  | 'quote_converted_to_or'
  
  // Factures
  | 'invoice_created'
  | 'invoice_updated'
  | 'invoice_deleted'
  | 'invoice_generated'
  | 'invoice_sent'
  | 'invoice_paid'
  | 'invoice_pdf_generated'
  
  // Ordres de réparation
  | 'or_created'
  | 'or_updated'
  | 'or_signed'
  | 'or_validated'
  | 'or_exported'
  | 'or_pdf_generated'
  
  // Paiements
  | 'payment_recorded'
  | 'payment_reminder_sent'
  
  // Véhicules de prêt
  | 'vehicle_loan_created'
  | 'vehicle_loan_returned'
  
  // Gestion des PV
  | 'pv_recorded'
  | 'pv_contested'
  
  // Cessions de créance
  | 'cession_created'
  | 'cession_validated'
  | 'cession_sent_email'
  | 'cession_signed'
  
  // Planning
  | 'appointment_created'
  | 'appointment_modified'
  | 'appointment_cancelled'
  
  // Utilisateurs
  | 'user_created'
  | 'user_modified'
  | 'permission_changed'
  
  // Gestion peinture
  | 'paint_stock_updated'
  | 'paint_order_created'
  
  // Exports
  | 'export_pdf'
  | 'export_excel'
  | 'export_accounting'
  
  // Analytics et IA
  | 'analytics_viewed'
  | 'prediction_generated'
  | 'alert_triggered'
  | 'report_generated'
  
  // Support
  | 'ticket_created'
  | 'chat_message_sent'
  | 'knowledge_base_searched'
  
  // Rapports d'expertise
  | 'expertise_report_imported'
  | 'expertise_report_created'
  | 'expertise_report_updated'
  | 'expertise_report_deleted'
  | 'expertise_report_viewed'
  | 'expertise_report_validated'
  | 'expertise_report_shared'
  | 'expertise_to_quote_converted'
  
  // Photos et documents véhicules
  | 'vehicle_photo_uploaded'
  
  // Clients
  | 'client_created'
  | 'client_updated'
  | 'client_deleted'
  
  // Véhicules
  | 'vehicle_created'
  | 'vehicle_updated'
  | 'vehicle_deleted';

export type ActivityCategory = 
  | 'integration_documentation'
  | 'facturation_pro_ia'
  | 'signature_or'
  | 'pret_vehicule'
  | 'gestion_pv'
  | 'cession_creance'
  | 'planning_atelier'
  | 'base_user_planning'
  | 'gestion_peinture'
  | 'dashboard_ia'
  | 'assistance_sav'
  | 'export_documents';

// Mapping des types d'actions vers les catégories
export const ACTION_CATEGORY_MAPPING: Record<ActionType, { category: ActivityCategory; subcategory: string }> = {
  // Intégration Documentation - Rapports d'expertise et documents
  expertise_report_imported: { category: 'integration_documentation', subcategory: 'Organisation' },
  expertise_report_created: { category: 'integration_documentation', subcategory: 'Organisation' },
  expertise_report_updated: { category: 'integration_documentation', subcategory: 'Organisation' },
  expertise_report_deleted: { category: 'integration_documentation', subcategory: 'Organisation' },
  expertise_report_viewed: { category: 'integration_documentation', subcategory: 'Organisation' },
  expertise_report_validated: { category: 'integration_documentation', subcategory: 'Organisation' },
  expertise_report_shared: { category: 'integration_documentation', subcategory: 'Organisation' },
  expertise_to_quote_converted: { category: 'integration_documentation', subcategory: 'Conversion' },
  vehicle_photo_uploaded: { category: 'integration_documentation', subcategory: 'Photos' },
  document_attached: { category: 'integration_documentation', subcategory: 'Pièces_jointes' },
  document_upload: { category: 'integration_documentation', subcategory: 'Organisation' },
  document_view: { category: 'integration_documentation', subcategory: 'Organisation' },
  document_delete: { category: 'integration_documentation', subcategory: 'Organisation' },
  
  // Facturation Pro IA
  quote_created: { category: 'facturation_pro_ia', subcategory: 'Devis' },
  quote_updated: { category: 'facturation_pro_ia', subcategory: 'Devis' },
  quote_deleted: { category: 'facturation_pro_ia', subcategory: 'Devis' },
  quote_sent: { category: 'facturation_pro_ia', subcategory: 'Devis' },
  quote_approved: { category: 'facturation_pro_ia', subcategory: 'Devis' },
  quote_pdf_generated: { category: 'facturation_pro_ia', subcategory: 'Exports' },
  quote_converted_to_or: { category: 'facturation_pro_ia', subcategory: 'Conversion' },
  
  invoice_created: { category: 'facturation_pro_ia', subcategory: 'Factures' },
  invoice_updated: { category: 'facturation_pro_ia', subcategory: 'Factures' },
  invoice_deleted: { category: 'facturation_pro_ia', subcategory: 'Factures' },
  invoice_generated: { category: 'facturation_pro_ia', subcategory: 'Factures' },
  invoice_sent: { category: 'facturation_pro_ia', subcategory: 'Factures' },
  invoice_paid: { category: 'facturation_pro_ia', subcategory: 'Factures' },
  invoice_pdf_generated: { category: 'facturation_pro_ia', subcategory: 'Exports' },
  
  payment_recorded: { category: 'facturation_pro_ia', subcategory: 'Paiements' },
  payment_reminder_sent: { category: 'facturation_pro_ia', subcategory: 'Relances' },
  
  export_pdf: { category: 'export_documents', subcategory: 'PDF' },
  export_excel: { category: 'export_documents', subcategory: 'Excel' },
  export_accounting: { category: 'export_documents', subcategory: 'Comptabilité' },
  
  // Signature des OR
  or_created: { category: 'signature_or', subcategory: 'Création' },
  or_updated: { category: 'signature_or', subcategory: 'Modification' },
  or_signed: { category: 'signature_or', subcategory: 'Signature_numérique' },
  or_validated: { category: 'signature_or', subcategory: 'Validation' },
  or_exported: { category: 'signature_or', subcategory: 'Export_PDF' },
  or_pdf_generated: { category: 'signature_or', subcategory: 'Export_PDF' },
  
  // Prêt de Véhicule
  vehicle_loan_created: { category: 'pret_vehicule', subcategory: 'Réservation' },
  vehicle_loan_returned: { category: 'pret_vehicule', subcategory: 'Retours' },
  
  // Gestion des PV
  pv_recorded: { category: 'gestion_pv', subcategory: 'Saisie' },
  pv_contested: { category: 'gestion_pv', subcategory: 'Contestation' },
  
  // Cession de Créance
  cession_created: { category: 'cession_creance', subcategory: 'Création' },
  cession_validated: { category: 'cession_creance', subcategory: 'Validation' },
  cession_sent_email: { category: 'cession_creance', subcategory: 'Envoi' },
  cession_signed: { category: 'cession_creance', subcategory: 'Signature' },
  
  // Planning Atelier
  appointment_created: { category: 'planning_atelier', subcategory: 'RDV' },
  appointment_modified: { category: 'planning_atelier', subcategory: 'RDV' },
  appointment_cancelled: { category: 'planning_atelier', subcategory: 'RDV' },
  
  // Base User Planning - Clients
  client_created: { category: 'base_user_planning', subcategory: 'Clients' },
  client_updated: { category: 'base_user_planning', subcategory: 'Clients' },
  client_deleted: { category: 'base_user_planning', subcategory: 'Clients' },
  
  // Base User Planning - Véhicules
  vehicle_created: { category: 'base_user_planning', subcategory: 'Véhicules' },
  vehicle_updated: { category: 'base_user_planning', subcategory: 'Véhicules' },
  vehicle_deleted: { category: 'base_user_planning', subcategory: 'Véhicules' },
  
  // Base User Planning - Utilisateurs
  user_created: { category: 'base_user_planning', subcategory: 'Utilisateurs' },
  user_modified: { category: 'base_user_planning', subcategory: 'Utilisateurs' },
  permission_changed: { category: 'base_user_planning', subcategory: 'Permissions' },
  
  // Gestion Peinture
  paint_stock_updated: { category: 'gestion_peinture', subcategory: 'Stock_peinture' },
  paint_order_created: { category: 'gestion_peinture', subcategory: 'Commandes' },
  
  // Dashboard IA
  analytics_viewed: { category: 'dashboard_ia', subcategory: 'Analytics' },
  prediction_generated: { category: 'dashboard_ia', subcategory: 'Prédictions' },
  alert_triggered: { category: 'dashboard_ia', subcategory: 'Alertes' },
  report_generated: { category: 'dashboard_ia', subcategory: 'Rapports' },
  
  // Assistance SAV
  ticket_created: { category: 'assistance_sav', subcategory: 'Tickets' },
  chat_message_sent: { category: 'assistance_sav', subcategory: 'Chat' },
  knowledge_base_searched: { category: 'assistance_sav', subcategory: 'Base_connaissance' },
};
