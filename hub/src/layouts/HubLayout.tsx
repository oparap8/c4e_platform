import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { useUser } from '@/hooks'

function Greeting() {
  const h = new Date().getHours()
  if (h < 12) return <span>Good morning</span>
  if (h < 17) return <span>Good Afternoon</span>
  return <span>Good Evening</span>
}

export default function HubLayout() {
  const { user } = useUser()

  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1>
            {' '}
            <Greeting /> {user?.first_name} {user?.last_name}
          </h1>
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
