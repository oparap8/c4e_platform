import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { C4ELogo } from '../C4ELogo'

export default function SidebarHeaderContent() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="hover:bg-white/5 data-[state=open]:bg-white/5">
          <C4ELogo />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-bold text-white">Center for Entrepreneurship</span>
            <span className="truncate text-[10px] tracking-wider text-slate-400 uppercase">
              C4E Platform · 2026
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
