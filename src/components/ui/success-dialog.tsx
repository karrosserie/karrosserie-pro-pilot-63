import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: React.ReactNode;
  buttonText?: string;
}

export function SuccessDialog({ 
  open, 
  onClose, 
  title, 
  description, 
  buttonText = "Compris" 
}: SuccessDialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onClose}>
        <DrawerContent>
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-2xl">
              {title}
            </DrawerTitle>
            <DrawerDescription className="text-base leading-relaxed pt-2 whitespace-pre-line">
              {description}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="pt-2">
            <Button onClick={onClose} className="w-full">
              {buttonText}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">{title}</DialogTitle>
          <DialogDescription className="text-lg text-center whitespace-pre-line">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose}>
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
