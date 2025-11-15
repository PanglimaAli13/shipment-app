'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // Menggunakan useRouter untuk navigasi
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter() // Inisialisasi router
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulasi login sederhana
    setTimeout(() => {
      if ((username === 'admin' && password === 'admin123') ||
          (username === 'driver' && password === 'driver123')) {
        
        localStorage.setItem('user', JSON.stringify({
          username: username,
          role: username === 'admin' ? 'admin' : 'driver',
          nama_lengkap: username === 'admin' ? 'Administrator' : 'John Driver'
        }))
        
        // Menggunakan router.push() untuk navigasi
        router.push('/dashboard')
      } else {
        alert('Login gagal! Gunakan admin/admin123 atau driver/driver123')
        setLoading(false)
      }
    }, 500)
  }

  return (
    // Latar Belakang Gelap dan Futuristik
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
      
      {/* Kartu Login: Warna gelap, border halus, shadow/glow sedikit */}
      <Card className="w-full max-w-sm bg-gray-800 border-gray-700 shadow-2xl shadow-indigo-500/20 text-white">
        
        <CardHeader className="text-center">
          {/* Judul dengan warna aksen cerah */}
          <CardTitle className="text-3xl font-extrabold tracking-wider text-cyan-400">
            SHIPMENT APP
          </CardTitle>
          <CardDescription className="text-gray-400">
            Masuk untuk melanjutkan
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            
            {/* Input Username */}
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-gray-300">Username</Label>
              {/* Input dengan warna background gelap yang konsisten */}
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="bg-gray-700 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400"
                required
              />
            </div>

            {/* Input Password */}
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="bg-gray-700 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400"
                required
              />
            </div>

            {/* Tombol Login - Menggunakan warna aksen futuristik (cyan) */}
            <Button 
              type="submit" 
              className="w-full mt-2 bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold transition-all" 
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>

          {/* Info Demo Credentials */}
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>Demo credentials:</p>
            <p className="font-semibold">Admin: <span className="text-cyan-400">admin</span> / <span className="text-cyan-400">admin123</span></p>
            <p className="font-semibold">Driver: <span className="text-cyan-400">driver</span> / <span className="text-cyan-400">driver123</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}