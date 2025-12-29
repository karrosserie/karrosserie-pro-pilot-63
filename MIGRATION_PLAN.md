# Plan de Migration - Architecture Dossier-Centrique

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

Restructurer l'application autour d'une entité **Dossier** (sinistre) qui centralise toutes les informations relatives à un accident/sinistre avec des **relations 1:1** strictes :

- Un **Dossier** représente un sinistre unique
- Un **Dossier** contient **exactement un** véhicule (le véhicule sinistré)
- Un **Dossier** contient **exactement un** rapport d'expertise
- Un **Dossier** contient **exactement un** devis
- Un **Dossier** contient **exactement un** ordre de réparation
- Un **Dossier** contient **exactement une** cession
- Un **Dossier** contient **exactement une** réservation de véhicule de prêt
- Un **Dossier** peut contenir **plusieurs** factures (1:N)
- Un **Dossier** peut contenir **plusieurs** messages (1:N)

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
                              │  dossiers   │ (sinistre)
                              └──────┬──────┘
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          │                          │                          │
          │         ┌────────────────┼────────────────┐         │
          │         │                │                │         │
          ▼         ▼                ▼                ▼         ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐
    │ vehicles │ │expertise │ │  quotes  │ │  repair  │ │ fleet_reservations│
    │   (1:1)  │ │ _reports │ │   (1:1)  │ │  orders  │ │       (1:1)       │
    └──────────┘ │   (1:1)  │ └──────────┘ │   (1:1)  │ └────────┬─────────┘
                 └──────────┘              └────┬─────┘          │
                                                │                │
                                     ┌──────────┼────────┐       │
                                     │          │        │       │
                                     ▼          ▼        ▼       │
                              ┌──────────┐ ┌──────────┐  │       │
                              │ invoices │ │ cessions │◄─┼───────┘
                              │   (1:N)  │ │   (1:1)  │  │
                              └──────────┘ └──────────┘  │
                                                         │
                                                  ┌──────────────┐
                                                  │  messageries │
                                                  │     (1:N)    │
                                                  └──────────────┘
```

### Relations Clés

| Relation | Type | Description |
|----------|------|-------------|
| `clients` → `dossiers` | 1:N | Un client peut avoir plusieurs sinistres |
| `dossiers` → `vehicles` | **1:1** | Un dossier = un véhicule sinistré |
| `dossiers` → `expertise_reports` | **1:1** | Un seul rapport d'expertise par sinistre |
| `dossiers` → `quotes` | **1:1** | Un seul devis par sinistre |
| `dossiers` → `repair_orders` | **1:1** | Un seul OR par sinistre |
| `dossiers` → `cessions` | **1:1** | Une seule cession par sinistre |
| `dossiers` → `fleet_reservations` | **1:1** | Une seule réservation de prêt par sinistre |
| `dossiers` → `invoices` | 1:N | **EXCEPTION** - Plusieurs factures possibles (acomptes, solde, franchise) |
| `dossiers` → `messageries` | 1:N | Plusieurs messages/conversations par dossier |

### Justification de l'Architecture 1:1

L'architecture 1:1 reflète la réalité métier d'un garage de réparation :

1. **Un sinistre = Un véhicule** : Un client peut avoir plusieurs véhicules, mais un sinistre concerne un seul véhicule à la fois
2. **Un sinistre = Un rapport** : L'expert produit un seul rapport pour un sinistre donné
3. **Un rapport = Un devis** : Le devis est directement dérivé du rapport d'expertise
4. **Un devis = Un OR** : L'ordre de réparation correspond au devis validé
5. **Un OR = Une cession** : La cession de créance correspond à un OR spécifique
6. **Un sinistre = Un prêt** : Le client reçoit un véhicule de prêt pendant la durée de réparation

**Exception pour les factures** : Un OR peut générer plusieurs factures (facture d'acompte, facture de solde, avoir pour franchise).

---

## Règles Métier Préservées

### ✅ Cessions

| Règle Actuelle | Statut | Implémentation Cible |
|----------------|--------|----------------------|
| Cession liée à un repair_order | ✅ Adapté | Via `dossier_id` (1:1) |
| Cession liée à une fleet_reservation | ✅ Adapté | Via `dossier_id` (1:1) - même dossier |
| Cession type `repair` / `repair_enterprise` | ✅ Préservé | Déterminé par présence de `repair_order_id` dans dossier |
| Cession type `fleet_loan` | ✅ Préservé | Déterminé par présence de `fleet_reservation_id` dans dossier |
| Statuts de cession | ✅ Préservé | Workflow inchangé |
| Validation données client/véhicule | ✅ Préservé | Via `dossier.client` et `dossier.vehicle` |

### ✅ Invoices (Factures)

| Règle Actuelle | Statut | Implémentation Cible |
|----------------|--------|----------------------|
| Factures liées à un repair_order | ✅ Adapté | Via `dossier_id` (1:N) |
| Calcul montants depuis OR | ✅ Préservé | Via `dossier.repair_order` |
| Statuts de facture | ✅ Préservé | Workflow inchangé |
| Multiples factures (acompte, solde) | ✅ Préservé | Relation 1:N maintenue |

### ✅ Quotes (Devis)

| Règle Actuelle | Statut | Implémentation Cible |
|----------------|--------|----------------------|
| Devis créé depuis expertise | ✅ Préservé | Via `dossier_id` (1:1) |
| Devis hérite du client/véhicule | ✅ Préservé | Via `dossier.client` et `dossier.vehicle` |
| Transformation en OR | ✅ Préservé | Création de `repair_order` dans le même dossier |

### ✅ Repair Orders (Ordres de Réparation)

| Règle Actuelle | Statut | Implémentation Cible |
|----------------|--------|----------------------|
| OR lié à client + véhicule | ✅ Adapté | Via `dossier_id` uniquement |
| OR depuis devis | ✅ Préservé | Même `dossier_id` que le devis source |
| Workflow statuts OR | ✅ Préservé | Inchangé |

### ✅ Vehicles (Véhicules)

| Règle Actuelle | Statut | Implémentation Cible |
|----------------|--------|----------------------|
| Véhicule lié à un client | ✅ Maintenu | `vehicle.client_id` conservé + `dossier.vehicle_id` |
| Un véhicule = plusieurs sinistres possibles | ✅ Adapté | Un nouveau dossier pour chaque sinistre |

---

## Phase 1 - Migration Base de Données

### Étape 1.1 - Modification de la table `dossiers` existante

La table `dossiers` existe déjà. Nous devons la modifier pour refléter l'architecture 1:1 :

```sql
-- ============================================
-- MIGRATION 001: Mise à jour table dossiers
-- ============================================

