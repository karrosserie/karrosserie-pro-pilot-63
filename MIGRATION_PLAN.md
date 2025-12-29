# Plan de Migration - Architecture Dossier-Centrique

## Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [État Actuel de la Base de Données](#état-actuel-de-la-base-de-données)
3. [Architecture Cible](#architecture-cible)
4. [Gestion des Messageries](#gestion-des-messageries)
5. [Nettoyage des Références Bidirectionnelles](#nettoyage-des-références-bidirectionnelles)
6. [Compatibilité n8n et Edge Functions](#compatibilité-n8n-et-edge-functions)
7. [Phase 0 - Clarification Documentation](#phase-0---clarification-documentation)
8. [Phase 1 - Migration Base de Données](#phase-1---migration-base-de-données)
9. [Phase 2 - Migration Application](#phase-2---migration-application)
10. [Phase 3 - Migration Edge Functions](#phase-3---migration-edge-functions)
11. [Phase 4 - Migration UI](#phase-4---migration-ui)
12. [Rollback](#stratégie-de-rollback)
13. [Calendrier](#calendrier-dexécution)

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
- Un **Dossier** peut avoir **plusieurs** messageries (1:N via `dossier_id` direct)

### Principe clé : Relations directes vs indirectes

| Entité | Type de relation | Méthode |
|--------|------------------|---------|
| `vehicles` | 1:1 | `dossiers.vehicle_id` |
| `expertise_reports` | 1:1 | `dossiers.expertise_report_id` |
| `quotes` | 1:1 | `dossiers.quote_id` |
| `repair_orders` | 1:1 | `dossiers.repair_order_id` |
| `cessions` | 1:1 | `dossiers.cession_id` |
| `fleet_reservations` | 1:1 | `dossiers.fleet_reservation_id` |
| **`invoices`** | 1:N **indirect** | Via `invoices.repair_order_id → dossiers.repair_order_id` |
| **`messageries`** | 1:N **direct** | `messageries.dossier_id` (FK existante) |

### Principes de Migration

| Principe | Description |
|----------|-------------|
| **Aucune suppression de données** | Les colonnes existantes (`client_id`, `vehicle_id`) sont conservées |
| **Pas de colonnes redondantes** | On utilise les relations existantes pour les factures |
| **Nettoyage bidirectionnel** | Supprimer les colonnes `dossier_id` redondantes des tables enfants |
| **Rétrocompatibilité** | Les fonctionnalités existantes continuent de fonctionner |
| **Feature flag** | Basculement progressif via configuration |
| **Migration données** | Script automatique pour créer les dossiers existants |

---

## État Actuel de la Base de Données

### ✅ Ce qui existe déjà

La table `dossiers` possède déjà les colonnes FK suivantes :

```sql
-- Colonnes existantes dans dossiers (déjà présentes)
expertise_report_id UUID  -- FK vers expertise_reports
quote_id UUID             -- FK vers quotes  
repair_order_id UUID      -- FK vers repair_orders
cession_id UUID           -- FK vers cessions
fleet_reservation_id UUID -- FK vers fleet_reservations
overall_status TEXT       -- Statut global du dossier
```

### ⚠️ Ce qui manque

1. **Contraintes UNIQUE manquantes** - Les colonnes 1:1 n'ont pas de contrainte UNIQUE
2. **Index manquants** - Pas d'index sur les colonnes FK
3. **Triggers manquants** - Pas d'auto-linking lors de la création d'entités

### 🔄 Références Bidirectionnelles Existantes (À SUPPRIMER)

La base de données a des références DANS LES DEUX SENS créant de la redondance :

| Table | Colonne `dossier_id` | Action |
|-------|---------------------|--------|
| `expertise_reports` | ✅ Existe | ❌ **À SUPPRIMER** |
| `quotes` | ✅ Existe | ❌ **À SUPPRIMER** |
| `repair_orders` | ✅ Existe | ❌ **À SUPPRIMER** |
| `fleet_reservations` | ✅ Existe | ❌ **À SUPPRIMER** |
| `messageries` | ✅ Existe | ✅ **À GARDER** (relation 1:N directe) |
| `cessions` | ❌ N'existe pas | - |
| `invoices` | ❌ N'existe pas | Relation via `repair_order_id` |

**Pourquoi supprimer ?** Ces colonnes `dossier_id` sont redondantes car :
- `dossiers.repair_order_id` suffit pour trouver le dossier d'un OR
- La bidirectionnalité crée un risque de désynchronisation
- Une seule source de vérité est plus maintenable

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
                              ┌──────────┐ ┌──────────┐ ┌────────────┐
                              │ invoices │ │ cessions │ │ messageries│
                              │ (via OR) │ │   (1:1)  │ │    (1:N)   │
                              └──────────┘ └──────────┘ └────────────┘
```

### Direction des Relations (SIMPLIFIÉ)

```
AUTORITATIF (Source of Truth) - RELATIONS 1:1 depuis dossiers:
┌─────────────────────────────────────────────────────────────────┐
│  dossiers.expertise_report_id  ──────►  expertise_reports.id   │
│  dossiers.quote_id             ──────►  quotes.id              │
│  dossiers.repair_order_id      ──────►  repair_orders.id       │
│  dossiers.cession_id           ──────►  cessions.id            │
│  dossiers.fleet_reservation_id ──────►  fleet_reservations.id  │
└─────────────────────────────────────────────────────────────────┘

RELATION 1:N DIRECTE (seule exception - À GARDER):
┌─────────────────────────────────────────────────────────────────┐
│  messageries.dossier_id        ──────►  dossiers.id (1:N)      │
└─────────────────────────────────────────────────────────────────┘

❌ SUPPRIMÉ (plus de reverse lookup redondant):
┌─────────────────────────────────────────────────────────────────┐
│  expertise_reports.dossier_id  ← SUPPRIMÉ                      │
│  quotes.dossier_id             ← SUPPRIMÉ                      │
│  repair_orders.dossier_id      ← SUPPRIMÉ                      │
│  fleet_reservations.dossier_id ← SUPPRIMÉ                      │
└─────────────────────────────────────────────────────────────────┘
```

### Comment trouver le dossier d'une entité

```sql
-- Pour trouver le dossier d'un repair_order :
SELECT * FROM dossiers WHERE repair_order_id = :repair_order_id;

-- Pour trouver le dossier d'un devis :
SELECT * FROM dossiers WHERE quote_id = :quote_id;

-- Les messageries ont toujours dossier_id (relation 1:N) :
SELECT * FROM messageries WHERE dossier_id = :dossier_id;
```

---

## Gestion des Messageries

### Situation Actuelle

- `messageries` a déjà une colonne `dossier_id` (UUID, nullable)
- Les messageries sont créées par plusieurs sources :
  - Edge functions (`trigger-document-reminder`)
  - Application directe (formulaires)
  - n8n webhooks

### Architecture pour Messageries

Les messageries ont une relation **1:N directe** avec les dossiers :

```sql
-- Un dossier peut avoir PLUSIEURS messageries
messageries.dossier_id → dossiers.id  (FK existante)
```

### Stratégie de peuplement `dossier_id`

1. **À la création** : Déduire le `dossier_id` depuis `client_id` + `vehicle_id`
2. **Migration existante** : Script pour peupler les `dossier_id` manquants
3. **Edge functions** : Mettre à jour pour peupler `dossier_id`

---

## Nettoyage des Références Bidirectionnelles

### Problème

La présence de références dans les deux sens crée :
- Risque de désynchronisation entre `dossiers.repair_order_id` et `repair_orders.dossier_id`
- Ambiguïté sur la source de vérité
- Complexité de maintenance avec des triggers de synchro
- Code applicatif plus complexe

### Solution : SUPPRIMER les colonnes redondantes

#### ✅ À GARDER (dans `dossiers` - Source de vérité)

```sql
dossiers.expertise_report_id  -- Source de vérité pour le lien 1:1
dossiers.quote_id             -- Source de vérité pour le lien 1:1
dossiers.repair_order_id      -- Source de vérité pour le lien 1:1
dossiers.cession_id           -- Source de vérité pour le lien 1:1
dossiers.fleet_reservation_id -- Source de vérité pour le lien 1:1
```

#### ✅ À GARDER (messageries - Relation 1:N directe)

```sql
messageries.dossier_id  -- Relation 1:N directe (un dossier a plusieurs messageries)
```

#### ❌ À SUPPRIMER (colonnes redondantes dans les tables enfants)

```sql
expertise_reports.dossier_id  -- ❌ SUPPRIMER - redondant avec dossiers.expertise_report_id
quotes.dossier_id             -- ❌ SUPPRIMER - redondant avec dossiers.quote_id
repair_orders.dossier_id      -- ❌ SUPPRIMER - redondant avec dossiers.repair_order_id
fleet_reservations.dossier_id -- ❌ SUPPRIMER - redondant avec dossiers.fleet_reservation_id
```

### Plan de Nettoyage en 3 Étapes

#### Étape 1 : Vérifier que `dossiers.*_id` est peuplé depuis `*.dossier_id`

```sql
-- Avant de supprimer, migrer les données de *.dossier_id vers dossiers.*_id

-- 1. expertise_reports → dossiers
UPDATE public.dossiers d
SET expertise_report_id = er.id
FROM public.expertise_reports er
WHERE er.dossier_id = d.id
  AND d.expertise_report_id IS NULL;

-- 2. quotes → dossiers  
UPDATE public.dossiers d
SET quote_id = q.id
FROM public.quotes q
WHERE q.dossier_id = d.id
  AND d.quote_id IS NULL;

-- 3. repair_orders → dossiers
UPDATE public.dossiers d
SET repair_order_id = ro.id
FROM public.repair_orders ro
WHERE ro.dossier_id = d.id
  AND d.repair_order_id IS NULL;

-- 4. fleet_reservations → dossiers
UPDATE public.dossiers d
SET fleet_reservation_id = fr.id
FROM public.fleet_reservations fr
WHERE fr.dossier_id = d.id
  AND d.fleet_reservation_id IS NULL;
```

#### Étape 2 : Vérifier qu'aucune donnée n'est perdue

```sql
-- Vérifier les orphelins : entités avec dossier_id mais sans dossier correspondant
SELECT 'expertise_reports orphelins' as table_name, COUNT(*) 
FROM expertise_reports er 
WHERE er.dossier_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM dossiers d WHERE d.expertise_report_id = er.id);

SELECT 'quotes orphelins' as table_name, COUNT(*) 
FROM quotes q 
WHERE q.dossier_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM dossiers d WHERE d.quote_id = q.id);

SELECT 'repair_orders orphelins' as table_name, COUNT(*) 
FROM repair_orders ro 
WHERE ro.dossier_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM dossiers d WHERE d.repair_order_id = ro.id);

SELECT 'fleet_reservations orphelins' as table_name, COUNT(*) 
FROM fleet_reservations fr 
WHERE fr.dossier_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM dossiers d WHERE d.fleet_reservation_id = fr.id);
```

#### Étape 3 : Supprimer les colonnes redondantes

```sql
-- ============================================
-- MIGRATION: Suppression des colonnes dossier_id redondantes
-- ============================================

-- Supprimer les contraintes FK d'abord
ALTER TABLE public.expertise_reports DROP CONSTRAINT IF EXISTS expertise_reports_dossier_id_fkey;
ALTER TABLE public.quotes DROP CONSTRAINT IF EXISTS quotes_dossier_id_fkey;
ALTER TABLE public.repair_orders DROP CONSTRAINT IF EXISTS repair_orders_dossier_id_fkey;
ALTER TABLE public.fleet_reservations DROP CONSTRAINT IF EXISTS fleet_reservations_dossier_id_fkey;

-- Supprimer les index sur dossier_id
DROP INDEX IF EXISTS idx_expertise_reports_dossier_id;
DROP INDEX IF EXISTS idx_quotes_dossier_id;
DROP INDEX IF EXISTS idx_repair_orders_dossier_id;
DROP INDEX IF EXISTS idx_fleet_reservations_dossier_id;

-- Supprimer les colonnes dossier_id
ALTER TABLE public.expertise_reports DROP COLUMN IF EXISTS dossier_id;
ALTER TABLE public.quotes DROP COLUMN IF EXISTS dossier_id;
ALTER TABLE public.repair_orders DROP COLUMN IF EXISTS dossier_id;
ALTER TABLE public.fleet_reservations DROP COLUMN IF EXISTS dossier_id;

-- NE PAS SUPPRIMER messageries.dossier_id (relation 1:N directe)
```

### Migration du Code Applicatif

Après suppression des colonnes, mettre à jour le code :

```typescript
// ❌ AVANT (avec dossier_id redondant)
const repairOrders = await supabase
  .from('repair_orders')
  .select('*')
  .eq('dossier_id', dossierId);

// ✅ APRÈS (via dossiers.repair_order_id)
const { data: dossier } = await supabase
  .from('dossiers')
  .select('repair_order_id')
  .eq('id', dossierId)
  .single();

const repairOrder = await supabase
  .from('repair_orders')
  .select('*')
  .eq('id', dossier.repair_order_id)
  .single();

// OU en une seule requête avec join :
const dossierWithRO = await supabase
  .from('dossiers')
  .select('*, repair_orders(*)')
  .eq('id', dossierId)
  .single();
```

---

## Compatibilité n8n et Edge Functions

### Edge Functions Impactées

| Edge Function | Impact | Action Requise |
|---------------|--------|----------------|
| `trigger-document-reminder` | Crée des messageries | Ajouter `dossier_id` au payload |
| Autres webhooks task | Peuvent créer des entités | Vérifier et ajouter `dossier_id` si pertinent |

### Mise à jour `trigger-document-reminder`

```typescript
// Modifications à apporter dans supabase/functions/trigger-document-reminder/index.ts

// 1. Récupérer le dossier_id depuis client_id + vehicle_id
const { data: dossier } = await supabaseClient
  .from('dossiers')
  .select('id')
  .eq('client_id', client_id)
  .eq('company_id', company_id)
  .order('created_at', { ascending: false })
  .limit(1)
  .single();

// 2. Inclure dossier_id dans l'insertion messageries
const { error: messagingError } = await supabaseClient
  .from('messageries')
  .insert({
    company_id,
    client_id,
    dossier_id: dossier?.id || null,  // AJOUT
    // ... autres champs
  });
```

### n8n Webhooks

Les workflows n8n qui créent des entités doivent être mis à jour car les colonnes `dossier_id` seront supprimées des tables enfants (sauf `messageries`).

**Changements requis :**

1. **Ne plus passer `dossier_id`** dans les insertions de `quotes`, `repair_orders`, `expertise_reports`, `fleet_reservations`
2. **Continuer à passer `dossier_id`** pour `messageries` (relation 1:N directe)
3. **Les triggers auto-lient** les entités au dossier via `client_id` + `vehicle_id`

#### Exemple de workflow n8n AVANT/APRÈS

```json
// ❌ AVANT (avec dossier_id redondant)
{
  "name": "Create Quote with Dossier",
  "parameters": {
    "operation": "insert",
    "table": "quotes",
    "data": {
      "client_id": "={{ $json.client_id }}",
      "vehicle_id": "={{ $json.vehicle_id }}",
      "dossier_id": "={{ $node['Get Dossier'].json.id }}"  // ❌ À SUPPRIMER
    }
  }
}

// ✅ APRÈS (sans dossier_id - auto-lié par trigger)
{
  "name": "Create Quote",
  "parameters": {
    "operation": "insert",
    "table": "quotes",
    "data": {
      "client_id": "={{ $json.client_id }}",
      "vehicle_id": "={{ $json.vehicle_id }}"
      // dossier_id n'est plus nécessaire - le trigger l'auto-lie
    }
  }
}

// ✅ Pour messageries, garder dossier_id (relation 1:N)
{
  "name": "Create Messagerie",
  "parameters": {
    "operation": "insert",
    "table": "messageries",
    "data": {
      "client_id": "={{ $json.client_id }}",
      "dossier_id": "={{ $json.dossier_id }}"  // ✅ À GARDER
    }
  }
}
```

---

## Phase 0 - Clarification Documentation

### Règles de Nommage et Conventions

| Convention | Description |
|------------|-------------|
| `dossiers.*_id` | Référence autoritaire (1:1) VERS l'entité |
| `messageries.dossier_id` | Seule relation 1:N directe autorisée |
| `overall_status` | Statut calculé du dossier basé sur ses entités |

### Source de Vérité (SIMPLIFIÉ)

```
Pour trouver le repair_order d'un dossier :
✅ SELECT * FROM repair_orders WHERE id = dossiers.repair_order_id
✅ SELECT ro.* FROM dossiers d JOIN repair_orders ro ON d.repair_order_id = ro.id

Pour trouver le dossier d'un repair_order :
✅ SELECT * FROM dossiers WHERE repair_order_id = :repair_order_id

Pour les messageries (1:N direct) :
✅ SELECT * FROM messageries WHERE dossier_id = :dossier_id
```

---

## Phase 1 - Migration Base de Données

### Étape 1.1 - Ajout des contraintes UNIQUE

```sql
-- ============================================
-- MIGRATION 001: Contraintes UNIQUE sur dossiers
-- ============================================
-- Les colonnes existent déjà, on ajoute seulement les contraintes

-- 1. Créer les contraintes UNIQUE pour garantir le 1:1
ALTER TABLE public.dossiers 
  ADD CONSTRAINT IF NOT EXISTS unique_expertise_report_per_dossier UNIQUE (expertise_report_id),
  ADD CONSTRAINT IF NOT EXISTS unique_quote_per_dossier UNIQUE (quote_id),
  ADD CONSTRAINT IF NOT EXISTS unique_repair_order_per_dossier UNIQUE (repair_order_id),
  ADD CONSTRAINT IF NOT EXISTS unique_cession_per_dossier UNIQUE (cession_id),
  ADD CONSTRAINT IF NOT EXISTS unique_fleet_reservation_per_dossier UNIQUE (fleet_reservation_id);

-- 2. Index pour performances (si pas déjà créés)
CREATE INDEX IF NOT EXISTS idx_dossiers_expertise_report_id ON public.dossiers(expertise_report_id) WHERE expertise_report_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_dossiers_quote_id ON public.dossiers(quote_id) WHERE quote_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_dossiers_repair_order_id ON public.dossiers(repair_order_id) WHERE repair_order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_dossiers_cession_id ON public.dossiers(cession_id) WHERE cession_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_dossiers_fleet_reservation_id ON public.dossiers(fleet_reservation_id) WHERE fleet_reservation_id IS NOT NULL;
```

### Étape 1.2 - Migration des données avant nettoyage

```sql
-- ============================================
-- MIGRATION 002: Migrer les données *.dossier_id → dossiers.*_id
-- ============================================
-- IMPORTANT: Exécuter AVANT de supprimer les colonnes dossier_id

-- 1. expertise_reports.dossier_id → dossiers.expertise_report_id
UPDATE public.dossiers d
SET expertise_report_id = er.id
FROM public.expertise_reports er
WHERE er.dossier_id = d.id
  AND d.expertise_report_id IS NULL;

-- 2. quotes.dossier_id → dossiers.quote_id
UPDATE public.dossiers d
SET quote_id = q.id
FROM public.quotes q
WHERE q.dossier_id = d.id
  AND d.quote_id IS NULL;

-- 3. repair_orders.dossier_id → dossiers.repair_order_id
UPDATE public.dossiers d
SET repair_order_id = ro.id
FROM public.repair_orders ro
WHERE ro.dossier_id = d.id
  AND d.repair_order_id IS NULL;

-- 4. fleet_reservations.dossier_id → dossiers.fleet_reservation_id
UPDATE public.dossiers d
SET fleet_reservation_id = fr.id
FROM public.fleet_reservations fr
WHERE fr.dossier_id = d.id
  AND d.fleet_reservation_id IS NULL;

-- 5. Peupler messageries.dossier_id via client_id matching (1:N - À GARDER)
UPDATE public.messageries m
SET dossier_id = (
  SELECT d.id FROM dossiers d 
  WHERE d.client_id = m.client_id 
    AND d.company_id = m.company_id
    AND d.created_at <= m.created_at
  ORDER BY d.created_at DESC
  LIMIT 1
)
WHERE m.dossier_id IS NULL AND m.client_id IS NOT NULL;
```

### Étape 1.3 - Vérification avant suppression

```sql
-- ============================================
-- VÉRIFICATION: S'assurer qu'aucune donnée n'est perdue
-- ============================================

-- Vérifier les orphelins (entités avec dossier_id non migrées)
SELECT 'expertise_reports' as table_name, COUNT(*) as orphan_count
FROM expertise_reports er 
WHERE er.dossier_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM dossiers d WHERE d.expertise_report_id = er.id)
UNION ALL
SELECT 'quotes', COUNT(*)
FROM quotes q 
WHERE q.dossier_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM dossiers d WHERE d.quote_id = q.id)
UNION ALL
SELECT 'repair_orders', COUNT(*)
FROM repair_orders ro 
WHERE ro.dossier_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM dossiers d WHERE d.repair_order_id = ro.id)
UNION ALL
SELECT 'fleet_reservations', COUNT(*)
FROM fleet_reservations fr 
WHERE fr.dossier_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM dossiers d WHERE d.fleet_reservation_id = fr.id);

-- Si orphan_count > 0, créer les dossiers manquants AVANT suppression
```

### Étape 1.4 - Suppression des colonnes dossier_id redondantes

```sql
-- ============================================
-- MIGRATION 003: Supprimer les colonnes dossier_id redondantes
-- ============================================
-- ⚠️ ATTENTION: Exécuter uniquement après vérification (Étape 1.3)

-- Supprimer les contraintes FK
ALTER TABLE public.expertise_reports DROP CONSTRAINT IF EXISTS expertise_reports_dossier_id_fkey;
ALTER TABLE public.quotes DROP CONSTRAINT IF EXISTS quotes_dossier_id_fkey;
ALTER TABLE public.repair_orders DROP CONSTRAINT IF EXISTS repair_orders_dossier_id_fkey;
ALTER TABLE public.fleet_reservations DROP CONSTRAINT IF EXISTS fleet_reservations_dossier_id_fkey;

-- Supprimer les index sur dossier_id
DROP INDEX IF EXISTS idx_expertise_reports_dossier_id;
DROP INDEX IF EXISTS idx_quotes_dossier_id;
DROP INDEX IF EXISTS idx_repair_orders_dossier_id;
DROP INDEX IF EXISTS idx_fleet_reservations_dossier_id;

-- Supprimer les colonnes dossier_id
ALTER TABLE public.expertise_reports DROP COLUMN IF EXISTS dossier_id;
ALTER TABLE public.quotes DROP COLUMN IF EXISTS dossier_id;
ALTER TABLE public.repair_orders DROP COLUMN IF EXISTS dossier_id;
ALTER TABLE public.fleet_reservations DROP COLUMN IF EXISTS dossier_id;

-- ✅ NE PAS SUPPRIMER messageries.dossier_id (relation 1:N directe)
```

### Étape 1.5 - Triggers pour auto-lier les nouvelles entités

```sql
-- ============================================
-- MIGRATION 004: Triggers d'auto-liaison (sans bidirectionnel)
-- ============================================

-- Trigger pour repair_orders : auto-lier au dossier via client_id + vehicle_id
CREATE OR REPLACE FUNCTION link_repair_order_to_dossier()
RETURNS TRIGGER AS $$
BEGIN
  -- Chercher un dossier existant par client_id + vehicle_id
  IF NEW.client_id IS NOT NULL AND NEW.vehicle_id IS NOT NULL THEN
    UPDATE dossiers 
    SET repair_order_id = NEW.id, updated_at = now()
    WHERE client_id = NEW.client_id 
      AND vehicle_id = NEW.vehicle_id
      AND repair_order_id IS NULL
      AND company_id = NEW.company_id
      AND archived = false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS after_repair_order_insert ON repair_orders;
CREATE TRIGGER after_repair_order_insert
AFTER INSERT ON repair_orders
FOR EACH ROW EXECUTE FUNCTION link_repair_order_to_dossier();

-- Trigger pour quotes : auto-lier au dossier via client_id + vehicle_id
CREATE OR REPLACE FUNCTION link_quote_to_dossier()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.client_id IS NOT NULL AND NEW.vehicle_id IS NOT NULL THEN
    UPDATE dossiers 
    SET quote_id = NEW.id, updated_at = now()
    WHERE client_id = NEW.client_id 
      AND vehicle_id = NEW.vehicle_id
      AND quote_id IS NULL
      AND company_id = NEW.company_id
      AND archived = false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS after_quote_insert ON quotes;
CREATE TRIGGER after_quote_insert
AFTER INSERT ON quotes
FOR EACH ROW EXECUTE FUNCTION link_quote_to_dossier();

-- Trigger pour messageries : auto-déduire dossier_id via client_id
CREATE OR REPLACE FUNCTION link_messagerie_to_dossier()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.dossier_id IS NULL AND NEW.client_id IS NOT NULL THEN
    SELECT id INTO NEW.dossier_id
    FROM dossiers
    WHERE client_id = NEW.client_id
      AND company_id = NEW.company_id
      AND archived = false
    ORDER BY created_at DESC
    LIMIT 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS before_messagerie_insert ON messageries;
CREATE TRIGGER before_messagerie_insert
BEFORE INSERT ON messageries
FOR EACH ROW EXECUTE FUNCTION link_messagerie_to_dossier();
```

### Étape 1.6 - Trigger de mise à jour du statut global

```sql
-- ============================================
-- MIGRATION 005: Calcul automatique de overall_status
-- ============================================

CREATE OR REPLACE FUNCTION update_dossier_overall_status()
RETURNS TRIGGER AS $$
DECLARE
  v_status TEXT;
BEGIN
  SELECT 
    CASE
      WHEN NEW.repair_order_id IS NOT NULL THEN
        CASE 
          WHEN EXISTS (SELECT 1 FROM invoices WHERE repair_order_id = NEW.repair_order_id AND status = 'paid') THEN 'cloture'
          WHEN EXISTS (SELECT 1 FROM invoices WHERE repair_order_id = NEW.repair_order_id) THEN 'facturation'
          ELSE 'reparation'
        END
      WHEN NEW.quote_id IS NOT NULL THEN 'devis'
      WHEN NEW.expertise_report_id IS NOT NULL THEN 'expertise'
      ELSE 'ouvert'
    END INTO v_status;
  
  NEW.overall_status := v_status;
  NEW.updated_at := now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS before_dossier_update_status ON dossiers;
CREATE TRIGGER before_dossier_update_status
BEFORE UPDATE ON dossiers
FOR EACH ROW EXECUTE FUNCTION update_dossier_overall_status();
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
  
  // Relations 1:1 (FK dans dossiers - AUTORITATIF)
  expertise_report_id?: string | null;
  quote_id?: string | null;
  repair_order_id?: string | null;
  cession_id?: string | null;
  fleet_reservation_id?: string | null;
  
  // Informations du sinistre
  claim_number?: string | null;
  policy_number?: string | null;
  incident_date?: string | null;
  incident_number?: string | null;
  expert_name?: string | null;
  report_number?: string | null;
  insurance_company_id?: string | null;
  
  // Métadonnées
  status?: string | null;
  overall_status?: DossierOverallStatus;
  notes?: string | null;
  archived?: boolean | null;
  created_at: string;
  updated_at: string;
  
  // Relations jointes (optionnelles)
  clients?: Client;
  vehicles?: Vehicle;
  expertise_reports?: ExpertiseReport;
  quotes?: Quote;
  repair_orders?: RepairOrder;
  cessions?: Cession;
  fleet_reservations?: FleetReservation;
  insurance_companies?: InsuranceCompany;
}

export type DossierOverallStatus = 
  | 'ouvert' 
  | 'en_cours' 
  | 'expertise' 
  | 'devis' 
  | 'reparation' 
  | 'facturation' 
  | 'cloture' 
  | 'archive';

// Les factures et messageries sont récupérées séparément
export interface DossierWithDetails extends Dossier {
  invoices?: Invoice[];       // Via repair_order_id (indirect)
  messageries?: Messagerie[]; // Via dossier_id (direct 1:N)
}
```

### 2.2 Service Dossiers

```typescript
// src/services/supabase/dossiers/queries.ts
import { supabase } from '@/integrations/supabase/client';
import type { Dossier, DossierWithDetails } from '@/types/dossier';

export const dossiersQueries = {
  /**
   * Récupère un dossier par ID avec toutes ses relations directes
   */
  async getById(id: string): Promise<DossierWithDetails | null> {
    // 1. Récupérer le dossier avec ses relations 1:1
    const { data: dossier, error } = await supabase
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
    
    if (error || !dossier) return null;
    
    // 2. Récupérer les factures via repair_order_id (relation indirecte)
    let invoices: any[] = [];
    if (dossier.repair_order_id) {
      const { data } = await supabase
        .from('invoices')
        .select('*')
        .eq('repair_order_id', dossier.repair_order_id);
      invoices = data || [];
    }
    
    // 3. Récupérer les messageries via dossier_id (relation directe 1:N)
    const { data: messageries } = await supabase
      .from('messageries')
      .select('*')
      .eq('dossier_id', id)
      .order('created_at', { ascending: false });
    
    return { 
      ...dossier, 
      invoices, 
      messageries: messageries || [] 
    } as DossierWithDetails;
  },

  /**
   * Liste les dossiers avec filtres
   */
  async list(filters?: {
    company_id?: string;
    client_id?: string;
    overall_status?: string;
    archived?: boolean;
  }) {
    let query = supabase
      .from('dossiers')
      .select(`
        *,
        clients (first_name, last_name, company_name),
        vehicles (license_plate, car_brands(name), car_models(name))
      `)
      .order('created_at', { ascending: false });
    
    if (filters?.company_id) query = query.eq('company_id', filters.company_id);
    if (filters?.client_id) query = query.eq('client_id', filters.client_id);
    if (filters?.overall_status) query = query.eq('overall_status', filters.overall_status);
    if (filters?.archived !== undefined) query = query.eq('archived', filters.archived);
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  /**
   * Récupère les factures d'un dossier (via repair_order_id)
   */
  async getInvoicesForDossier(dossierId: string) {
    const { data: dossier } = await supabase
      .from('dossiers')
      .select('repair_order_id')
      .eq('id', dossierId)
      .single();
    
    if (!dossier?.repair_order_id) return [];
    
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .eq('repair_order_id', dossier.repair_order_id);
    
    return data || [];
  },

  /**
   * Récupère les messageries d'un dossier
   */
  async getMessageriesForDossier(dossierId: string) {
    const { data } = await supabase
      .from('messageries')
      .select('*')
      .eq('dossier_id', dossierId)
      .order('created_at', { ascending: false });
    
    return data || [];
  },

  /**
   * Trouve ou crée un dossier pour un client/véhicule
   */
  async findOrCreate(params: {
    company_id: string;
    client_id: string;
    vehicle_id?: string;
  }) {
    // Chercher un dossier existant non archivé
    const { data: existing } = await supabase
      .from('dossiers')
      .select('*')
      .eq('company_id', params.company_id)
      .eq('client_id', params.client_id)
      .eq('archived', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (existing) return existing;
    
    // Créer un nouveau dossier
    const { data: created, error } = await supabase
      .from('dossiers')
      .insert({
        company_id: params.company_id,
        client_id: params.client_id,
        vehicle_id: params.vehicle_id,
        overall_status: 'ouvert'
      })
      .select()
      .single();
    
    if (error) throw error;
    return created;
  }
};
```

### 2.3 Hook useDossiers

```typescript
// src/hooks/useDossiers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dossiersQueries } from '@/services/supabase/dossiers/queries';

export function useDossier(id: string | undefined) {
  return useQuery({
    queryKey: ['dossier', id],
    queryFn: () => dossiersQueries.getById(id!),
    enabled: !!id,
  });
}

export function useDossiers(filters?: Parameters<typeof dossiersQueries.list>[0]) {
  return useQuery({
    queryKey: ['dossiers', filters],
    queryFn: () => dossiersQueries.list(filters),
  });
}

export function useDossierInvoices(dossierId: string | undefined) {
  return useQuery({
    queryKey: ['dossier-invoices', dossierId],
    queryFn: () => dossiersQueries.getInvoicesForDossier(dossierId!),
    enabled: !!dossierId,
  });
}

export function useDossierMessageries(dossierId: string | undefined) {
  return useQuery({
    queryKey: ['dossier-messageries', dossierId],
    queryFn: () => dossiersQueries.getMessageriesForDossier(dossierId!),
    enabled: !!dossierId,
  });
}
```

---

## Phase 3 - Migration Edge Functions

### 3.1 Mise à jour `trigger-document-reminder`

Modifier le fichier `supabase/functions/trigger-document-reminder/index.ts` :

```typescript
// Ajouter après la récupération des données client (ligne ~100)

// Récupérer le dossier associé au client
const { data: dossier } = await supabaseClient
  .from('dossiers')
  .select('id')
  .eq('client_id', client_id)
  .eq('company_id', company_id)
  .eq('archived', false)
  .order('created_at', { ascending: false })
  .limit(1)
  .single();

// Modifier l'insertion dans messageries pour inclure dossier_id
const { error: messagingError } = await supabaseClient
  .from('messageries')
  .insert({
    company_id,
    client_id,
    dossier_id: dossier?.id || null,  // AJOUT
    type: 'sms',
    direction: 'outgoing',
    // ... autres champs existants
  });
```

### 3.2 Pattern pour les autres Edge Functions

Pour toute edge function qui crée des entités liées à un client :

```typescript
// Pattern réutilisable
async function getDossierForClient(
  supabaseClient: SupabaseClient,
  clientId: string,
  companyId: string
): Promise<string | null> {
  const { data } = await supabaseClient
    .from('dossiers')
    .select('id')
    .eq('client_id', clientId)
    .eq('company_id', companyId)
    .eq('archived', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  return data?.id || null;
}
```

---

## Phase 4 - Migration UI

### 4.1 Nouvelle page Dossiers

- Liste des dossiers avec filtres (statut, client, date)
- Vue détaillée d'un dossier avec tous ses documents
- Timeline des événements du dossier
- Onglet Messageries dans la vue dossier

### 4.2 Intégration dans les formulaires existants

- Lors de la création d'un devis/OR/facture, sélection ou création du dossier
- Auto-liaison au dossier existant si client + véhicule correspondent

### 4.3 Composants à créer

```
src/
├── pages/
│   └── Dossiers.tsx              # Liste des dossiers
│   └── DossierDetail.tsx         # Vue détaillée
├── components/
│   └── dossiers/
│       ├── DossierList.tsx       # Tableau des dossiers
│       ├── DossierCard.tsx       # Carte résumé
│       ├── DossierTimeline.tsx   # Chronologie
│       ├── DossierDocuments.tsx  # Documents liés
│       └── DossierMessageries.tsx # Communications
```

---

## Stratégie de Rollback

### Rollback Phase 1 (Contraintes et Triggers)

```sql
-- Retirer les contraintes UNIQUE si problème
ALTER TABLE dossiers DROP CONSTRAINT IF EXISTS unique_expertise_report_per_dossier;
ALTER TABLE dossiers DROP CONSTRAINT IF EXISTS unique_quote_per_dossier;
ALTER TABLE dossiers DROP CONSTRAINT IF EXISTS unique_repair_order_per_dossier;
ALTER TABLE dossiers DROP CONSTRAINT IF EXISTS unique_cession_per_dossier;
ALTER TABLE dossiers DROP CONSTRAINT IF EXISTS unique_fleet_reservation_per_dossier;

-- Supprimer les triggers
DROP TRIGGER IF EXISTS after_repair_order_insert ON repair_orders;
DROP TRIGGER IF EXISTS after_quote_insert ON quotes;
DROP TRIGGER IF EXISTS before_messagerie_insert ON messageries;
DROP TRIGGER IF EXISTS before_dossier_update_status ON dossiers;

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS link_repair_order_to_dossier();
DROP FUNCTION IF EXISTS link_quote_to_dossier();
DROP FUNCTION IF EXISTS link_messagerie_to_dossier();
DROP FUNCTION IF EXISTS update_dossier_overall_status();
```

### Rollback Suppression Colonnes (Si besoin de restaurer)

⚠️ **ATTENTION**: La suppression des colonnes `dossier_id` est irréversible !

Si vous devez restaurer les colonnes après suppression :

```sql
-- Recréer les colonnes
ALTER TABLE public.expertise_reports ADD COLUMN IF NOT EXISTS dossier_id UUID REFERENCES dossiers(id);
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS dossier_id UUID REFERENCES dossiers(id);
ALTER TABLE public.repair_orders ADD COLUMN IF NOT EXISTS dossier_id UUID REFERENCES dossiers(id);
ALTER TABLE public.fleet_reservations ADD COLUMN IF NOT EXISTS dossier_id UUID REFERENCES dossiers(id);

-- Repeupler depuis dossiers.*_id
UPDATE expertise_reports er SET dossier_id = d.id FROM dossiers d WHERE d.expertise_report_id = er.id;
UPDATE quotes q SET dossier_id = d.id FROM dossiers d WHERE d.quote_id = q.id;
UPDATE repair_orders ro SET dossier_id = d.id FROM dossiers d WHERE d.repair_order_id = ro.id;
UPDATE fleet_reservations fr SET dossier_id = d.id FROM dossiers d WHERE d.fleet_reservation_id = fr.id;
```

---

## Calendrier d'Exécution

| Étape | Durée estimée | Risque | Dépendances |
|-------|---------------|--------|-------------|
| Phase 1.1 - Contraintes UNIQUE | 5 min | Faible | Aucune |
| Phase 1.2 - Migration données | 10-30 min | Moyen | Phase 1.1 |
| Phase 1.3 - Vérification orphelins | 5 min | - | Phase 1.2 |
| Phase 1.4 - Suppression colonnes | 5 min | **ÉLEVÉ** | Phases 1.2-1.3 |
| Phase 1.5 - Triggers auto-liaison | 10 min | Moyen | Phase 1.4 |
| Phase 1.6 - Trigger overall_status | 5 min | Faible | Phase 1.5 |
| Phase 2 - Types & Services | 2h | Faible | Phase 1 complète |
| Phase 3 - Edge Functions | 1h | Moyen | Phase 2 |
| Phase 4 - UI | 4-8h | Moyen | Phase 2 |
| Tests & Validation | 2h | - | Toutes phases |

---

## Checklist de Déploiement

### Pré-déploiement
- [ ] Backup de la base de données (OBLIGATOIRE avant Phase 1.4)
- [ ] Vérifier qu'aucun conflit UNIQUE n'existe (doublons)
- [ ] Identifier les workflows n8n impactés
- [ ] Identifier le code applicatif qui utilise `*.dossier_id`

### Phase 1 - Base de données
- [ ] Exécuter Phase 1.1 (Contraintes UNIQUE)
- [ ] Exécuter Phase 1.2 (Migration données)
- [ ] Exécuter Phase 1.3 (Vérifier orphelins = 0)
- [ ] **⚠️ Backup final avant suppression**
- [ ] Exécuter Phase 1.4 (Suppression colonnes dossier_id)
- [ ] Créer les triggers Phase 1.5-1.6
- [ ] Tester les triggers manuellement

### Phase 2 - Application
- [ ] Mettre à jour les types TypeScript
- [ ] Supprimer les références à `*.dossier_id` dans le code
- [ ] Déployer le service dossiers
- [ ] Déployer les hooks

### Phase 3 - Edge Functions
- [ ] Supprimer `dossier_id` des insertions (sauf messageries)
- [ ] Déployer les edge functions modifiées
- [ ] Tester les webhooks

### Phase 4 - UI
- [ ] Déployer la page Dossiers
- [ ] Mettre à jour les formulaires existants
- [ ] Tests de non-régression

### Post-déploiement
- [ ] Monitoring des erreurs
- [ ] Vérifier la cohérence des données
- [ ] Mettre à jour les workflows n8n
- [ ] Documenter les changements pour l'équipe
