"use client";

import { Trash2, AlertTriangle } from "lucide-react";

// ==========================================================
// IMPORT KOMPONEN SHADCN/UI (Dialog)
// ==========================================================
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// ==========================================================

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: DeleteConfirmModalProps) {
  return (
    // Dialog otomatis menangani overlay
    <Dialog open={isOpen} onOpenChange={onClose}>
      
      {/* Lebar Konten Dibatasi (max-w-sm) untuk Konfirmasi */}
      <DialogContent className="sm:max-w-sm p-0">
        
        {/* Header Konfirmasi (Warna Merah untuk Aksi Destruktif) */}
        <DialogHeader className="p-6 border-b text-center">
          <div className="flex justify-center mb-3">
             <AlertTriangle className="h-10 w-10 text-red-500 animate-pulse" />
          </div>
          <DialogTitle className="text-xl font-bold text-red-600">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1">
            {message}
          </DialogDescription>
        </DialogHeader>

        {/* Action Buttons */}
        <div className="flex justify-end p-4 bg-gray-50/50">
            {/* Tombol Batal/Tutup */}
            <Button 
                variant="outline" 
                onClick={onClose} 
                className="mr-2 transition-colors duration-200"
            >
                Batal
            </Button>
            {/* Tombol Konfirmasi Hapus */}
            <Button 
                variant="destructive" 
                onClick={onConfirm}
                className="transition-transform duration-200 hover:scale-[1.05] shadow-md hover:shadow-lg"
            >
                <Trash2 className="h-4 w-4 mr-2" />
                Ya, Hapus
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}