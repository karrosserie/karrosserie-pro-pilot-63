-- Add expertise-related fields to repair_orders table to match quotes table structure
ALTER TABLE repair_orders 
ADD COLUMN report_number TEXT,
ADD COLUMN policy_number TEXT,
ADD COLUMN report_date DATE,
ADD COLUMN expert_name TEXT,
ADD COLUMN incident_date DATE;

-- Add indexes for better query performance
CREATE INDEX idx_repair_orders_report_number ON repair_orders(report_number);
CREATE INDEX idx_repair_orders_policy_number ON repair_orders(policy_number);
CREATE INDEX idx_repair_orders_expert_name ON repair_orders(expert_name);