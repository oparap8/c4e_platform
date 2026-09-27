import { Progress } from '@/components/ui/progress'
import { MEMO_SECTIONS } from '@/constants'
import { NavLink, useParams } from 'react-router-dom'
import { Circle, CircleAlert, CircleCheck, CircleDashed } from 'lucide-react'

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'complete':
      return <CircleCheck className="size-4 shrink-0 text-emerald-500" />
    case 'needs-work':
      return <CircleAlert className="text-destructive size-4 shrink-0" />
    case 'edited':
      return <CircleDashed className="size-4 shrink-0 text-amber-500" />
    case 'not-started':
    default:
      return <Circle className="text-muted-foreground size-4 shrink-0" />
  }
}

export default function CompanyMemoNav() {
  const { id } = useParams()
  const completedSections = MEMO_SECTIONS.filter((s) => s.status === 'complete').length
  const totalSections = MEMO_SECTIONS.length
  const progressPercentage = Math.round((completedSections / totalSections) * 100)

  return (
    <aside className="sticky top-20 hidden w-64 shrink-0 space-y-4 self-start md:block">
      <div className="bg-card border-border space-y-2.5 rounded-xl border p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-semibold tracking-wider uppercase">
            Progress
          </span>
          <span className="text-primary font-bold">{progressPercentage}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
        <p className="text-muted-foreground text-xs">
          <strong className="text-foreground">{completedSections}</strong> of {totalSections}{' '}
          sections complete
        </p>
      </div>

      <nav className="bg-muted/50 border-border flex max-h-[calc(100vh-18rem)] scrollbar-none flex-col gap-1 overflow-y-auto rounded-xl border p-1.5 [&::-webkit-scrollbar]:hidden">
        {MEMO_SECTIONS.map((section) => (
          <NavLink
            key={section.name}
            to={`${id}/${section.name.toLowerCase().replace(/\s+/g, '-')}`}
            className={({ isActive }: { isActive: boolean }) =>
              `flex w-full items-center gap-3 rounded-lg border-l-4 px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary border-primary font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/60 border-transparent'
              }`
            }
          >
            <StatusIcon status={section.status} />
            <span className="truncate">{section.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="bg-card border-border space-y-2 rounded-xl border p-3.5 text-xs">
        <span className="text-muted-foreground block text-[10px] font-semibold tracking-wider uppercase">
          Status Key
        </span>
        <div className="text-muted-foreground grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1.5">
            <CircleCheck className="size-3.5 text-emerald-500" />
            <span>Complete</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CircleAlert className="text-destructive size-3.5" />
            <span>Needs work</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CircleDashed className="size-3.5 text-amber-500" />
            <span>Edited</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Circle className="text-muted-foreground size-3.5" />
            <span>Not started</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
