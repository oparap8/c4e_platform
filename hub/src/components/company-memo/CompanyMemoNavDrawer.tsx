import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { MEMO_SECTIONS } from '@/constants'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
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

export default function CompanyMemoNavDrawer({ className }: { className?: string }) {
  const { id } = useParams()
  const completedCount = MEMO_SECTIONS.filter((s) => s.status === 'complete').length
  const progressPercentage = Math.round((completedCount / MEMO_SECTIONS.length) * 100)

  return (
    <Drawer>
      <DrawerTrigger
        render={
          <Button variant="secondary" className={className || ''}>
            View Sections
          </Button>
        }
      />
      <DrawerContent>
        <DrawerHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle>Company Memo Sections</DrawerTitle>
              <DrawerDescription>Navigate through your memo draft sections.</DrawerDescription>
            </div>
            <span className="text-primary bg-primary/10 rounded-full px-2.5 py-1 text-xs font-bold">
              {progressPercentage}% Done
            </span>
          </div>

          <Progress value={progressPercentage} className="h-2 w-full" />
        </DrawerHeader>

        <div className="p-4">
          <nav
            data-vaul-no-drag
            className="bg-muted flex max-h-[55vh] scrollbar-none flex-col gap-1.5 overflow-y-auto rounded-xl p-2 [&::-webkit-scrollbar]:hidden"
          >
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
                <div className="flex flex-col text-left">
                  <span>{section.name}</span>
                  <span className="text-muted-foreground text-xs font-normal capitalize">
                    {section.status.replace('-', ' ')}
                  </span>
                </div>
              </NavLink>
            ))}
          </nav>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
