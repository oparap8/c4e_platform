import { useUser } from '@/hooks'
import { Avatar, AvatarFallback } from '../ui/avatar'

const AuthAvatar = () => {
  const { user } = useUser()

  return (
    <Avatar>
      <AvatarFallback>
        {user?.first_name?.[0] || ''}
        {user?.last_name?.[0] || ''}
      </AvatarFallback>
    </Avatar>
  )
}

export default AuthAvatar
