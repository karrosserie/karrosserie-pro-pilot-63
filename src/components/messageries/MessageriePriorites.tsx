import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  AlertCircle, 
  FileText, 
  Info, 
  ChevronRight, 
  ArrowLeft,
  Phone,
  Mail,
  MessageSquare,
  Smartphone,
  Clock,
  Calendar,
  Tag,
  X
} from "lucide-react";

// -------------------------------
// MessageriePriorites (autonome)
// - Version basée sur un tableau de bord par priorité.
// - Onglets: Urgent / Haute / Normale / Basse
// - Vue détaillée par priorité
// -------------------------------

const INCIDENTS = [
  // PRIORITÉ 1 – CRITIQUE
  { id: 1, priority: 1, title: "Accident en cours / véhicule immobilisé", channel: "Téléphone", eta: "2h", time: "16:46:42", summary: "Véhicule impliqué dans un accident, immobilisation immédiate, intervention urgente requise.", message: "Le client signale que son véhicule est à l'arrêt complet sur le côté de la route après un impact. Il y a de la fumée qui s'échappe du capot et il ne peut pas le déplacer. Il demande une assistance immédiate pour sécuriser la zone et remorquer le véhicule.", tags: ["sécurité", "immédiat"], resolved: false, archived: false },
  { id: 2, priority: 1, title: "Pare-brise fissuré dans le champ de vision", channel: "Mail", eta: "2h", time: "09:22:10", summary: "Pare-brise fissuré dans le champ de vision du conducteur, nécessite remplacement rapide.", message: "Client a envoyé une photo de son pare-brise. Il y a une longue fissure en étoile, juste devant le siège du conducteur. Il est sur le point de partir en vacances et a besoin d'une réparation le plus tôt possible pour éviter d'être verbalisé.", tags: ["sécurité"], resolved: false, archived: false },
  { id: 3, priority: 1, title: "Problème sécurité post-intervention (airbag / ADAS)", channel: "Message", eta: "2h", time: "08:12:33", summary: "Client signale dysfonctionnement airbag / ADAS après intervention — à traiter immédiatement.", message: "Message du client : 'Le voyant de l'airbag est resté allumé après votre réparation. Je ne me sens pas en sécurité, je dois savoir si je peux rouler.'", tags: ["sécurité", "post-interv"], resolved: false, archived: false },
  { id: 4, priority: 1, title: "Restitution urgente avec paiement bloqué", channel: "WhatsApp", eta: "2h", time: "14:05:00", summary: "Le véhicule doit être restitué mais le paiement est bloqué — risque de litige immédiat.", message: "Le client est sur place pour récupérer son véhicule mais le paiement en ligne ne passe pas. Il est pressé et menace de laisser le véhicule si le problème n'est pas résolu dans l'heure.", tags: ["finance"], resolved: false, archived: false },
  { id: 5, priority: 1, title: "Accident avec véhicule de prêt", channel: "Téléphone", eta: "2h", time: "07:15:11", summary: "Accident impliquant le véhicule de prêt — gestion assurance et immobilisation.", message: "Un de nos véhicules de prêt a été impliqué dans un accident. Le client signale que les dégâts sont mineurs mais la voiture n'est plus en état de rouler. Il faut organiser le remorquage et la gestion de l'assurance immédiatement.", tags: ["prêt", "assurance"], resolved: false, archived: false },
  { id: 6, priority: 1, title: "Fuite liquide / chauffe moteur après choc", channel: "Message", eta: "2h", time: "12:01:05", summary: "Fuite ou surchauffe moteur signalée immédiatement après choc — risque sécurité.", message: "Message du client: 'Ma voiture a heurté un trottoir et maintenant il y a un liquide qui coule en dessous et le moteur chauffe. Je l'ai éteinte, qu'est-ce que je dois faire ?'", tags: ["fuite", "moteur"], resolved: false, archived: false },
  { id: 7, priority: 1, title: "Réparation non conforme visible (teinte, alignements)", channel: "Mail", eta: "2h", time: "10:30:00", summary: "Client signale réparation non conforme et défaut visible post-livraison.", message: "Le client a constaté que la couleur du nouveau pare-chocs ne correspond pas exactement à celle de la carrosserie. Il a également noté un léger décalage dans l'alignement des pièces. Il demande une nouvelle intervention de toute urgence.", tags: ["qualité"], resolved: false, archived: false },

  // PRIORITÉ 2 – HAUTE
  { id: 10, priority: 2, title: "Autorisation assurance manquante / expertise à programmer", channel: "Mail", eta: "24h", time: "13:02:22", summary: "Autorisation assurance absente — expertise à programmer pour débloquer dossier.", message: "L'assurance nous a informé que l'autorisation de réparation n'a pas encore été validée. Le client attend de pouvoir récupérer son véhicule. Il est crucial d'obtenir cette validation rapidement pour ne pas impacter le planning.", tags: ["assurance", "expertise"], resolved: false, archived: false },
  { id: 11, priority: 2, title: "Complément d'expertise après démontage", channel: "Message", eta: "24h", time: "11:11:11", summary: "Nécessité d'un complément d'expertise après démontage — planning impacté.", message: "L'expert a demandé des photos supplémentaires suite au démontage de la carrosserie pour évaluer les dégâts internes. Le client est en attente.", tags: ["expertise"], resolved: false, archived: false },
  { id: 12, priority: 2, title: "Changement de RDV client en urgence", channel: "Message", eta: "24h", time: "15:40:50", summary: "Client demande changement de RDV — affecte planning et ressources.", message: "Le client nous a contactés pour décaler son rendez-vous de remise de véhicule. Il a une urgence personnelle et ne peut pas venir à l'heure prévue. Il faut trouver un nouveau créneau rapidement pour ne pas perturber le planning.", tags: ["planning"], resolved: false, archived: false },

  // PRIORITÉ 3 – NORMALE
  { id: 30, priority: 3, title: "Demande devis (rayure, poc, DSP, smart repair)", channel: "Mail", eta: "3j", time: "10:00:00", summary: "Demande classique de devis pour réparation cosmétique.", message: "Client nous a contactés par mail pour demander un devis pour une petite rayure sur la porte avant. Il a joint une photo.", tags: ["devis"], resolved: false, archived: false },
  { id: 31, priority: 3, title: "Aide déclaration assurance / envoi constat", channel: "Téléphone", eta: "48h", time: "09:30:00", summary: "Assistance pour remplir déclaration et envoyer constat.", message: "Client nous a appelés pour obtenir de l'aide pour remplir son constat après un accident. Il a des difficultés et souhaite que nous l'assistions par téléphone.", tags: ["assurance"], resolved: false, archived: false },

  // PRIORITÉ 4 – BASSE
  { id: 50, priority: 4, title: "Demande info sur délais standards", channel: "WhatsApp", eta: "7j", time: "09:00:00", summary: "Question sur délais moyens de réparation.", message: "Le client nous demande le délai moyen pour une réparation de carrosserie.", tags: ["info"], resolved: false, archived: false },
  { id: 51, priority: 4, title: "Questions sur garanties légales / constructeur", channel: "Mail", eta: "7j", time: "10:00:00", summary: "Interrogation sur garanties légales et constructeur.", message: "Le client a une question sur les garanties qui s'appliquent à ses réparations.", tags: ["garantie"], resolved: false, archived: false },
];

