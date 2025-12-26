# Plan de Migration - Modèle Dossier

## Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Architecture Cible](#architecture-cible)
3. [Règles Métier Préservées](#règles-métier-préservées)
4. [Phase 1 - Migration Base de Données](#phase-1---migration-base-de-données)
5. [Phase 2 - Migration Application](#phase-2---migration-application)
6. [Phase 3 - Migration UI](#phase-3---migration-ui)
7. [Phase 4 - Nettoyage](#phase-4---nettoyage-optionnel)
8. [Rollback](#stratégie-de-rollback)
9. [Calendrier](#calendrier-dexécution)

---

## Vue d'Ensemble

### Objectif

Introduire une entité **Dossier** (sinistre) qui centralise toutes les informations relatives à un accident/sinistre :
- Un client peut avoir plusieurs dossiers (plusieurs sinistres)
- Chaque dossier est lié à un seul véhicule
- Tous les documents (expertises, devis, OR, factures, cessions) sont rattachés au dossier

### Principes de Migration

| Principe | Description |
|----------|-------------|
| **Aucune suppression** | Les colonnes existantes (`client_id`, `vehicle_id`) sont conservées |
| **Mode hybride** | Le code supporte les deux modes pendant la transition |
| **Rétrocompatibilité** | Les fonctionnalités existantes continuent de fonctionner |
| **Feature flag** | Basculement progressif via configuration |
| **Migration données** | Script automatique pour créer les dossiers existants |

---

## Architecture Cible

### Schéma Relationnel

```
┌─────────────┐
│   clients   │
└──────┬──────┘
       │ 1:N
       ▼
┌─────────────┐
│  dossiers   │──────────────────────────────────────┐
└──────┬──────┘                                      │
       │ 1:1                                         │
       ▼                                             │
┌─────────────┐                                      │
│  vehicles   │                                      │
└─────────────┘                                      │
                                                     │
       ┌─────────────────────────────────────────────┼─────────────────────────────┐
       │                                             │                             │
       ▼                                             ▼                             ▼
┌──────────────────┐                    ┌────────────────────┐          ┌──────────────────┐
│ expertise_reports│                    │    repair_orders   │          │fleet_reservations│
└──────────────────┘                    └─────────┬──────────┘          └────────┬─────────┘
       │                                          │                              │
       │ 1:N                              ┌───────┴───────┐                      │
       ▼                                  │               │                      │
┌─────────────┐                           ▼               ▼                      │
│   quotes    │                    ┌──────────┐    ┌──────────┐                  │
└─────────────┘                    │ invoices │    │ cessions │◄─────────────────┘
                                   └──────────┘    └──────────┘
                                                   (via repair_order_id OU fleet_reservation_id)
```

### Relations Clés

| Relation | Type | Description |
|----------|------|-------------|
| `clients` → `dossiers` | 1:N | Un client peut avoir plusieurs sinistres |
| `dossiers` → `vehicles` | 1:1 | Un dossier = un véhicule concerné |
| `dossiers` → `expertise_reports` | 1:N | Rapports d'expertise du sinistre |
| `dossiers` → `quotes` | 1:N | Devis liés au sinistre |
| `dossiers` → `repair_orders` | 1:N | Ordres de réparation du sinistre |
| `dossiers` → `fleet_reservations` | 1:N | Prêts de véhicule pour le sinistre |
| `repair_orders` → `invoices` | 1:N | **PRÉSERVÉ** - Factures de l'OR |
| `repair_orders` → `cessions` | 1:1 | **PRÉSERVÉ** - Cession de créance de l'OR |
| `fleet_reservations` → `cessions` | 1:1 | **PRÉSERVÉ** - Cession pour prêt véhicule |

---

## Règles Métier Préservées

### ✅ Cessions

| Règle Actuelle | Statut | Implémentation Cible |
|----------------|--------|----------------------|
| Cession liée à un repair_order | ✅ Préservé | `repair_order_id` conservé |
| Cession liée à une fleet_reservation | ✅ Préservé | `fleet_reservation_id` conservé |
| Cession type `repair` / `repair_enterprise` | ✅ Préservé | Logique inchangée |
| Cession type `fleet_loan` | ✅ Préservé | Logique inchangée |
| Statuts de cession | ✅ Préservé | Workflow inchangé |
| Validation données client/véhicule | ✅ Préservé | Via `repair_order.dossier.client/vehicle` |

**Code concerné :**
- `src/components/cessions/form/types.ts` - Types inchangés
- `src/components/cessions/form/utils/formState.ts` - Logique préservée
- `src/components/cessions/form/useCessionFormLogic.ts` - Enrichissement via dossier
- `src/services/supabase/cessions/` - Requêtes adaptées

### ✅ Invoices (Factures)

| Règle Actuelle | Statut | Implémentation Cible |
|----------------|--------|----------------------|
| Facture liée à un repair_order | ✅ Préservé | `repair_order_id` conservé |
| Calcul montants depuis OR | ✅ Préservé | Logique inchangée |
| Statuts de facture | ✅ Préservé | Workflow inchangé |

### ✅ Quotes (Devis)

| Règle Actuelle | Statut | Implémentation Cible |
|----------------|--------|----------------------|
| Devis créé depuis expertise | ✅ Préservé | `source_report_id` conservé |
| Devis hérite du client/véhicule | ✅ Préservé | Via `dossier_id` |
| Transformation en OR | ✅ Préservé | Logique inchangée |

### ✅ Repair Orders (Ordres de Réparation)

| Règle Actuelle | Statut | Implémentation Cible |
|----------------|--------|----------------------|
| OR lié à client + véhicule | ✅ Adapté | Via `dossier_id` uniquement |
| OR depuis devis | ✅ Préservé | `quote_id` conservé |
| Workflow statuts OR | ✅ Préservé | Inchangé |

### ✅ Vehicles (Véhicules)

| Règle Actuelle | Statut | Implémentation Cible |
|----------------|--------|----------------------|
| Véhicule lié à un client | ✅ Adapté | Via `dossier.client_id` |
| Un véhicule = plusieurs OR possibles | ✅ Adapté | Via différents dossiers |

---

## Phase 1 - Migration Base de Données

### Étape 1.1 - Création de la table `dossiers`

```sql
-- ============================================
-- MIGRATION 001: Création table dossiers
-- ============================================

-- 1. Créer la table dossiers
CREATE TABLE public.dossiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT NOT NULL DEFAULT '',
  
  -- Relations principales
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  company_id UUID NOT NULL,
  
  -- Informations sinistre (centralisées)
  claim_number TEXT,           -- Numéro de sinistre
  policy_number TEXT,          -- Numéro de police
  incident_date DATE,          -- Date du sinistre
  incident_number TEXT,        -- Numéro d'incident
  report_number TEXT,          -- Numéro de rapport
  expert_name TEXT,            -- Nom de l'expert
  insurance_company_id UUID REFERENCES public.insurance_companies(id),
  
  -- Métadonnées
  status TEXT DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'en_cours', 'terminé', 'archivé')),
  archived BOOLEAN DEFAULT false,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Contraintes
  CONSTRAINT unique_vehicle_per_dossier UNIQUE (vehicle_id, company_id)
);

-- 2. Index pour performances
CREATE INDEX idx_dossiers_client_id ON public.dossiers(client_id);
CREATE INDEX idx_dossiers_vehicle_id ON public.dossiers(vehicle_id);
CREATE INDEX idx_dossiers_company_id ON public.dossiers(company_id);
CREATE INDEX idx_dossiers_claim_number ON public.dossiers(claim_number);
CREATE INDEX idx_dossiers_status ON public.dossiers(status);

-- 3. Trigger updated_at
CREATE TRIGGER update_dossiers_updated_at
  BEFORE UPDATE ON public.dossiers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. RLS Policies
ALTER TABLE public.dossiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members can manage dossiers"
  ON public.dossiers
  FOR ALL
  USING (user_belongs_to_company(auth.uid(), company_id))
  WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

CREATE POLICY "Admin users can manage all dossiers"
  ON public.dossiers
  FOR ALL
  USING (get_current_user_role() = 'admin');

-- 5. Fonction de génération de référence
CREATE OR REPLACE FUNCTION generate_dossier_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference IS NULL OR NEW.reference = '' THEN
    NEW.reference := 'DOS-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                     LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_dossier_reference
  BEFORE INSERT ON public.dossiers
  FOR EACH ROW
  EXECUTE FUNCTION generate_dossier_reference();
```

### Étape 1.2 - Ajout des colonnes `dossier_id`

```sql
-- ============================================
-- MIGRATION 002: Ajout dossier_id aux tables
-- ============================================

-- 1. Table vehicles (relation 1:1 avec dossier)
-- Note: vehicle_id est dans dossiers, pas l'inverse pour la relation 1:1

-- 2. Table expertise_reports
ALTER TABLE public.expertise_reports 
  ADD COLUMN IF NOT EXISTS dossier_id UUID REFERENCES public.dossiers(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_expertise_reports_dossier_id ON public.expertise_reports(dossier_id);

-- 3. Table quotes
ALTER TABLE public.quotes 
  ADD COLUMN IF NOT EXISTS dossier_id UUID REFERENCES public.dossiers(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_quotes_dossier_id ON public.quotes(dossier_id);

-- 4. Table repair_orders
ALTER TABLE public.repair_orders 
  ADD COLUMN IF NOT EXISTS dossier_id UUID REFERENCES public.dossiers(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_repair_orders_dossier_id ON public.repair_orders(dossier_id);

-- 5. Table fleet_reservations
ALTER TABLE public.fleet_reservations 
  ADD COLUMN IF NOT EXISTS dossier_id UUID REFERENCES public.dossiers(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_fleet_reservations_dossier_id ON public.fleet_reservations(dossier_id);

-- 6. Table messageries
ALTER TABLE public.messageries 
  ADD COLUMN IF NOT EXISTS dossier_id UUID REFERENCES public.dossiers(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_messageries_dossier_id ON public.messageries(dossier_id);

-- Note: cessions garde UNIQUEMENT repair_order_id et fleet_reservation_id
-- La relation avec le dossier passe par ces entités parentes
```

### Étape 1.3 - Migration des données existantes

```sql
-- ============================================
-- MIGRATION 003: Population des dossiers
-- ============================================

-- Stratégie: Créer un dossier par combinaison unique (client_id, vehicle_id)
-- en récupérant les infos sinistre depuis les documents existants

-- 1. Créer les dossiers depuis les repair_orders (source principale)
INSERT INTO public.dossiers (
  client_id,
  vehicle_id,
  company_id,
  claim_number,
  policy_number,
  incident_date,
  incident_number,
  report_number,
  expert_name,
  insurance_company_id,
  status,
  created_at
)
SELECT DISTINCT ON (ro.client_id, ro.vehicle_id)
  ro.client_id,
  ro.vehicle_id,
  ro.company_id,
  ro.claim_number,
  ro.policy_number,
  ro.incident_date,
  NULL as incident_number,  -- À récupérer depuis cessions si besoin
  ro.report_number,
  ro.expert_name,
  NULL as insurance_company_id,
  CASE 
    WHEN ro.status = 'completed' THEN 'terminé'
    WHEN ro.status IN ('cancelled', 'archived') THEN 'archivé'
    ELSE 'en_cours'
  END as status,
  ro.created_at
FROM public.repair_orders ro
WHERE ro.client_id IS NOT NULL 
  AND ro.vehicle_id IS NOT NULL
ORDER BY ro.client_id, ro.vehicle_id, ro.created_at DESC;

-- 2. Créer les dossiers depuis les expertise_reports sans OR
INSERT INTO public.dossiers (
  client_id,
  vehicle_id,
  company_id,
  claim_number,
  status,
  created_at
)
SELECT DISTINCT ON (er.client_id, v.id)
  er.client_id,
  v.id as vehicle_id,
  er.company_id,
  er.claim_number,
  'en_cours' as status,
  er.created_at
FROM public.expertise_reports er
LEFT JOIN public.vehicles v ON v.client_id = er.client_id
WHERE NOT EXISTS (
  SELECT 1 FROM public.dossiers d 
  WHERE d.client_id = er.client_id AND d.vehicle_id = v.id
)
AND er.client_id IS NOT NULL
AND v.id IS NOT NULL
ORDER BY er.client_id, v.id, er.created_at DESC;

-- 3. Mettre à jour les repair_orders avec dossier_id
UPDATE public.repair_orders ro
SET dossier_id = d.id
FROM public.dossiers d
WHERE ro.client_id = d.client_id 
  AND ro.vehicle_id = d.vehicle_id
  AND ro.dossier_id IS NULL;

-- 4. Mettre à jour les expertise_reports avec dossier_id
UPDATE public.expertise_reports er
SET dossier_id = d.id
FROM public.dossiers d
JOIN public.vehicles v ON v.id = d.vehicle_id
WHERE er.client_id = d.client_id 
  AND er.dossier_id IS NULL;

-- 5. Mettre à jour les quotes avec dossier_id
UPDATE public.quotes q
SET dossier_id = d.id
FROM public.dossiers d
WHERE q.client_id = d.client_id 
  AND q.vehicle_id = d.vehicle_id
  AND q.dossier_id IS NULL;

-- 6. Mettre à jour les fleet_reservations avec dossier_id
UPDATE public.fleet_reservations fr
SET dossier_id = d.id
FROM public.dossiers d
WHERE fr.client_id = d.client_id 
  AND fr.vehicle_id = d.vehicle_id
  AND fr.dossier_id IS NULL;

-- 7. Enrichir les dossiers avec insurance_company_id depuis cessions
UPDATE public.dossiers d
SET insurance_company_id = c.insurance_company_id,
    incident_number = c.incident_number
FROM public.cessions c
JOIN public.repair_orders ro ON ro.id = c.repair_order_id
WHERE ro.dossier_id = d.id
  AND c.insurance_company_id IS NOT NULL
  AND d.insurance_company_id IS NULL;
```

### Étape 1.4 - Validation de la migration

```sql
-- ============================================
-- VALIDATION: Vérifications post-migration
-- ============================================

-- 1. Vérifier que tous les OR ont un dossier_id
SELECT COUNT(*) as orphan_repair_orders
FROM public.repair_orders
WHERE dossier_id IS NULL 
  AND client_id IS NOT NULL 
  AND vehicle_id IS NOT NULL;

-- 2. Vérifier la cohérence client/véhicule
SELECT d.id, d.client_id, d.vehicle_id, v.client_id as vehicle_client_id
FROM public.dossiers d
JOIN public.vehicles v ON v.id = d.vehicle_id
WHERE d.client_id != v.client_id;

-- 3. Statistiques de migration
SELECT 
  'dossiers' as table_name, COUNT(*) as count FROM public.dossiers
UNION ALL
SELECT 
  'repair_orders avec dossier' as table_name, 
  COUNT(*) FROM public.repair_orders WHERE dossier_id IS NOT NULL
UNION ALL
SELECT 
  'quotes avec dossier' as table_name, 
  COUNT(*) FROM public.quotes WHERE dossier_id IS NOT NULL
UNION ALL
SELECT 
  'expertise_reports avec dossier' as table_name, 
  COUNT(*) FROM public.expertise_reports WHERE dossier_id IS NOT NULL;
```

---

## Phase 2 - Migration Application

### Étape 2.1 - Création des types TypeScript

**Fichier: `src/types/dossier.ts`**

```typescript
import { Client } from '@/services/supabase/clients';
import { Vehicle } from '@/services/supabase/vehicles';
import { InsuranceCompany } from '@/services/supabase/insurance-companies';

export type DossierStatus = 'nouveau' | 'en_cours' | 'terminé' | 'archivé';

export interface Dossier {
  id: string;
  reference: string;
  client_id: string | null;
  vehicle_id: string | null;
  company_id: string;
  
  // Informations sinistre
  claim_number: string | null;
  policy_number: string | null;
  incident_date: string | null;
  incident_number: string | null;
  report_number: string | null;
  expert_name: string | null;
  insurance_company_id: string | null;
  
  // Métadonnées
  status: DossierStatus;
  archived: boolean;
  notes: string | null;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Relations (optionnelles, pour enrichissement)
  client?: Client;
  vehicle?: Vehicle;
  insurance_company?: InsuranceCompany;
}

export interface NewDossier {
  client_id: string;
  vehicle_id?: string | null;
  company_id: string;
  claim_number?: string | null;
  policy_number?: string | null;
  incident_date?: string | null;
  incident_number?: string | null;
  report_number?: string | null;
  expert_name?: string | null;
  insurance_company_id?: string | null;
  notes?: string | null;
}

export interface UpdateDossier {
  client_id?: string | null;
  vehicle_id?: string | null;
  claim_number?: string | null;
  policy_number?: string | null;
  incident_date?: string | null;
  incident_number?: string | null;
  report_number?: string | null;
  expert_name?: string | null;
  insurance_company_id?: string | null;
  status?: DossierStatus;
  archived?: boolean;
  notes?: string | null;
}

// Types pour les statistiques
export interface DossierStats {
  total_dossiers: number;
  dossiers_en_cours: number;
  dossiers_termines: number;
  dossiers_archives: number;
}

// Type pour la timeline du dossier
export interface DossierTimelineEvent {
  id: string;
  type: 'expertise' | 'quote' | 'repair_order' | 'invoice' | 'cession' | 'message';
  title: string;
  description?: string;
  status?: string;
  amount?: number;
  created_at: string;
  entity_id: string;
}
```

### Étape 2.2 - Création du service `dossiersService`

**Fichier: `src/services/supabase/dossiers.ts`**

```typescript
import { supabase } from '@/integrations/supabase/client';
import { Dossier, NewDossier, UpdateDossier, DossierTimelineEvent } from '@/types/dossier';

const DOSSIER_SELECT = `
  *,
  client:clients(*),
  vehicle:vehicles(*),
  insurance_company:insurance_companies(*)
`;

export const dossiersService = {
  // ===== CRUD de base =====
  
  async getAll(): Promise<Dossier[]> {
    const { data, error } = await supabase
      .from('dossiers')
      .select(DOSSIER_SELECT)
      .eq('archived', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Dossier | null> {
    const { data, error } = await supabase
      .from('dossiers')
      .select(DOSSIER_SELECT)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  async getByClientId(clientId: string): Promise<Dossier[]> {
    const { data, error } = await supabase
      .from('dossiers')
      .select(DOSSIER_SELECT)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getByVehicleId(vehicleId: string): Promise<Dossier | null> {
    const { data, error } = await supabase
      .from('dossiers')
      .select(DOSSIER_SELECT)
      .eq('vehicle_id', vehicleId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  async create(dossier: NewDossier): Promise<Dossier> {
    const { data, error } = await supabase
      .from('dossiers')
      .insert(dossier)
      .select(DOSSIER_SELECT)
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: UpdateDossier): Promise<Dossier> {
    const { data, error } = await supabase
      .from('dossiers')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(DOSSIER_SELECT)
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('dossiers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async archive(id: string): Promise<Dossier> {
    return this.update(id, { archived: true, status: 'archivé' });
  },

  // ===== Méthodes spécialisées =====

  async getTimeline(dossierId: string): Promise<DossierTimelineEvent[]> {
    const events: DossierTimelineEvent[] = [];

    // Récupérer les expertises
    const { data: expertises } = await supabase
      .from('expertise_reports')
      .select('id, created_at, status')
      .eq('dossier_id', dossierId);

    expertises?.forEach(e => {
      events.push({
        id: e.id,
        type: 'expertise',
        title: 'Rapport d\'expertise',
        status: e.status,
        created_at: e.created_at,
        entity_id: e.id
      });
    });

    // Récupérer les devis
    const { data: quotes } = await supabase
      .from('quotes')
      .select('id, reference, created_at, status, total_ttc')
      .eq('dossier_id', dossierId);

    quotes?.forEach(q => {
      events.push({
        id: q.id,
        type: 'quote',
        title: `Devis ${q.reference}`,
        status: q.status,
        amount: q.total_ttc,
        created_at: q.created_at,
        entity_id: q.id
      });
    });

    // Récupérer les OR
    const { data: repairOrders } = await supabase
      .from('repair_orders')
      .select('id, reference, created_at, status, total_ttc')
      .eq('dossier_id', dossierId);

    repairOrders?.forEach(ro => {
      events.push({
        id: ro.id,
        type: 'repair_order',
        title: `Ordre de réparation ${ro.reference}`,
        status: ro.status,
        amount: ro.total_ttc,
        created_at: ro.created_at,
        entity_id: ro.id
      });
    });

    // Récupérer les factures via les OR
    if (repairOrders && repairOrders.length > 0) {
      const roIds = repairOrders.map(ro => ro.id);
      const { data: invoices } = await supabase
        .from('invoices')
        .select('id, reference, created_at, status, total_ttc')
        .in('repair_order_id', roIds);

      invoices?.forEach(inv => {
        events.push({
          id: inv.id,
          type: 'invoice',
          title: `Facture ${inv.reference}`,
          status: inv.status,
          amount: inv.total_ttc,
          created_at: inv.created_at,
          entity_id: inv.id
        });
      });

      // Récupérer les cessions via les OR
      const { data: cessions } = await supabase
        .from('cessions')
        .select('id, reference, created_at, status')
        .in('repair_order_id', roIds);

      cessions?.forEach(c => {
        events.push({
          id: c.id,
          type: 'cession',
          title: `Cession ${c.reference}`,
          status: c.status,
          created_at: c.created_at,
          entity_id: c.id
        });
      });
    }

    // Trier par date
    return events.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  async getDocumentCounts(dossierId: string): Promise<{
    expertises: number;
    quotes: number;
    repair_orders: number;
    invoices: number;
    cessions: number;
  }> {
    const [expertises, quotes, repairOrders] = await Promise.all([
      supabase.from('expertise_reports').select('id', { count: 'exact' }).eq('dossier_id', dossierId),
      supabase.from('quotes').select('id', { count: 'exact' }).eq('dossier_id', dossierId),
      supabase.from('repair_orders').select('id', { count: 'exact' }).eq('dossier_id', dossierId)
    ]);

    // Récupérer les IDs des OR pour compter factures et cessions
    const { data: roData } = await supabase
      .from('repair_orders')
      .select('id')
      .eq('dossier_id', dossierId);

    let invoicesCount = 0;
    let cessionsCount = 0;

    if (roData && roData.length > 0) {
      const roIds = roData.map(ro => ro.id);
      const [invoices, cessions] = await Promise.all([
        supabase.from('invoices').select('id', { count: 'exact' }).in('repair_order_id', roIds),
        supabase.from('cessions').select('id', { count: 'exact' }).in('repair_order_id', roIds)
      ]);
      invoicesCount = invoices.count || 0;
      cessionsCount = cessions.count || 0;
    }

    return {
      expertises: expertises.count || 0,
      quotes: quotes.count || 0,
      repair_orders: repairOrders.count || 0,
      invoices: invoicesCount,
      cessions: cessionsCount
    };
  },

  // ===== Création automatique depuis autres entités =====

  async getOrCreateFromRepairOrder(repairOrderId: string): Promise<Dossier> {
    // Récupérer l'OR
    const { data: ro } = await supabase
      .from('repair_orders')
      .select('*, dossier_id')
      .eq('id', repairOrderId)
      .single();

    if (!ro) throw new Error('Repair order not found');

    // Si déjà un dossier, le retourner
    if (ro.dossier_id) {
      const dossier = await this.getById(ro.dossier_id);
      if (dossier) return dossier;
    }

    // Créer un nouveau dossier
    const dossier = await this.create({
      client_id: ro.client_id,
      vehicle_id: ro.vehicle_id,
      company_id: ro.company_id,
      claim_number: ro.claim_number,
      policy_number: ro.policy_number,
      incident_date: ro.incident_date,
      report_number: ro.report_number,
      expert_name: ro.expert_name
    });

    // Mettre à jour l'OR avec le dossier_id
    await supabase
      .from('repair_orders')
      .update({ dossier_id: dossier.id })
      .eq('id', repairOrderId);

    return dossier;
  }
};
```

### Étape 2.3 - Création des hooks

**Fichier: `src/hooks/use-dossiers.ts`**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dossiersService } from '@/services/supabase/dossiers';
import { NewDossier, UpdateDossier } from '@/types/dossier';
import { toast } from 'sonner';

export function useDossiers() {
  return useQuery({
    queryKey: ['dossiers'],
    queryFn: () => dossiersService.getAll()
  });
}

export function useDossier(id?: string) {
  return useQuery({
    queryKey: ['dossiers', id],
    queryFn: () => dossiersService.getById(id!),
    enabled: !!id
  });
}

export function useClientDossiers(clientId?: string) {
  return useQuery({
    queryKey: ['dossiers', 'client', clientId],
    queryFn: () => dossiersService.getByClientId(clientId!),
    enabled: !!clientId
  });
}

export function useVehicleDossier(vehicleId?: string) {
  return useQuery({
    queryKey: ['dossiers', 'vehicle', vehicleId],
    queryFn: () => dossiersService.getByVehicleId(vehicleId!),
    enabled: !!vehicleId
  });
}

export function useDossierTimeline(dossierId?: string) {
  return useQuery({
    queryKey: ['dossiers', dossierId, 'timeline'],
    queryFn: () => dossiersService.getTimeline(dossierId!),
    enabled: !!dossierId
  });
}

export function useDossierDocumentCounts(dossierId?: string) {
  return useQuery({
    queryKey: ['dossiers', dossierId, 'counts'],
    queryFn: () => dossiersService.getDocumentCounts(dossierId!),
    enabled: !!dossierId
  });
}

export function useCreateDossier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewDossier) => dossiersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dossiers'] });
      toast.success('Dossier créé avec succès');
    },
    onError: (error) => {
      console.error('Error creating dossier:', error);
      toast.error('Erreur lors de la création du dossier');
    }
  });
}

export function useUpdateDossier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDossier }) => 
      dossiersService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dossiers'] });
      queryClient.invalidateQueries({ queryKey: ['dossiers', variables.id] });
      toast.success('Dossier mis à jour');
    },
    onError: (error) => {
      console.error('Error updating dossier:', error);
      toast.error('Erreur lors de la mise à jour du dossier');
    }
  });
}

