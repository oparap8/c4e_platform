import { FrappeProvider } from 'frappe-react-sdk'
import type { ReactNode } from 'react'
import { ThemeProvider } from '@/components/ThemeProvider'
import { TooltipProvider } from '@/components/ui/tooltip'

const frappeUrl = import.meta.env.VITE_FRAPPE_URL || window.location.origin

export function Providers({ children }: { children: ReactNode }) {
  return (
    <FrappeProvider url={frappeUrl}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </FrappeProvider>
  )
}
