import { Paperclip, Bell, Calendar } from 'lucide-react'
import { AuthAvatar } from '@/components/auth'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export default function SidebarFooterCollapsed() {
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
            <AuthAvatar />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  )
}