export function useArchiveDossier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dossiersService.archive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dossiers'] });
      toast.success('Dossier archivé');
    },
    onError: (error) => {
      console.error('Error archiving dossier:', error);
      toast.error('Erreur lors de l\'archivage du dossier');
    }
  });
}
```

### Étape 2.4 - Modification des services existants (Mode Hybride)

**Modifications à appliquer à chaque service :**

#### `src/services/supabase/repair-orders/queries.ts`

```typescript
// AJOUTER au select existant
const REPAIR_ORDER_SELECT = `
  *,
  dossier:dossiers(*),  // NOUVEAU
  client:clients(*),
  vehicle:vehicles(*),
  // ... reste inchangé
`;

// AJOUTER nouvelle méthode
async getByDossierId(dossierId: string): Promise<RepairOrder[]> {
  const { data, error } = await supabase
    .from('repair_orders')
    .select(REPAIR_ORDER_SELECT)
    .eq('dossier_id', dossierId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
```

#### `src/services/supabase/quotes.ts`

```typescript
// AJOUTER au select
const QUOTE_SELECT = `
  *,
  dossier:dossiers(*),  // NOUVEAU
  client:clients(*),
  // ... reste inchangé
`;

// AJOUTER nouvelle méthode
async getByDossierId(dossierId: string): Promise<Quote[]> {
  const { data, error } = await supabase
    .from('quotes')
    .select(QUOTE_SELECT)
    .eq('dossier_id', dossierId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
```

#### `src/services/supabase/cessions/queries.ts`

```typescript
// Le service cessions N'A PAS de dossier_id direct
// L'enrichissement passe par repair_order.dossier

const CESSION_SELECT = `
  *,
  repair_order:repair_orders(
    *,
    dossier:dossiers(*)  // NOUVEAU: accès indirect au dossier
  ),
  fleet_reservation:fleet_reservations(
    *,
    dossier:dossiers(*)  // NOUVEAU: accès indirect au dossier
  ),
  // ... reste inchangé
`;

// L'accès au dossier se fait via:
// cession.repair_order?.dossier
// OU cession.fleet_reservation?.dossier
```

---

## Phase 3 - Migration UI

### Étape 3.1 - Composant DossierSelector

**Fichier: `src/components/dossier/DossierSelector.tsx`**

```typescript
import React from 'react';
import { useClientDossiers } from '@/hooks/use-dossiers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Folder, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DossierSelectorProps {
  clientId?: string;
  value?: string;
  onChange: (dossierId: string) => void;
  onCreateNew?: () => void;
  disabled?: boolean;
  error?: string;
}

export function DossierSelector({
  clientId,
  value,
  onChange,
  onCreateNew,
  disabled,
  error
}: DossierSelectorProps) {
  const { data: dossiers, isLoading } = useClientDossiers(clientId);

  if (!clientId) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez d'abord un client" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <div className="space-y-2">
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className={error ? 'border-destructive' : ''}>
          <SelectValue placeholder="Sélectionner un dossier" />
        </SelectTrigger>
        <SelectContent>
          {dossiers?.map((dossier) => (
            <SelectItem key={dossier.id} value={dossier.id}>
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4" />
                <span>{dossier.reference}</span>
                {dossier.claim_number && (
                  <span className="text-muted-foreground text-xs">
                    ({dossier.claim_number})
                  </span>
                )}
                {dossier.incident_date && (
                  <span className="text-muted-foreground text-xs">
                    - {format(new Date(dossier.incident_date), 'dd/MM/yyyy', { locale: fr })}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
          
          {(!dossiers || dossiers.length === 0) && (
            <div className="p-2 text-center text-muted-foreground text-sm">
              Aucun dossier pour ce client
            </div>
          )}
        </SelectContent>
      </Select>

      {onCreateNew && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCreateNew}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Créer un nouveau dossier
        </Button>
      )}

      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}
    </div>
  );
}
```

### Étape 3.2 - Composant DossierCard

**Fichier: `src/components/dossier/DossierCard.tsx`**

```typescript
import React from 'react';
import { Dossier } from '@/types/dossier';
import { useDossierDocumentCounts } from '@/hooks/use-dossiers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Folder, 
  Car, 
  FileText, 
  Receipt, 
  Wrench,
  CreditCard 
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DossierCardProps {
  dossier: Dossier;
  onClick?: () => void;
}

const statusColors: Record<string, string> = {
  nouveau: 'bg-blue-100 text-blue-800',
  en_cours: 'bg-yellow-100 text-yellow-800',
  terminé: 'bg-green-100 text-green-800',
  archivé: 'bg-gray-100 text-gray-800'
};

const statusLabels: Record<string, string> = {
  nouveau: 'Nouveau',
  en_cours: 'En cours',
  terminé: 'Terminé',
  archivé: 'Archivé'
};

export function DossierCard({ dossier, onClick }: DossierCardProps) {
  const { data: counts } = useDossierDocumentCounts(dossier.id);

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{dossier.reference}</CardTitle>
          </div>
          <Badge className={statusColors[dossier.status]}>
            {statusLabels[dossier.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Véhicule */}
          {dossier.vehicle && (
            <div className="flex items-center gap-2 text-sm">
              <Car className="h-4 w-4 text-muted-foreground" />
              <span>
                {dossier.vehicle.brand} {dossier.vehicle.model} - {dossier.vehicle.license_plate}
              </span>
            </div>
          )}

          {/* Infos sinistre */}
          {dossier.claim_number && (
            <div className="text-sm text-muted-foreground">
              N° sinistre: {dossier.claim_number}
            </div>
          )}
          {dossier.incident_date && (
            <div className="text-sm text-muted-foreground">
              Date: {format(new Date(dossier.incident_date), 'dd MMMM yyyy', { locale: fr })}
            </div>
          )}

          {/* Compteurs documents */}
          {counts && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {counts.expertises > 0 && (
                <Badge variant="outline" className="text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  {counts.expertises} expertise{counts.expertises > 1 ? 's' : ''}
                </Badge>
              )}
              {counts.quotes > 0 && (
                <Badge variant="outline" className="text-xs">
                  <Receipt className="h-3 w-3 mr-1" />
                  {counts.quotes} devis
                </Badge>
              )}
              {counts.repair_orders > 0 && (
                <Badge variant="outline" className="text-xs">
                  <Wrench className="h-3 w-3 mr-1" />
                  {counts.repair_orders} OR
                </Badge>
              )}
              {counts.cessions > 0 && (
                <Badge variant="outline" className="text-xs">
                  <CreditCard className="h-3 w-3 mr-1" />
                  {counts.cessions} cession{counts.cessions > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

### Étape 3.3 - Modifications des formulaires existants

#### CessionForm - Conserver la logique actuelle

```typescript
// src/components/cessions/CessionForm.tsx
// 
// AUCUNE MODIFICATION MAJEURE REQUISE
// 
// Le formulaire continue d'utiliser repair_order_id et fleet_reservation_id
// L'accès au dossier se fait via ces entités parentes:
// - repair_order.dossier_id → pour récupérer les infos du sinistre
// - fleet_reservation.dossier_id → idem
//
// Modifications mineures suggérées:
// - Afficher la référence du dossier parent dans l'en-tête
// - Pré-remplir les champs sinistre depuis le dossier si disponibles
```

---

## Phase 4 - Nettoyage (Optionnel)

### Après validation complète (minimum 3 mois en production)

```sql
-- ============================================
-- MIGRATION FINALE: Nettoyage (OPTIONNEL)
-- ============================================
-- À EXÉCUTER UNIQUEMENT après validation complète

-- 1. Supprimer les colonnes dupliquées des repair_orders
-- ALTER TABLE public.repair_orders DROP COLUMN claim_number;
-- ALTER TABLE public.repair_orders DROP COLUMN policy_number;
-- ALTER TABLE public.repair_orders DROP COLUMN incident_date;
-- ALTER TABLE public.repair_orders DROP COLUMN report_number;
-- ALTER TABLE public.repair_orders DROP COLUMN expert_name;

-- 2. Supprimer les colonnes client_id/vehicle_id des tables (devenues redondantes)
-- Ces colonnes sont conservées pour rétrocompatibilité

-- NOTE: Cette phase est OPTIONNELLE et ne doit être exécutée que si:
-- - Tout le code utilise exclusivement dossier_id
-- - Les tests de non-régression sont passés
-- - Aucun système externe ne dépend de ces colonnes
```

---

## Stratégie de Rollback

### Rollback Phase 1 (Base de données)

```sql
-- Si problème après migration, restaurer l'état précédent

-- 1. Supprimer les nouvelles colonnes
ALTER TABLE public.expertise_reports DROP COLUMN IF EXISTS dossier_id;
ALTER TABLE public.quotes DROP COLUMN IF EXISTS dossier_id;
ALTER TABLE public.repair_orders DROP COLUMN IF EXISTS dossier_id;
ALTER TABLE public.fleet_reservations DROP COLUMN IF EXISTS dossier_id;
ALTER TABLE public.messageries DROP COLUMN IF EXISTS dossier_id;

-- 2. Supprimer la table dossiers
DROP TABLE IF EXISTS public.dossiers CASCADE;
```

### Rollback Phase 2 (Application)

```bash
# Revenir à la version précédente du code
git revert HEAD~N  # N = nombre de commits de migration

# Redéployer l'application
```

### Feature Flag pour basculement progressif

```typescript
// src/config/features.ts
export const FEATURES = {
  // Basculer à true pour activer le modèle dossier
  USE_DOSSIER_MODEL: false,
  
  // Afficher les dossiers dans l'UI
  SHOW_DOSSIERS_UI: false,
  
  // Créer automatiquement des dossiers
  AUTO_CREATE_DOSSIERS: false,
};
```

---

## Calendrier d'Exécution

| Jour | Phase | Actions |
|------|-------|---------|
| J1 | Préparation | Backup BD, validation scripts SQL |
| J1 | Phase 1.1 | Création table `dossiers` |
| J1 | Phase 1.2 | Ajout colonnes `dossier_id` |
| J2 | Phase 1.3 | Migration données existantes |
| J2 | Phase 1.4 | Validation migration BD |
| J3 | Phase 2.1-2.2 | Types + Service dossiers |
| J3 | Phase 2.3 | Hooks dossiers |
| J4 | Phase 2.4 | Modification services existants |
| J5 | Phase 3.1-3.2 | Composants UI dossier |
| J5 | Phase 3.3 | Modifications formulaires |
| J6 | Tests | Tests de non-régression complets |
| J7 | Déploiement | Mise en production (feature flag OFF) |
| J8-J14 | Validation | Activation progressive feature flag |
| J30+ | Phase 4 | Nettoyage (optionnel) |

---

## Checklist de Validation

### Pré-migration

- [ ] Backup complet de la base de données
- [ ] Scripts SQL testés en environnement de staging
- [ ] Code TypeScript compilé sans erreur
- [ ] Tests unitaires passés

### Post-migration Phase 1

- [ ] Table `dossiers` créée avec données
- [ ] Colonnes `dossier_id` ajoutées
- [ ] 100% des repair_orders ont un dossier_id
- [ ] Contraintes d'intégrité vérifiées

### Post-migration Phase 2

- [ ] Service dossiersService fonctionnel
- [ ] Hooks React fonctionnels
- [ ] Services existants en mode hybride
- [ ] Aucune régression sur les workflows existants

### Post-migration Phase 3

- [ ] Composants DossierSelector/DossierCard fonctionnels
- [ ] Navigation vers les dossiers opérationnelle
- [ ] Formulaires existants non impactés

### Validation Finale

- [ ] Workflow complet expertise → devis → OR → facture → cession
- [ ] Création de nouveau dossier
- [ ] Recherche et filtrage par dossier
- [ ] Performances acceptables (<500ms pour les requêtes principales)

---

## Annexes

### A. Mapping des champs sinistre

| Champ | Source actuelle | Source cible |
|-------|-----------------|--------------|
| `claim_number` | repair_orders, quotes, expertise_reports | dossiers |
| `policy_number` | repair_orders, cessions | dossiers |
| `incident_date` | repair_orders, cessions | dossiers |
| `incident_number` | cessions | dossiers |
| `report_number` | repair_orders | dossiers |
| `expert_name` | repair_orders | dossiers |
| `insurance_company_id` | cessions | dossiers |

### B. Requêtes de diagnostic

```sql
-- Dossiers sans documents
SELECT d.* FROM dossiers d
WHERE NOT EXISTS (SELECT 1 FROM repair_orders WHERE dossier_id = d.id)
  AND NOT EXISTS (SELECT 1 FROM quotes WHERE dossier_id = d.id)
  AND NOT EXISTS (SELECT 1 FROM expertise_reports WHERE dossier_id = d.id);

-- Documents sans dossier (après migration)
SELECT 'repair_orders' as type, COUNT(*) FROM repair_orders WHERE dossier_id IS NULL
UNION ALL
SELECT 'quotes', COUNT(*) FROM quotes WHERE dossier_id IS NULL
UNION ALL
SELECT 'expertise_reports', COUNT(*) FROM expertise_reports WHERE dossier_id IS NULL;

-- Statistiques par statut de dossier
SELECT status, COUNT(*) FROM dossiers GROUP BY status;
```
