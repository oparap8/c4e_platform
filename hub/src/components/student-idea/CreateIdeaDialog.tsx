import type React from 'react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import CreateIdeaForm from './IdeaForm'

export default function CreateIdeaDialog({ render }: { render: React.ReactElement }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={render} />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create your idea</DialogTitle>
          <DialogDescription>Fill out the details below to create a new idea.</DialogDescription>
        </DialogHeader>

        <CreateIdeaForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
