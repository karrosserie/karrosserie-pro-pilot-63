import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MessageriesHeaderProps {
  onNewMessage: () => void;
}

export function MessageriesHeader({ onNewMessage }: MessageriesHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Centre de Communication Client</h1>
          <p className="text-muted-foreground">
            Gérez toutes vos communications clients depuis un seul endroit
          </p>
        </div>
        <Button onClick={onNewMessage} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle communication
        </Button>
      </div>
    </header>
  );
}
