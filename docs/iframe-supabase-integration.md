# Intégration Supabase pour l'Iframe

Ce document explique comment l'application en iframe peut s'authentifier via Supabase Auth et effectuer des actions dans la base de données tout en récupérant les informations de profil adequates.

## Vue d'ensemble du système

Le système fonctionne en 3 étapes principales :

1. **Génération du token JWT** : L'application principale génère un token JWT sécurisé contenant les informations utilisateur et le token Supabase Auth
2. **Authentification de l'iframe** : L'iframe utilise ce token pour s'authentifier et récupérer ses credentials Supabase
3. **Actions Supabase** : L'iframe peut ensuite effectuer des actions Supabase directement ou via un proxy sécurisé

## Architecture

### Fonctions Edge

#### 1. `generate-iframe-token`
- **Rôle** : Génère un token JWT sécurisé pour l'iframe
- **Entrée** : Token Supabase Auth de l'utilisateur connecté
- **Sortie** : Token JWT contenant les informations utilisateur, entreprise et le token Supabase Auth original
- **Sécurité** : Token avec expiration de 30 minutes

#### 2. `iframe-supabase-direct`
- **Rôle** : Permet à l'iframe d'obtenir ses credentials Supabase
- **Entrée** : Token JWT de l'iframe
- **Sortie** : Configuration Supabase (URL, clé, token auth) et contexte utilisateur
- **Usage** : Pour utiliser le client Supabase directement dans l'iframe

#### 3. `iframe-supabase-proxy`
- **Rôle** : Proxy sécurisé pour les actions Supabase
- **Entrée** : Token JWT + action à effectuer (select, insert, update, delete, rpc)
- **Sortie** : Résultat de l'action Supabase
- **Sécurité** : Filtre automatiquement par company_id, applique les RLS

### Helper JavaScript

#### `IframeSupabaseHelper`
Classe utilitaire qui facilite l'utilisation de Supabase dans l'iframe :

- **Initialisation** : `initialize(iframeToken)`
- **Client Supabase** : `getClient()`
- **Contexte utilisateur** : `getUserContext()`
- **Vérification des permissions** : `hasPermission(permission)`
- **Requêtes proxy** : `proxyRequest(request)`

## Guide d'implémentation

### Étape 1 : Récupération du token dans l'iframe

```javascript
// L'iframe récupère son token depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const iframeToken = urlParams.get('token');
```

### Étape 2 : Initialisation du helper

```javascript
import { IframeSupabaseHelper } from './iframe-supabase-helper.ts';

const supabaseHelper = new IframeSupabaseHelper();
const initialized = await supabaseHelper.initialize(iframeToken);
```

### Étape 3 : Utilisation du client Supabase

#### Méthode 1 : Client direct
```javascript
const supabase = supabaseHelper.getClient();
const userContext = supabaseHelper.getUserContext();

// Requête directe avec les RLS appliquées automatiquement
const { data, error } = await supabase
  .from('clients')
  .select('*')
  .eq('company_id', userContext.company.id);
```

#### Méthode 2 : Proxy sécurisé
```javascript
// Requête via le proxy (company_id ajouté automatiquement)
const clients = await supabaseHelper.proxyRequest({
  action: 'select',
  table: 'clients',
  select: 'id, first_name, last_name, email',
  filter: { status: 'active' }
});
```

### Étape 4 : Vérification des permissions

```javascript
if (supabaseHelper.hasPermission('canManage')) {
  // L'utilisateur peut créer/modifier des données
  enableManagementFeatures();
} else if (supabaseHelper.hasPermission('viewOnly')) {
  // L'utilisateur ne peut que consulter
  enableViewOnlyFeatures();
}
```

## Types de permissions

- **`isOwner`** : Propriétaire de l'entreprise
- **`canManage`** : Peut gérer les données (Propriétaire, responsable, responsable administratif)
- **`viewOnly`** : Accès en lecture seule (carrossier, carrossier-véhicule de courtoisie)

## Sécurité

### Filtrage automatique
- Toutes les requêtes sont automatiquement filtrées par `company_id`
- Les RLS (Row Level Security) de Supabase sont appliquées
- Le token JWT expire après 30 minutes

### Actions autorisées via le proxy
- **SELECT** : Lecture des données (avec filtrage company_id)
- **INSERT** : Création (company_id ajouté automatiquement)
- **UPDATE** : Modification (filtré par company_id)
- **DELETE** : Suppression (filtré par company_id)
- **RPC** : Appel de fonctions (avec paramètres company_id et user_id)

## Exemple complet

```javascript
// Initialisation
const supabaseHelper = new IframeSupabaseHelper();
await supabaseHelper.initialize(iframeToken);

// Récupération du contexte
const userContext = supabaseHelper.getUserContext();
console.log(`Connecté en tant que ${userContext.user.email} pour ${userContext.company.name}`);

// Action selon les permissions
if (supabaseHelper.hasPermission('canManage')) {
  // Créer un nouveau client
  const newClient = await supabaseHelper.proxyRequest({
    action: 'insert',
    table: 'clients',
    data: {
      first_name: 'Jean',
      last_name: 'Dupont',
      email: 'jean.dupont@email.com'
    }
  });
} else {
  // Lecture seule
  const clients = await supabaseHelper.proxyRequest({
    action: 'select',
    table: 'clients',
    select: 'first_name, last_name, email'
  });
}
```

## Débogage

### Logs disponibles
- Les fonctions edge loggent toutes les étapes importantes
- Le helper JavaScript affiche les informations de connexion
- Les erreurs sont catchées et loggées avec des détails

### Vérifications
1. **Token valide** : Vérifier que le token JWT n'est pas expiré
2. **Permissions** : S'assurer que l'utilisateur a les bonnes permissions
3. **Company ID** : Vérifier que le company_id est bien présent dans le token
4. **RLS** : Les règles de sécurité Supabase sont appliquées

## Limitations

- Le token JWT expire après 30 minutes (renouvelable)
- Les requêtes sont automatiquement filtrées par company_id
- Certaines tables système (car_brands, car_models) ne sont pas filtrées
- Les RPC doivent accepter les paramètres p_company_id et p_user_id

## Support

Pour toute question ou problème :
1. Vérifier les logs des fonctions edge dans Supabase
2. Vérifier les logs du navigateur dans l'iframe
3. S'assurer que les RLS sont correctement configurées
4. Tester avec les outils de développement Supabase