import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Eye, Edit2, Copy, Mail, MessageSquare, FileText, Scale, Receipt, Trash2, X } from "lucide-react";
import { useTemplates, Template } from '@/hooks/use-templates';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
export const TemplatesTab = () => {
  const isMobile = useIsMobile();
  const {
    templates,
    isLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    toggleTemplateStatus
  } = useTemplates();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
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

  const handleSaveTemplate = async () => {
    if (!currentTemplate) return;
    
    if (currentTemplate.id) {
      // Modifier template existant
      await updateTemplate(currentTemplate.id, currentTemplate);
    } else {
      // Nouveau template
      await createTemplate(currentTemplate);
    }
    
    setIsEditModalOpen(false);
    setCurrentTemplate(null);
  };

  const handlePreviewTemplate = (template: Template) => {
    setPreviewTemplate(template);
    setIsPreviewModalOpen(true);
  };

  const handleDeleteTemplate = async (template: Template) => {
    await deleteTemplate(template.id);
  };

  const toggleTemplateStatusHandler = async (template: Template) => {
    await toggleTemplateStatus(template);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">✅ Actif</Badge>;
      case 'draft':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">⏳ Brouillon</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-red-100 text-red-600">❌ Inactif</Badge>;
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">📝 Gestion des Templates Juridiques</h2>
        <p className="opacity-90">Personnalisation et automatisation de vos documents légaux</p>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h3 className="text-lg sm:text-xl font-semibold">Bibliothèque de Templates</h3>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button variant="outline" className="w-full sm:w-auto">📥 Importer</Button>
          <Button onClick={handleCreateTemplate} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau template
          </Button>
        </div>
      </div>

      {/* Mobile Categories - Horizontal scroll */}
      <div className="lg:hidden">
        <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 scrollbar-hide">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                className={`flex items-center gap-2 px-4 py-3 rounded-full whitespace-nowrap transition-colors flex-shrink-0 ${
                  selectedCategory === category.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{category.name}</span>
                <Badge variant={selectedCategory === category.id ? "secondary" : "outline"} className="text-xs ml-1">
                  {category.count}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Desktop only */}
        <div className="hidden lg:block lg:col-span-1">
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
                      className={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors ${
                        selectedCategory === category.id 
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-muted'
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
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <CardTitle className="text-base sm:text-lg">Templates disponibles ({filteredTemplates.length})</CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-xs">
                          {template.type}
                        </Badge>
                        <div 
                          className="cursor-pointer" 
                          onClick={() => toggleTemplateStatusHandler(template)}
                          title="Cliquer pour activer/désactiver"
                        >
                          {getStatusBadge(template.status)}
                        </div>
                      </div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="bg-muted p-3 rounded text-xs font-mono mb-3 max-h-20 overflow-hidden relative">
                        {template.content.substring(0, 120)}...
                        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-muted to-transparent" />
                      </div>
                      
                      <div className="text-xs text-muted-foreground mb-3">
                        Utilisé {template.usage} fois
                      </div>
                      
                      {/* Performance Metrics */}
                      {Object.keys(template.performance).length > 0 && (
                        <div className="bg-primary/5 p-2 rounded text-xs mb-3">
                          <div className="font-semibold text-primary mb-1">📊 Performances</div>
                          <div className="grid grid-cols-3 gap-2">
                            {Object.entries(template.performance).map(([key, value]) => (
                              <div key={key} className="text-center">
                                <div className="font-bold text-primary">{value}%</div>
                                <div className="text-primary/70 text-xs">
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
                      
                      {/* Action buttons - larger on mobile */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="p-3 h-auto"
                          onClick={() => handlePreviewTemplate(template)}
                          title="Aperçu du template"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="p-3 h-auto"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="p-3 h-auto">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="p-3 h-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                              title="Supprimer le template"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer le template "{template.name}" ? 
                                Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteTemplate(template)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Modal - Sheet on mobile, Dialog on desktop */}
      {isMobile ? (
        <Sheet open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <SheetContent side="bottom" className="h-[95vh] flex flex-col p-0">
            <SheetHeader className="p-4 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <SheetTitle>
                  {currentTemplate?.id ? 'Éditer le template' : 'Nouveau template'}
                </SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </div>
            </SheetHeader>
            
            {currentTemplate && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <Label htmlFor="templateNameMobile">Nom du template</Label>
                  <Input
                    id="templateNameMobile"
                    value={currentTemplate.name}
                    onChange={(e) => setCurrentTemplate({...currentTemplate, name: e.target.value})}
                    placeholder="Nom du template"
                  />
                </div>

                <div>
                  <Label htmlFor="templateCategoryMobile">Catégorie</Label>
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
                  <Label htmlFor="templateDescriptionMobile">Description</Label>
                  <Textarea
                    id="templateDescriptionMobile"
                    value={currentTemplate.description}
                    onChange={(e) => setCurrentTemplate({...currentTemplate, description: e.target.value})}
                    placeholder="Description du template"
                    rows={2}
                  />
                </div>

                <div className="bg-primary/5 p-3 rounded">
                  <div className="font-semibold text-primary mb-2">📝 Variables disponibles</div>
                  <div className="flex overflow-x-auto gap-2 pb-2 -mx-1 px-1">
                    {variables.map(variable => (
                      <Button
                        key={variable}
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 px-3 flex-shrink-0"
                        onClick={() => insertVariable(variable)}
                      >
                        {variable}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="templateContentMobile">Contenu</Label>
                  <Textarea
                    id="templateContentMobile"
                    value={currentTemplate.content}
                    onChange={(e) => setCurrentTemplate({...currentTemplate, content: e.target.value})}
                    placeholder="Contenu du template..."
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>

                <div>
                  <Label>👁️ Aperçu</Label>
                  <div className="bg-muted p-3 rounded border text-sm max-h-60 overflow-y-auto">
                    {currentTemplate.content
                      .replace(/\[NOM_CLIENT\]/g, 'SARL Exemple')
                      .replace(/\[NUMERO_FACTURE\]/g, 'FAC-2024-001')
                      .replace(/\[MONTANT\]/g, '3 450,00')
                      .replace(/\[DATE_EMISSION\]/g, '15/01/2024')
                      .replace(/\[DATE_ECHEANCE\]/g, '15/02/2024')
                      .replace(/\[NB_JOURS\]/g, '30')
                      .replace(/\[NOM_ENTREPRISE\]/g, 'Votre Entreprise')
                      .replace(/\[ADRESSE_ENTREPRISE\]/g, '123 Rue de la République, 75001 Paris')
                      .split('\n').map((line, index) => (
                        <div key={index}>{line || <br />}</div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            <SheetFooter className="p-4 border-t flex-shrink-0">
              <div className="flex flex-col gap-2 w-full">
                <Button onClick={handleSaveTemplate} className="w-full">
                  💾 Enregistrer
                </Button>
                <Button variant="outline" className="w-full">
                  🧪 Tester le template
                </Button>
                <Button variant="ghost" onClick={() => setIsEditModalOpen(false)} className="w-full">
                  Annuler
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ) : (
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

                  <div className="bg-primary/5 p-3 rounded">
                    <div className="font-semibold text-primary mb-2">📝 Variables disponibles</div>
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
                  <div className="bg-muted p-3 rounded border text-sm h-96 overflow-y-auto">
                    {currentTemplate.content
                      .replace(/\[NOM_CLIENT\]/g, 'SARL Exemple')
                      .replace(/\[NUMERO_FACTURE\]/g, 'FAC-2024-001')
                      .replace(/\[MONTANT\]/g, '3 450,00')
                      .replace(/\[DATE_EMISSION\]/g, '15/01/2024')
                      .replace(/\[DATE_ECHEANCE\]/g, '15/02/2024')
                      .replace(/\[NB_JOURS\]/g, '30')
                      .replace(/\[NOM_ENTREPRISE\]/g, 'Votre Entreprise')
                      .replace(/\[ADRESSE_ENTREPRISE\]/g, '123 Rue de la République, 75001 Paris')
                      .split('\n').map((line, index) => (
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
                🧪 Tester le template
              </Button>
              <Button onClick={handleSaveTemplate}>
                💾 Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Preview Modal - Sheet on mobile, Dialog on desktop */}
      {isMobile ? (
        <Sheet open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
          <SheetContent side="bottom" className="h-[95vh] flex flex-col p-0">
            <SheetHeader className="p-4 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-base">
                  👁️ Aperçu - {previewTemplate?.name}
                </SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </div>
            </SheetHeader>
            
            {previewTemplate && (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="bg-background p-4 rounded border text-sm">
                  {previewTemplate.content
                    .replace(/\[NOM_CLIENT\]/g, 'SARL Exemple')
                    .replace(/\[NUMERO_FACTURE\]/g, 'FAC-2024-001')
                    .replace(/\[MONTANT\]/g, '3 450,00')
                    .replace(/\[DATE_EMISSION\]/g, '15/01/2024')
                    .replace(/\[DATE_ECHEANCE\]/g, '15/02/2024')
                    .replace(/\[NB_JOURS\]/g, '30')
                    .replace(/\[NOM_ENTREPRISE\]/g, 'Votre Entreprise')
                    .replace(/\[ADRESSE_ENTREPRISE\]/g, '123 Rue de la République, 75001 Paris')
                    .split('\n').map((line, index) => (
                      <div key={index} className="mb-1">{line || <br />}</div>
                    ))}
                </div>
              </div>
            )}

            <SheetFooter className="p-4 border-t flex-shrink-0">
              <div className="flex flex-col gap-2 w-full">
                <Button onClick={() => {
                  if (previewTemplate) {
                    handleEditTemplate(previewTemplate);
                    setIsPreviewModalOpen(false);
                  }
                }} className="w-full">
                  ✏️ Éditer ce template
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      🗑️ Supprimer ce template
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer le template "{previewTemplate?.name}" ? 
                        Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => {
                          if (previewTemplate) {
                            handleDeleteTemplate(previewTemplate);
                            setIsPreviewModalOpen(false);
                          }
                        }}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button variant="ghost" onClick={() => setIsPreviewModalOpen(false)} className="w-full">
                  Fermer
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                👁️ Aperçu du template - {previewTemplate?.name}
              </DialogTitle>
            </DialogHeader>
            
            {previewTemplate && (
              <div className="overflow-y-auto max-h-[70vh]">
                <div className="bg-background p-6 rounded border text-sm">
                  {previewTemplate.content
                    .replace(/\[NOM_CLIENT\]/g, 'SARL Exemple')
                    .replace(/\[NUMERO_FACTURE\]/g, 'FAC-2024-001')
                    .replace(/\[MONTANT\]/g, '3 450,00')
                    .replace(/\[DATE_EMISSION\]/g, '15/01/2024')
                    .replace(/\[DATE_ECHEANCE\]/g, '15/02/2024')
                    .replace(/\[NB_JOURS\]/g, '30')
                    .replace(/\[NOM_ENTREPRISE\]/g, 'Votre Entreprise')
                    .replace(/\[ADRESSE_ENTREPRISE\]/g, '123 Rue de la République, 75001 Paris')
                    .split('\n').map((line, index) => (
                      <div key={index} className="mb-1">{line || <br />}</div>
                    ))}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPreviewModalOpen(false)}>
                Fermer
              </Button>
              <Button onClick={() => {
                if (previewTemplate) {
                  handleEditTemplate(previewTemplate);
                  setIsPreviewModalOpen(false);
                }
              }}>
                ✏️ Éditer ce template
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    🗑️ Supprimer ce template
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir supprimer le template "{previewTemplate?.name}" ? 
                      Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => {
                        if (previewTemplate) {
                          handleDeleteTemplate(previewTemplate);
                          setIsPreviewModalOpen(false);
                        }
                      }}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};