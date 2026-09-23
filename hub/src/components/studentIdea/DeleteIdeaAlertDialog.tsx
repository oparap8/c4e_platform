import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '../ui/button'
import { useFrappeDeleteDoc } from 'frappe-react-sdk'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { getFrappeErrorMessage } from '@/lib/utils'

export default function DeleteIdeaAlertDialog({ id }: { id: string }) {
  const { deleteDoc, loading } = useFrappeDeleteDoc()
  const navigate = useNavigate()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await deleteDoc('C4E Student Idea', id)
      navigate('/idea', { replace: true })
    } catch (error) {
      toast.error(getFrappeErrorMessage(error))
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" />}>Delete Idea</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Idea</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this idea.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Continue'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
