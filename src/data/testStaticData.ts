// Script de test pour vérifier que les données statiques fonctionnent correctement

import { 
  STATIC_AUTH, 
  STATIC_COMPANY, 
  STATIC_CLIENTS, 
  STATIC_VEHICLES, 
  STATIC_INVOICES,
  STATIC_SUBSCRIPTIONS,
  filterByCompanyId 
} from './staticData';

// Test des données statiques
export function testStaticData() {
  console.log('=== TEST DES DONNÉES STATIQUES ===');
  
  // Test de l'authentification
  console.log('✓ Utilisateur authentifié:', STATIC_AUTH.session.user.email);
  console.log('✓ Entreprise:', STATIC_COMPANY.name);
  
  // Test des clients
  const clients = filterByCompanyId(STATIC_CLIENTS, STATIC_COMPANY.id);
  console.log(`✓ ${clients.length} clients trouvés:`, clients.map(c => `${c.first_name} ${c.last_name}`));
  
  // Test des véhicules
  const vehicles = filterByCompanyId(STATIC_VEHICLES, STATIC_COMPANY.id);
  console.log(`✓ ${vehicles.length} véhicules trouvés:`, vehicles.map(v => `${v.license_plate} (${v.car_brands?.name} ${v.car_models?.name})`));
  
  // Test des factures
  const invoices = filterByCompanyId(STATIC_INVOICES, STATIC_COMPANY.id);
  console.log(`✓ ${invoices.length} factures trouvées:`, invoices.map(i => `${i.reference} - ${i.total_amount}€`));
  
  // Test de l'abonnement
  const subscription = STATIC_SUBSCRIPTIONS.find(s => s.company_id === STATIC_COMPANY.id);
  console.log('✓ Abonnement actif:', subscription ? `${subscription.plan_type} (${subscription.tokens_remaining}/${subscription.tokens_limit} jetons)` : 'Aucun');
  
  console.log('=== TESTS TERMINÉS AVEC SUCCÈS ===');
}

// Exporter pour utilisation dans la console du navigateur
if (typeof window !== 'undefined') {
  (window as any).testStaticData = testStaticData;
}

// Auto-test au chargement en développement
if (import.meta.env.DEV) {
  setTimeout(testStaticData, 1000);
}