# Mode Démo - Données Statiques

Ce projet a été configuré pour fonctionner avec des données statiques pour permettre des captures d'écran et des démonstrations sans nécessiter de connexion à la base de données Supabase.

## Modifications Apportées

### 1. Données Statiques
- **Fichier principal**: `src/data/staticData.ts`
- Contient des données réalistes pour une karrosserie française :
  - 3 clients avec adresses parisiennes
  - 3 véhicules (Renault Clio, Peugeot 208, Volkswagen Golf)
  - 2 factures avec différents statuts (payée/en attente)
  - 2 devis avec exemples de travaux de carrosserie
  - 3 ordres de réparation avec différents statuts
  - Dépenses et reçus d'exemple
  - Compagnies d'assurance françaises
  - Marques et modèles de voitures

### 2. Client Supabase Mock
- **Fichier**: `src/data/mockSupabaseClient.ts`
- Remplace complètement le client Supabase réel
- Intercepte toutes les requêtes SQL et les remplace par des opérations sur les données statiques
- Simule les délais réseau pour un comportement réaliste
- Gère les relations entre tables (clients, véhicules, factures, etc.)

### 3. Services Modifiés
Les services suivants ont été mis à jour pour utiliser les données statiques :
- **Authentification** (`src/services/supabase/auth.ts`)
- **Clients** (`src/services/supabase/clients.ts`)
- **Factures** (`src/services/supabase/invoices/queries.ts`)
- **Devis** (`src/services/supabase/quotes.ts`)
- **Marques de voitures** (`src/services/supabase/car-brands.ts`)

### 4. Client Principal
- **Fichier**: `src/integrations/supabase/client.ts`
- Modifié pour utiliser `mockSupabaseClient` au lieu du vrai client Supabase
- Code original conservé en commentaire pour restauration facile

## Fonctionnalités Disponibles

### Authentification
- Connexion automatique avec utilisateur démo : Jean Dupont (demo@karrosserie-dupont.fr)
- Pas besoin de mots de passe, toute tentative de connexion réussit

### Données Pré-remplies
- **Karrosserie Dupont** : Entreprise démo basée à Paris
- **Clients** : Marie Martin, Pierre Bernard, Sophie Durand
- **Véhicules** : Immatriculés AB-123-CD, EF-456-GH, IJ-789-KL
- **Factures** : Une payée (876€), une en attente (291€)
- **Devis** : Réparations carrosserie réalistes avec prix du marché

### Fonctionnalités Simulées
- Création, modification, suppression de tous les types d'enregistrements
- Recherches et filtres
- Relations entre entités
- Gestion multi-entreprises (impersonation)
- Délais réseau simulés pour un comportement réaliste

## Utilisation pour Démonstration

1. **Démarrer l'application** : `npm run dev`
2. **Accès direct** : L'utilisateur est automatiquement connecté
3. **Navigation** : Toutes les sections sont accessibles avec des données réalistes
4. **Captures d'écran** : Parfait pour documenter les fonctionnalités

## Données Exemple

### Client Exemple
```
Marie Martin
marie.martin@email.fr
06 12 34 56 78
45 Rue de la République, 75011 Paris
```

### Véhicule Exemple
```
Renault Clio (2020)
Plaque: AB-123-CD
Kilométrage: 45 000 km
Couleur: Blanc
```

### Facture Exemple
```
FACT-2024-001 - 876€ TTC
Réparation portière arrière gauche
Statut: Payée le 18/03/2024
```

## Restauration du Mode Normal

Pour revenir au mode normal avec Supabase :
1. Restaurer `src/integrations/supabase/client.ts` (décommenter le code original)
2. Supprimer les imports des données statiques dans les services
3. Restaurer les appels Supabase originaux dans les services

## Notes Techniques

- Compatible avec tous les hooks TanStack Query existants
- Maintient la cohérence des données entre les relations
- Simule les erreurs et cas limites appropriés
- Performance optimisée pour les démonstrations