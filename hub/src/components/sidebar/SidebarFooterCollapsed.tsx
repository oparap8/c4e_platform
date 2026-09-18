import { Paperclip, Bell, Calendar } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export function SidebarFooterCollapsed() {
  return (
    <div className="hidden group-data-[collapsible=icon]:block">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="My Files"
            className="text-slate-300 hover:bg-white/5 hover:text-white"
          >
            <Paperclip />
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Notifications"
            className="text-slate-300 hover:bg-white/5 hover:text-white"
          >
            <Bell />
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Book office hours"
            className="text-slate-300 hover:bg-white/5 hover:text-white"
          >
            <Calendar />
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem className="mt-2">
          <SidebarMenuButton
            tooltip="Student Profile"
            className="h-9 w-9 justify-center rounded-full p-0 hover:bg-white/10"
          >
            <Avatar className="size-7 bg-blue-600 text-white">
              <AvatarFallback className="bg-blue-600 text-xs">ST</AvatarFallback>
            </Avatar>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  )
}
