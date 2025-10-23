import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, FileText, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useDocumentRequests } from '@/hooks/useDocumentRequests';
import { useCompanyId } from '@/hooks/use-company-id';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const DocumentRequestAlerts = () => {
  const { companyId } = useCompanyId();
  const { data: requests, isLoading } = useDocumentRequests(companyId);

  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <FileText className="h-5 w-5 mr-2 text-amber-600" />
            Demandes de Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <FileText className="h-5 w-5 mr-2 text-green-600" />
            Demandes de Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aucune demande de document en attente
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
            Demandes de Documents
          </div>
          <Badge variant="destructive" className="ml-2">
            {requests.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-start p-4 rounded-lg bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              <div className="mr-3 mt-0.5">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-gray-900">
                  {request.probleme}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDistanceToNow(new Date(request.created_at), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentRequestAlerts;
