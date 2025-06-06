
-- Add status column to expenses table
ALTER TABLE expenses 
ADD COLUMN status TEXT NOT NULL DEFAULT 'En attente' 
CHECK (status IN ('En attente', 'Validé', 'Payé', 'Refusé'));

-- Create index for performance
CREATE INDEX idx_expenses_status ON expenses(status);