-- 1. Ajouter les références 1:1 vers les entités liées
ALTER TABLE public.dossiers 
  ADD COLUMN IF NOT EXISTS expertise_report_id UUID REFERENCES public.expertise_reports(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS quote_id UUID REFERENCES public.quotes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS repair_order_id UUID REFERENCES public.repair_orders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cession_id UUID REFERENCES public.cessions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS fleet_reservation_id UUID REFERENCES public.fleet_reservations(id) ON DELETE SET NULL;

-- 2. Créer les contraintes UNIQUE pour garantir le 1:1
ALTER TABLE public.dossiers 
  ADD CONSTRAINT unique_expertise_report_per_dossier UNIQUE (expertise_report_id),
  ADD CONSTRAINT unique_quote_per_dossier UNIQUE (quote_id),
  ADD CONSTRAINT unique_repair_order_per_dossier UNIQUE (repair_order_id),
  ADD CONSTRAINT unique_cession_per_dossier UNIQUE (cession_id),
  ADD CONSTRAINT unique_fleet_reservation_per_dossier UNIQUE (fleet_reservation_id);

-- 3. Index pour performances
CREATE INDEX IF NOT EXISTS idx_dossiers_expertise_report_id ON public.dossiers(expertise_report_id);
CREATE INDEX IF NOT EXISTS idx_dossiers_quote_id ON public.dossiers(quote_id);
CREATE INDEX IF NOT EXISTS idx_dossiers_repair_order_id ON public.dossiers(repair_order_id);
CREATE INDEX IF NOT EXISTS idx_dossiers_cession_id ON public.dossiers(cession_id);
CREATE INDEX IF NOT EXISTS idx_dossiers_fleet_reservation_id ON public.dossiers(fleet_reservation_id);

-- 4. Colonnes pour le statut global du dossier (déjà existantes potentiellement)
ALTER TABLE public.dossiers
  ADD COLUMN IF NOT EXISTS overall_status TEXT DEFAULT 'ouvert' 
    CHECK (overall_status IN ('ouvert', 'en_cours', 'expertise', 'devis', 'reparation', 'facturation', 'cloture', 'archive'));
```

### Étape 1.2 - Ajout de `dossier_id` aux tables existantes

```sql
-- ============================================
-- MIGRATION 002: Ajout dossier_id aux tables (références inverses optionnelles)
-- ============================================

-- Note: Ces colonnes permettent une navigation bidirectionnelle mais 
-- la source de vérité est dans la table dossiers

-- 1. Table invoices (relation 1:N - seule exception)
ALTER TABLE public.invoices 
  ADD COLUMN IF NOT EXISTS dossier_id UUID REFERENCES public.dossiers(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_invoices_dossier_id ON public.invoices(dossier_id);

-- 2. Table messageries (relation 1:N)
ALTER TABLE public.messageries 
  ADD COLUMN IF NOT EXISTS dossier_id UUID REFERENCES public.dossiers(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_messageries_dossier_id ON public.messageries(dossier_id);

-- Note: Les tables expertise_reports, quotes, repair_orders, cessions, fleet_reservations
-- n'ont PAS besoin de dossier_id car la relation 1:1 est stockée dans la table dossiers
-- (chaque entité est référencée par son ID dans dossiers)
```

### Étape 1.3 - Migration des données existantes

```sql
-- ============================================
-- MIGRATION 003: Population des dossiers avec relations 1:1
-- ============================================

-- Stratégie: Pour chaque repair_order existant, créer ou mettre à jour un dossier
-- en liant tous les documents associés

-- 1. Créer les dossiers depuis les repair_orders existants (source principale)
INSERT INTO public.dossiers (
  client_id,
  vehicle_id,
  company_id,
  repair_order_id,
  claim_number,
  policy_number,
  incident_date,
  report_number,
  expert_name,
  overall_status,
  created_at
)
SELECT 
  ro.client_id,
  ro.vehicle_id,
  ro.company_id,
  ro.id as repair_order_id,
  ro.claim_number,
  ro.policy_number,
  ro.incident_date,
  ro.report_number,
  ro.expert_name,
  CASE 
    WHEN ro.status = 'completed' THEN 'cloture'
    WHEN ro.status IN ('cancelled', 'archived') THEN 'archive'
    WHEN ro.status = 'invoiced' THEN 'facturation'
    ELSE 'reparation'
  END as overall_status,
  ro.created_at
FROM public.repair_orders ro
WHERE ro.client_id IS NOT NULL 
  AND ro.vehicle_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.dossiers d WHERE d.repair_order_id = ro.id
  );

-- 2. Lier les devis aux dossiers via quote_id
UPDATE public.dossiers d
SET quote_id = q.id
FROM public.quotes q
WHERE d.repair_order_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.repair_orders ro 
    WHERE ro.id = d.repair_order_id AND ro.quote_id = q.id
  )
  AND d.quote_id IS NULL;

-- 3. Lier les expertises aux dossiers via expertise_report_id
UPDATE public.dossiers d
SET expertise_report_id = er.id
FROM public.expertise_reports er
JOIN public.quotes q ON q.source_report_id = er.id
WHERE d.quote_id = q.id
  AND d.expertise_report_id IS NULL;

-- 4. Lier les cessions aux dossiers via cession_id
UPDATE public.dossiers d
SET cession_id = c.id
FROM public.cessions c
WHERE c.repair_order_id = d.repair_order_id
  AND d.cession_id IS NULL;

-- 5. Lier les fleet_reservations aux dossiers
UPDATE public.dossiers d
SET fleet_reservation_id = fr.id
FROM public.fleet_reservations fr
WHERE fr.client_id = d.client_id 
  AND fr.vehicle_id = d.vehicle_id
  AND d.fleet_reservation_id IS NULL;

-- 6. Mettre à jour les factures avec dossier_id
UPDATE public.invoices inv
SET dossier_id = d.id
FROM public.dossiers d
WHERE inv.repair_order_id = d.repair_order_id
  AND inv.dossier_id IS NULL;

-- 7. Enrichir les dossiers avec insurance_company_id depuis cessions
UPDATE public.dossiers d
SET insurance_company_id = c.insurance_company_id,
    incident_number = COALESCE(d.incident_number, c.incident_number)
FROM public.cessions c
WHERE d.cession_id = c.id
  AND c.insurance_company_id IS NOT NULL
  AND d.insurance_company_id IS NULL;
```

### Étape 1.4 - Triggers pour maintenir la cohérence

```sql
-- ============================================
-- MIGRATION 004: Triggers de cohérence
-- ============================================

-- Trigger pour mettre à jour le statut global du dossier
CREATE OR REPLACE FUNCTION update_dossier_status()
RETURNS TRIGGER AS $$
DECLARE
  v_dossier_id UUID;
  v_new_status TEXT;
BEGIN
  -- Trouver le dossier associé
  SELECT id INTO v_dossier_id
  FROM public.dossiers
  WHERE repair_order_id = NEW.id
     OR quote_id = NEW.id
     OR expertise_report_id = NEW.id
     OR cession_id = NEW.id;
  
  IF v_dossier_id IS NOT NULL THEN
    -- Déterminer le nouveau statut basé sur les entités présentes
    SELECT 
      CASE
        WHEN d.cession_id IS NOT NULL AND c.status = 'paid' THEN 'cloture'
        WHEN EXISTS (SELECT 1 FROM invoices i WHERE i.dossier_id = d.id AND i.status = 'paid') THEN 'cloture'
        WHEN EXISTS (SELECT 1 FROM invoices i WHERE i.dossier_id = d.id) THEN 'facturation'
        WHEN d.repair_order_id IS NOT NULL THEN 'reparation'
        WHEN d.quote_id IS NOT NULL THEN 'devis'
        WHEN d.expertise_report_id IS NOT NULL THEN 'expertise'
        ELSE 'ouvert'
      END INTO v_new_status
    FROM public.dossiers d
    LEFT JOIN public.cessions c ON c.id = d.cession_id
    WHERE d.id = v_dossier_id;
    
    UPDATE public.dossiers
    SET overall_status = v_new_status,
        updated_at = now()
    WHERE id = v_dossier_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Étape 1.5 - Validation de la migration

```sql
-- ============================================
-- VALIDATION: Vérifications post-migration
-- ============================================

-- 1. Vérifier les contraintes 1:1 (pas de doublons)
SELECT 'repair_orders dupliqués' as issue, repair_order_id, COUNT(*) 
FROM public.dossiers 
WHERE repair_order_id IS NOT NULL
GROUP BY repair_order_id 
HAVING COUNT(*) > 1;

SELECT 'quotes dupliqués' as issue, quote_id, COUNT(*) 
FROM public.dossiers 
WHERE quote_id IS NOT NULL
GROUP BY quote_id 
HAVING COUNT(*) > 1;

-- 2. Vérifier la cohérence des données
SELECT 
  'Dossiers total' as metric, COUNT(*) as count FROM public.dossiers
UNION ALL
SELECT 
  'Dossiers avec OR' as metric, COUNT(*) FROM public.dossiers WHERE repair_order_id IS NOT NULL
UNION ALL
SELECT 
  'Dossiers avec devis' as metric, COUNT(*) FROM public.dossiers WHERE quote_id IS NOT NULL
UNION ALL
SELECT 
  'Dossiers avec expertise' as metric, COUNT(*) FROM public.dossiers WHERE expertise_report_id IS NOT NULL
UNION ALL
SELECT 
  'Dossiers avec cession' as metric, COUNT(*) FROM public.dossiers WHERE cession_id IS NOT NULL
UNION ALL
SELECT 
  'Factures avec dossier' as metric, COUNT(*) FROM public.invoices WHERE dossier_id IS NOT NULL;

-- 3. Orphelins (entités sans dossier)
SELECT 'repair_orders orphelins' as issue, COUNT(*) 
FROM public.repair_orders ro
WHERE NOT EXISTS (SELECT 1 FROM public.dossiers d WHERE d.repair_order_id = ro.id);
```

---

## Phase 2 - Migration Application

### Étape 2.1 - Types TypeScript mis à jour

**Fichier: `src/types/dossier.ts`**

```typescript
import { Client } from '@/services/supabase/clients';
import { Vehicle } from '@/services/supabase/vehicles';
import { InsuranceCompany } from '@/services/supabase/insurance-companies';
import { RepairOrder } from '@/types/repair-order';
import { Quote } from '@/types/quote';
import { ExpertiseReport } from '@/types/expertise-report';
import { Cession } from '@/types/cession';
import { FleetReservation } from '@/types/fleet-reservation';
import { Invoice } from '@/types/invoice';

export type DossierStatus = 
  | 'ouvert' 
  | 'en_cours' 
  | 'expertise' 
  | 'devis' 
  | 'reparation' 
  | 'facturation' 
  | 'cloture' 
  | 'archive';

export interface Dossier {
  id: string;
  reference: string;
  
  // Relations principales
  client_id: string | null;
  vehicle_id: string | null;
  company_id: string;
  
  // Relations 1:1 (stockées dans dossiers)
  expertise_report_id: string | null;
  quote_id: string | null;
  repair_order_id: string | null;
  cession_id: string | null;
  fleet_reservation_id: string | null;
  
  // Informations sinistre (centralisées)
  claim_number: string | null;
  policy_number: string | null;
  incident_date: string | null;
  incident_number: string | null;
  report_number: string | null;
  expert_name: string | null;
  insurance_company_id: string | null;
  
  // Métadonnées
  overall_status: DossierStatus;
  archived: boolean;
  notes: string | null;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Relations chargées (optionnelles)
  client?: Client;
  vehicle?: Vehicle;
  insurance_company?: InsuranceCompany;
  expertise_report?: ExpertiseReport;
  quote?: Quote;
  repair_order?: RepairOrder;
  cession?: Cession;
  fleet_reservation?: FleetReservation;
  invoices?: Invoice[];
}

export interface DossierWithRelations extends Dossier {
  client: Client;
  vehicle: Vehicle;
  expertise_report?: ExpertiseReport;
  quote?: Quote;
  repair_order?: RepairOrder;
  cession?: Cession;
  fleet_reservation?: FleetReservation;
  invoices: Invoice[];
}

export interface CreateDossier {
  client_id: string;
  vehicle_id?: string | null;
  company_id: string;
  claim_number?: string | null;
  policy_number?: string | null;
  incident_date?: string | null;
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
  overall_status?: DossierStatus;
  archived?: boolean;
  notes?: string | null;
  
  // Mise à jour des relations 1:1
  expertise_report_id?: string | null;
  quote_id?: string | null;
  repair_order_id?: string | null;
  cession_id?: string | null;
  fleet_reservation_id?: string | null;
}

// Type pour la timeline du dossier
export interface DossierTimelineEvent {
  id: string;
  type: 'creation' | 'expertise' | 'quote' | 'repair_order' | 'invoice' | 'cession' | 'fleet_loan' | 'message' | 'status_change';
  title: string;
  description?: string;
  status?: string;
  amount?: number;
  created_at: string;
  entity_id?: string;
}
```

### Étape 2.2 - Service `dossiersService` mis à jour

**Fichier: `src/services/supabase/dossiers.ts`**

```typescript
import { supabase } from '@/integrations/supabase/client';
import { 
  Dossier, 
  DossierWithRelations, 
  CreateDossier, 
  UpdateDossier, 
  DossierTimelineEvent 
} from '@/types/dossier';

const DOSSIER_SELECT = `
  *,
  client:clients(*),
  vehicle:vehicles(*),
  insurance_company:insurance_companies(*),
  expertise_report:expertise_reports(*),
  quote:quotes(*),
  repair_order:repair_orders(*),
  cession:cessions(*),
  fleet_reservation:fleet_reservations(*)
`;

const DOSSIER_WITH_INVOICES_SELECT = `
  ${DOSSIER_SELECT},
  invoices:invoices(*)
`;

export const dossiersService = {
  // ===== CRUD de base =====
  
  async getAll(companyId: string): Promise<Dossier[]> {
    const { data, error } = await supabase
      .from('dossiers')
      .select(DOSSIER_SELECT)
      .eq('company_id', companyId)
      .eq('archived', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<DossierWithRelations | null> {
    const { data, error } = await supabase
      .from('dossiers')
      .select(DOSSIER_WITH_INVOICES_SELECT)
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
      .eq('archived', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getByVehicleId(vehicleId: string): Promise<Dossier[]> {
    const { data, error } = await supabase
      .from('dossiers')
      .select(DOSSIER_SELECT)
      .eq('vehicle_id', vehicleId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Trouver le dossier par une de ses entités 1:1
  async getByRepairOrderId(repairOrderId: string): Promise<Dossier | null> {
    const { data, error } = await supabase
      .from('dossiers')
      .select(DOSSIER_SELECT)
      .eq('repair_order_id', repairOrderId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  async getByQuoteId(quoteId: string): Promise<Dossier | null> {
    const { data, error } = await supabase
      .from('dossiers')
      .select(DOSSIER_SELECT)
      .eq('quote_id', quoteId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  async getByExpertiseReportId(reportId: string): Promise<Dossier | null> {
    const { data, error } = await supabase
      .from('dossiers')
      .select(DOSSIER_SELECT)
      .eq('expertise_report_id', reportId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  async create(dossier: CreateDossier): Promise<Dossier> {
    const { data, error } = await supabase
      .from('dossiers')
      .insert({
        ...dossier,
        overall_status: 'ouvert'
      })
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
    return this.update(id, { archived: true, overall_status: 'archive' });
  },

  // ===== Liaison des entités 1:1 =====

  async linkExpertiseReport(dossierId: string, reportId: string): Promise<Dossier> {
    return this.update(dossierId, { expertise_report_id: reportId });
  },

  async linkQuote(dossierId: string, quoteId: string): Promise<Dossier> {
    return this.update(dossierId, { quote_id: quoteId });
  },

  async linkRepairOrder(dossierId: string, repairOrderId: string): Promise<Dossier> {
    return this.update(dossierId, { repair_order_id: repairOrderId });
  },

  async linkCession(dossierId: string, cessionId: string): Promise<Dossier> {
    return this.update(dossierId, { cession_id: cessionId });
  },

  async linkFleetReservation(dossierId: string, reservationId: string): Promise<Dossier> {
    return this.update(dossierId, { fleet_reservation_id: reservationId });
  },

  // ===== Timeline =====

  async getTimeline(dossierId: string): Promise<DossierTimelineEvent[]> {
    const dossier = await this.getById(dossierId);
    if (!dossier) return [];

    const events: DossierTimelineEvent[] = [];

    // Événement de création
    events.push({
      id: `creation-${dossier.id}`,
      type: 'creation',
      title: 'Dossier créé',
      description: `Référence: ${dossier.reference}`,
      created_at: dossier.created_at
    });

    // Expertise
    if (dossier.expertise_report) {
      events.push({
        id: dossier.expertise_report.id,
        type: 'expertise',
        title: 'Rapport d\'expertise',
        status: dossier.expertise_report.status,
        created_at: dossier.expertise_report.created_at,
        entity_id: dossier.expertise_report.id
      });
    }

    // Devis
    if (dossier.quote) {
      events.push({
        id: dossier.quote.id,
        type: 'quote',
        title: `Devis ${dossier.quote.reference}`,
        status: dossier.quote.status,
        amount: dossier.quote.total_ttc,
        created_at: dossier.quote.created_at,
        entity_id: dossier.quote.id
      });
    }

    // Ordre de réparation
    if (dossier.repair_order) {
      events.push({
        id: dossier.repair_order.id,
        type: 'repair_order',
        title: `OR ${dossier.repair_order.reference}`,
        status: dossier.repair_order.status,
        amount: dossier.repair_order.total_ttc,
        created_at: dossier.repair_order.created_at,
        entity_id: dossier.repair_order.id
      });
    }

    // Factures (1:N)
    dossier.invoices?.forEach(inv => {
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

    // Cession
    if (dossier.cession) {
      events.push({
        id: dossier.cession.id,
        type: 'cession',
        title: `Cession ${dossier.cession.reference}`,
        status: dossier.cession.status,
        created_at: dossier.cession.created_at,
        entity_id: dossier.cession.id
      });
    }

    // Prêt véhicule
    if (dossier.fleet_reservation) {
      events.push({
        id: dossier.fleet_reservation.id,
        type: 'fleet_loan',
        title: 'Véhicule de prêt',
        status: dossier.fleet_reservation.status,
        created_at: dossier.fleet_reservation.created_at,
        entity_id: dossier.fleet_reservation.id
      });
    }

    // Trier par date
    return events.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  // ===== Statistiques =====

  async getStats(companyId: string): Promise<{
    total: number;
    byStatus: Record<string, number>;
  }> {
    const { data, error } = await supabase
      .from('dossiers')
      .select('overall_status')
      .eq('company_id', companyId)
      .eq('archived', false);

    if (error) throw error;

    const byStatus: Record<string, number> = {};
    data?.forEach(d => {
      byStatus[d.overall_status] = (byStatus[d.overall_status] || 0) + 1;
    });

    return {
      total: data?.length || 0,
      byStatus
    };
  }
};
```

### Étape 2.3 - Hooks mis à jour

**Fichier: `src/hooks/use-dossiers.ts`**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dossiersService } from '@/services/supabase/dossiers';
import { CreateDossier, UpdateDossier } from '@/types/dossier';
import { useCompany } from '@/hooks/use-company';
import { toast } from 'sonner';

