import { FileText, Folder, Lightbulb } from 'lucide-react'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { NavLink, useLocation } from 'react-router-dom'

export default function SidebarNavContent() {
  const { pathname } = useLocation()

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="mb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase group-data-[collapsible=icon]:hidden">
        Navigation
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Dashboard"
              render={<NavLink to="/idea" />}
              isActive={pathname.startsWith('/idea')}
            >
              <Lightbulb className="size-4" />
              <span>Ideas</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Company Memo"
              render={<NavLink to="/company-memo" />}
              isActive={pathname.startsWith('/company-memo')}
            >
              <FileText className="size-4" />
              <span>Company Memo</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Data Room"
              render={<NavLink to="/data-room" />}
              isActive={pathname.startsWith('/data-room')}
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
