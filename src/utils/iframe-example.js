/**
 * EXEMPLE D'UTILISATION DANS L'IFRAME
 * 
 * Ce fichier montre comment utiliser l'IframeSupabaseHelper dans votre application iframe
 * pour s'authentifier avec Supabase et effectuer des actions.
 */

import { IframeSupabaseHelper } from './iframe-supabase-helper.ts';

// Créer une instance du helper
const supabaseHelper = new IframeSupabaseHelper();

// Fonction principale d'initialisation de l'iframe
async function initializeIframeApp() {
  try {
    // 1. Récupérer le token depuis l'URL de l'iframe
    const urlParams = new URLSearchParams(window.location.search);
    const iframeToken = urlParams.get('token');
    
    if (!iframeToken) {
      throw new Error('Token d\'authentification manquant dans l\'URL');
    }

    console.log('🔑 Token récupéré, initialisation en cours...');

    // 2. Initialiser le helper avec le token
    const initialized = await supabaseHelper.initialize(iframeToken);
    
    if (!initialized) {
      throw new Error('Échec de l\'initialisation');
    }

    // 3. Récupérer le contexte utilisateur
    const userContext = supabaseHelper.getUserContext();
    console.log('👤 Utilisateur connecté:', userContext.user.email);
    console.log('🏢 Entreprise:', userContext.company.name);
    console.log('🎭 Rôle:', userContext.role);

    // 4. Vérifier les permissions
    if (supabaseHelper.hasPermission('canManage')) {
      console.log('✅ L\'utilisateur peut gérer les données');
      enableManagementFeatures();
    } else if (supabaseHelper.hasPermission('viewOnly')) {
      console.log('👀 L\'utilisateur a accès en lecture seule');
      enableViewOnlyFeatures();
    }

    // 5. Exemple d'utilisation du client Supabase directement
    await loadDataWithDirectClient();

    // 6. Exemple d'utilisation du proxy pour des actions sécurisées
    await loadDataWithProxy();

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    showErrorMessage(error.message);
  }
}

// Exemple d'utilisation directe du client Supabase
async function loadDataWithDirectClient() {
  try {
    console.log('📡 Chargement des données avec le client direct...');
    
    const supabase = supabaseHelper.getClient();
    const userContext = supabaseHelper.getUserContext();

    // Exemple: récupérer les clients de l'entreprise
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('company_id', userContext.company.id)
      .limit(10);

    if (error) throw error;

    console.log('👥 Clients récupérés:', clients.length);
    displayClients(clients);

  } catch (error) {
    console.error('❌ Erreur lors du chargement des clients:', error);
  }
}

// Exemple d'utilisation du proxy pour des actions sécurisées
async function loadDataWithProxy() {
  try {
    console.log('🔒 Chargement des données avec le proxy sécurisé...');

    // Exemple: récupérer les véhicules via le proxy
    const vehicles = await supabaseHelper.proxyRequest({
      action: 'select',
      table: 'vehicles',
      select: 'id, license_plate, brand_id, model_id',
      filter: { status: 'active' }
    });

    console.log('🚗 Véhicules récupérés:', vehicles.length);
    displayVehicles(vehicles);

  } catch (error) {
    console.error('❌ Erreur lors du chargement des véhicules:', error);
  }
}

// Exemple de création d'un nouveau client
async function createNewClient(clientData) {
  try {
    if (!supabaseHelper.hasPermission('canManage')) {
      throw new Error('Permissions insuffisantes pour créer un client');
    }

    // Utilisation du proxy pour créer le client (ajoute automatiquement company_id)
    const newClient = await supabaseHelper.proxyRequest({
      action: 'insert',
      table: 'clients',
      data: {
        first_name: clientData.firstName,
        last_name: clientData.lastName,
        email: clientData.email,
        phone: clientData.phone
      }
    });

    console.log('✅ Client créé avec succès:', newClient[0]);
    return newClient[0];

  } catch (error) {
    console.error('❌ Erreur lors de la création du client:', error);
    throw error;
  }
}

// Exemple de mise à jour d'un client
async function updateClient(clientId, updates) {
  try {
    if (!supabaseHelper.hasPermission('canManage')) {
      throw new Error('Permissions insuffisantes pour modifier un client');
    }

    const updatedClient = await supabaseHelper.proxyRequest({
      action: 'update',
      table: 'clients',
      data: updates,
      filter: { id: clientId }
    });

    console.log('✅ Client mis à jour:', updatedClient[0]);
    return updatedClient[0];

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du client:', error);
    throw error;
  }
}

// Fonctions utilitaires d'affichage
function displayClients(clients) {
  // Afficher les clients dans l'interface
  console.log('Affichage des clients:', clients);
}

function displayVehicles(vehicles) {
  // Afficher les véhicules dans l'interface
  console.log('Affichage des véhicules:', vehicles);
}

function enableManagementFeatures() {
  // Activer les fonctionnalités de gestion
  console.log('Fonctionnalités de gestion activées');
}

function enableViewOnlyFeatures() {
  // Activer les fonctionnalités en lecture seule
  console.log('Mode lecture seule activé');
}

function showErrorMessage(message) {
  // Afficher un message d'erreur à l'utilisateur
  console.error('Erreur:', message);
}

// Initialiser l'application iframe au chargement
window.addEventListener('DOMContentLoaded', initializeIframeApp);

// Exporter les fonctions pour utilisation externe
window.iframeApp = {
  createNewClient,
  updateClient,
  supabaseHelper
};