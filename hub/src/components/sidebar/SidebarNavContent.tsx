import { Home, FileText, Folder } from 'lucide-react'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

export function SidebarNavContent() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="mb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase group-data-[collapsible=icon]:hidden">
        Navigation
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Dashboard"
              isActive
              className="relative rounded-l-none bg-white/10 text-white before:absolute before:top-0 before:bottom-0 before:left-0 before:w-1 before:bg-red-500 hover:bg-white/15"
            >
              <Home className="size-4" />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Company Memo"
              className="text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <FileText className="size-4" />
              <span>Company Memo</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Data Room"
              className="text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <Folder className="size-4" />
              <span>Data Room</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
