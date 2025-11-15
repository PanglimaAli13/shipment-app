"use client";

import { useState, useEffect } from "react";
import { Package, Pencil, Users, Calendar, Hash, Truck, XCircle } from "lucide-react";

// ==========================================================
// IMPORT KOMPONEN SHADCN/UI
// ==========================================================
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ==========================================================

interface Shipment {
  id: string;
  shipment: string;
  nama_lengkap: string;
  tanggal: string;
  jumlah_toko: number;
  terkirim: number;
  gagal: number;
  alasan?: string;
}

interface EditShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipmentData: Shipment | null; // Data Shipment yang akan di-edit
  onSave: (updatedShipment: Shipment) => void;
}

export default function EditShipmentModal({
  isOpen,
  onClose,
  shipmentData,
  onSave,
}: EditShipmentModalProps) {
    
  const [formData, setFormData] = useState<Omit<Shipment, 'id' | 'alasan'> | null>(null);

  // Efek untuk mengisi form saat modal dibuka atau data berubah
  useEffect(() => {
    if (shipmentData) {
        // Ambil data yang relevan untuk diedit
        setFormData({
            shipment: shipmentData.shipment,
            nama_lengkap: shipmentData.nama_lengkap,
            tanggal: shipmentData.tanggal,
            jumlah_toko: shipmentData.jumlah_toko,
            terkirim: shipmentData.terkirim,
            gagal: shipmentData.gagal,
        });
    }
  }, [shipmentData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSelectChange = (value: string) => {
    if (formData) {
        setFormData({ ...formData, nama_lengkap: value });
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shipmentData || !formData) return;

    const updatedShipment: Shipment = {
        ...shipmentData, // Pertahankan ID dan alasan lama
        ...formData, // Timpa dengan data baru dari form
        jumlah_toko: parseInt(String(formData.jumlah_toko)),
        terkirim: parseInt(String(formData.terkirim)),
        gagal: parseInt(String(formData.gagal)),
    };
    
    onSave(updatedShipment);
    onClose();
  };

  const dummyDrivers = [
    { value: "Budi Santoso", label: "Budi Santoso" },
    { value: "Sari Dewi", label: "Sari Dewi" },
    { value: "Ahmad Fauzi", label: "Ahmad Fauzi" },
  ]
  
  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-0">
        
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="flex items-center text-2xl font-bold text-primary">
            <Pencil className="h-6 w-6 mr-3 text-primary/80" />
            Edit Shipment: {formData.shipment}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1">
            Ubah detail pengiriman, termasuk status terkirim/gagal.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
                
                {/* Field 1: Shipment ID (Read-only) */}
                <div className="space-y-2">
                    <Label htmlFor="shipment" className="text-base flex items-center">
                        <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
                        Shipment ID
                    </Label>
                    <Input id="shipment" value={formData.shipment} readOnly className="bg-gray-100 dark:bg-zinc-800 font-mono border-dashed"/>
                </div>

                {/* Field 2: Nama Driver (Select) */}
                <div className="space-y-2">
                    <Label htmlFor="nama_lengkap" className="text-base flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        Nama Driver
                    </Label>
                    <Select onValueChange={handleSelectChange} value={formData.nama_lengkap} name="nama_lengkap">
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih Driver" />
                        </SelectTrigger>
                        <SelectContent>
                            {dummyDrivers.map(driver => (
                                <SelectItem key={driver.value} value={driver.value}>{driver.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                {/* Field 3 & 4: Tanggal & Jumlah Toko (Grid 2 Kolom) */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Sub-Field 3.1: Tanggal */}
                    <div className="space-y-2">
                        <Label htmlFor="tanggal" className="text-base flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            Tanggal
                        </Label>
                        <Input id="tanggal" type="date" value={formData.tanggal} onChange={handleChange} required/>
                    </div>
                    
                    {/* Sub-Field 3.2: Jumlah Toko */}
                    <div className="space-y-2">
                        <Label htmlFor="jumlah_toko" className="text-base flex items-center">
                            <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                            Jumlah Toko (Target)
                        </Label>
                        <Input id="jumlah_toko" type="number" placeholder="Contoh: 25" value={formData.jumlah_toko} onChange={handleChange} required/>
                    </div>
                </div>

                {/* Field 5 & 6: Terkirim & Gagal (Grid 2 Kolom) */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="terkirim" className="text-base flex items-center text-green-600">
                            <Truck className="h-4 w-4 mr-2" />
                            Jumlah Terkirim
                        </Label>
                        <Input id="terkirim" type="number" value={formData.terkirim} onChange={handleChange} required/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gagal" className="text-base flex items-center text-red-600">
                            <XCircle className="h-4 w-4 mr-2" />
                            Jumlah Gagal
                        </Label>
                        <Input id="gagal" type="number" value={formData.gagal} onChange={handleChange} required/>
                    </div>
                </div>

            </div>

            {/* Footer/Action Button */}
            <div className="flex justify-end p-4 border-t bg-gray-50/50">
                <Button 
                    variant="ghost" 
                    type="button" 
                    onClick={onClose} 
                    className="mr-2 transition-colors duration-200"
                >
                    Batal
                </Button>
                <Button 
                    type="submit" 
                    className="transition-transform duration-200 hover:scale-[1.05]"
                >
                    <Pencil className="h-4 w-4 mr-2" />
                    Simpan Perubahan
                </Button>
            </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}