'use client' 

import { useEffect, useState, useMemo,useRef } from 'react'
import { useRouter } from 'next/navigation'
// Import ikon yang diperlukan
import {
  Package, Truck, User, Plus, CheckCircle, XCircle, BarChart2, Edit, Trash2, Loader2, List,
  ChevronUp, ChevronDown, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Calendar as CalendarIcon
} from 'lucide-react'
// Import date-fns untuk manipulasi tanggal
import { parseISO, format, isBefore, isAfter, isValid } from 'date-fns' 

// ==========================================================
// IMPORT KOMPONEN SHADCN/UI & UTILS
// ==========================================================
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils' // Asumsi cn diimpor dari lib/utils.ts

// ==========================================================
// IMPORT MODAL (Asumsi komponen modal sudah tersedia)
// ==========================================================
import AddShipmentModal from '@/components/modals/add-shipment-modal'
import DeleteConfirmModal from '@/components/modals/delete-confirm-modal'
import EditShipmentModal from '@/components/modals/edit-shipment-modal' 
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
  nama_lengkap: string
}

// Helper untuk format tanggal ke DD-MM-YYYY
const formatDate = (dateString: string) => {
    try {
        const date = parseISO(dateString);
        return format(date, 'dd-MM-yyyy');
    } catch (e) {
        return dateString; 
    }
};

