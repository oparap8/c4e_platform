import { Card } from '@/components/ui/card'
import { PlusCircle } from 'lucide-react'

export default function NewIdeaCard() {
  return (
    <Card
      asChild
      className="group border-primary/40 bg-primary/5 hover:border-primary hover:bg-primary/10 focus-visible:ring-ring min-h-50 border-2 border-dashed transition-all duration-300 ease-out hover:-translate-y-1 hover:border-solid hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <button
        onClick={() => console.log('Add New Idea clicked')}
        className="grid h-full w-full place-content-center text-center"
      >
        <div className="text-primary flex flex-col items-center text-lg font-bold">
          <PlusCircle className="mb-2 size-7 transition-transform duration-300 ease-out group-hover:scale-125" />
          <span>Add New Idea</span>
        </div>
      </button>
    </Card>
  )
}
