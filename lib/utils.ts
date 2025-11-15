// 📂 lib/utils.ts

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
// Fungsi cn: menggabungkan class Tailwind dengan menghilangkan konflik
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}