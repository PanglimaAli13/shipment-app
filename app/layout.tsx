// 📂 app/dashboard/layout.tsx

import Sidebar from "@/components/sidebar";
import './globals.css'
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Kontainer utama dengan layout Flex
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-gray-950/90 transition-colors duration-300">
      
      {/* Sidebar yang elegan dan dapat dilipat */}
      {/* Kita sembunyikan di layar kecil dan tampilkan di layar sedang ke atas (md:flex) */}
      <div className="hidden md:flex flex-shrink-0">
          <Sidebar />
      </div>
      
      {/* Konten Utama */}
      <main className="flex-1 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}