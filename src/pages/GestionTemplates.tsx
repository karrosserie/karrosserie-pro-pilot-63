import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Eye, Edit2, Copy, Mail, MessageSquare, FileText, Scale, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  content: string;
  type: string;
  status: 'active' | 'draft' | 'archived';
  usage: number;
  performance: {
    openRate?: number;
    responseRate?: number;
    paymentRate?: number;
    deliveryRate?: number;
    clickRate?: number;
    successRate?: number;
  };
}

const GestionTemplates = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 'relance-aimable',
      name: 'Relance aimable - Première approche',
      category: 'reminders',
      description: 'Template pour première relance courte et cordiale, avec ton bienveillant pour maintenir la relation client.',
      content: `Objet : Rappel aimable - Facture [NUMERO_FACTURE]

Bonjour [NOM_CLIENT],

J'espère que vous allez bien.

Je me permets de vous contacter concernant votre facture [NUMERO_FACTURE] d'un montant de [MONTANT] €, émise le [DATE_EMISSION] et arrivée à échéance le [DATE_ECHEANCE].

À ce jour, nous n'avons pas reçu votre règlement. Il s'agit peut-être d'un simple oubli de votre part ?

Si le règlement a déjà été effectué, merci de ne pas tenir compte de ce message.

Dans le cas contraire, je vous serais reconnaissant de bien vouloir procéder au règlement dans les plus brefs délais.

Je reste à votre disposition pour tout renseignement complémentaire.

Cordialement,
[NOM_ENTREPRISE]`,
      type: 'EMAIL - RELANCE',
      status: 'active',
      usage: 145,
      performance: { openRate: 72, responseRate: 28, paymentRate: 15 }
    },
    {
      id: 'mise-en-demeure',
      name: 'Mise en demeure formelle',
      category: 'notices',
      description: 'Template juridique validé pour mise en demeure officielle avec toutes les mentions légales obligatoires.',
      content: `MISE EN DEMEURE

Madame, Monsieur,

Nous vous mettons en demeure de procéder au règlement de votre dette d'un montant de [MONTANT] € correspondant à notre facture [NUMERO_FACTURE] émise le [DATE_EMISSION].

Cette somme était exigible le [DATE_ECHEANCE] et demeure à ce jour impayée malgré nos relances.

Nous vous accordons un délai de 8 jours à compter de la réception de la présente pour procéder au règlement.

À défaut, nous nous réservons le droit d'engager toute action en recouvrement.

Fait à [VILLE], le [DATE]
[NOM_ENTREPRISE]`,
      type: 'LRE - MISE EN DEMEURE',
      status: 'active',
      usage: 67,
      performance: { deliveryRate: 95, paymentRate: 78 }
    }
  ]);

  const categories = [
    { id: 'all', name: 'Tous les templates', icon: FileText, count: templates.length },
    { id: 'reminders', name: 'Relances', icon: Mail, count: templates.filter(t => t.category === 'reminders').length },
    { id: 'notices', name: 'Mises en demeure', icon: MessageSquare, count: templates.filter(t => t.category === 'notices').length },
    { id: 'contracts', name: 'Contrats/Devis', icon: FileText, count: templates.filter(t => t.category === 'contracts').length },
    { id: 'legal', name: 'Procédures', icon: Scale, count: templates.filter(t => t.category === 'legal').length },
    { id: 'invoices', name: 'Facturation', icon: Receipt, count: templates.filter(t => t.category === 'invoices').length }
  ];

  const variables = [
    '[NOM_CLIENT]', '[NUMERO_FACTURE]', '[MONTANT]', '[DATE_EMISSION]',
    '[DATE_ECHEANCE]', '[NB_JOURS]', '[NOM_ENTREPRISE]', '[ADRESSE_ENTREPRISE]'
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleEditTemplate = (template: Template) => {
    setCurrentTemplate(template);
    setIsEditModalOpen(true);
  };

  const handleCreateTemplate = () => {
    setCurrentTemplate({
      id: '',
      name: '',
      category: 'reminders',
      description: '',
      content: '',
      type: 'EMAIL',
      status: 'draft',
      usage: 0,
      performance: {}
    });
    setIsEditModalOpen(true);
  };

  const handleSaveTemplate = () => {
    if (!currentTemplate) return;
    
    if (currentTemplate.id) {
      // Modifier template existant
      setTemplates(prev => prev.map(t => t.id === currentTemplate.id ? currentTemplate : t));
    } else {
      // Nouveau template
      const newTemplate = { ...currentTemplate, id: Date.now().toString() };
      setTemplates(prev => [...prev, newTemplate]);
    }
    
    setIsEditModalOpen(false);
    setCurrentTemplate(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">✅ Actif</Badge>;
      case 'draft':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">⏳ Brouillon</Badge>;
      case 'archived':
        return <Badge variant="outline" className="bg-gray-100 text-gray-600">📦 Archivé</Badge>;
      default:
        return null;
    }
  };

  const insertVariable = (variable: string) => {
    if (!currentTemplate) return;
    
    const textarea = document.getElementById('templateContent') as HTMLTextAreaElement;
    if (textarea) {
      const cursorPos = textarea.selectionStart;
      const textBefore = currentTemplate.content.substring(0, cursorPos);
      const textAfter = currentTemplate.content.substring(cursorPos);
      
      setCurrentTemplate({
        ...currentTemplate,
        content: textBefore + variable + textAfter
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/settings')}
          className="text-white hover:bg-white/20 mb-4"
        >
          ← Retour aux paramètres
        </Button>
        <h1 className="text-2xl font-bold mb-2">📝 Gestion des Templates Juridiques</h1>
        <p className="opacity-90">Personnalisation et automatisation de vos documents légaux</p>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Bibliothèque de Templates</h2>
        <div className="flex gap-3">
          <Button variant="outline">📥 Importer</Button>
          <Button onClick={handleCreateTemplate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">📂 Catégories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <div
                      key={category.id}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                        selectedCategory === category.id 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Templates disponibles ({filteredTemplates.length})</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un template..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTemplates.map(template => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-xs">
                          {template.type}
                        </Badge>
                        {getStatusBadge(template.status)}
                      </div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="bg-gray-50 p-3 rounded text-xs font-mono mb-3 max-h-20 overflow-hidden relative">
                        {template.content.substring(0, 120)}...
                        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-50 to-transparent" />
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-3">
                        Utilisé {template.usage} fois
                      </div>
                      
                      {/* Performance Metrics */}
                      {Object.keys(template.performance).length > 0 && (
                        <div className="bg-blue-50 p-2 rounded text-xs mb-3">
                          <div className="font-semibold text-blue-700 mb-1">📊 Performances</div>
                          <div className="grid grid-cols-3 gap-2">
                            {Object.entries(template.performance).map(([key, value]) => (
                              <div key={key} className="text-center">
                                <div className="font-bold text-blue-600">{value}%</div>
                                <div className="text-blue-500 text-xs">
                                  {key === 'openRate' ? 'Ouverture' :
                                   key === 'responseRate' ? 'Réponse' :
                                   key === 'paymentRate' ? 'Paiement' :
                                   key === 'deliveryRate' ? 'Livraison' :
                                   key === 'clickRate' ? 'Clic' :
                                   key === 'successRate' ? 'Succès' : key}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="flex-1 text-xs">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex-1 text-xs"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 text-xs">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {currentTemplate?.id ? 'Éditer le template' : 'Nouveau template'}
            </DialogTitle>
          </DialogHeader>
          
          {currentTemplate && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="templateName">Nom du template</Label>
                  <Input
                    id="templateName"
                    value={currentTemplate.name}
                    onChange={(e) => setCurrentTemplate({...currentTemplate, name: e.target.value})}
                    placeholder="Nom du template"
                  />
                </div>

                <div>
                  <Label htmlFor="templateCategory">Catégorie</Label>
                  <Select
                    value={currentTemplate.category}
                    onValueChange={(value) => setCurrentTemplate({...currentTemplate, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reminders">📧 Relances</SelectItem>
                      <SelectItem value="notices">📮 Mises en demeure</SelectItem>
                      <SelectItem value="contracts">📋 Contrats/Devis</SelectItem>
                      <SelectItem value="legal">⚖️ Procédures</SelectItem>
                      <SelectItem value="invoices">🧾 Facturation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="templateDescription">Description</Label>
                  <Textarea
                    id="templateDescription"
                    value={currentTemplate.description}
                    onChange={(e) => setCurrentTemplate({...currentTemplate, description: e.target.value})}
                    placeholder="Description du template"
                    rows={2}
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-semibold text-blue-700 mb-2">📝 Variables disponibles</div>
                  <div className="flex flex-wrap gap-1">
                    {variables.map(variable => (
                      <Button
                        key={variable}
                        variant="outline"
                        size="sm"
                        className="text-xs h-6"
                        onClick={() => insertVariable(variable)}
                      >
                        {variable}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="templateContent">Contenu</Label>
                  <Textarea
                    id="templateContent"
                    value={currentTemplate.content}
                    onChange={(e) => setCurrentTemplate({...currentTemplate, content: e.target.value})}
                    placeholder="Contenu du template..."
                    rows={15}
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <Label>👁️ Aperçu</Label>
                <div className="bg-gray-50 p-3 rounded border text-sm h-96 overflow-y-auto">
                  {currentTemplate.content
                    .replace(/\[NOM_CLIENT\]/g, 'SARL Exemple')
                    .replace(/\[NUMERO_FACTURE\]/g, 'FAC-2024-001')
                    .replace(/\[MONTANT\]/g, '3 450,00')
                    .replace(/\[DATE_EMISSION\]/g, '15/11/2024')
                    .replace(/\[DATE_ECHEANCE\]/g, '15/12/2024')
                    .replace(/\[NB_JOURS\]/g, '45')
                    .replace(/\[NOM_ENTREPRISE\]/g, 'Votre Entreprise')
                    .replace(/\[ADRESSE_ENTREPRISE\]/g, '123 Rue Example, 13000 Marseille')
                    .split('\n')
                    .map((line, index) => (
                      <div key={index}>{line || <br />}</div>
                    ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="outline">
              🧪 Tester
            </Button>
            <Button onClick={handleSaveTemplate}>
              💾 Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestionTemplates;