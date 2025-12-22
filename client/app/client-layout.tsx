'use client'

import ErrorBoundary from '@/components/ErrorBoundary'
import '../sentry.client.config'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  )
}