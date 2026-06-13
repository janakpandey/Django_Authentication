'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../auth/AuthContext'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import {
  User,
  Mail,
  MapPin,
  School,
  Calendar,
  Camera,
  LogOut,
  Save,
  Moon,
  Sun,
  Loader2,
  Sparkles,
} from 'lucide-react'

export default function DashboardPage() {
  const { user, loading, logout, refreshUser } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const [form, setForm] = useState({
    email: '',
    age: '',
    school: '',
    location: '',
  })

  useEffect(() => {
    setMounted(true)
    const isDark = document.documentElement.classList.contains('dark')
    setDark(isDark)
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user) {
      setForm({
        email: user.email || '',
        age: user.age?.toString() || '',
        school: user.school || '',
        location: user.location || '',
      })
    }
  }, [user])

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setSaving(true)
    const fd = new FormData()

    if (form.email) fd.append('email', form.email)
    if (form.age) fd.append('age', form.age)
    if (form.school) fd.append('school', form.school)
    if (form.location) fd.append('location', form.location)

    const file = fileInputRef.current?.files?.[0]
    if (file) fd.append('profile_picture', file)

    const { data, error } = await api.updateProfile(fd)
    setSaving(false)

    if (error) {
      toast.error(error)
    } else {
      toast.success('Profile updated!')
      setIsEditing(false)
      setPreview(null)
      await refreshUser()
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setPreview(null)
    if (user) {
      setForm({
        email: user.email || '',
        age: user.age?.toString() || '',
        school: user.school || '',
        location: user.location || '',
      })
    }
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-blue-500" />
          <p className="text-slate-500 dark:text-slate-400 animate-pulse">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500" />

      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-500/5 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-float" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-400/10 dark:bg-purple-500/5 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

      <div className="relative z-10">
        <header className="glass border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AuthFlow
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2.5 glass-strong rounded-xl hover:scale-105 transition-all duration-300"
                aria-label="Toggle theme"
              >
                {dark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-600" />}
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2.5 glass-strong rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-300 hover:scale-105"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass-strong rounded-3xl shadow-xl overflow-hidden">
              <div className="relative h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
              </div>

              <div className="relative px-6 sm:px-8 pb-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 mb-8">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-slate-800 shadow-xl">
                      {preview || user.profile_picture ? (
                        <Image
                          src={preview || user.profile_picture!}
                          alt="Profile"
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <User size={48} className="text-white/80" />
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200"
                      >
                        <Camera size={16} />
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>

                  <div className="text-center sm:text-left flex-1">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                      {user.username}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                      Member since {new Date().getFullYear()}
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                    className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                      isEditing
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl'
                    }`}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </motion.button>
                </div>

                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="edit"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                            <Mail size={14} /> Email
                          </label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="your@email.com"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                            <Calendar size={14} /> Age
                          </label>
                          <input
                            type="number"
                            value={form.age}
                            onChange={(e) => setForm({ ...form, age: e.target.value })}
                            placeholder="Your age"
                            min="1"
                            max="150"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                            <School size={14} /> School
                          </label>
                          <input
                            type="text"
                            value={form.school}
                            onChange={(e) => setForm({ ...form, school: e.target.value })}
                            placeholder="Your school"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                            <MapPin size={14} /> Location
                          </label>
                          <input
                            type="text"
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                            placeholder="Your location"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSave}
                          disabled={saving}
                          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-300 disabled:opacity-60 flex items-center gap-2"
                        >
                          {saving ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Save size={18} />
                          )}
                          {saving ? 'Saving...' : 'Save Changes'}
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                      {[
                        { icon: Mail, label: 'Email', value: user.email || 'Not set', color: 'from-blue-500 to-blue-600' },
                        { icon: Calendar, label: 'Age', value: user.age ?? 'Not set', color: 'from-emerald-500 to-emerald-600' },
                        { icon: School, label: 'School', value: user.school || 'Not set', color: 'from-purple-500 to-purple-600' },
                        { icon: MapPin, label: 'Location', value: user.location || 'Not set', color: 'from-amber-500 to-amber-600' },
                      ].map((item, i) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.4 }}
                          className="glass rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className={`inline-flex w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl items-center justify-center mb-3 shadow-md`}>
                            <item.icon size={18} className="text-white" />
                          </div>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {item.label}
                          </p>
                          <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1 truncate">
                            {item.value}
                          </p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
