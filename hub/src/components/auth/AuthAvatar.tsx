import { Avatar, AvatarFallback } from '../ui/avatar'

const AuthAvatar = () => {
  return (
    <Avatar className="size-9 border border-white/10 bg-blue-600 text-white">
      <AvatarFallback className="bg-blue-200">ST</AvatarFallback>
    </Avatar>
  )
}

export default AuthAvatar
