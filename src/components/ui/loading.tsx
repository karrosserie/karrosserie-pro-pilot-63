
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  text?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function Loading({ 
  text = "Chargement...", 
  className,
  size = "default"
}: LoadingProps) {
  const sizeClass = 
    size === "sm" ? "h-4 w-4" : 
    size === "lg" ? "h-8 w-8" : 
    "h-6 w-6";

  return (
    <div className={cn("flex flex-col items-center justify-center py-8", className)}>
      <Loader2 className={cn("animate-spin text-karrosserie-orange", sizeClass)} />
      {text && <p className="mt-2 text-gray-500 text-sm">{text}</p>}
    </div>
  );
}

export function TableLoading() {
  return (
    <div className="rounded-md border">
      <div className="h-24 flex items-center justify-center">
        <Loading text="Chargement des données..." />
      </div>
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loading text="Chargement..." size="lg" />
    </div>
  );
}