// Komponen StatCard (Tema Gelap)
const StatCard = ({ title, value, icon: Icon, description, colorClass }: {
  title: string, value: string | number, icon: React.ElementType, description: string, colorClass: string
}) => (
  <Card className={cn(
    "bg-gray-800 border-gray-700 text-white shadow-xl transition-all duration-300 hover:scale-[1.01]",
    "border-l-4 border-cyan-500/50 hover:border-cyan-500" // Tema gelap/cyan
  )}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
      <Icon className={cn("h-5 w-5", colorClass)} />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold tracking-tight text-cyan-400">{value}</div>
      <p className="text-xs text-gray-400 mt-1">{description}</p>
    </CardContent>
  </Card>
)
// ==========================================================
// KOMPONEN UTAMA DASHBOARD
// ==========================================================
export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)

  // STATE MODAL
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [shipmentToDelete, setShipmentToDelete] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [shipmentToEdit, setShipmentToEdit] = useState<Shipment | null>(null)

  // STATE FILTERING & SORTING
  const [driverFilter, setDriverFilter] = useState('')
  const [startDateFilter, setStartDateFilter] = useState<string | null>(null) 
  const [endDateFilter, setEndDateFilter] = useState<string | null>(null) 
  const [sortKey, setSortKey] = useState<keyof Shipment>('tanggal') 
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc') 

  // STATE PAGINATION
  const ROWS_PER_PAGE = 15 
  const [currentPage, setCurrentPage] = useState(1)

  // TAMBAHKAN DUA BARIS INI
  const startDateRef = useRef<HTMLInputElement>(null)
  const endDateRef = useRef<HTMLInputElement>(null)


  // --- LOGIKA OTENTIKASI & DUMMY DATA ---
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Generate Dummy Data (25 baris)
    const generateDummyShipments = (): Shipment[] => {
        const drivers = [{ name: 'Budi Santoso' }, { name: 'Sari Dewi' }, { name: 'Ahmad Fauzi' }, { name: 'Rani Fitri' }, { name: 'Joko Widodo' }];
        const baseDate = new Date('2024-01-01').getTime();
        const data: Shipment[] = [];

        for (let i = 1; i <= 25; i++) { 
            const driver = drivers[i % drivers.length];
            // Tanggal dalam format YYYY-MM-DD
            const date = format(new Date(baseDate + (i * 86400000)), 'yyyy-MM-dd'); 
            const numToko = Math.floor(Math.random() * 15) + 15;
            const numTerkirim = Math.floor(Math.random() * numToko);
            const numGagal = numToko - numTerkirim;
            
            let alasan = (i % 5 === 0 && numGagal > 0) ? 'Toko tutup dan tidak ada orang yang bertanggung jawab' : undefined;
            if (i % 7 === 0 && numGagal > 0) alasan = 'Barang mengalami kerusakan kecil saat pengiriman dan harus diretur';
            if (i % 10 === 0 && numGagal > 0) alasan = 'Alamat tidak ditemukan setelah beberapa kali percobaan pengiriman';

            data.push({
                id: i.toString(),
                shipment: `SHIP-${date.substring(5, 7)}-${i.toString().padStart(3, '0')}`,
                nama_lengkap: driver.name,
                tanggal: date,
                jumlah_toko: numToko,
                terkirim: numTerkirim,
                gagal: numGagal,
                alasan: alasan
            });
        }
        return data;
    };

    setTimeout(() => {
        setShipments(generateDummyShipments())
        setLoading(false)
    }, 1000)
  }, [router])


  // --- HANDLER CRUD (Tetap Dipertahankan) ---
  const handleAddShipment = (newShipment: Shipment) => { setShipments(prev => [newShipment, ...prev]) }
  const handleDeleteClick = (id: string) => { setShipmentToDelete(id); setIsDeleteModalOpen(true); }
  const handleConfirmDelete = () => {
    if (shipmentToDelete) {
      setShipments(prev => prev.filter(item => item.id !== shipmentToDelete))
      setIsDeleteModalOpen(false)
      setShipmentToDelete(null)
    }
  }
  const handleEditClick = (shipment: Shipment) => { setShipmentToEdit(shipment); setIsEditModalOpen(true); }
  const handleSaveEdit = (updatedShipment: Shipment) => {
    setShipments(prev => 
      prev.map(s => (s.id === updatedShipment.id ? updatedShipment : s))
    )
    setIsEditModalOpen(false)
    setShipmentToEdit(null)
  }

  // --- LOGIKA FILTERING, SORTING, DAN PAGINATION ---
  const sortedAndFilteredShipments = useMemo(() => {
    let currentShipments = [...shipments];

    // 1. Filtering by Driver (Admin Only)
    if (user?.role === 'admin' && driverFilter) {
      currentShipments = currentShipments.filter(s => 
        s.nama_lengkap.toLowerCase().includes(driverFilter.toLowerCase())
      );
    }
    
    // 2. Filter by Date Range
    if (startDateFilter && endDateFilter) {
        const start = parseISO(startDateFilter);
        const end = parseISO(endDateFilter);

        if (isValid(start) && isValid(end)) {
             currentShipments = currentShipments.filter(s => {
                const shipmentDate = parseISO(s.tanggal);
                // Tambahkan 1 hari ke tanggal akhir agar inklusif (date-fns logic)
                const inclusiveEnd = new Date(end.getTime() + 86400000); 

                // Cek apakah tanggal pengiriman berada di antara tanggal mulai (inklusif) dan tanggal akhir (eksklusif hari berikutnya)
                return isAfter(shipmentDate, new Date(start.getTime() - 1)) && isBefore(shipmentDate, inclusiveEnd);
            });
        }
    }
    // Reset ke halaman 1 setelah filter/sort
    setCurrentPage(1); 
    
    // 3. Sorting
    currentShipments.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];
        
        if (aValue === undefined || bValue === undefined) return 0;
        
        let comparison = 0;
        if (sortKey === 'tanggal') {
             // Sorting Tanggal (menggunakan parseISO)
            const dateA = parseISO(aValue as string);
            const dateB = parseISO(bValue as string);
            if (dateA > dateB) comparison = 1;
            else if (dateA < dateB) comparison = -1;
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
            comparison = aValue.localeCompare(bValue);
        } else if (aValue > bValue) {
            comparison = 1;
        } else if (aValue < bValue) {
            comparison = -1;
        }

        return sortDirection === 'desc' ? comparison * -1 : comparison;
    });

    return currentShipments;
  }, [shipments, user, driverFilter, startDateFilter, endDateFilter, sortKey, sortDirection]);

  // Pagination Slice
  const totalPages = Math.ceil(sortedAndFilteredShipments.length / ROWS_PER_PAGE);
  const paginatedShipments = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    return sortedAndFilteredShipments.slice(startIndex, endIndex);
  }, [sortedAndFilteredShipments, currentPage]);


  // Handler untuk mengaktifkan sorting pada kolom
  const handleSort = (key: keyof Shipment) => {
    if (sortKey === key) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
        setSortKey(key);
        setSortDirection('desc'); // Default ke DESC saat ganti kolom sort
    }
  };
  
  // --- KALKULASI STATS (DIPERTAHANKAN) ---
  const totalShipments = shipments.length
  const totalDelivered = shipments.reduce((sum, item) => sum + item.terkirim, 0)
  const totalFailed = shipments.reduce((sum, item) => sum + item.gagal, 0)
  const totalAttempted = totalDelivered + totalFailed;
  const successRate = totalAttempted > 0 ? ((totalDelivered / totalAttempted) * 100).toFixed(1) : '0'

  // Fungsi untuk mendapatkan status badge (Tetap sama)
  const getStatusBadge = (gagal: number) => {
    if (gagal === 0) {
      return (
        <Badge className="bg-green-500 hover:bg-green-600 text-white transition-colors duration-200">
          Completed
        </Badge>
      )
    } else if (gagal > 0 && gagal <= 5) {
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 transition-colors duration-200">
          Partial
        </Badge>
      )
    } else {
      return (
         <Badge className="bg-red-500 hover:bg-red-600 text-white transition-colors duration-200">
          Failed
        </Badge>
      )
    }
  }


  if (!user || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 transition-colors duration-300">
        <div className="flex flex-col items-center space-y-4 p-8 bg-gray-800 rounded-xl shadow-2xl">
          <Loader2 className="h-10 w-10 text-cyan-500 animate-spin transition-all duration-500" />
          <p className="text-lg font-medium text-gray-300">
            Mempersiapkan dashboard yang elegan...
          </p>
        </div>
      </div>
    )
  }

  // Komponen Header Tabel yang bisa di-sort
  const SortableTableHead = ({ children, sortKeyName, align = 'center' }: { children: React.ReactNode, sortKeyName: keyof Shipment, align?: 'left' | 'center' | 'right' }) => (
    <TableHead 
      className={cn(
        // Tambahkan border-r untuk pemisah kolom
        `cursor-pointer hover:bg-gray-700/50 transition-colors duration-150 text-gray-400 border-r border-gray-700 last:border-r-0`, 
        `text-${align}`,
        `min-w-[120px]` // Tambahkan min-width dasar untuk mencegah kompresi berlebihan
      )}
      onClick={() => handleSort(sortKeyName)}
    >
      <div className={cn("flex items-center gap-1", {
         'justify-center': align === 'center',
         'justify-end': align === 'right',
         'justify-start': align === 'left',
      })}>
        {children}
        {sortKey === sortKeyName && (
          sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
        )}
      </div>
    </TableHead>
  );
  
  const PaginationControls = () => {
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages || totalPages === 0;

    const changePage = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
    // Tombol untuk Pagination
    const PageButton = ({ children, onClick, disabled = false }: { children: React.ReactNode, onClick: () => void, disabled?: boolean }) => (
        <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            disabled={disabled}
            className="text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
            {children}
        </Button>
    );

    return (
        <div className="flex justify-between items-center pt-4 border-t border-gray-700 mt-6">
            <div className="text-sm text-gray-400">
                Menampilkan {((currentPage - 1) * ROWS_PER_PAGE) + 1} - {Math.min(currentPage * ROWS_PER_PAGE, sortedAndFilteredShipments.length)} dari {sortedAndFilteredShipments.length} total data
            </div>
            
            <div className="flex items-center space-x-2">
                <PageButton onClick={() => changePage(1)} disabled={isFirstPage}>
                    <ChevronsLeft size={18} />
                </PageButton>
                <PageButton onClick={() => changePage(currentPage - 1)} disabled={isFirstPage}>
                    <ChevronLeft size={18} />
                </PageButton>
                
                <span className="text-gray-300 px-3 py-1 bg-gray-700 rounded-lg text-sm">
                    Halaman {currentPage} dari {totalPages || 1}
                </span>

                <PageButton onClick={() => changePage(currentPage + 1)} disabled={isLastPage}>
                    <ChevronRight size={18} />
                </PageButton>
                <PageButton onClick={() => changePage(totalPages)} disabled={isLastPage}>
                    <ChevronsRight size={18} />
                </PageButton>
            </div>
        </div>
    );
  };
  
  return (
    // Catatan: Layout luar (Sidebar & ml-64) ditangani oleh DashboardLayout di app/layout.tsx
    <div className="p-4 md:p-10 space-y-8 bg-gray-900 min-h-screen text-white">
      {/* Header Elegan */}
      <header className="space-y-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-cyan-400">
              Dashboard
            </h1>
            <p className="text-base text-gray-400 mt-1">
              Selamat datang kembali, <span className="text-cyan-400 font-semibold">{user.nama_lengkap || user.username}</span>.
            </p>
          </div>
          <Badge variant="default" className="text-sm px-3 py-1 hidden sm:flex bg-cyan-600 hover:bg-cyan-700 transition-colors">
            <User className="h-4 w-4 mr-2" />
            Role: <span className="font-bold ml-1 capitalize">{user.role}</span>
          </Badge>
        </div>
      </header>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Shipments" value={totalShipments} icon={List} description="Semua pengiriman tercatat" colorClass="text-blue-400" />
        <StatCard title="Terkirim" value={totalDelivered} icon={CheckCircle} description="Pengiriman sukses" colorClass="text-green-400" />
        <StatCard title="Gagal" value={totalFailed} icon={XCircle} description="Percobaan pengiriman gagal" colorClass="text-red-400" />
        <StatCard title="Tingkat Sukses" value={`${successRate}%`} icon={BarChart2} description="Persentase sukses keseluruhan" colorClass="text-purple-400" />
      </div>


      {/* Recent Shipments Table */}
      <Card className="bg-gray-800 border-gray-700 shadow-xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-100">Aktivitas Pengiriman Terbaru</CardTitle>
              <p className="text-sm text-gray-400 mt-1">Kelola dan lacak aktivitas pengiriman Anda.</p>
            </div>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              size="lg"
              className="transition-transform duration-200 hover:scale-[1.05] shadow-lg bg-cyan-600 hover:bg-cyan-700 w-full md:w-32 rounded-lg" // Full width di mobile
            >
              <span>Input Shipment</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
            {/* Filter Section */}
            <div className="flex flex-wrap gap-3 items-end"> 
                
                {/* Filter Tanggal Mulai (Full width di mobile) */}
                  <div className="relative flex flex-col gap-1 w-full xs:w-[calc(50%-6px)] sm:w-[200px]">
                      <Label htmlFor="startDateFilter" className="text-gray-400 text-sm">Tanggal Mulai</Label>
                      
                      {/* Ikon Kalender Kustom dari Lucide */}
                      <CalendarIcon 
                      onClick={() => startDateRef.current?.showPicker()}
                      className="absolute bottom-2.5 right-3 h-4 w-4 text-gray-400 cursor-pointer" />
                      
                      <Input 
                          id="startDateFilter"
                          ref={startDateRef}
                          type="date"
                          value={startDateFilter || ''}
                          onChange={(e) => setStartDateFilter(e.target.value || null)}
                          // Tambahkan pr-10 agar teks tidak menimpa ikon
                          className="bg-gray-700 border-gray-600 text-white rounded-lg h-9 transition-colors hover:border-cyan-500 pr-10"
                      />
                  </div>

                  {/* Filter Tanggal Akhir (Full width di mobile) */}
                  <div className="relative flex flex-col gap-1 w-full xs:w-[calc(50%-6px)] sm:w-[200px]">
                      <Label htmlFor="endDateFilter" className="text-gray-400 text-sm">Tanggal Akhir</Label>

                      {/* Ikon Kalender Kustom dari Lucide */}
                      <CalendarIcon 
                      onClick={() => endDateRef.current?.showPicker()}
                      className="absolute bottom-2.5 right-3 h-4 w-4 text-gray-400 cursor-pointer" />

                      <Input 
                          id="endDateFilter"
                          ref={endDateRef}
                          type="date"
                          value={endDateFilter || ''}
                          onChange={(e) => setEndDateFilter(e.target.value || null)}
                          // Tambahkan pr-10 agar teks tidak menimpa ikon
                          className="bg-gray-700 border-gray-600 text-white rounded-lg h-9 transition-colors hover:border-cyan-500 pr-10"
                      />
                  </div>

                {/* Filter Driver (Admin Only - Full width di mobile) */}
                {user?.role === 'admin' && (
                    <div className="flex flex-col gap-1 w-full sm:w-[200px]">
                        <Label htmlFor="driverFilter" className="text-gray-400 text-sm">Nama Driver</Label>
                        <Input 
                            id="driverFilter"
                            type="text"
                            value={driverFilter}
                            onChange={(e) => setDriverFilter(e.target.value)}
                            placeholder="Cari Driver..."
                            className="bg-gray-700 border-gray-600 text-white rounded-lg h-9 transition-colors hover:border-cyan-500"
                        />
                    </div>
                )}
                
                <Button 
                    variant="ghost" 
                    onClick={() => { setDriverFilter(''); setStartDateFilter(null); setEndDateFilter(null); }}
                    className="text-red-400 hover:bg-gray-700 h-9 transition-colors w-full sm:w-auto" // Full width di mobile
                >
                    Reset Filter
                </Button>

            </div>

            {/* RESPONSIVITAS TABEL: Wrapper untuk scroll horizontal */}
            <div className="overflow-x-auto rounded-lg border border-gray-700"> {/* Tambahkan border di sini untuk bingkai luar */}
                <Table className="min-w-full">
                    <TableHeader className="bg-gray-700/50">
                    <TableRow>
                        
                        {/* 1. TANGGAL (CENTER) */}
                        <SortableTableHead sortKeyName="tanggal">Tanggal</SortableTableHead> 
                        
                        {/* 2. NAMA DRIVER (LEFT, ADMIN ONLY) */}
                        {user?.role === 'admin' && (
                        <SortableTableHead sortKeyName="nama_lengkap" align="center">Nama Driver</SortableTableHead> 
                        )}

                        {/* 3. SHIPMENT (CENTER) */}
                        <SortableTableHead sortKeyName="shipment">Shipment</SortableTableHead> 
                        {/* 4. JUMLAH TOKO (CENTER) */}
                        <SortableTableHead sortKeyName="jumlah_toko">Jml. Toko</SortableTableHead> 
                        {/* 5. TERKIRIM (CENTER) */}
                        <SortableTableHead sortKeyName="terkirim">Terkirim</SortableTableHead> 
                        {/* 6. GAGAL (CENTER) */}
                        <SortableTableHead sortKeyName="gagal">Gagal</SortableTableHead> 
                        
                        {/* 9. ALASAN (LEFT, Truncate) */}
                        <TableHead className="min-w-[180px] text-center text-gray-400 border-r border-gray-700">Alasan</TableHead>
                        
                        {/* 10. AKSI (RIGHT) - border-r-0 karena ini kolom terakhir */}
                        <TableHead className="min-w-[100px] text-center text-gray-400 last:border-r-0">Aksi</TableHead> 
                    </TableRow>
                    </TableHeader>

                    <TableBody>
                    {paginatedShipments.map((shipment) => (
                        <TableRow 
                        key={shipment.id} 
                        // GARIS PEMISAH HORIZONTAL
                        className="border-b border-gray-700 hover:bg-gray-700/40 transition-colors duration-150"
                        >
                        
                        {/* 1. TANGGAL (CENTER, Format DD-MM-YYYY) */}
                        {/* GARIS PEMISAH VERTIKAL */}
                        <TableCell className="py-3 text-center font-medium text-cyan-400 border-r border-gray-700">{formatDate(shipment.tanggal)}</TableCell> 

                        {/* 2. NAMA DRIVER (LEFT, ADMIN ONLY) */}
                        {user?.role === 'admin' && (
                            <TableCell className="py-3 pl-4 text-left text-gray-300 border-r border-gray-700">{shipment.nama_lengkap}</TableCell>
                        )}
                        
                        {/* 3. SHIPMENT (CENTER) */}
                        <TableCell className="py-3 text-center text-gray-300 border-r border-gray-700">{shipment.shipment}</TableCell> 
                        {/* 4. JUMLAH TOKO (CENTER) */}
                        <TableCell className="py-3 text-center text-gray-300 border-r border-gray-700">{shipment.jumlah_toko}</TableCell> 
                        {/* 5. TERKIRIM (CENTER) */}
                        <TableCell className="py-3 text-center text-green-400 font-semibold border-r border-gray-700">{shipment.terkirim}</TableCell> 
                        {/* 6. GAGAL (CENTER) */}
                        <TableCell className="py-3 text-center text-red-400 font-semibold border-r border-gray-700">{shipment.gagal}</TableCell> 
                        
                        {/* 9. ALASAN (LEFT, Truncate) */}
                        <TableCell className="py-3 pl-4 text-left text-gray-400 max-w-xs truncate border-r border-gray-700" title={shipment.alasan}>
                            {shipment.alasan || '-'}
                        </TableCell>
                        
                        {/* 10. AKSI (RIGHT, Ikon) - Hapus border-r pada kolom terakhir */}
                        <TableCell className="text-right">
                            <div className="py-3 flex justify-center space-x-7">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEditClick(shipment)}
                                className="text-blue-400 hover:bg-gray-700/60 transition-colors duration-200"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteClick(shipment.id)}
                                className="text-red-400 hover:bg-gray-700/60 transition-colors duration-200"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            </div>
                        </TableCell>
                        </TableRow>
                    ))}
                    {/* Handling Empty State */}
                        {paginatedShipments.length === 0 && (
                            <TableRow className="border-b border-gray-700">
                                <TableCell colSpan={user?.role === 'admin' ? 8 : 7} className="text-center text-gray-500 py-10">
                                    Tidak ada data pengiriman ditemukan berdasarkan filter Anda.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
          
          {/* Pagination Controls */}
          <PaginationControls />

        </CardContent>
      </Card>


      {/* Footer yang Bersih */}
      <footer className="pt-8 border-t border-gray-800 text-sm text-gray-400 flex justify-between items-center">
        <div>
          <span className="font-medium text-gray-300">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span className="ml-4 hidden sm:inline">|</span>
          <span className="ml-4 hidden sm:inline">Logged in as: <span className="text-cyan-400 font-semibold">{user?.username}</span></span>
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