const PRIORITY_META = {
  1: { 
    label: "Urgent", 
    bgColor: "bg-destructive/10", 
    borderColor: "border-destructive", 
    textColor: "text-destructive", 
    icon: AlertTriangle,
    description: "immédiate (2h)"
  },
  2: { 
    label: "Haute", 
    bgColor: "bg-karrosserie-orange/10", 
    borderColor: "border-karrosserie-orange", 
    textColor: "text-karrosserie-orange", 
    icon: AlertCircle,
    description: "rapide (24h)"
  },
  3: { 
    label: "Normale", 
    bgColor: "bg-yellow-100", 
    borderColor: "border-yellow-500", 
    textColor: "text-yellow-700", 
    icon: FileText,
    description: "à l'étude (48h)"
  },
  4: { 
    label: "Basse", 
    bgColor: "bg-green-100", 
    borderColor: "border-green-500", 
    textColor: "text-green-700", 
    icon: Info,
    description: "simple (7j)"
  }
};

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "Téléphone": return Phone;
    case "Mail": return Mail;
    case "WhatsApp": return MessageSquare;
    case "Message": default: return Smartphone;
  }
};

export default function MessageriePriorites() {
  const [items, setItems] = useState(INCIDENTS);
  const [selectedPriority, setSelectedPriority] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<typeof INCIDENTS[0] | null>(null);
  const [showResolved, setShowResolved] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    if (notificationMessage) {
      const timer = setTimeout(() => {
        setNotificationMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notificationMessage]);

  const activeItems = useMemo(() => {
    if (showResolved) {
      return items.filter(item => item.resolved);
    }
    if (showArchived) {
      return items.filter(item => item.archived);
    }
    return items.filter(item => !item.resolved && !item.archived);
  }, [items, showResolved, showArchived]);

  const priorityCounts = useMemo(() => {
    return activeItems.reduce((acc, item) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
  }, [activeItems]);

  function toggleResolved(id: number) {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, resolved: !item.resolved } : item
      )
    );
    setNotificationMessage("Message envoyé dans les messages traités !");
  }

  function toggleArchived(id: number) {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, archived: !item.archived } : item
      )
    );
    setNotificationMessage("Le message a bien été archivé !");
  }

  function handleViewDetails(id: number) {
    const it = items.find((i) => i.id === id);
    if (it) setSelectedItem(it);
  }

  function handleReply(id: number) {
    const it = items.find((i) => i.id === id);
    alert(`Répondre → ${it?.title}`);
  }

  function handleAutoManage(id: number) {
    const it = items.find((i) => i.id === id);
    if (it?.priority === 1) return;
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, resolved: true } : item
      )
    );
    setNotificationMessage("Le message a bien été traité automatiquement !");
  }

  function handleSemiAuto(id: number) {
    const it = items.find((i) => i.id === id);
    if (it?.priority === 1) return;
    setNotificationMessage("Un brouillon de réponse a été généré pour vous !");
  }

  function handleEscalate(id: number) {
    const it = items.find((i) => i.id === id);
    if (it?.priority === 1) {
      setNotificationMessage("Le message est déjà en priorité 1 et ne peut pas être escaladé davantage.");
      return;
    }

    const newPriority = (it?.priority || 2) - 1;
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, priority: newPriority } : item
      )
    );
    setNotificationMessage("Le niveau d'urgence a bien été augmenté !");
  }

  const handleBack = () => {
    setSelectedPriority(null);
  };

  const handleArchive = (id: number) => {
    toggleArchived(id);
  };

  // Composant pour le tableau de bord des priorités
  const DashboardView = () => (
    <div className="space-y-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Classification Intelligente des Messages</CardTitle>
          <CardDescription>
            Notre IA analyse automatiquement tous les messages entrants et les classe par niveau de priorité
          </CardDescription>
          <div className="mt-4 text-2xl font-bold text-primary">
            {activeItems.length} message{activeItems.length > 1 ? "s" : ""} {
              showResolved ? "traités" : (showArchived ? "archivés" : "en attente")
            }
          </div>
        </CardHeader>
      </Card>

      {[1, 2, 3, 4].map(priority => {
        const meta = PRIORITY_META[priority];
        const count = priorityCounts[priority] || 0;
        const IconComponent = meta.icon;
        
        return (
          <Card
            key={priority}
            className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${meta.borderColor}`}
            onClick={() => setSelectedPriority(priority)}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${meta.bgColor} ${meta.textColor}`}>
                  <IconComponent size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{meta.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    Messages nécessitant une intervention {meta.description}
                  </p>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {count} message{count > 1 ? "s" : ""}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // Composant pour la vue détaillée d'une priorité
  const PriorityView = ({ priority }: { priority: number }) => {
    const meta = PRIORITY_META[priority];
    const filteredItems = useMemo(() => activeItems.filter(item => item.priority === priority), [activeItems, priority]);
    const IconComponent = meta.icon;

    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${meta.bgColor} ${meta.textColor}`}>
              <IconComponent size={24} />
            </div>
            <div>
              <h1 className="text-xl font-semibold">{meta.label}</h1>
              <p className="text-sm text-muted-foreground">
                Messages nécessitant une intervention {meta.description}
              </p>
            </div>
          </div>
        </div>

        {filteredItems.length > 0 ? (
          filteredItems.map(it => {
            const ChannelIcon = getChannelIcon(it.channel);
            
            return (
              <Card key={it.id} className={`border-l-4 ${meta.borderColor}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${meta.bgColor} ${meta.textColor}`}>
                        <IconComponent size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{it.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{it.summary}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className={meta.textColor}>
                            {meta.label}
                          </Badge>
                          <Badge variant="outline">
                            <ChannelIcon size={12} className="mr-1" />
                            {it.channel}
                          </Badge>
                          <Badge variant="outline">
                            <Clock size={12} className="mr-1" />
                            {it.eta}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{it.time}</div>
                  </div>
                  
                  <p className="mt-4 text-sm">{it.message}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleViewDetails(it.id)}>
                      Détails complets
                    </Button>
                    {!showResolved && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleReply(it.id)}>
                          Répondre
                        </Button>
                        {it.priority !== 1 && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleAutoManage(it.id)}>
                              Réponse auto
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleSemiAuto(it.id)}>
                              Semi auto
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleEscalate(it.id)}>
                          Escalader
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline" onClick={() => toggleResolved(it.id)}>
                      {it.resolved ? "Marquer non résolu" : "Marquer résolu"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleArchive(it.id)}>
                      {it.archived ? "Désarchiver" : "Archiver"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-muted-foreground">Aucun message de cette priorité.</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <header className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <MessageSquare size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Centre de messages</h1>
            <p className="text-sm text-muted-foreground">Tous vos canaux de communication</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={!showResolved && !showArchived ? "default" : "outline"}
            onClick={() => { setShowResolved(false); setShowArchived(false); }}
          >
            Messages en attente
          </Button>
          <Button
            variant={showResolved ? "default" : "outline"}
            onClick={() => { setShowResolved(true); setShowArchived(false); }}
          >
            Messages traités
          </Button>
          <Button
            variant={showArchived ? "default" : "outline"}
            onClick={() => { setShowArchived(true); setShowResolved(false); }}
          >
            Messages archivés
          </Button>
        </div>
      </header>

      {notificationMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-primary text-primary-foreground rounded-lg shadow-lg transition-all duration-300 z-50 animate-fade-in">
          {notificationMessage}
        </div>
      )}

      {selectedPriority === null ? <DashboardView /> : <PriorityView priority={selectedPriority} />}

      {/* Modal des détails */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${PRIORITY_META[selectedItem.priority].bgColor} ${PRIORITY_META[selectedItem.priority].textColor}`}>
                    {React.createElement(PRIORITY_META[selectedItem.priority].icon, { size: 24 })}
                  </div>
                  <div>
                    <CardTitle>Détails de l'incident #{selectedItem.id}</CardTitle>
                    <Badge className={PRIORITY_META[selectedItem.priority].textColor}>
                      Priorité {selectedItem.priority} - {PRIORITY_META[selectedItem.priority].label}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedItem(null)}
                >
                  <X size={20} />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Titre</h3>
                <p className="text-sm bg-muted p-3 rounded-lg">{selectedItem.title}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description détaillée</h3>
                <p className="text-sm bg-muted p-3 rounded-lg">{selectedItem.summary}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Message</h3>
                <p className="text-sm bg-muted p-3 rounded-lg">{selectedItem.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Canal de communication</h3>
                  <div className="flex items-center gap-2">
                    {React.createElement(getChannelIcon(selectedItem.channel), { size: 20 })}
                    <Badge variant="outline">{selectedItem.channel}</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Temps de traitement estimé</h3>
                  <div className="flex items-center gap-2">
                    <Clock size={20} />
                    <Badge variant="outline">{selectedItem.eta}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Horodatage</h3>
                <div className="flex items-center gap-2">
                  <Calendar size={20} />
                  <Badge variant="outline">{selectedItem.time}</Badge>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Tags associés</h3>
                <div className="flex gap-2 flex-wrap">
                  {selectedItem.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      <Tag size={12} className="mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Actions rapides</h3>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" onClick={() => { handleReply(selectedItem.id); setSelectedItem(null); }}>
                    Répondre
                  </Button>
                  {selectedItem.priority !== 1 && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => { handleAutoManage(selectedItem.id); setSelectedItem(null); }}>
                        Réponse auto
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { handleSemiAuto(selectedItem.id); setSelectedItem(null); }}>
                        Semi auto
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline" onClick={() => { handleEscalate(selectedItem.id); setSelectedItem(null); }}>
                    Escalader
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { toggleResolved(selectedItem.id); setSelectedItem(null); }}>
                    Marquer résolu
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { handleArchive(selectedItem.id); setSelectedItem(null); }}>
                    Archiver
                  </Button>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={() => setSelectedItem(null)}>
                Fermer
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}