// 📂 components/sidebar.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Truck, User, Menu } from "lucide-react";

// Import komponen shadcn/ui
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Menggunakan fungsi cn yang baru saja Anda buat!

// Definisikan item navigasi
const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Package },
  { name: "Shipments", href: "/shipments", icon: Truck },
  { name: "Profile", href: "/profile", icon: User },
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  // Tambahkan properti lain jika diperlukan
}

export function Sidebar({ className }: SidebarProps) {
  // State untuk mengontrol apakah sidebar terbuka atau tertutup
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const pathname = usePathname();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    // Kontainer utama Sidebar
    <div
      className={cn(
        // Basis styling: flex, border, bg-background
        "flex flex-col h-full border-r bg-card/50 shadow-lg",
        // Transisi halus (elegan)
        "transition-all duration-300 ease-in-out",
        // Lebar: 220px saat terbuka, 64px (16 rem) saat tertutup
        isCollapsed ? "w-16" : "w-[220px]",
        className
      )}
    >
      {/* Tombol Toggle (Menu) di bagian atas */}
      <div className={cn("flex p-4", isCollapsed ? "justify-center" : "justify-end")}>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleCollapse}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className="hover:bg-primary/10 transition-colors duration-200"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Area Navigasi Utama */}
      <nav className="flex flex-col gap-2 p-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-10 transition-colors duration-200",
                  {
                    "hover:bg-accent hover:text-accent-foreground": !isActive,
                    "px-3": isCollapsed,
                    "px-4": !isCollapsed,
                  }
                )}
              >
                {/* Ikon */}
                <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                
                {/* Teks - muncul hanya jika tidak Collapsed */}
                {!isCollapsed && (
                  <span className="truncate transition-opacity duration-200 delay-150">
                    {item.name}
                  </span>
                )}
                
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

// 🔑 Perubahan Penting: Default Export untuk mengatasi error import
export default Sidebar;