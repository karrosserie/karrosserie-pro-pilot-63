import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, MapPin, Phone, Mail, Plus, Search, Filter } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface EmployeePlanningTabProps {
  employees?: any[];
  schedules?: any[];
}

export const EmployeePlanningTab = ({ employees = [], schedules = [] }: EmployeePlanningTabProps) => {
  console.log('🔍 EmployeePlanningTab - Data received:', {
    employeesCount: employees.length,
    schedulesCount: schedules.length,
    schedulesStructure: schedules.slice(0, 2).map(s => ({
      id: s.id,
      dateAssignation: s.dateAssignation,
      heure: s.heure,
      technicien: s.technicien,
      user_id: s.user_id,
      allKeys: Object.keys(s)
    }))
  });
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrer les employés actifs
  const activeEmployees = employees.filter(emp => emp.actif);

  // Filtrer les tâches par employé et date
  const getEmployeeTasks = (employeeId: string) => {
    return schedules.filter(schedule => {
      // Handle both schedule structures
      if (schedule.dateAssignation) {
        // New structure from planningTaches
        return schedule.user_id === employeeId && schedule.dateAssignation === selectedDate;
      } else if (schedule.start_datetime) {
        // Old structure from employee_schedule
        const startDate = new Date(schedule.start_datetime);
        if (isNaN(startDate.getTime())) return false;
        const scheduleDate = startDate.toISOString().split('T')[0];
        return schedule.user_id === employeeId && scheduleDate === selectedDate;
      }
      return false;
    });
  };

  // Calculer les statistiques pour un employé
  const getEmployeeStats = (employeeId: string) => {
    const tasks = getEmployeeTasks(employeeId);
    const completedTasks = tasks.filter(t => t.status === 'Terminé' || t.status === 'termine');
    const inProgressTasks = tasks.filter(t => t.status === 'En cours' || t.status === 'en_cours');
    
    // Calculer le temps total
    const totalTime = tasks.reduce((acc, task) => {
      if (task.heure) {
        // New structure: parse heure format "12h-13h"
        const timeRange = task.heure.replace(/h/g, ':');
        const [startTime, endTime] = timeRange.split('-');
        if (startTime && endTime) {
          const [startHour, startMin = '0'] = startTime.split(':').map(Number);
          const [endHour, endMin = '0'] = endTime.split(':').map(Number);
          const duration = (endHour + endMin/60) - (startHour + startMin/60);
          return acc + duration;
        }
      } else if (task.start_datetime && task.end_datetime) {
        // Old structure: calculate from datetime
        const start = new Date(task.start_datetime);
        const end = new Date(task.end_datetime);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return acc;
        return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }
      return acc;
    }, 0);

    return {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      inProgressTasks: inProgressTasks.length,
      totalTime: totalTime.toFixed(1)
    };
  };

  // Filtrer les employés selon la recherche
  const filteredEmployees = activeEmployees.filter(emp => 
    emp.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedEmployees = selectedEmployee === 'all' 
    ? filteredEmployees 
    : filteredEmployees.filter(emp => emp.user_id === selectedEmployee);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Planning des Employés</h2>
        <p className="text-muted-foreground mb-4">
          Visualisez et gérez les plannings individuels de vos employés
        </p>
      </div>

      {/* Filtres et contrôles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un employé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
          </div>
          
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tous les employés" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les employés</SelectItem>
              {activeEmployees.map((employee) => (
                <SelectItem key={employee.user_id} value={employee.user_id}>
                  {employee.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-[150px]"
          />
        </div>

        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle tâche
        </Button>
      </div>

      {/* Liste des employés et leurs plannings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayedEmployees.map((employee) => {
          const tasks = getEmployeeTasks(employee.user_id);
          const stats = getEmployeeStats(employee.user_id);

          return (
            <Card key={employee.user_id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10">
                      {employee.nom.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{employee.nom}</CardTitle>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 min-w-0">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{employee.email || 'Non renseigné'}</span>
                      </div>
                      {employee.telephone && (
                        <div className="flex items-center gap-1 min-w-0">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{employee.telephone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs whitespace-nowrap flex-shrink-0">
                    {employee.role}
                  </Badge>
                </div>

                {/* Statistiques journalières */}
                <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="font-semibold text-primary">{stats.totalTasks}</div>
                    <div className="text-muted-foreground text-xs">Tâches</div>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="font-semibold text-primary">{stats.totalTime}h</div>
                    <div className="text-muted-foreground text-xs">Temps</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {tasks.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucune tâche planifiée</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {tasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm">
                                {task.task_type || task.tache}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {task.vehicule || task.vehicles?.license_plate} • {task.client || 
                                  (task.vehicles?.clients ? 
                                    `${task.vehicles.clients.first_name} ${task.vehicles.clients.last_name}` : 
                                    'Client non renseigné')}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="h-3 w-3 flex-shrink-0" />
                                <span className="text-xs">
                                  {task.heure || (() => {
                                    if (!task.start_datetime) return '--:--';
                                    const startDate = new Date(task.start_datetime);
                                    const startTime = !isNaN(startDate.getTime()) 
                                      ? startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                                      : '--:--';
                                    
                                    if (!task.end_datetime) return startTime;
                                    
                                    const endDate = new Date(task.end_datetime);
                                    const endTime = !isNaN(endDate.getTime())
                                      ? endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                                      : '--:--';
                                    
                                    return `${startTime} - ${endTime}`;
                                  })()}
                                </span>
                              </div>
                            </div>
                            <Badge 
                              variant={
                                (task.status === 'Terminé' || task.status === 'termine') ? 'default' : 
                                (task.status === 'En cours' || task.status === 'en_cours') ? 'secondary' : 'outline'
                              }
                              className="text-xs whitespace-nowrap flex-shrink-0"
                            >
                              {task.status === 'termine' ? 'Terminé' : 
                               task.status === 'en_cours' ? 'En cours' : 
                               task.status === 'planifie' ? 'Planifié' : 
                               task.status}
                            </Badge>
                          </div>
                        </div>
                    ))}
                  </div>
                )}

                {/* Qualifications */}
                {employee.qualifications && employee.qualifications.length > 0 && (
                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground mb-1">Qualifications</div>
                    <div className="flex flex-wrap gap-1">
                      {employee.qualifications.slice(0, 3).map((qual: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {qual}
                        </Badge>
                      ))}
                      {employee.qualifications.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{employee.qualifications.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-8">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-lg font-medium mb-1">Aucun employé trouvé</p>
          <p className="text-muted-foreground">
            {searchQuery ? 'Essayez de modifier votre recherche' : 'Aucun employé actif dans votre équipe'}
          </p>
        </div>
      )}
    </div>
  );
};