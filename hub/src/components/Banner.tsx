import * as React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

type BannerVariant = 'info' | 'success' | 'warning' | 'error'

interface BannerProps extends Omit<React.ComponentProps<typeof Alert>, 'variant' | 'title'> {
  variant?: BannerVariant
  title: string
  description?: React.ReactNode
  action?: React.ReactNode
}

const variantStyles: Record<BannerVariant, { classes: string; icon: React.ElementType }> = {
  info: {
    classes: 'border-blue-200 bg-blue-50 text-blue-800 [&>svg]:text-blue-600',
    icon: Info
  },
  success: {
    classes: 'border-green-200 bg-green-50 text-green-800 [&>svg]:text-green-600',
    icon: CheckCircle2
  },
  warning: {
    classes: 'border-amber-200 bg-amber-50 text-amber-800 [&>svg]:text-amber-600',
    icon: AlertTriangle
  },
  error: {
    classes: 'border-red-200 bg-red-50 text-red-800 [&>svg]:text-red-600',
    icon: XCircle
  }
}

export function Banner({
  variant = 'info',
  title,
  description,
  action,
  children,
  className,
  ...props
}: BannerProps) {
  const config = variantStyles[variant]
  const Icon = config.icon

  return (
    <Alert
      className={`relative ${action ? 'pr-24' : ''} ${config.classes} ${className || ''}`}
      {...props}
    >
      <Icon className="h-4 w-4" />

      <AlertTitle>{title}</AlertTitle>

      {(description || children) && <AlertDescription>{description || children}</AlertDescription>}

      {action && <div className="absolute top-3.5 right-4">{action}</div>}
    </Alert>
  )
}
