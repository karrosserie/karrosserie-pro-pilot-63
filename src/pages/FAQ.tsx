
import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Book, Users, Car, FileText, Calculator, CreditCard, Settings, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useNavigate } from 'react-router-dom';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  image?: string;
  steps?: string[];
}

const FAQ = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: 'Toutes les catégories', icon: Book, color: 'bg-blue-500' },
    { id: 'clients', name: 'Gestion des clients', icon: Users, color: 'bg-green-500' },
    { id: 'vehicles', name: 'Gestion des véhicules', icon: Car, color: 'bg-orange-500' },
    { id: 'documents', name: 'Documents et devis', icon: FileText, color: 'bg-purple-500' },
    { id: 'accounting', name: 'Comptabilité', icon: Calculator, color: 'bg-red-500' },
    { id: 'payments', name: 'Paiements', icon: CreditCard, color: 'bg-teal-500' },
    { id: 'settings', name: 'Paramètres', icon: Settings, color: 'bg-gray-500' }
  ];

  const faqItems: FAQItem[] = [
    // Gestion des clients
    {
      id: 'add-client',
      question: 'Comment ajouter un nouveau client ?',
      answer: 'Pour ajouter un nouveau client, rendez-vous dans la section "Clients" et cliquez sur le bouton "Nouveau client". Remplissez les informations personnelles, les coordonnées et les détails de contact.',
      category: 'clients',
      tags: ['nouveau', 'ajouter', 'créer'],
      image: 'photo-1581091226825-a6a2a5aee158',
      steps: [
        'Allez dans la section "Clients"',
        'Cliquez sur "Nouveau client"',
        'Remplissez les informations personnelles',
        'Ajoutez les coordonnées de contact',
        'Sauvegardez le client'
      ]
    },
    {
      id: 'edit-client',
      question: 'Comment modifier les informations d\'un client ?',
      answer: 'Pour modifier un client existant, trouvez-le dans la liste des clients, cliquez sur son nom ou sur l\'icône d\'édition, puis modifiez les informations nécessaires.',
      category: 'clients',
      tags: ['modifier', 'éditer', 'mettre à jour'],
      steps: [
        'Recherchez le client dans la liste',
        'Cliquez sur le nom du client',
        'Cliquez sur "Modifier"',
        'Changez les informations nécessaires',
        'Sauvegardez les modifications'
      ]
    },
    {
      id: 'client-history',
      question: 'Comment voir l\'historique d\'un client ?',
      answer: 'L\'historique complet du client (véhicules, factures, devis, ordres de réparation) est accessible en cliquant sur le nom du client puis en naviguant dans les différents onglets.',
      category: 'clients',
      tags: ['historique', 'consultation', 'véhicules', 'factures'],
      steps: [
        'Cliquez sur le nom du client',
        'Naviguez dans les onglets : Véhicules, Devis, Factures, etc.',
        'Consultez l\'historique complet des interactions'
      ]
    },

    // Gestion des véhicules
    {
      id: 'add-vehicle',
      question: 'Comment enregistrer un nouveau véhicule ?',
      answer: 'Pour ajouter un véhicule, allez dans "Véhicules", cliquez sur "Nouveau véhicule", sélectionnez le client propriétaire, renseignez les détails du véhicule (marque, modèle, immatriculation, etc.).',
      category: 'vehicles',
      tags: ['véhicule', 'nouveau', 'enregistrer'],
      image: 'photo-1486312338219-ce68d2c6f44d',
      steps: [
        'Allez dans la section "Véhicules"',
        'Cliquez sur "Nouveau véhicule"',
        'Sélectionnez le client propriétaire',
        'Remplissez les détails : marque, modèle, année',
        'Ajoutez la plaque d\'immatriculation',
        'Téléchargez la carte grise si nécessaire',
        'Sauvegardez le véhicule'
      ]
    },
    {
      id: 'vehicle-condition',
      question: 'Comment documenter l\'état d\'un véhicule ?',
      answer: 'Dans l\'onglet "État du véhicule", vous pouvez marquer les dommages existants (rayures, chocs, pièces hors service) en cliquant sur les zones correspondantes du véhicule.',
      category: 'vehicles',
      tags: ['état', 'dommages', 'rayures', 'chocs'],
      steps: [
        'Ouvrez la fiche du véhicule',
        'Allez dans l\'onglet "État du véhicule"',
        'Cliquez sur les zones endommagées',
        'Sélectionnez le type de dommage : rayure, choc, ou hors service',
        'Sauvegardez l\'état du véhicule'
      ]
    },
    {
      id: 'vehicle-photos',
      question: 'Comment ajouter des photos du véhicule ?',
      answer: 'Vous pouvez ajouter plusieurs photos du véhicule dans l\'onglet "Documents" de la fiche véhicule. Cela aide à documenter l\'état avant et après réparation.',
      category: 'vehicles',
      tags: ['photos', 'images', 'documentation'],
      steps: [
        'Ouvrez la fiche du véhicule',
        'Allez dans l\'onglet "Documents"',
        'Cliquez sur "Ajouter des photos"',
        'Sélectionnez ou prenez des photos',
        'Les photos sont automatiquement sauvegardées'
      ]
    },

    // Documents et devis
    {
      id: 'create-quote',
      question: 'Comment créer un devis ?',
      answer: 'Pour créer un devis, allez dans "Documents > Devis", cliquez sur "Nouveau devis", sélectionnez le client et le véhicule, ajoutez les prestations et pièces nécessaires.',
      category: 'documents',
      tags: ['devis', 'créer', 'estimation'],
      image: 'photo-1498050108023-c5249f4df085',
      steps: [
        'Allez dans "Documents > Devis"',
        'Cliquez sur "Nouveau devis"',
        'Sélectionnez le client et le véhicule',
        'Ajoutez les prestations de réparation',
        'Ajoutez les pièces nécessaires',
        'Vérifiez les totaux et remises',
        'Sauvegardez et envoyez le devis'
      ]
    },
    {
      id: 'quote-to-order',
      question: 'Comment transformer un devis en ordre de réparation ?',
      answer: 'Une fois le devis accepté par le client, vous pouvez le convertir en ordre de réparation directement depuis la fiche du devis en cliquant sur "Convertir en ordre".',
      category: 'documents',
      tags: ['devis', 'ordre', 'conversion', 'accepté'],
      steps: [
        'Ouvrez le devis accepté',
        'Cliquez sur "Convertir en ordre de réparation"',
        'Vérifiez les informations',
        'L\'ordre de réparation est automatiquement créé'
      ]
    },
    {
      id: 'create-invoice',
      question: 'Comment générer une facture ?',
      answer: 'Les factures peuvent être créées à partir d\'un ordre de réparation terminé ou créées directement. Allez dans "Documents > Factures" pour gérer vos facturations.',
      category: 'documents',
      tags: ['facture', 'facturation', 'génération'],
      steps: [
        'Allez dans "Documents > Factures"',
        'Cliquez sur "Nouvelle facture" ou convertissez un ordre terminé',
        'Vérifiez les prestations et montants',
        'Générez la facture PDF',
        'Envoyez par email ou imprimez'
      ]
    },

    // Comptabilité
    {
      id: 'track-payments',
      question: 'Comment suivre les paiements des factures ?',
      answer: 'Le suivi des paiements se fait dans la section "Paiements > Encaissements". Vous pouvez enregistrer les paiements reçus et voir le statut de chaque facture.',
      category: 'accounting',
      tags: ['paiements', 'encaissements', 'suivi'],
      steps: [
        'Allez dans "Paiements > Encaissements"',
        'Trouvez la facture concernée',
        'Cliquez sur "Enregistrer un paiement"',
        'Saisissez le montant et le mode de paiement',
        'Le statut de la facture est mis à jour automatiquement'
      ]
    },
    {
      id: 'expense-tracking',
      question: 'Comment enregistrer mes dépenses professionnelles ?',
      answer: 'Dans "Paiements > Dépenses", vous pouvez enregistrer toutes vos dépenses professionnelles avec les justificatifs pour faciliter votre comptabilité.',
      category: 'accounting',
      tags: ['dépenses', 'frais', 'justificatifs'],
      steps: [
        'Allez dans "Paiements > Dépenses"',
        'Cliquez sur "Nouvelle dépense"',
        'Remplissez le type, montant et description',
        'Téléchargez le justificatif (facture, reçu)',
        'Sauvegardez la dépense'
      ]
    },

    // Paramètres
    {
      id: 'company-settings',
      question: 'Comment configurer les informations de mon entreprise ?',
      answer: 'Dans "Paramètres > Entreprise", vous pouvez modifier le nom, l\'adresse, le logo et toutes les informations qui apparaîtront sur vos documents officiels.',
      category: 'settings',
      tags: ['entreprise', 'configuration', 'logo', 'adresse'],
      image: 'photo-1531297484001-80022131f5a1',
      steps: [
        'Allez dans "Paramètres"',
        'Cliquez sur l\'onglet "Entreprise"',
        'Modifiez les informations nécessaires',
        'Téléchargez votre logo si souhaité',
        'Sauvegardez les modifications'
      ]
    }
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const filteredItems = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Retour</span>
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Centre d'aide
                </h1>
                <p className="text-gray-600 mt-1">
                  Trouvez rapidement les réponses à vos questions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Catégories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-2 rounded-md ${category.color} text-white`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">{category.name}</span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Rechercher dans la FAQ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
              </CardContent>
            </Card>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredItems.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Aucun résultat trouvé pour votre recherche.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <Collapsible
                      open={expandedItems.includes(item.id)}
                      onOpenChange={() => toggleExpanded(item.id)}
                    >
                      <CollapsibleTrigger className="w-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4 px-6 hover:bg-gray-50">
                          <div className="flex items-start space-x-4 text-left">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {item.question}
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {item.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-4">
                            {expandedItems.includes(item.id) ? (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <CardContent className="px-6 pb-6">
                          <div className="space-y-6">
                            {/* Image if available */}
                            {item.image && (
                              <div className="rounded-lg overflow-hidden bg-gray-100">
                                <img
                                  src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=800&q=80`}
                                  alt="Illustration"
                                  className="w-full h-48 object-cover"
                                />
                              </div>
                            )}
                            
                            {/* Answer */}
                            <div className="prose max-w-none">
                              <p className="text-gray-700 leading-relaxed">
                                {item.answer}
                              </p>
                            </div>

                            {/* Steps if available */}
                            {item.steps && (
                              <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-900 mb-3">
                                  Étapes à suivre :
                                </h4>
                                <ol className="space-y-2">
                                  {item.steps.map((step, index) => (
                                    <li key={index} className="flex items-start space-x-3">
                                      <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                                        {index + 1}
                                      </span>
                                      <span className="text-blue-800">{step}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
