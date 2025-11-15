"use client";

import { useState } from "react";
import { X, PackagePlus, Users, Calendar, Hash, Truck } from "lucide-react";

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

interface UserData {
    username: string;
    role: string;
}

interface AddShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newShipment: Shipment) => void;
  user: UserData | null;
}

export default function AddShipmentModal({
  isOpen,
  onClose,
  onAdd,
  user,
}: AddShipmentModalProps) {
    
  const [formData, setFormData] = useState({
    shipment: `SHIP-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`, // Auto-generated ID
    nama_lengkap: user?.username || '',
    tanggal: new Date().toISOString().split('T')[0],
    jumlah_toko: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    // Ini adalah placeholder, jika Anda punya data driver yang banyak
    setFormData({ ...formData, nama_lengkap: value });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Logika validasi sederhana
    if (!formData.jumlah_toko || parseInt(formData.jumlah_toko) <= 0) {
        alert("Jumlah toko harus valid.");
        return;
    }

    const newShipment: Shipment = {
        id: Date.now().toString(), // ID unik
        shipment: formData.shipment,
        nama_lengkap: formData.nama_lengkap,
        tanggal: formData.tanggal,
        jumlah_toko: parseInt(formData.jumlah_toko),
        terkirim: 0, // Awalnya 0 terkirim
        gagal: 0, // Awalnya 0 gagal
    };
    
    onAdd(newShipment);
    onClose();
    // Reset form jika diperlukan, tapi kita biarkan saja dulu
  };
  
  // Dummy Driver List untuk Select
  const dummyDrivers = [
    { value: user?.username || "driver_current", label: user?.username || "Driver Saat Ini" },
    { value: "Sari Dewi", label: "Sari Dewi" },
    { value: "Ahmad Fauzi", label: "Ahmad Fauzi" },
  ]
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0">
        
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="flex items-center text-2xl font-bold text-primary">
            <PackagePlus className="h-6 w-6 mr-3 text-primary/80" />
            Tambah Shipment Baru
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1">
            Isi detail pengiriman baru. Klik 'Simpan' saat selesai.
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
                    <Input 
                        id="shipment" 
                        value={formData.shipment}
                        readOnly
                        className="bg-gray-100 dark:bg-zinc-800 font-mono border-dashed"
                    />
                </div>

                {/* Field 2: Nama Driver (Select) */}
                <div className="space-y-2">
                    <Label htmlFor="nama_lengkap" className="text-base flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        Nama Driver
                    </Label>
                    <Select 
                        onValueChange={handleSelectChange} 
                        value={formData.nama_lengkap}
                        name="nama_lengkap"
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih Driver" />
                        </SelectTrigger>
                        <SelectContent>
                            {dummyDrivers.map(driver => (
                                <SelectItem key={driver.value} value={driver.value}>
                                    {driver.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                {/* Field 3: Tanggal & Jumlah Toko (Grid 2 Kolom) */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Sub-Field 3.1: Tanggal */}
                    <div className="space-y-2">
                        <Label htmlFor="tanggal" className="text-base flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            Tanggal
                        </Label>
                        <Input 
                            id="tanggal" 
                            type="date" 
                            value={formData.tanggal}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    {/* Sub-Field 3.2: Jumlah Toko */}
                    <div className="space-y-2">
                        <Label htmlFor="jumlah_toko" className="text-base flex items-center">
                            <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                            Jumlah Toko (Target)
                        </Label>
                        <Input 
                            id="jumlah_toko" 
                            type="number" 
                            placeholder="Contoh: 25"
                            value={formData.jumlah_toko}
                            onChange={handleChange}
                            required
                        />
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
                    <PackagePlus className="h-4 w-4 mr-2" />
                    Simpan Shipment
                </Button>
            </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}