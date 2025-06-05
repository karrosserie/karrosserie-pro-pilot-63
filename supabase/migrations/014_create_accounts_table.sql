
-- Create accounts table
create table public.accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  bank text not null,
  iban text not null,
  bic text not null,
  balance decimal(15,2) default 0.00,
  status text default 'Actif' check (status in ('Actif', 'Inactif', 'Suspendu')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.accounts enable row level security;

-- Create RLS policies
create policy "Users can view their own accounts" on public.accounts
  for select using (auth.uid() = user_id);

create policy "Users can insert their own accounts" on public.accounts
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own accounts" on public.accounts
  for update using (auth.uid() = user_id);

create policy "Users can delete their own accounts" on public.accounts
  for delete using (auth.uid() = user_id);

-- Create updated_at trigger
create trigger handle_updated_at before update on public.accounts
  for each row execute procedure moddatetime (updated_at);
