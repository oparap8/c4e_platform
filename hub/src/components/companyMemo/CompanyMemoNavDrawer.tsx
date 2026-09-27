import { Button } from '@/components/ui/button'
import { MEMO_SECTIONS } from '@/constants'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { NavLink } from 'react-router-dom'
import { Circle, CircleAlert, CircleCheck, CircleDashed } from 'lucide-react'

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'complete':
      return <CircleCheck className="size-4 text-emerald-500" />
    case 'needs-work':
      return <CircleAlert className="text-destructive size-4" /> // or text-red-500
    case 'edited':
      return <CircleDashed className="size-4 text-amber-500" />
    case 'not-started':
    default:
      return <Circle className="text-muted-foreground size-4" />
  }
}

export default function CompanyMemoNavDrawer() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline" />}>Open</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <nav className="bg-muted mb-6 flex scrollbar-none flex-col flex-nowrap items-center gap-1 overflow-x-auto rounded-xl p-1.5 [&::-webkit-scrollbar]:hidden">
            {MEMO_SECTIONS.map((section) => (
              <Button
                key={section.name}
                variant="outline"
                className="h-auto w-full justify-start p-0"
                render={
                  <NavLink
                    to={section.name.toLowerCase().replace(/\s+/g, '-')}
                    className={({ isActive }) =>
                      `flex w-full shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? 'bg-background text-primary ring-border/50 shadow-sm ring-1'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  />
                }
              >
                <StatusIcon status={section.status} />
                {section.name}
              </Button>
            ))}
          </nav>
        </div>
        {/* <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
        </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  )
}
