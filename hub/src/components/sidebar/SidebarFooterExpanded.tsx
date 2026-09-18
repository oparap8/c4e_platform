import { Paperclip, Bell, Calendar, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function SidebarFooterExpanded() {
  return (
    <div className="flex flex-col gap-3 group-data-[collapsible=icon]:hidden">
      <Collapsible
        defaultOpen
        className="group/collapsible rounded-xl border border-white/10 bg-white/5"
      >
        <CollapsibleTrigger asChild>
          <div className="flex cursor-pointer items-center justify-between rounded-t-xl p-3 text-sm font-medium text-white hover:bg-white/5">
            <div className="flex items-center gap-2">
              <Paperclip className="size-4" />
              <span>My Files</span>
            </div>
            <ChevronUp className="size-4 transition-transform group-data-[state=closed]/collapsible:rotate-180" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-3 pt-0">
          <Button
            variant="outline"
            className="w-full border-white/20 bg-transparent text-white hover:bg-white/10"
          >
            Add files
          </Button>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible className="group/collapsible rounded-xl border border-white/10 bg-white/5">
        <CollapsibleTrigger asChild>
          <div className="flex cursor-pointer items-center justify-between rounded-xl p-3 text-sm font-bold tracking-wider text-slate-300 uppercase hover:bg-white/5">
            <div className="flex items-center gap-2">
              <Bell className="size-4" />
              <span>Notifications</span>
            </div>
            <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-3">
          <div className="text-xs text-slate-400">No new notifications</div>
        </CollapsibleContent>
      </Collapsible>

      <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10">
        <Calendar className="size-5 text-slate-300" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">Book office hours</span>
          <span className="text-xs text-slate-400">60 min session</span>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-9 border border-white/10 bg-blue-600 text-white">
            <AvatarFallback className="bg-blue-600">ST</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm leading-tight font-semibold text-white">Student</span>
            <span className="text-xs text-slate-400">C4E Builder</span>
          </div>
        </div>
        <button className="p-1 text-slate-400 transition-colors hover:text-white">
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
