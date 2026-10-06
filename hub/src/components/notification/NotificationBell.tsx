import { Bell } from 'lucide-react'
import { useFrappeGetDocList } from 'frappe-react-sdk'

export default function NotificationBell() {
  const { data } = useFrappeGetDocList('Notification Log', {
    fields: ['subject', 'read'],
    filters: [['read', '=', 0]]
  })

  return (
    <span className="relative">
      <Bell className="size-4" />
      {data && data.length > 0 && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {data.length}
        </span>
      )}
    </span>
  )
}
