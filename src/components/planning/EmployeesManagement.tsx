import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Plus, Edit, Trash2, Search, Award, Clock } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  qualifications: string[];
  hourlyRate: number;
  weeklyHours: number;
  status: 'Actif' | 'Inactif' | 'Congés';
  joinDate: string;
}

const availableQualifications = [
  'Carrosserie',
  'Peinture',
  'Mécanique',
  'Électricité',
  'Diagnostic',
  'Soudure',
  'Débosselage',
  'Polissage'
];

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Sophie Martin',
    email: 'sophie.martin@garage.fr',
    phone: '06 12 34 56 78',
    role: 'Technicien Peinture',
    qualifications: ['Peinture', 'Préparation', 'Polissage'],
    hourlyRate: 25,
    weeklyHours: 35,
    status: 'Actif',
    joinDate: '2023-01-15'
  },
  {
    id: '2',
    name: 'Martin Dubois',
    email: 'martin.dubois@garage.fr',
    phone: '06 98 76 54 32',
    role: 'Technicien Carrosserie',
    qualifications: ['Carrosserie', 'Débosselage', 'Soudure'],
    hourlyRate: 28,
    weeklyHours: 35,
    status: 'Actif',
    joinDate: '2022-06-01'
  },
  {
    id: '3',
    name: 'Julie Blanc',
    email: 'julie.blanc@garage.fr',
    phone: '06 55 44 33 22',
    role: 'Technicien Junior',
    qualifications: ['Carrosserie', 'Peinture'],
    hourlyRate: 20,
    weeklyHours: 35,
    status: 'Actif',
    joinDate: '2023-09-01'
  },
  {
    id: '4',
    name: 'Pierre Moreau',
    email: 'pierre.moreau@garage.fr',
    phone: '06 11 22 33 44',
    role: 'Chef d\'équipe',
    qualifications: ['Carrosserie', 'Peinture', 'Mécanique', 'Management'],
    hourlyRate: 32,
    weeklyHours: 35,
    status: 'Congés',
    joinDate: '2021-03-15'
  }
];

export const EmployeesManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: '',
    email: '',
    phone: '',
    role: '',
    qualifications: [],
    hourlyRate: 20,
    weeklyHours: 35,
    status: 'Actif'
  });

  const getStatusBadge = (status: Employee['status']) => {
    switch (status) {
      case 'Actif':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'Inactif':
        return <Badge className="bg-red-100 text-red-800">Inactif</Badge>;
      case 'Congés':
        return <Badge className="bg-orange-100 text-orange-800">Congés</Badge>;
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.qualifications.some(q => q.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddEmployee = () => {
    const id = Date.now().toString();
    const employee: Employee = {
      ...newEmployee as Employee,
      id,
      joinDate: new Date().toISOString().split('T')[0]
    };
    setEmployees(prev => [...prev, employee]);
    setIsAddDialogOpen(false);
    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      role: '',
      qualifications: [],
      hourlyRate: 20,
      weeklyHours: 35,
      status: 'Actif'
    });
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const handleQualificationChange = (qualification: string, checked: boolean) => {
    setNewEmployee(prev => ({
      ...prev,
      qualifications: checked 
        ? [...(prev.qualifications || []), qualification]
        : (prev.qualifications || []).filter(q => q !== qualification)
    }));
  };

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'Actif').length,
    onLeave: employees.filter(e => e.status === 'Congés').length,
    avgRate: Math.round(employees.reduce((acc, emp) => acc + emp.hourlyRate, 0) / employees.length)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Gestion des Employés</h2>
          <p className="text-muted-foreground">Équipe, compétences et planning</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Ajouter un employé
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel employé</DialogTitle>
              <DialogDescription>
                Remplissez les informations de base du nouvel employé.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Jean Dupont"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Poste</Label>
                  <Select value={newEmployee.role} onValueChange={(value) => setNewEmployee(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un poste" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technicien Carrosserie">Technicien Carrosserie</SelectItem>
                      <SelectItem value="Technicien Peinture">Technicien Peinture</SelectItem>
                      <SelectItem value="Technicien Junior">Technicien Junior</SelectItem>
                      <SelectItem value="Chef d'équipe">Chef d'équipe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="jean.dupont@garage.fr"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hourlyRate">Taux horaire (€)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={newEmployee.hourlyRate}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="weeklyHours">Heures hebdomadaires</Label>
                  <Input
                    id="weeklyHours"
                    type="number"
                    value={newEmployee.weeklyHours}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, weeklyHours: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div>
                <Label>Qualifications</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableQualifications.map(qualification => (
                    <div key={qualification} className="flex items-center space-x-2">
                      <Checkbox
                        id={qualification}
                        checked={newEmployee.qualifications?.includes(qualification)}
                        onCheckedChange={(checked) => handleQualificationChange(qualification, checked as boolean)}
                      />
                      <Label htmlFor={qualification} className="text-sm">{qualification}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddEmployee}>
                Ajouter l'employé
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Employés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-muted-foreground">Actifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.onLeave}</div>
            <div className="text-sm text-muted-foreground">En congés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.avgRate}€</div>
            <div className="text-sm text-muted-foreground">Taux moy./h</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom, poste ou compétence..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Employee List */}
      <div className="grid gap-6">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-3">
                    {/* Basic Info */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-semibold">{employee.name}</h3>
                      {getStatusBadge(employee.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">{employee.role}</div>

                    {/* Contact & Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="font-medium">Email:</span> {employee.email}
                      </div>
                      <div>
                        <span className="font-medium">Téléphone:</span> {employee.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="font-medium">Taux:</span> {employee.hourlyRate}€/h
                      </div>
                      <div>
                        <span className="font-medium">Heures:</span> {employee.weeklyHours}h/sem
                      </div>
                    </div>

                    {/* Qualifications */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Qualifications:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {employee.qualifications.map(qualification => (
                          <Badge key={qualification} variant="secondary" className="text-xs">
                            {qualification}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Edit className="w-3 h-3" />
                    Modifier
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteEmployee(employee.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun employé trouvé</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Modifiez votre recherche' : 'Ajoutez votre premier employé'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};