export function useDossiers() {
  const { company } = useCompany();
  
  return useQuery({
    queryKey: ['dossiers', company?.id],
    queryFn: () => dossiersService.getAll(company!.id),
    enabled: !!company?.id
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

export function useDossierByRepairOrder(repairOrderId?: string) {
  return useQuery({
    queryKey: ['dossiers', 'repair_order', repairOrderId],
    queryFn: () => dossiersService.getByRepairOrderId(repairOrderId!),
    enabled: !!repairOrderId
  });
}

export function useDossierByQuote(quoteId?: string) {
  return useQuery({
    queryKey: ['dossiers', 'quote', quoteId],
    queryFn: () => dossiersService.getByQuoteId(quoteId!),
    enabled: !!quoteId
  });
}

export function useDossierTimeline(dossierId?: string) {
  return useQuery({
    queryKey: ['dossiers', dossierId, 'timeline'],
    queryFn: () => dossiersService.getTimeline(dossierId!),
    enabled: !!dossierId
  });
}

export function useDossierStats() {
  const { company } = useCompany();
  
  return useQuery({
    queryKey: ['dossiers', 'stats', company?.id],
    queryFn: () => dossiersService.getStats(company!.id),
    enabled: !!company?.id
  });
}

export function useCreateDossier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDossier) => dossiersService.create(data),
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

export function useLinkEntityToDossier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      dossierId, 
      entityType, 
      entityId 
    }: { 
      dossierId: string; 
      entityType: 'expertise_report' | 'quote' | 'repair_order' | 'cession' | 'fleet_reservation';
      entityId: string;
    }) => {
      switch (entityType) {
        case 'expertise_report':
          return dossiersService.linkExpertiseReport(dossierId, entityId);
        case 'quote':
          return dossiersService.linkQuote(dossierId, entityId);
        case 'repair_order':
          return dossiersService.linkRepairOrder(dossierId, entityId);
        case 'cession':
          return dossiersService.linkCession(dossierId, entityId);
        case 'fleet_reservation':
          return dossiersService.linkFleetReservation(dossierId, entityId);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dossiers'] });
      queryClient.invalidateQueries({ queryKey: ['dossiers', variables.dossierId] });
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

---

## Phase 3 - Migration UI

### Étape 3.1 - Page Dossiers

**Route**: `/dossiers`

La page dossiers affiche la liste de tous les dossiers avec :
- Filtres par statut (ouvert, en_cours, expertise, devis, reparation, facturation, cloture)
- Recherche par référence, client, véhicule
- Vue cards ou tableau
- Accès rapide au détail du dossier

### Étape 3.2 - Vue Détail Dossier

La vue détail d'un dossier affiche :

1. **En-tête** : Référence, statut, client, véhicule
2. **Informations sinistre** : Numéro sinistre, date, assurance, expert
3. **Documents liés** (1:1) :
   - Carte Expertise (si `expertise_report_id`)
   - Carte Devis (si `quote_id`)
   - Carte OR (si `repair_order_id`)
   - Carte Cession (si `cession_id`)
   - Carte Prêt véhicule (si `fleet_reservation_id`)
4. **Factures** (1:N) : Liste des factures
5. **Timeline** : Historique chronologique
6. **Actions** : Créer expertise, créer devis, créer OR, etc.

### Étape 3.3 - Intégration dans les formulaires existants

Chaque formulaire de création (expertise, devis, OR, cession) doit :

1. **Recevoir un `dossier_id` optionnel** comme prop
2. **Si `dossier_id` fourni** : Pré-remplir client/véhicule depuis le dossier
3. **Après création** : Mettre à jour automatiquement le dossier avec l'ID de l'entité créée

```typescript
// Exemple: Création d'un OR depuis un dossier
async function createRepairOrderForDossier(dossierId: string, roData: CreateRepairOrder) {
  // 1. Créer l'OR
  const repairOrder = await repairOrdersService.create(roData);
  
  // 2. Lier au dossier
  await dossiersService.linkRepairOrder(dossierId, repairOrder.id);
  
  return repairOrder;
}
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
-- (claim_number, policy_number, etc. sont maintenant dans dossiers)
-- ALTER TABLE public.repair_orders DROP COLUMN claim_number;
-- ALTER TABLE public.repair_orders DROP COLUMN policy_number;
-- ALTER TABLE public.repair_orders DROP COLUMN incident_date;
-- ALTER TABLE public.repair_orders DROP COLUMN report_number;
-- ALTER TABLE public.repair_orders DROP COLUMN expert_name;

-- 2. Supprimer les colonnes client_id/vehicle_id redondantes
-- (devenues optionnelles car héritées du dossier)
-- NOTE: Conserver pour rétrocompatibilité sauf si 100% migré

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

-- 1. Supprimer les nouvelles colonnes de dossiers
ALTER TABLE public.dossiers 
  DROP COLUMN IF EXISTS expertise_report_id,
  DROP COLUMN IF EXISTS quote_id,
  DROP COLUMN IF EXISTS repair_order_id,
  DROP COLUMN IF EXISTS cession_id,
  DROP COLUMN IF EXISTS fleet_reservation_id,
  DROP COLUMN IF EXISTS overall_status;

-- 2. Supprimer dossier_id des tables liées
ALTER TABLE public.invoices DROP COLUMN IF EXISTS dossier_id;
ALTER TABLE public.messageries DROP COLUMN IF EXISTS dossier_id;
```

### Feature Flag pour basculement progressif

```typescript
// src/config/features.ts
export const FEATURES = {
  // Basculer à true pour activer le modèle dossier
  USE_DOSSIER_MODEL: false,
  
  // Afficher les dossiers dans l'UI
  SHOW_DOSSIERS_UI: false,
  
  // Créer automatiquement des dossiers à partir des entités
  AUTO_CREATE_DOSSIERS: false,
  
  // Exiger un dossier pour créer un OR/devis
  REQUIRE_DOSSIER_FOR_DOCUMENTS: false,
};
```

---

## Calendrier d'Exécution

| Jour | Phase | Actions |
|------|-------|---------|
| J1 | Préparation | Backup BD, validation scripts SQL |
| J1 | Phase 1.1 | Modification table `dossiers` |
| J1 | Phase 1.2 | Ajout `dossier_id` aux tables |
| J2 | Phase 1.3 | Migration données existantes |
| J2 | Phase 1.4-1.5 | Triggers + Validation migration BD |
| J3 | Phase 2.1-2.2 | Types + Service dossiers |
| J3 | Phase 2.3 | Hooks dossiers |
| J4 | Phase 3.1-3.2 | Page + Vue détail dossier |
| J5 | Phase 3.3 | Intégration formulaires |
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

- [ ] Table `dossiers` mise à jour avec colonnes 1:1
- [ ] Contraintes UNIQUE en place
- [ ] Données migrées avec relations 1:1 correctes
- [ ] Aucune violation de contrainte

### Post-migration Phase 2

- [ ] Service dossiersService fonctionnel
- [ ] Hooks React fonctionnels
- [ ] Liaison automatique des entités au dossier
- [ ] Aucune régression sur les workflows existants

### Post-migration Phase 3

- [ ] Page /dossiers fonctionnelle
- [ ] Vue détail dossier avec toutes les cartes
- [ ] Navigation bidirectionnelle (dossier ↔ entités)
- [ ] Formulaires intégrés avec dossier_id

### Validation Finale

- [ ] Workflow complet : Dossier → Expertise → Devis → OR → Facture → Cession
- [ ] Relations 1:1 respectées (pas de doublons)
- [ ] Timeline chronologique correcte
- [ ] Performances acceptables (<500ms pour les requêtes principales)

---

## Diagramme des Flux

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              CRÉATION D'UN DOSSIER                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. Client arrive avec un sinistre                                           │
│     └─> CRÉER DOSSIER (client_id, vehicle_id, infos sinistre)                │
│                                                                              │
│  2. Expertise demandée                                                        │
│     └─> CRÉER EXPERTISE → LIER AU DOSSIER (expertise_report_id)              │
│                                                                              │
│  3. Devis généré                                                              │
│     └─> CRÉER DEVIS (depuis expertise) → LIER AU DOSSIER (quote_id)          │
│                                                                              │
│  4. Devis accepté                                                             │
│     └─> CRÉER OR (depuis devis) → LIER AU DOSSIER (repair_order_id)          │
│                                                                              │
│  5. Prêt de véhicule                                                          │
│     └─> CRÉER RÉSERVATION → LIER AU DOSSIER (fleet_reservation_id)           │
│                                                                              │
│  6. Réparation terminée                                                       │
│     └─> CRÉER FACTURE(S) → LIER AU DOSSIER (via dossier_id dans invoice)     │
│                                                                              │
│  7. Cession de créance                                                        │
│     └─> CRÉER CESSION → LIER AU DOSSIER (cession_id)                         │
│                                                                              │
│  8. Paiement reçu                                                             │
│     └─> CLÔTURER DOSSIER (overall_status = 'cloture')                        │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```
