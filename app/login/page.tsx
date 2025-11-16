'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
// Mengimport ikon yang dibutuhkan
import { Eye, EyeOff } from 'lucide-react' 
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false) 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Logika login sederhana untuk demo
    setTimeout(() => {
      if ((username === 'admin' && password === 'admin123') ||
          (username === 'driver' && password === 'driver123')) {
        
        localStorage.setItem('user', JSON.stringify({
          username: username,
          role: username === 'admin' ? 'admin' : 'driver',
          nama_lengkap: username === 'admin' ? 'Administrator' : 'John Driver'
        }))
        
        router.push('/dashboard')
      } else {
        alert('Login gagal! Gunakan admin/admin123 atau driver/driver123')
        setLoading(false)
      }
    }, 500)
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        background: 'var(--login-background)', 
        backgroundSize: 'cover',               
        backgroundPosition: 'center',          
        backgroundRepeat: 'no-repeat',         
      }} 
    >
      
      <Card 
        className="
          w-full max-w-sm 
          bg-gradient-to-br from-white to-gray-50 
          border-gray-200 shadow-2xl shadow-gray-900/40 
          text-gray-900
          rounded-xl
        "
      >
        
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold tracking-wider text-gray-800">
            SHIPMENT APP
          </CardTitle>
          <CardDescription className="text-gray-600">
            Masuk untuk melanjutkan
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            
            {/* Input Username */}
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-gray-700 text-sm">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                // Penyesuaian: Menggunakan height (h-9) untuk tinggi yang lebih ringkas
                className="bg-white border-gray-300 text-gray-900 focus:border-blue-600 focus:ring-blue-600 rounded-lg h-11 text-center" 
                required
              />
            </div>

            {/* Input Password dengan Toggle Ikon */}
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-gray-700 text-sm">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  // Penyesuaian: Menggunakan height (h-9) dan pr-10 yang sama
                  className="bg-white border-gray-300 text-gray-900 focus:border-blue-600 focus:ring-blue-600 rounded-lg pr-10 h-11 text-center" 
                  required
                />
                
                {/* Tombol Ikon Show/Hide */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  // Penyesuaian: Padding vertikal (py-1) untuk mengatur posisi ikon di dalam h-9
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {/* Penyesuaian: Menggunakan ukuran 18px (size={18}) untuk ikon yang lebih proporsional */}
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              // Penyesuaian: Mengurangi py (py-2) agar tombol tidak terlalu tebal
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all rounded-lg py-2" 
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Demo credentials:</p>
            <p className="font-semibold">Admin: <span className="text-blue-600">admin</span> / <span className="text-blue-600">admin123</span></p>
            <p className="font-semibold">Driver: <span className="text-blue-600">driver</span> / <span className="text-blue-600">driver123</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}