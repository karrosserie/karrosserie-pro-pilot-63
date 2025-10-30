import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Messagerie } from "@/hooks/use-messageries";
import { Phone, Mail, MessageSquare, Smartphone, Clock, Calendar, Tag } from "lucide-react";

interface MessageDetailModalProps {
  message: Messagerie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReply: (id: string) => void;
  onResolve: (id: string) => void;
  onArchive: (id: string) => void;
}

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "Téléphone": return Phone;
    case "Mail": return Mail;
    case "WhatsApp": return MessageSquare;
    case "Message": default: return Smartphone;
  }
};

const getPriorityLabel = (priority: number) => {
  switch (priority) {
    case 1: return { label: "Urgent", color: "text-destructive" };
    case 2: return { label: "Haute", color: "text-karrosserie-orange" };
    case 3: return { label: "Normale", color: "text-yellow-700" };
    case 4: return { label: "Basse", color: "text-blue-700" };
    default: return { label: "Inconnue", color: "text-muted-foreground" };
  }
};

export function MessageDetailModal({
  message,
  open,
  onOpenChange,
  onReply,
  onResolve,
  onArchive,
}: MessageDetailModalProps) {
  if (!message) return null;

  const ChannelIcon = getChannelIcon(message.channel);
  const priorityInfo = getPriorityLabel(message.priority);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ChannelIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">{message.title}</DialogTitle>
              <DialogDescription>
                <Badge className={priorityInfo.color}>
                  Priorité {message.priority} - {priorityInfo.label}
                </Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Résumé
            </h4>
            <p className="text-sm bg-muted p-3 rounded-lg">{message.summary}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Message complet
            </h4>
            <p className="text-sm bg-muted p-3 rounded-lg whitespace-pre-wrap">{message.message}</p>
          </div>

          {message.reponse && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Réponse
              </h4>
              <p className="text-sm bg-muted p-3 rounded-lg">{message.reponse}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <ChannelIcon className="h-4 w-4" />
                Canal
              </h4>
              <Badge variant="outline">{message.channel}</Badge>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Temps estimé
              </h4>
              <Badge variant="outline">{message.eta}</Badge>
            </div>

            {message.contact && (
              <div>
                <h4 className="font-semibold mb-2">Contact</h4>
                <p className="text-sm">{message.contact}</p>
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date
              </h4>
              <p className="text-sm">{message.date} à {message.time}</p>
            </div>
          </div>

          {message.tags.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </h4>
              <div className="flex gap-2 flex-wrap">
                {message.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            {!message.resolved && (
              <>
                <Button
                  onClick={() => {
                    onReply(message.id);
                    onOpenChange(false);
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  Répondre
                </Button>
                <Button
                  onClick={() => {
                    onResolve(message.id);
                    onOpenChange(false);
                  }}
                  variant="outline"
                  className="border-green-500 text-green-700 hover:bg-green-50"
                >
                  Marquer comme traité
                </Button>
              </>
            )}
            <Button
              onClick={() => {
                onArchive(message.id);
                onOpenChange(false);
              }}
              variant="outline"
            >
              {message.archived ? "Désarchiver" : "Archiver"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
