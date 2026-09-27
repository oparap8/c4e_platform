interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps): React.JSX.Element {
  return <div className={`p-2 md:p-5 ${className ? className : ''}`}>{children}</div>
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-2 md:flex-row md:items-center">
      <div>
        <h3 className="text-primary text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:items-center">{action}</div>
    </div>
  )
}
