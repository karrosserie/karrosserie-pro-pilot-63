-- Add foreign key relationship between remonté_demande_document and clients
ALTER TABLE "remonté_demande_document" 
ADD CONSTRAINT "remonté_demande_document_client_id_fkey" 
FOREIGN KEY (client_id) 
REFERENCES clients(id) 
ON DELETE CASCADE;