-- Add foreign key constraints to client_relances table
ALTER TABLE public.client_relances
ADD CONSTRAINT fk_client_relances_company_id 
FOREIGN KEY (company_id) REFERENCES public.company_info(id);

ALTER TABLE public.client_relances
ADD CONSTRAINT fk_client_relances_client_id 
FOREIGN KEY (client_id) REFERENCES public.clients(id);

ALTER TABLE public.client_relances
ADD CONSTRAINT fk_client_relances_invoice_id 
FOREIGN KEY (invoice_id) REFERENCES public.invoices(id);

ALTER TABLE public.client_relances
ADD CONSTRAINT fk_client_relances_quote_id 
FOREIGN KEY (quote_id) REFERENCES public.quotes(id);