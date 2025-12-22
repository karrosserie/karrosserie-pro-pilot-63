import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { User, Mail, Phone, MessageCircle, Clock, Calendar, FileSignature, Car, CheckCircle, Send, Loader2 } from "lucide-react";
import { Messagerie, Client } from "@/hooks/use-messageries";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

interface SignatureRequest {
  id: string;
  request_type: 'ordre_reparation' | 'cession_creance';
  document_reference: string;
  status: string;
  signature_mode: 'electronique' | 'en_personne';
  vehicle_id?: string;
  sent_at?: string;
  signed_at?: string;
  created_at: string;
}

interface ClientHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  messages: Messagerie[];
}

export function ClientHistoryModal({ 
  isOpen, 
  onClose, 
  client, 
  messages 
}: ClientHistoryModalProps) {
  const [filteredMessages, setFilteredMessages] = useState<Messagerie[]>([]);
  const [signatureRequests, setSignatureRequests] = useState<SignatureRequest[]>([]);
  const [loadingSignatures, setLoadingSignatures] = useState(false);

  useEffect(() => {
    if (client && messages) {
      const clientMessages = messages.filter(m => m.client_id === client.id);
      setFilteredMessages(clientMessages);
    }
  }, [client, messages]);

  useEffect(() => {
    async function fetchSignatureRequests() {
      if (!client?.id || !isOpen) return;
      
      setLoadingSignatures(true);
      try {
        const { data: signatures, error } = await supabase
          .from('signature_requests')
          .select('*')
          .eq('client_id', client.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching signature requests:', error);
          return;
        }
        
        if (signatures) {
          setSignatureRequests(signatures as SignatureRequest[]);
        }
      } catch (error) {
        console.error('Error fetching signature requests:', error);
      } finally {
        setLoadingSignatures(false);
      }
    }

    fetchSignatureRequests();
  }, [client?.id, isOpen]);

  if (!client) return null;

  const stats = {
    total: filteredMessages.length,
    resolved: filteredMessages.filter(m => m.resolved).length,
    pending: filteredMessages.filter(m => !m.resolved && !m.archived).length,
    signatures: signatureRequests.length,
  };

  const getPriorityBadge = (priority: number) => {
    const variants = {
      1: { label: "Urgent", variant: "destructive" as const },
      2: { label: "Normal", variant: "default" as const },
      3: { label: "Faible", variant: "secondary" as const },
    };
    const config = variants[priority as keyof typeof variants] || variants[2];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getSignatureStatusBadge = (status: string) => {
    switch (status) {
      case 'signed':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Signé
          </Badge>
        );
      case 'sent':
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-200">
            <Send className="h-3 w-3 mr-1" />
            Envoyé
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-orange-500/10 text-orange-700 border-orange-200">
            <Loader2 className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Historique de communication
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
          {/* Infos client */}
          <Card className="p-4 bg-muted/50">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">
                {client.first_name} {client.last_name}
              </h3>
              <div className="flex flex-wrap gap-4 text-sm">
                {client.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{client.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Statistiques */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-xs text-muted-foreground mt-1">Messages</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <div className="text-xs text-muted-foreground mt-1">Résolus</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              <div className="text-xs text-muted-foreground mt-1">En attente</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.signatures}</div>
              <div className="text-xs text-muted-foreground mt-1">Signatures</div>
            </Card>
          </div>

          {/* Demandes de signature */}
          {signatureRequests.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <FileSignature className="h-4 w-4" />
                Demandes de signature
              </h4>
              <div className="space-y-3">
                {signatureRequests.map((request) => (
                  <Card key={request.id} className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {request.request_type === 'ordre_reparation' 
                              ? 'Ordre de réparation' 
                              : 'Cession de créance'}
                          </span>
                          {getSignatureStatusBadge(request.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Réf: {request.document_reference}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Mode: {request.signature_mode === 'electronique' ? 'Signature électronique' : 'Signature en personne'}
                        </p>
                        {request.sent_at && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Envoyé le: {format(new Date(request.sent_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                          </p>
                        )}
                        {request.signed_at && (
                          <p className="text-xs text-green-600 mt-1">
                            Signé le: {format(new Date(request.signed_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(request.created_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Timeline des messages */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Historique des communications
            </h4>

            {filteredMessages.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Aucune communication avec ce client</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredMessages.map((message) => (
                  <Card key={message.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{message.channel}</Badge>
                            {getPriorityBadge(message.priority)}
                            {message.resolved && (
                              <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
                                Résolu
                              </Badge>
                            )}
                          </div>
                          <h5 className="font-medium">{message.title}</h5>
                          <p className="text-sm text-muted-foreground mt-1">
                            {message.summary}
                          </p>
                        </div>
                        <div className="text-right text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(message.created_at), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </div>
                      </div>

                      {message.replies_count !== undefined && message.replies_count > 0 && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 pt-2 border-t">
                          <MessageCircle className="h-3 w-3" />
                          {message.replies_count} réponse{message.replies_count > 1 ? 's' : ''}
                        </div>
                      )}

                      {message.tags && message.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {message.tags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}