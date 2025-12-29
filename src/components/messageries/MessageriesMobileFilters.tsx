import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
}

interface MessageriesMobileFiltersProps {
  searchTerm: string;
  selectedType: string;
  selectedClient: string;
  selectedPeriod: string;
  selectedPriority: string;
  selectedCategory: string;
  selectedStatus: string;
  clients: Client[];
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onClientChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function MessageriesMobileFilters({
  searchTerm,
  selectedType,
  selectedClient,
  selectedPeriod,
  selectedPriority,
  selectedCategory,
  selectedStatus,
  clients,
  onSearchChange,
  onTypeChange,
  onClientChange,
  onPeriodChange,
  onPriorityChange,
  onCategoryChange,
  onStatusChange,
}: MessageriesMobileFiltersProps) {
  const [open, setOpen] = useState(false);

  // Compter les filtres actifs
  const activeFiltersCount = [
    selectedType !== 'all',
    selectedClient !== 'all',
    selectedPeriod !== 'all',
    selectedPriority !== 'all',
    selectedCategory !== 'all',
    selectedStatus !== 'all',
  ].filter(Boolean).length;

  const resetAllFilters = () => {
    onTypeChange('all');
    onClientChange('all');
    onPeriodChange('all');
    onPriorityChange('all');
    onCategoryChange('all');
    onStatusChange('all');
  };

  return (
    <div className="mb-4 space-y-3">
      {/* Barre de recherche toujours visible */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-20"
        />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 gap-1"
            >
              <Filter className="h-4 w-4" />
              Filtres
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
            <SheetHeader className="pb-4">
              <div className="flex items-center justify-between">
                <SheetTitle>Filtres</SheetTitle>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={resetAllFilters} className="text-muted-foreground">
                    <X className="h-4 w-4 mr-1" />
                    Effacer tout
                  </Button>
                )}
              </div>
            </SheetHeader>
            
            <div className="space-y-4 overflow-y-auto pb-20">
              <div className="space-y-2">
                <label className="text-sm font-medium">Canal</label>
                <Select value={selectedType} onValueChange={onTypeChange}>
                  <SelectTrigger><SelectValue placeholder="Tous les canaux" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les canaux</SelectItem>
                    <SelectItem value="Téléphone">📞 Téléphone</SelectItem>
                    <SelectItem value="Mail">✉️ Mail</SelectItem>
                    <SelectItem value="WhatsApp">💬 WhatsApp</SelectItem>
                    <SelectItem value="Message">📱 Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Client</label>
                <Select value={selectedClient} onValueChange={onClientChange}>
                  <SelectTrigger><SelectValue placeholder="Tous les clients" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les clients</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.first_name} {client.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Période</label>
                <Select value={selectedPeriod} onValueChange={onPeriodChange}>
                  <SelectTrigger><SelectValue placeholder="Toutes les périodes" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les périodes</SelectItem>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priorité</label>
                <Select value={selectedPriority} onValueChange={onPriorityChange}>
                  <SelectTrigger><SelectValue placeholder="Toutes les urgences" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les urgences</SelectItem>
                    <SelectItem value="1">🔴 Urgents</SelectItem>
                    <SelectItem value="2">🟠 Haute priorité</SelectItem>
                    <SelectItem value="3">🟡 Normale</SelectItem>
                    <SelectItem value="4">🔵 Basse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie</label>
                <Select value={selectedCategory} onValueChange={onCategoryChange}>
                  <SelectTrigger><SelectValue placeholder="Toutes les catégories" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="sinistre">🚗 Sinistre</SelectItem>
                    <SelectItem value="devis">💰 Devis</SelectItem>
                    <SelectItem value="sav">🔧 SAV</SelectItem>
                    <SelectItem value="reclamation">⚠️ Réclamation</SelectItem>
                    <SelectItem value="information">ℹ️ Information</SelectItem>
                    <SelectItem value="facturation">📄 Facturation</SelectItem>
                    <SelectItem value="autre">📦 Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <Select value={selectedStatus} onValueChange={onStatusChange}>
                  <SelectTrigger><SelectValue placeholder="Tous les statuts" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="nouveau">🆕 Nouveau</SelectItem>
                    <SelectItem value="en_cours">⏳ En cours</SelectItem>
                    <SelectItem value="en_attente_client">⏸️ En attente client</SelectItem>
                    <SelectItem value="planifie">📅 Planifié</SelectItem>
                    <SelectItem value="resolu">✅ Résolu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bouton appliquer en bas */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
                <Button className="w-full" onClick={() => setOpen(false)}>
                  Appliquer les filtres
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
