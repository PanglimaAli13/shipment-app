'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Package, Truck, User, Plus, CheckCircle, XCircle, BarChart2, Edit, Trash2, Loader2, List
} from 'lucide-react'

// ==========================================================
// IMPORT KOMPONEN SHADCN/UI
// ==========================================================
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

// ==========================================================
// IMPORT MODAL BARU
// ==========================================================
import AddShipmentModal from '@/components/modals/add-shipment-modal'
import DeleteConfirmModal from '@/components/modals/delete-confirm-modal'
import EditShipmentModal from '@/components/modals/edit-shipment-modal' // <-- KOMPONEN BARU
// ==========================================================


interface Shipment {
  id: string
  shipment: string
  nama_lengkap: string
  tanggal: string
  jumlah_toko: number
  terkirim: number
  gagal: number
  alasan?: string
}

interface UserData {
  username: string
  role: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)

  // STATE MODAL TAMBAH & HAPUS (Sudah Ada)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [shipmentToDelete, setShipmentToDelete] = useState<string | null>(null)

  // STATE MODAL EDIT (BARU)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [shipmentToEdit, setShipmentToEdit] = useState<Shipment | null>(null)


  // --- LOGIKA UTAMA (DIPERTAHANKAN) ---
  useEffect(() => {
    // ... (Logika autentikasi dan dummy data tetap sama)
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))

    const dummyData: Shipment[] = [
      { id: '1', shipment: 'SHIP-2024-001', nama_lengkap: 'Budi Santoso', tanggal: '2024-01-15', jumlah_toko: 25, terkirim: 23, gagal: 2, alasan: 'Toko tutup' },
      { id: '2', shipment: 'SHIP-2024-002', nama_lengkap: 'Sari Dewi', tanggal: '2024-01-16', jumlah_toko: 18, terkirim: 18, gagal: 0 },
      { id: '3', shipment: 'SHIP-2024-003', nama_lengkap: 'Ahmad Fauzi', tanggal: '2024-01-17', jumlah_toko: 30, terkirim: 28, gagal: 2, alasan: 'Barang rusak' }
    ]

    setTimeout(() => {
      setShipments(dummyData)
      setLoading(false)
    }, 1000)
  }, [router])

  // --- HANDLER TAMBAH/HAPUS ---
  const handleAddShipment = (newShipment: Shipment) => {
    setShipments(prev => [newShipment, ...prev])
  }

  const handleDeleteClick = (id: string) => {
    setShipmentToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (shipmentToDelete) {
      setShipments(prev => prev.filter(item => item.id !== shipmentToDelete))
      setIsDeleteModalOpen(false)
      setShipmentToDelete(null)
    }
  }

  // --- HANDLER EDIT (BARU) ---
  const handleEditClick = (shipment: Shipment) => {
    setShipmentToEdit(shipment)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = (updatedShipment: Shipment) => {
    setShipments(prev => 
      prev.map(s => (s.id === updatedShipment.id ? updatedShipment : s))
    )
    setIsEditModalOpen(false)
    setShipmentToEdit(null)
  }

  // --- KALKULASI STATS ---
  const totalShipments = shipments.length
  const totalDelivered = shipments.reduce((sum, item) => sum + item.terkirim, 0)
  const totalFailed = shipments.reduce((sum, item) => sum + item.gagal, 0)
  const totalAttempted = totalDelivered + totalFailed;
  const successRate = totalAttempted > 0 ? ((totalDelivered / totalAttempted) * 100).toFixed(1) : '0'

  // ... (Komponen StatCard dan Loading State tetap sama)
  const StatCard = ({ title, value, icon: Icon, description, colorClass }: {
    title: string, value: string | number, icon: React.ElementType, description: string, colorClass: string
  }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300 transform hover:scale-[1.01] border-l-4 border-primary/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={cn("h-5 w-5", colorClass)} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )
  
  // Helper untuk classNames
  const cn = (...classes: (string | boolean | undefined | Record<string, boolean>)[]) => {
    return classes.filter(Boolean).map(c => {
      if (typeof c === 'string') return c;
      if (typeof c === 'object' && c !== null) return Object.keys(c).filter(key => c[key]).join(' ');
      return '';
    }).join(' ');
  };


  if (!user || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="flex flex-col items-center space-y-4 p-8 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl">
          <Loader2 className="h-10 w-10 text-primary animate-spin transition-all duration-500" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Mempersiapkan dashboard yang elegan...
          </p>
        </div>
      </div>
    )
  }

  return (
    // Catatan: Sidebar sekarang ada di Layout Induk
    <div className="p-6 md:p-10 space-y-10">
      {/* Header Elegan */}
      <header className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-gray-900 dark:text-gray-50">
              Dashboard
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              Selamat datang kembali, <span className="text-primary font-semibold">{user.username}</span>.
            </p>
          </div>
          <Badge variant="secondary" className="text-sm px-4 py-2 hidden sm:flex">
            <User className="h-4 w-4 mr-2" />
            Role: <span className="font-bold ml-1 capitalize">{user.role}</span>
          </Badge>
        </div>
      </header>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Shipments" 
          value={totalShipments} 
          icon={List} 
          description="Semua pengiriman tercatat" 
          colorClass="text-blue-500"
        />
        <StatCard 
          title="Terkirim" 
          value={totalDelivered} 
          icon={CheckCircle} 
          description="Pengiriman sukses" 
          colorClass="text-green-500"
        />
        <StatCard 
          title="Gagal" 
          value={totalFailed} 
          icon={XCircle} 
          description="Percobaan pengiriman gagal" 
          colorClass="text-red-500"
        />
        <StatCard 
          title="Tingkat Sukses" 
          value={`${successRate}%`} 
          icon={BarChart2} 
          description="Persentase sukses keseluruhan" 
          colorClass="text-purple-500"
        />
      </div>


      {/* Recent Shipments Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold">Aktivitas Pengiriman Terbaru</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Kelola dan lacak aktivitas pengiriman Anda.</p>
          </div>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            size="lg"
            className="transition-transform duration-200 hover:scale-[1.05] shadow-md hover:shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            <span>Shipment Baru</span>
          </Button>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Shipment ID</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Toko (Sukses/Total)</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {shipments.map((shipment) => (
                <TableRow 
                  key={shipment.id} 
                  className="transition-colors duration-150 hover:bg-muted/50"
                >
                  <TableCell className="font-medium flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-primary/70" />
                    {shipment.shipment}
                  </TableCell>
                  <TableCell>{shipment.nama_lengkap}</TableCell>
                  <TableCell className="text-muted-foreground">{shipment.tanggal}</TableCell>
                  <TableCell>
                    <span className="font-semibold text-green-600">{shipment.terkirim}</span> 
                    <span className="text-muted-foreground"> / {shipment.jumlah_toko}</span>
                    {shipment.gagal > 0 && (
                      <Badge variant="destructive" className="ml-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors">
                        {shipment.gagal} Gagal
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={shipment.gagal === 0 ? "default" : "secondary"} className={
                        shipment.gagal === 0 
                          ? "bg-green-500 hover:bg-green-600 text-white transition-colors"
                          : "bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
                    }>
                      {shipment.gagal === 0 ? 'Completed' : 'Partial'}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {/* Tombol Edit: Panggil handler baru */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditClick(shipment)} // <-- Panggil handleEditClick
                        className="text-blue-600 hover:bg-blue-100/50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      {/* Tombol Delete: Panggil handler yang sudah ada */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteClick(shipment.id)}
                        className="text-red-600 hover:bg-red-100/50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>


      {/* Footer yang Bersih */}
      <footer className="pt-8 border-t text-sm text-muted-foreground flex justify-between items-center">
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span className="ml-4 hidden sm:inline">|</span>
          <span className="ml-4 hidden sm:inline">Logged in as: <span className="text-primary font-semibold">{user?.username}</span></span>
        </div>
      </footer>


      {/* POPUP MODALS (Overlay Layer) */}
      <AddShipmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddShipment}
        user={user}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setShipmentToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Hapus Data Shipment"
        message="Apakah Anda yakin ingin menghapus data shipment ini? Tindakan ini tidak dapat dibatalkan."
      />
      
      {/* MODAL EDIT BARU */}
      <EditShipmentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setShipmentToEdit(null)
        }}
        shipmentData={shipmentToEdit}
        onSave={handleSaveEdit}
      />
    </div>
  )
}