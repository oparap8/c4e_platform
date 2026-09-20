import { useFrappeAuth, useFrappeGetDoc, type FrappeError } from 'frappe-react-sdk'

export interface UserDoc {
  name: string
  email: string
  first_name: string
  last_name: string
}

export default function useUser() {
  const { currentUser, isLoading: authLoading, error: authError } = useFrappeAuth()

  const {
    data: userData,
    isLoading: docLoading,
    error: docError,
    mutate
  } = useFrappeGetDoc<UserDoc>('User', currentUser || undefined)

  const loading = authLoading || (!!currentUser && docLoading)
  const error = (authError || docError || null) as FrappeError | null

  return {
    user: userData,
    currentUser,
    loading,
    error,
    mutate
  }
}
