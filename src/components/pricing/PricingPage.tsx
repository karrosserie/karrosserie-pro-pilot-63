import React from 'react';

const PricingPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#f8fafc', color: '#2d3748', lineHeight: 1.5 }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px', background: '#ffffff', padding: '32px 24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1a202c', marginBottom: '8px' }}>Plan Tarifaire</h1>
        <div style={{ fontSize: '1rem', color: '#718096', marginBottom: '4px' }}>Grille tarifaire officielle Karrosserie.pro</div>
        <div style={{ fontSize: '0.875rem', color: '#a0aec0' }}>Prix nets, TVA non applicable sur facturation intracommunautaire</div>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2d3748', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #e2e8f0' }}>📦 Modules inclus</h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: '#fff5f5', border: '2px solid #fed7d7', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#e53e3e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🏢</div>
              <div style={{ fontWeight: 600, color: '#2d3748', fontSize: '1rem' }}>Abonnement principal</div>
            </div>
            <div style={{ fontWeight: 700, color: '#1a202c', fontSize: '1.125rem', background: '#e2e8f0', padding: '8px 16px', borderRadius: '8px' }}>699 €</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: '#f7fafc', border: '2px solid #e2e8f0', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#4299e1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📄</div>
              <div style={{ fontWeight: 600, color: '#2d3748', fontSize: '1rem' }}>Module Cessions de créance</div>
            </div>
            <div style={{ fontWeight: 700, color: '#1a202c', fontSize: '1.125rem', background: '#e2e8f0', padding: '8px 16px', borderRadius: '8px' }}>129 €</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: '#f7fafc', border: '2px solid #e2e8f0', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#4299e1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🚗</div>
              <div style={{ fontWeight: 600, color: '#2d3748', fontSize: '1rem' }}>Module Prêt Véhicules</div>
            </div>
            <div style={{ fontWeight: 700, color: '#1a202c', fontSize: '1.125rem', background: '#e2e8f0', padding: '8px 16px', borderRadius: '8px' }}>189 €</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: '#f7fafc', border: '2px solid #e2e8f0', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#4299e1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📅</div>
              <div style={{ fontWeight: 600, color: '#2d3748', fontSize: '1rem' }}>Module Planning atelier</div>
            </div>
            <div style={{ fontWeight: 700, color: '#1a202c', fontSize: '1.125rem', background: '#e2e8f0', padding: '8px 16px', borderRadius: '8px' }}>119 €</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: '#f7fafc', border: '2px solid #e2e8f0', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#4299e1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🤖</div>
              <div style={{ fontWeight: 600, color: '#2d3748', fontSize: '1rem' }}>Module Secrétariat général IA</div>
            </div>
            <div style={{ fontWeight: 700, color: '#1a202c', fontSize: '1.125rem', background: '#e2e8f0', padding: '8px 16px', borderRadius: '8px' }}>90 €</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: '#f7fafc', border: '2px solid #e2e8f0', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#4299e1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>💰</div>
              <div style={{ fontWeight: 600, color: '#2d3748', fontSize: '1rem' }}>Module Relance des impayés</div>
            </div>
            <div style={{ fontWeight: 700, color: '#1a202c', fontSize: '1.125rem', background: '#e2e8f0', padding: '8px 16px', borderRadius: '8px' }}>99 €</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: '#f7fafc', border: '2px solid #e2e8f0', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#4299e1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🎨</div>
              <div style={{ fontWeight: 600, color: '#2d3748', fontSize: '1rem' }}>Module Gestion de la peinture</div>
            </div>
            <div style={{ fontWeight: 700, color: '#1a202c', fontSize: '1.125rem', background: '#e2e8f0', padding: '8px 16px', borderRadius: '8px' }}>119 €</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: '#f7fafc', border: '2px solid #e2e8f0', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#4299e1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📊</div>
              <div style={{ fontWeight: 600, color: '#2d3748', fontSize: '1rem' }}>Module Export</div>
            </div>
            <div style={{ fontWeight: 700, color: '#1a202c', fontSize: '1.125rem', background: '#e2e8f0', padding: '8px 16px', borderRadius: '8px' }}>59 €</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: '#f7fafc', border: '2px solid #e2e8f0', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#4299e1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🛟</div>
              <div style={{ fontWeight: 600, color: '#2d3748', fontSize: '1rem' }}>Module Assistance</div>
            </div>
            <div style={{ fontWeight: 700, color: '#1a202c', fontSize: '1.125rem', background: '#e2e8f0', padding: '8px 16px', borderRadius: '8px' }}>59 €</div>
          </div>

        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#ffffff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', opacity: 0.8 }}>💳 Paiement mensuel par prélèvement SEPA</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>130,17 €</div>
          <div style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '16px' }}>par mois</div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Facilité de paiement</div>
        </div>
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', color: '#718096' }}>Tarif annuel net</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px', color: '#4a5568' }}>1 562 €</div>
          <div style={{ fontSize: '0.875rem', marginBottom: '16px', color: '#718096' }}>par an</div>
          <div style={{ fontSize: '0.875rem', color: '#718096' }}>Pack complet - Tous modules inclus</div>
        </div>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)', marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ textAlign: 'center', padding: '20px', background: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💻</div>
            <div style={{ fontWeight: 600, color: '#2d3748', marginBottom: '4px' }}>Application SaaS</div>
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>Accès 24h/24 depuis n'importe où</div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔄</div>
            <div style={{ fontWeight: 600, color: '#2d3748', marginBottom: '4px' }}>Mises à jour</div>
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>Automatiques et incluses</div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🛠️</div>
            <div style={{ fontWeight: 600, color: '#2d3748', marginBottom: '4px' }}>Support technique</div>
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>Assistance complète incluse</div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📦</div>
            <div style={{ fontWeight: 600, color: '#2d3748', marginBottom: '4px' }}>Pack indissociable</div>
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>Tous les modules ensemble</div>
          </div>
        </div>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2d3748', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #e2e8f0' }}>⚖️ Option supplémentaire - Procédure Tribunal Jugement sur Pièces</h2>
        <div style={{ marginBottom: '24px', padding: '20px', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#856404', marginBottom: '8px' }}>📋 Module optionnel - Non inclus dans le pack de base</div>
          <div style={{ fontSize: '1rem', color: '#6c5700', fontWeight: 500, lineHeight: 1.4 }}>Pour recours professionnel ou particulier de moins de 10 000 euros</div>
        </div>
        <div style={{ display: 'grid', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: '#e8f5e8', border: '2px solid #c3e6c3', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#28a745', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>⚖️</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#2d3748', fontSize: '1rem' }}>Plan Pro - Procédure Tribunal</div>
                <div style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '4px' }}>
                  • Relances illimitées<br />
                  • 1 dossier tribunal inclus/mois<br />
                  • Dossiers supplémentaires : 99 €
                </div>
              </div>
            </div>
            <div style={{ fontWeight: 700, color: 'white', fontSize: '1.125rem', background: '#28a745', padding: '8px 16px', borderRadius: '8px' }}>129 €/mois</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: '#e3f2fd', border: '2px solid #90caf9', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#1976d2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>⚖️</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#2d3748', fontSize: '1rem' }}>Plan Expert - Procédure Tribunal</div>
                <div style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '4px' }}>
                  • Relances illimitées<br />
                  • 3 dossiers inclus/mois<br />
                  • Dossiers supplémentaires : 79 €
                </div>
              </div>
            </div>
            <div style={{ fontWeight: 700, color: 'white', fontSize: '1.125rem', background: '#1976d2', padding: '8px 16px', borderRadius: '8px' }}>199 €/mois</div>
          </div>
        </div>
      </div>

      <div style={{ background: '#1a202c', color: '#ffffff', padding: '24px 32px', borderRadius: '12px', textAlign: 'center', marginTop: '32px' }}>
        <div style={{ fontSize: '1rem', marginBottom: '8px' }}>Solution complète pour votre atelier de carrosserie</div>
        <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>📅 Engagement 12 mois</div>
      </div>
    </div>
  );
};

export default PricingPage;