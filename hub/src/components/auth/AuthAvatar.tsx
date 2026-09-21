import { useUser } from '@/hooks'
import { Avatar, AvatarFallback } from '../ui/avatar'

const AuthAvatar = () => {
  const { user } = useUser()
  console.log({ user })

  return (
    <Avatar className="size-9 border border-white/10 bg-blue-600 text-white">
      <AvatarFallback className="bg-blue-200">
        {user?.first_name?.[0] || ''}
        {user?.last_name?.[0] || ''}
      </AvatarFallback>
    </Avatar>
  )
}

export default AuthAvatar
