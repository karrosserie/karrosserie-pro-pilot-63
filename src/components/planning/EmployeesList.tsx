import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useEmployees, Employee } from '@/hooks/use-employees';
import { EmployeeCard } from './EmployeeCard';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface EmployeesListProps {
  onAddEmployee: () => void;
  onEditEmployee: (employee: Employee) => void;
}

export const EmployeesList: React.FC<EmployeesListProps> = ({
  onAddEmployee,
  onEditEmployee
}) => {
  const { employees, isLoading, deleteEmployee } = useEmployees();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setEmployeeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      deleteEmployee.mutate(employeeToDelete);
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange mx-auto mb-2"></div>
          <p className="text-gray-600">Chargement des employés...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton d'ajout */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestion des Employés</h2>
          <p className="text-gray-600 mt-1">Créer et gérer les profils avec leurs qualifications</p>
        </div>
        <Button 
          className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
          onClick={onAddEmployee}
        >
          <User className="w-4 h-4 mr-2" />
          Ajouter un employé
        </Button>
      </div>

      {/* Liste des employés */}
      {employees.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun employé</h3>
          <p className="text-gray-500 mb-4">
            Commencez par ajouter votre premier employé au planning.
          </p>
          <Button 
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
            onClick={onAddEmployee}
          >
            <User className="w-4 h-4 mr-2" />
            Ajouter un employé
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {employees
            .sort((a, b) => {
              const firstNameA = a.user_companies?.profiles?.first_name || '';
              const lastNameA = a.user_companies?.profiles?.last_name || '';
              const firstNameB = b.user_companies?.profiles?.first_name || '';
              const lastNameB = b.user_companies?.profiles?.last_name || '';
              
              const fullNameA = `${firstNameA} ${lastNameA}`.trim();
              const fullNameB = `${firstNameB} ${lastNameB}`.trim();
              
              return fullNameA.localeCompare(fullNameB);
            })
            .map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onEdit={onEditEmployee}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet employé ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};