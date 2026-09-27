import { Paperclip, Bell, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { AuthAvatar } from '@/components/auth'
import ThemeSwitcher from '../ThemeSwitcher'

export default function SidebarFooterExpanded() {
  return (
    <div className="flex flex-col gap-3 group-data-[collapsible=icon]:hidden">
      <Collapsible defaultOpen className="group/collapsible rounded-xl border bg-white/5">
        <CollapsibleTrigger className="w-full">
          <div className="flex cursor-pointer items-center justify-between rounded-t-xl p-3 text-sm font-medium hover:bg-white/5">
            <div className="flex items-center gap-2">
              <Paperclip className="size-4" />
              <span>My Files</span>
            </div>
            <ChevronUp className="size-4 transition-transform group-data-[state=closed]/collapsible:rotate-180" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-3 pt-0">
          <Button variant="outline" className="w-full" size={'xs'}>
            Add files
          </Button>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible className="group/collapsible rounded-xl border bg-white/5">
        <CollapsibleTrigger className="w-full">
          <div className="tracking-wideruppercase flex cursor-pointer items-center justify-between rounded-xl p-3 text-sm font-bold hover:bg-white/5">
            <div className="flex items-center gap-2">
              <Bell className="size-4" />
              <span>Notifications</span>
            </div>
            <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="item-center flex justify-center p-3">
          <div className="text-xs">No new notifications</div>
        </CollapsibleContent>
      </Collapsible>

      <div className="h flex cursor-pointer items-center gap-3 rounded-xl border bg-white/5 p-3 transition-colors">
        <Calendar className="size-5 text-slate-300" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Book office hours</span>
          <span className="text-xs">60 min session</span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-3 rounded-xl border bg-white/5 p-3">
        <AuthAvatar />

        <div className="min-w-0 flex-1">
          <span className="block text-sm leading-tight font-semibold">Student</span>
          <span className="block text-xs">C4E Builder</span>
        </div>

        <ThemeSwitcher />
      </div>
    </div>
  )
}
