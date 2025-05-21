
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileIcon, UploadCloud, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onUpload: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function FileUpload({ 
  onUpload,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSize = 10,
  className
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file: File) => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: `La taille du fichier dépasse ${maxSize} MB.`,
        variant: "destructive",
      });
      return false;
    }

    // Check file type
    const acceptedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    
    if (!acceptedTypes.some(type => {
      // Handle both mime types and extensions
      if (type.startsWith('.')) {
        return type === fileExtension;
      } else {
        return file.type.match(type);
      }
    })) {
      toast({
        title: "Type de fichier non supporté",
        description: `Les types de fichiers acceptés sont: ${accept}`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const processFile = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Function to format the accepted file types for display
  const getFormattedAcceptTypes = () => {
    // Use split and join instead of replaceAll for better compatibility
    return accept.split('.').join('').split(',').join(' ');
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept={accept}
        className="hidden"
      />
      
      {!selectedFile ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm font-medium text-gray-700">
            Glisser-déposer un fichier ou{" "}
            <span className="text-karrosserie-orange">parcourir</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {getFormattedAcceptTypes()} jusqu'à {maxSize} MB
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
          <div className="flex items-center space-x-3">
            <FileIcon className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm font-medium truncate max-w-[200px]">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRemove}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
