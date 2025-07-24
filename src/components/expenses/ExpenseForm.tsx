
import React, { useState, useEffect } from 'react';
import { TypeProofFields } from './form/TypeProofFields';
import { BasicFields } from './form/BasicFields';
import { SupplierCategoryFields } from './form/SupplierCategoryFields';
import { VehicleAssignmentFields } from './form/VehicleAssignmentFields';
import { FormActions } from './form/FormActions';
import { ExpenseWithRelations } from '@/services/supabase/expenses';

interface ExpenseFormData {
  type: string;
  proof_url?: string;
  date: string;
  vat_amount: number | string;
  total_amount: number | string;
  supplier: string;
  category: string;
  status: string;
  assign_to_vehicle: boolean;
  vehicle_id?: string;
}

interface ExpenseFormProps {
  expense?: ExpenseWithRelations | null;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const ExpenseForm = ({
  expense,
  onSubmit,
  onCancel,
  isSubmitting
}: ExpenseFormProps) => {
  const [formData, setFormData] = useState<ExpenseFormData>({
    type: 'Note de frais',
    proof_url: '',
    date: new Date().toISOString().split('T')[0],
    vat_amount: '',
    total_amount: '',
    supplier: '',
    category: 'Autres',
    status: 'En attente',
    assign_to_vehicle: false,
    vehicle_id: ''
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        type: expense.type,
        proof_url: expense.proof_url || '',
        date: expense.date,
        vat_amount: expense.vat_amount,
        total_amount: expense.total_amount,
        supplier: expense.supplier,
        category: expense.category,
        status: expense.status || 'En attente',
        assign_to_vehicle: expense.assign_to_vehicle,
        vehicle_id: expense.vehicle_id || ''
      });
    }
  }, [expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (field: keyof ExpenseFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAnalysisComplete = (analysisData: any) => {
    console.log('Received analysis data:', analysisData);
    
    // Mapper les données de l'API aux champs du formulaire
    if (analysisData) {
      const updates: Partial<ExpenseFormData> = {};
      
      // Date
      if (analysisData.date) {
        // Convertir la date au format YYYY-MM-DD si nécessaire
        const date = new Date(analysisData.date);
        if (!isNaN(date.getTime())) {
          updates.date = date.toISOString().split('T')[0];
        }
      }
      
      // Fournisseur
      if (analysisData.name || analysisData.supplier) {
        updates.supplier = analysisData.name || analysisData.supplier;
      }
      
      // Catégorie
      if (analysisData.category) {
        updates.category = analysisData.category;
      }
      
      // Montant TVA
      if (analysisData.tva || analysisData.vat_amount) {
        const vatAmount = parseFloat(analysisData.tva || analysisData.vat_amount);
        if (!isNaN(vatAmount)) {
          updates.vat_amount = vatAmount;
        }
      }
      
      // Montant TTC
      if (analysisData.ttc || analysisData.total_amount) {
        const totalAmount = parseFloat(analysisData.ttc || analysisData.total_amount);
        if (!isNaN(totalAmount)) {
          updates.total_amount = totalAmount;
        }
      }
      
      // Appliquer les mises à jour
      if (Object.keys(updates).length > 0) {
        setFormData(prev => ({
          ...prev,
          ...updates
        }));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TypeProofFields
        formData={formData}
        onChange={handleChange}
        onAnalysisComplete={handleAnalysisComplete}
      />

      <BasicFields
        formData={formData}
        onChange={handleChange}
      />

      <SupplierCategoryFields
        formData={formData}
        onChange={handleChange}
      />

      <VehicleAssignmentFields
        formData={formData}
        onChange={handleChange}
      />

      <FormActions
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        expense={expense}
      />
    </form>
  );
};
