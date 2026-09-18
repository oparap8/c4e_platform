import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar'
import { SidebarHeaderContent } from './sidebar/SidebarHeaderContent'
import { SidebarNavContent } from './sidebar/SidebarNavContent'
import { SidebarFooterExpanded } from './sidebar/SidebarFooterExpanded'
import { SidebarFooterCollapsed } from './sidebar/SidebarFooterCollapsed'

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-[#112652] text-slate-200">
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
