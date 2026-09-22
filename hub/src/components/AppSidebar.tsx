import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar'
import {
  SidebarFooterCollapsed,
  SidebarFooterExpanded,
  SidebarHeaderContent,
  SidebarNavContent
} from './sidebar'

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="bg-sidebar text-sidebar-foreground border-r-0">
      <SidebarHeader className="border-b border-white/10 p-4 group-data-[collapsible=icon]:p-2">
        <SidebarHeaderContent />
      </SidebarHeader>

      <SidebarContent>
        <SidebarNavContent />
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2">
        <SidebarFooterExpanded />
        <SidebarFooterCollapsed />
      </SidebarFooter>
    </Sidebar>
  )
}
