
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon, FileQuestion } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <Icon className="h-16 w-16 text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="text-gray-500 mt-2 text-center max-w-md">{description}</p>
      {action && (
        <Button
          onClick={action.onClick}
          className="mt-6 bg-karrosserie-orange hover:bg-karrosserie-orange/90"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function TableEmptyState({
  title = "Aucun résultat",
  description = "Aucun élément correspondant à votre recherche n'a été trouvé.",
  action,
}: Partial<EmptyStateProps>) {
  return (
    <div className="rounded-md border">
      <EmptyState 
        title={title}
        description={description}
        action={action}
        className="py-8"
      />
    </div>
  );
}
