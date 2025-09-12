import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, MapPin, Phone, Mail, Plus, Search, Filter, TrendingUp, Activity } from 'lucide-react';
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
    <div className="space-y-8 animate-fade-in">
      {/* Header avec gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Planning des Employés
              </h2>
              <p className="text-slate-600 mt-1">
                Visualisez et gérez les plannings individuels de vos employés
              </p>
            </div>
          </div>
          
          {/* Stats globales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-slate-600">Employés actifs</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{activeEmployees.length}</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-slate-600">Tâches aujourd'hui</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {schedules.filter(s => s.dateAssignation === selectedDate).length}
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-slate-600">Performance</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-1">85%</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-slate-600">Temps total</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-1">32h</div>
            </div>
          </div>
        </div>
        
        {/* Décoration background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-200/20 to-pink-200/20 rounded-full translate-y-24 -translate-x-24 blur-2xl" />
      </div>

      {/* Filtres modernisés */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher un employé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
            />
          </div>
          
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-[220px] bg-slate-50 border-slate-200 focus:bg-white">
              <Filter className="h-4 w-4 mr-2 text-slate-400" />
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

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10 w-[160px] bg-slate-50 border-slate-200 focus:bg-white"
            />
          </div>
        </div>

        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover-scale">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle tâche
        </Button>
      </div>

      {/* Grille des employés */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayedEmployees.map((employee, index) => {
          const tasks = getEmployeeTasks(employee.user_id);
          const stats = getEmployeeStats(employee.user_id);

          return (
            <Card 
              key={employee.user_id} 
              className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/50 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 flex items-start gap-4">
                  <div className="relative">
                    <Avatar className="h-14 w-14 ring-4 ring-white/50 shadow-lg">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-lg">
                        {employee.nom.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {employee.nom}
                    </CardTitle>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{employee.email || 'Non renseigné'}</span>
                      </div>
                      {employee.telephone && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{employee.telephone}</span>
                        </div>
                      )}
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200"
                    >
                      {employee.role}
                    </Badge>
                  </div>
                </div>

                {/* Statistiques avec design moderne */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
                    <div className="text-xl font-bold text-blue-700">{stats.totalTasks}</div>
                    <div className="text-xs text-blue-600 font-medium">Tâches</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200/50">
                    <div className="text-xl font-bold text-green-700">{stats.completedTasks}</div>
                    <div className="text-xs text-green-600 font-medium">Terminées</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200/50">
                    <div className="text-xl font-bold text-orange-700">{stats.totalTime}h</div>
                    <div className="text-xs text-orange-600 font-medium">Temps</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {tasks.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                      <Calendar className="h-8 w-8" />
                    </div>
                    <p className="text-sm font-medium">Aucune tâche planifiée</p>
                    <p className="text-xs mt-1">Profitez de cette journée libre</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                    {tasks.map((task, taskIndex) => (
                      <div
                        key={task.id}
                        className="group/task p-4 bg-gradient-to-r from-white to-slate-50/50 rounded-xl border border-slate-200/50 hover:shadow-md hover:border-blue-200 transition-all duration-200 hover-scale"
                        style={{ animationDelay: `${(index * 100) + (taskIndex * 50)}ms` }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm mb-1">
                              {task.task_type || task.tache}
                            </div>
                            <div className="text-xs text-slate-600 mb-2 line-clamp-1">
                              {task.vehicule || task.vehicles?.license_plate} • {task.client || 
                                (task.vehicles?.clients ? 
                                  `${task.vehicles.clients.first_name} ${task.vehicles.clients.last_name}` : 
                                  'Client non renseigné')}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Clock className="h-3 w-3" />
                                <span>
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
                          </div>
                          <Badge 
                            variant={
                              (task.status === 'Terminé' || task.status === 'termine') ? 'default' : 
                              (task.status === 'En cours' || task.status === 'en_cours') ? 'secondary' : 'outline'
                            }
                            className={`text-xs whitespace-nowrap flex-shrink-0 ${
                              (task.status === 'Terminé' || task.status === 'termine') ? 'bg-green-100 text-green-800 border-green-200' :
                              (task.status === 'En cours' || task.status === 'en_cours') ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
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

                {/* Qualifications avec style moderne */}
                {employee.qualifications && employee.qualifications.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <div className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                      Qualifications
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {employee.qualifications.slice(0, 3).map((qual: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200 hover-scale">
                          {qual}
                        </Badge>
                      ))}
                      {employee.qualifications.length > 3 && (
                        <Badge variant="outline" className="text-xs bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 border-slate-200">
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
        <div className="text-center py-16 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
            <User className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun employé trouvé</h3>
          <p className="text-slate-600 max-w-md mx-auto">
            {searchQuery ? 'Essayez de modifier votre recherche ou ajustez les filtres' : 'Aucun employé actif dans votre équipe pour le moment'}
          </p>
        </div>
      )}
    </div>
  );
};