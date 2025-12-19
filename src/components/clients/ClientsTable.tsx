
import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Eye, Pencil, Trash, UserPlus, Car, ChevronLeft, ChevronRight } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { useTableSorting, SortDirection } from '@/hooks/use-table-sorting';
import { Client } from '@/services/supabase/clients';
import { useIsMobile } from '@/hooks/use-mobile';
import { ClientMobileCard } from './ClientMobileCard';
import { RequestDocumentsButton } from './RequestDocumentsButton';
import { ClientSortOption } from './ClientsFilters';

const ITEMS_PER_PAGE = 30;

interface ClientsTableProps {
  clients: Client[];
  onViewClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
  onCreateVehicle?: (client: Client) => void;
  onRequestDocuments?: (client: Client) => void;
  highlightedClientId?: string | null;
  sortOption: ClientSortOption;
}

// Convertir l'option de tri en clé et direction
const getSortConfig = (sortOption: ClientSortOption): { key: string; direction: SortDirection } => {
  switch (sortOption) {
    case 'alphabetical-asc':
      return { key: 'fullName', direction: 'asc' };
    case 'alphabetical-desc':
      return { key: 'fullName', direction: 'desc' };
    case 'recent-first':
      return { key: 'created_at', direction: 'desc' };
    case 'oldest-first':
      return { key: 'created_at', direction: 'asc' };
    default:
      return { key: 'fullName', direction: 'asc' };
  }
};

const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  onViewClient,
  onEditClient,
  onDeleteClient,
  onCreateVehicle,
  onRequestDocuments,
  highlightedClientId,
  sortOption
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { key: sortKey, direction: sortDirection } = useMemo(() => getSortConfig(sortOption), [sortOption]);
  
  // Ajouter un champ fullName calculé pour le tri alphabétique sur nom complet
  const clientsWithFullName = useMemo(() => {
    return clients.map(client => ({
      ...client,
      fullName: `${client.first_name || ''} ${client.last_name || ''}`.trim().toLowerCase()
    }));
  }, [clients]);
  
  const { sortedData: sortedClients } = useTableSorting(clientsWithFullName, sortKey, sortDirection);
  const isMobile = useIsMobile();
  const highlightedRef = useRef<HTMLTableRowElement>(null);
  const highlightedMobileRef = useRef<HTMLDivElement>(null);

  // Pagination
  const totalPages = Math.ceil(sortedClients.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedClients = sortedClients.slice(startIndex, endIndex);

  // Reset page when clients or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [clients.length, sortOption]);

  // Scroll to highlighted client and adjust page if needed
  useEffect(() => {
    if (highlightedClientId) {
      const clientIndex = sortedClients.findIndex(c => c.id === highlightedClientId);
      if (clientIndex !== -1) {
        const targetPage = Math.floor(clientIndex / ITEMS_PER_PAGE) + 1;
        if (targetPage !== currentPage) {
          setCurrentPage(targetPage);
        }
      }
      
      const ref = isMobile ? highlightedMobileRef : highlightedRef;
      if (ref.current) {
        setTimeout(() => {
          ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [highlightedClientId, isMobile, sortedClients, currentPage]);

  const PaginationControls = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
        <div className="text-sm text-muted-foreground">
          {sortedClients.length} client{sortedClients.length > 1 ? 's' : ''} au total
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Suivant
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };
  
  if (isMobile) {
    return (
      <div className="space-y-4">
        {paginatedClients.length > 0 ? (
          <>
            {paginatedClients.map((client) => (
              <ClientMobileCard
                key={client.id}
                client={client}
                onViewClient={onViewClient}
                onEditClient={onEditClient}
                onDeleteClient={onDeleteClient}
                onCreateVehicle={onCreateVehicle}
                onRequestDocuments={onRequestDocuments}
                isHighlighted={highlightedClientId === client.id}
                highlightedRef={highlightedClientId === client.id ? highlightedMobileRef : undefined}
              />
            ))}
            <PaginationControls />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <UserPlus className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">Aucun résultat</h3>
            <p className="text-gray-500">
              Aucun client correspondant à votre recherche n'a été trouvé.
            </p>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="card-container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Permis de conduire</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedClients.length > 0 ? (
            paginatedClients.map((client) => {
              const clientData = client as any;
              const isEntreprise = clientData.client_type === 'entreprise';
              const hasFrontLicense = clientData.driver_license_front_url;
              const hasBackLicense = clientData.driver_license_back_url;
              const hasCompleteLicense = hasFrontLicense && hasBackLicense;

              const isHighlighted = highlightedClientId === client.id;
              
              return (
                <React.Fragment key={client.id}>
                  <TableRow 
                    ref={isHighlighted ? highlightedRef : undefined}
                    className={`hover:bg-gray-50 border-b-0 ${isHighlighted ? 'highlight-client' : ''}`}
                  >
                    <TableCell className="font-medium">
                      {client.first_name} {client.last_name}
                    </TableCell>
                    <TableCell>{client.email || '-'}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>{client.city}</TableCell>
                    <TableCell>
                      {isEntreprise ? (
                        <StatusBadge 
                          status="Entreprise"
                          className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                        />
                      ) : (
                        <StatusBadge 
                          status={hasCompleteLicense ? "Permis importé" : "Pas de permis"}
                          className={hasCompleteLicense ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-amber-100 text-amber-800 hover:bg-amber-100"}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow className={`border-t-0 ${isHighlighted ? 'highlight-client' : ''}`}>
                    <TableCell colSpan={5} className="py-3 border-t-0">
                      <div className="flex flex-wrap gap-2 justify-end px-4">
                        <Button variant="view" size="sm" onClick={() => onViewClient(client)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button variant="edit" size="sm" onClick={() => onEditClient(client)}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button variant="create" size="sm" className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white" onClick={() => onCreateVehicle?.(client)}>
                          <Car className="h-4 w-4 mr-1" />
                          Nouveau véhicule
                        </Button>
                        {onRequestDocuments && (
                          <RequestDocumentsButton
                            client={client}
                            onRequestDocuments={onRequestDocuments}
                          />
                        )}
                        <Button variant="delete" size="sm" onClick={() => onDeleteClient(client)}>
                          <Trash className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                <div className="flex flex-col items-center justify-center py-8">
                  <UserPlus className="h-10 w-10 text-gray-400 mb-2" />
                  <h3 className="font-medium text-gray-900">Aucun résultat</h3>
                  <p className="text-gray-500 mt-1">
                    Aucun client correspondant à votre recherche n'a été trouvé.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <PaginationControls />
    </div>
  );
};

export default ClientsTable;
