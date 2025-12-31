import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { RepairOrder } from '@/services/supabase/repair-orders';
import NewRepairOrderPDF from '@/services/pdf/NewRepairOrderPDF';
import { supabase } from '@/integrations/supabase/client';
import { clientsService } from '@/services/supabase/clients';
import { getClientDisplayName } from '@/utils/clientDisplayUtils';
import { calculateInvoiceTotals } from '@/utils/invoiceCalculations';

export const prepareRepairOrderDataForPDF = async (repairOrder: RepairOrder, companyData: any) => {
  try {
    // Récupérer les données de l'entreprise si nécessaire
    let finalCompanyData = companyData;
    if (!finalCompanyData || Object.keys(finalCompanyData).length === 0) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userCompany } = await supabase
          .from('user_companies')
          .select('company_id')
          .eq('user_id', user.id)
          .eq('active', true)
          .single();

        let company = null;
        if (userCompany) {
          const { data } = await supabase
            .from('company_info')
            .select('*')
            .eq('id', userCompany.company_id)
            .single();
          company = data;
        }
        
        finalCompanyData = company || {};
      }
    }

    // Récupérer les données du client
    let clientData = null;
    if (repairOrder.client_id) {
      try {
        const client = await clientsService.getById(repairOrder.client_id);
        clientData = {
          name: getClientDisplayName(client),
          address: client.address || '',
          city: `${client.postal_code || ''} ${client.city || ''}`.trim(),
          email: client.email || '',
          phone: client.phone || ''
        };
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    }

    // Récupérer les données du véhicule
    let vehicleData = null;
    if (repairOrder.vehicle_id) {
      try {
        const { data: vehicle } = await supabase
          .from('vehicles')
          .select(`
            *,
            car_brands(name),
            car_models(name)
          `)
          .eq('id', repairOrder.vehicle_id)
          .single();

        if (vehicle) {
          vehicleData = {
            brand: vehicle.car_brands?.name || '',
            model: vehicle.car_models?.name || '',
            licensePlate: vehicle.license_plate || '',
            mileage: vehicle.mileage ? vehicle.mileage.toLocaleString() + ' km' : '',
            start_date: repairOrder.start_date,
            end_date: repairOrder.end_date
          };
        }
      } catch (error) {
        console.error('Error fetching vehicle data:', error);
      }
    }

    // Calculer les totaux
    const totals = calculateInvoiceTotals(repairOrder.repairs_data, repairOrder.parts_data);

    // Données d'expertise (optionnelles)
    const expertiseData = (repairOrder.report_number || repairOrder.expert_name) ? {
      reportNumber: repairOrder.report_number || undefined,
      expertName: repairOrder.expert_name || undefined,
      reportDate: repairOrder.report_date || undefined,
    } : undefined;

    // Données de sinistre (optionnelles)
    const incidentData = (repairOrder.policy_number || repairOrder.claim_number || repairOrder.incident_date) ? {
      policyNumber: repairOrder.policy_number || undefined,
      claimNumber: repairOrder.claim_number || undefined,
      incidentDate: repairOrder.incident_date || undefined,
    } : undefined;

    // Données de l'ordre
    const orderData = {
      reference: repairOrder.reference,
      date: repairOrder.created_at,
      amount: totals.finalTotal,
      notes: repairOrder.notes,
    };

    // Données de signature
    const signatureData = {
      clientName: clientData?.name || '',
      isForOodrive: false,
    };

    return {
      companyData: finalCompanyData,
      clientData,
      vehicleData,
      orderData,
      expertiseData,
      incidentData,
      signatureData,
      totals,
    };
  } catch (error) {
    console.error('Error preparing repair order data for PDF:', error);
    throw error;
  }
};

export const generateRepairOrderPDFBlob = async (repairOrder: RepairOrder, companyData: any) => {
  try {
    const data = await prepareRepairOrderDataForPDF(repairOrder, companyData);
    
    const doc = (
      <NewRepairOrderPDF
        companyData={data.companyData}
        clientData={data.clientData || { name: '', address: '', city: '', phone: '', email: '' }}
        vehicleData={data.vehicleData || { brand: '', model: '', licensePlate: '', mileage: '' }}
        orderData={data.orderData}
        expertiseData={data.expertiseData}
        incidentData={data.incidentData}
        signatureData={data.signatureData}
      />
    );
    
    const asPdf = pdf(doc);
    return await asPdf.toBlob();
  } catch (error) {
    console.error('Erreur lors de la génération du blob PDF ordre de réparation:', error);
    throw error;
  }
};

export const generateRepairOrderPDFWithTemplate = async (repairOrder: RepairOrder, companyData: any) => {
  try {
    const data = await prepareRepairOrderDataForPDF(repairOrder, companyData);
    
    console.log('Creating PDF with new repair order format');
    console.log('Company data for PDF:', data.companyData);
    console.log('Client data for PDF:', data.clientData);

    const doc = (
      <NewRepairOrderPDF
        companyData={data.companyData}
        clientData={data.clientData || { name: '', address: '', city: '', phone: '', email: '' }}
        vehicleData={data.vehicleData || { brand: '', model: '', licensePlate: '', mileage: '' }}
        orderData={data.orderData}
        expertiseData={data.expertiseData}
        incidentData={data.incidentData}
        signatureData={data.signatureData}
      />
    );
    
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    
    const filename = `Ordre_reparation_${repairOrder.reference}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
    
    return { success: true, filename };
  } catch (error: any) {
    console.error('Erreur lors de la génération du PDF:', error);
    return { success: false, error: error.message };
  }
};

export const printRepairOrderPDFWithTemplate = async (repairOrder: RepairOrder, companyData: any) => {
  try {
    const data = await prepareRepairOrderDataForPDF(repairOrder, companyData);
    
    console.log('Creating PDF for print with new repair order format');
    
    const doc = (
      <NewRepairOrderPDF
        companyData={data.companyData}
        clientData={data.clientData || { name: '', address: '', city: '', phone: '', email: '' }}
        vehicleData={data.vehicleData || { brand: '', model: '', licensePlate: '', mileage: '' }}
        orderData={data.orderData}
        expertiseData={data.expertiseData}
        incidentData={data.incidentData}
        signatureData={data.signatureData}
      />
    );
    
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    
    const url = URL.createObjectURL(blob);
    
    const printWindow = window.open(url, '_blank');
    
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
      };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Erreur lors de l'ouverture du PDF pour impression:", error);
    return { success: false, error: error.message };
  }
};
