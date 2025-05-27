
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Euro, User, FileText, MoreHorizontal } from 'lucide-react';

interface PaymentsListProps {
  searchTerm: string;
}

const PaymentsList: React.FC<PaymentsListProps> = ({ searchTerm }) => {
  const payments = [
    {
      id: '1',
      reference: 'PAY-2024-001',
      client: 'Jean Dupont',
      amount: '€1,250.00',
      status: 'En attente',
      date: '2024-01-15',
      type: 'Réparation',
      dueDate: '2024-01-30'
    },
    {
      id: '2',
      reference: 'PAY-2024-002',
      client: 'Marie Martin',
      amount: '€850.00',
      status: 'Payé',
      date: '2024-01-14',
      type: 'Expertise',
      dueDate: '2024-01-29'
    },
    {
      id: '3',
      reference: 'PAY-2024-003',
      client: 'Pierre Durand',
      amount: '€2,100.00',
      status: 'En retard',
      date: '2024-01-10',
      type: 'Réparation',
      dueDate: '2024-01-25'
    },
    {
      id: '4',
      reference: 'PAY-2024-004',
      client: 'Sophie Leclerc',
      amount: '€675.00',
      status: 'Payé',
      date: '2024-01-12',
      type: 'Devis',
      dueDate: '2024-01-27'
    }
  ];

  const filteredPayments = payments.filter(payment =>
    payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Payé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'En retard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Euro className="h-5 w-5 text-karrosserie-orange" />
          Liste des paiements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <div key={payment.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-800">{payment.reference}</h3>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {payment.client}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {payment.type}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Échéance: {payment.dueDate}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-800">{payment.amount}</p>
                    <p className="text-sm text-gray-500">Date: {payment.date}</p>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentsList;
