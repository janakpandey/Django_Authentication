'use client'

import { ReactNode, useEffect, useState } from 'react'
import { AuthProvider } from './auth/AuthContext'

function ThemeScript() {
  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    }
  }, [])
  return null
}

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <AuthProvider>
      <ThemeScript />
      {mounted ? children : null}
    </AuthProvider>
  )
}
