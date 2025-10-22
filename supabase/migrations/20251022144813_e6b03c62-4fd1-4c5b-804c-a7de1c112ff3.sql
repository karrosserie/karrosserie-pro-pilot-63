-- Add fields to track report modifications in quotes
ALTER TABLE quotes
ADD COLUMN IF NOT EXISTS is_modified_from_report boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS modificatif_report_id uuid REFERENCES expertise_reports(id),
ADD COLUMN IF NOT EXISTS modificatif_requested_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS modificatif_received_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS source_report_id uuid REFERENCES expertise_reports(id);

-- Add fields to track report modifications in repair_orders
ALTER TABLE repair_orders
ADD COLUMN IF NOT EXISTS is_modified_from_report boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS modificatif_report_id uuid REFERENCES expertise_reports(id),
ADD COLUMN IF NOT EXISTS modificatif_requested_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS modificatif_received_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS source_report_id uuid REFERENCES expertise_reports(id);

-- Add comment for documentation
COMMENT ON COLUMN quotes.is_modified_from_report IS 'Indique si le devis a été modifié par rapport au rapport d''expert initial';
COMMENT ON COLUMN quotes.modificatif_report_id IS 'Référence au rapport modificatif reçu de l''expert';
COMMENT ON COLUMN quotes.modificatif_requested_at IS 'Date de demande du rapport modificatif à l''expert';
COMMENT ON COLUMN quotes.modificatif_received_at IS 'Date de réception du rapport modificatif';
COMMENT ON COLUMN quotes.source_report_id IS 'Référence au rapport d''expert initial';

COMMENT ON COLUMN repair_orders.is_modified_from_report IS 'Indique si l''OR a été modifié par rapport au rapport d''expert initial';
COMMENT ON COLUMN repair_orders.modificatif_report_id IS 'Référence au rapport modificatif reçu de l''expert';
COMMENT ON COLUMN repair_orders.modificatif_requested_at IS 'Date de demande du rapport modificatif à l''expert';
COMMENT ON COLUMN repair_orders.modificatif_received_at IS 'Date de réception du rapport modificatif';
COMMENT ON COLUMN repair_orders.source_report_id IS 'Référence au rapport d''expert initial';