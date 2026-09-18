import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export function SidebarHeaderContent() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="hover:bg-white/5 data-[state=open]:bg-white/5">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white/10 font-bold text-white">
            C
          </div>
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
