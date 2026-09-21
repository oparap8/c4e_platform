import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { useUser } from '@/hooks'

function Greeting() {
  const h = new Date().getHours()
  if (h < 12) return <span>Good morning,</span>
  if (h < 17) return <span>Good Afternoon,</span>
  return <span>Good Evening,</span>
}

export default function HubLayout() {
  const { user } = useUser()

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="bg-secondary text-secondary-foreground flex h-16 items-center gap-2 md:h-20">
          <SidebarTrigger />
          <h1 className="text-lg font-bold md:text-2xl">
            <Greeting /> {user?.first_name} {user?.last_name}
          </h1>
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
