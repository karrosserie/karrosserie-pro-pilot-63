# Plan de Migration - Architecture Dossier-Centrique

## Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Architecture Cible](#architecture-cible)
3. [Règles Métier Préservées](#règles-métier-préservées)
4. [Phase 1 - Migration Base de Données](#phase-1---migration-base-de-données)
5. [Phase 2 - Migration Application](#phase-2---migration-application)
6. [Phase 3 - Migration UI](#phase-3---migration-ui)
7. [Rollback](#stratégie-de-rollback)
8. [Calendrier](#calendrier-dexécution)

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

### Principe clé : Relations indirectes pour les factures

Les factures sont reliées au dossier **via l'ordre de réparation** existant, sans ajouter de colonne `dossier_id` :

```
Invoice.repair_order_id → Repair Order ← Dossier.repair_order_id
```

Cela évite la redondance et utilise les FK existantes.

### Principes de Migration

| Principe | Description |
|----------|-------------|
| **Aucune suppression** | Les colonnes existantes (`client_id`, `vehicle_id`) sont conservées |
| **Pas de colonnes redondantes** | On utilise les relations existantes plutôt que d'ajouter `dossier_id` partout |
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
    └──────────┘ │   (1:1)  │ └──────────┘ │   (1:1)  │ └──────────────────┘
                 └──────────┘              └────┬─────┘
                                                │
                                     ┌──────────┼────────┐
                                     │          │        │
                                     ▼          ▼        ▼
                              ┌──────────┐ ┌──────────┐
                              │ invoices │ │ cessions │
                              │ (via OR) │ │   (1:1)  │
                              └──────────┘ └──────────┘
```

### Relations Clés

| Relation | Type | Stockage |
|----------|------|----------|
| `clients` → `dossiers` | 1:N | `dossiers.client_id` |
| `dossiers` → `vehicles` | **1:1** | `dossiers.vehicle_id` |
| `dossiers` → `expertise_reports` | **1:1** | `dossiers.expertise_report_id` (UNIQUE) |
| `dossiers` → `quotes` | **1:1** | `dossiers.quote_id` (UNIQUE) |
| `dossiers` → `repair_orders` | **1:1** | `dossiers.repair_order_id` (UNIQUE) |
| `dossiers` → `cessions` | **1:1** | `dossiers.cession_id` (UNIQUE) |
| `dossiers` → `fleet_reservations` | **1:1** | `dossiers.fleet_reservation_id` (UNIQUE) |
| `dossiers` → `invoices` | 1:N | **Via `invoices.repair_order_id`** (relation indirecte) |

### Requêtes pour les factures d'un dossier

```sql
-- Trouver toutes les factures d'un dossier
SELECT i.* FROM invoices i
JOIN dossiers d ON d.repair_order_id = i.repair_order_id
WHERE d.id = :dossier_id;

-- Trouver le dossier d'une facture
SELECT d.* FROM dossiers d
WHERE d.repair_order_id = (SELECT repair_order_id FROM invoices WHERE id = :invoice_id);
```

---

## Règles Métier Préservées

### ✅ Invoices (Factures)

| Règle Actuelle | Statut | Implémentation |
|----------------|--------|----------------|
| Factures liées à un repair_order | ✅ Inchangé | `invoices.repair_order_id` (FK existante) |
| Accès au dossier depuis facture | ✅ Via JOIN | `JOIN dossiers ON dossiers.repair_order_id = invoices.repair_order_id` |
| Multiples factures possibles | ✅ Préservé | Relation 1:N via OR |

### ✅ Cessions

| Règle Actuelle | Statut | Implémentation |
|----------------|--------|----------------|
| Cession liée à un repair_order | ✅ Adapté | Via `dossiers.cession_id` (1:1) |
| Cession liée à fleet_reservation | ✅ Adapté | Via `dossiers.fleet_reservation_id` (1:1) |

### ✅ Quotes (Devis)

| Règle Actuelle | Statut | Implémentation |
|----------------|--------|----------------|
| Devis créé depuis expertise | ✅ Préservé | Via `dossiers.quote_id` (1:1) |
| Transformation en OR | ✅ Préservé | Mise à jour de `dossiers.repair_order_id` |

### ✅ Repair Orders

| Règle Actuelle | Statut | Implémentation |
|----------------|--------|----------------|
| OR lié à client + véhicule | ✅ Via dossier | `dossiers.client_id` + `dossiers.vehicle_id` |
| OR depuis devis | ✅ Préservé | Même dossier |

---

## Phase 1 - Migration Base de Données

### Étape 1.1 - Modification de la table `dossiers`

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

-- 4. Statut global du dossier
ALTER TABLE public.dossiers
  ADD COLUMN IF NOT EXISTS overall_status TEXT DEFAULT 'ouvert' 
    CHECK (overall_status IN ('ouvert', 'en_cours', 'expertise', 'devis', 'reparation', 'facturation', 'cloture', 'archive'));
```

### Étape 1.2 - Migration des données existantes

```sql
-- ============================================
-- MIGRATION 002: Population des relations 1:1
-- ============================================

-- 1. Lier les repair_orders aux dossiers
UPDATE public.dossiers d
SET repair_order_id = ro.id
FROM public.repair_orders ro
WHERE d.client_id = ro.client_id 
  AND d.vehicle_id = ro.vehicle_id
  AND d.repair_order_id IS NULL;

-- 2. Lier les devis aux dossiers
UPDATE public.dossiers d
SET quote_id = q.id
FROM public.quotes q
WHERE d.client_id = q.client_id 
  AND d.vehicle_id = q.vehicle_id
  AND d.quote_id IS NULL;

-- 3. Lier les expertises aux dossiers
UPDATE public.dossiers d
SET expertise_report_id = er.id
FROM public.expertise_reports er
WHERE d.client_id = er.client_id 
  AND d.vehicle_id = er.vehicle_id
  AND d.expertise_report_id IS NULL;

-- 4. Lier les cessions aux dossiers via repair_order_id
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
  AND d.fleet_reservation_id IS NULL;
```

### Étape 1.3 - Triggers de synchronisation

```sql
-- ============================================
-- MIGRATION 003: Triggers pour lier automatiquement les nouvelles entités
-- ============================================

-- Trigger pour lier un nouveau repair_order à son dossier
CREATE OR REPLACE FUNCTION link_repair_order_to_dossier()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE dossiers 
  SET repair_order_id = NEW.id, updated_at = now()
  WHERE client_id = NEW.client_id 
    AND vehicle_id = NEW.vehicle_id
    AND repair_order_id IS NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_repair_order_insert
AFTER INSERT ON repair_orders
FOR EACH ROW EXECUTE FUNCTION link_repair_order_to_dossier();

-- Trigger similaire pour quotes
CREATE OR REPLACE FUNCTION link_quote_to_dossier()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE dossiers 
  SET quote_id = NEW.id, updated_at = now()
  WHERE client_id = NEW.client_id 
    AND vehicle_id = NEW.vehicle_id
    AND quote_id IS NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_quote_insert
AFTER INSERT ON quotes
FOR EACH ROW EXECUTE FUNCTION link_quote_to_dossier();
```

---

## Phase 2 - Migration Application

### 2.1 Types TypeScript

```typescript
// src/types/dossier.ts
export interface Dossier {
  id: string;
  reference: string;
  company_id: string;
  client_id: string;
  vehicle_id: string;
  
  // Relations 1:1 (FK dans dossiers)
  expertise_report_id?: string;
  quote_id?: string;
  repair_order_id?: string;
  cession_id?: string;
  fleet_reservation_id?: string;
  
  // Informations du sinistre
  claim_number?: string;
  policy_number?: string;
  incident_date?: string;
  incident_number?: string;
  expert_name?: string;
  report_number?: string;
  insurance_company_id?: string;
  
  // Métadonnées
  status?: string;
  overall_status?: string;
  notes?: string;
  archived?: boolean;
  created_at: string;
  updated_at: string;
  
  // Relations jointes
  clients?: Client;
  vehicles?: Vehicle;
  expertise_reports?: ExpertiseReport;
  quotes?: Quote;
  repair_orders?: RepairOrder;
  cessions?: Cession;
  fleet_reservations?: FleetReservation;
  insurance_companies?: InsuranceCompany;
}

// Les factures sont récupérées séparément via repair_order_id
export interface DossierWithInvoices extends Dossier {
  invoices?: Invoice[]; // Chargées via JOIN sur repair_order_id
}
```

### 2.2 Service Dossiers

```typescript
// src/services/supabase/dossiers/queries.ts
export const dossiersQueries = {
  async getById(id: string): Promise<DossierWithInvoices> {
    // 1. Récupérer le dossier avec ses relations directes
    const { data: dossier } = await supabase
      .from('dossiers')
      .select(`
        *,
        clients (*),
        vehicles (*, car_brands(*), car_models(*)),
        expertise_reports (*),
        quotes (*),
        repair_orders (*),
        cessions (*),
        fleet_reservations (*),
        insurance_companies (*)
      `)
      .eq('id', id)
      .single();
    
    // 2. Récupérer les factures via repair_order_id (relation indirecte)
    let invoices: Invoice[] = [];
    if (dossier?.repair_order_id) {
      const { data } = await supabase
        .from('invoices')
        .select('*')
        .eq('repair_order_id', dossier.repair_order_id);
      invoices = data || [];
    }
    
    return { ...dossier, invoices };
  },

  async getInvoicesForDossier(dossierId: string): Promise<Invoice[]> {
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .eq('repair_order_id', 
        supabase.from('dossiers')
          .select('repair_order_id')
          .eq('id', dossierId)
          .single()
      );
    return data || [];
  }
};
```

---

## Phase 3 - Migration UI

### 3.1 Nouvelle page Dossiers
- Liste des dossiers avec filtres (statut, client, date)
- Vue détaillée d'un dossier avec tous ses documents
- Timeline des événements du dossier

### 3.2 Intégration dans les formulaires existants
- Lors de la création d'un devis/OR/facture, sélection ou création du dossier
- Auto-liaison au dossier existant si client + véhicule correspondent

---

## Stratégie de Rollback

```sql
-- En cas de problème, retirer les contraintes UNIQUE
ALTER TABLE dossiers DROP CONSTRAINT IF EXISTS unique_expertise_report_per_dossier;
ALTER TABLE dossiers DROP CONSTRAINT IF EXISTS unique_quote_per_dossier;
ALTER TABLE dossiers DROP CONSTRAINT IF EXISTS unique_repair_order_per_dossier;
ALTER TABLE dossiers DROP CONSTRAINT IF EXISTS unique_cession_per_dossier;
ALTER TABLE dossiers DROP CONSTRAINT IF EXISTS unique_fleet_reservation_per_dossier;

-- Les colonnes peuvent rester (nullable) sans impact
-- L'application continuera à fonctionner avec les relations existantes
```

---

## Calendrier d'Exécution

| Étape | Durée estimée | Risque |
|-------|---------------|--------|
| Phase 1.1 - ALTER TABLE | 5 min | Faible |
| Phase 1.2 - Migration données | 10-30 min | Moyen |
| Phase 1.3 - Triggers | 5 min | Faible |
| Phase 2 - Types & Services | 2h | Faible |
| Phase 3 - UI | 4-8h | Moyen |
| Tests & Validation | 2h | - |

---

## Checklist de Déploiement

- [ ] Backup de la base de données
- [ ] Exécuter Phase 1.1 (ALTER TABLE)
- [ ] Exécuter Phase 1.2 (Migration données)
- [ ] Vérifier les données migrées
- [ ] Créer les triggers Phase 1.3
- [ ] Déployer les types TypeScript
- [ ] Déployer le service dossiers
- [ ] Déployer la nouvelle UI
- [ ] Tests de non-régression
- [ ] Monitoring post-déploiement
