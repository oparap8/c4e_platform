import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Comment } from '@/types/Core/Comment'
import { useFrappeGetDocList } from 'frappe-react-sdk'
import { Loader2, MessageSquare, Pencil } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { Badge } from '../ui/badge'

export default function CompanyMemoComment() {
  const { id } = useParams<{ id: string }>()

  const { data: comments, isLoading } = useFrappeGetDocList<Comment>('Comment', {
    fields: ['name', 'comment_by', 'content', 'modified', 'creation'],
    filters: [
      ['reference_doctype', '=', 'C4E Company Memo'],
      ['reference_name', '=', id || '']
    ],
    orderBy: { field: 'creation', order: 'desc' }
  })

  return (
    <Card className="border-border/60 my-5 shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <MessageSquare className="text-primary size-4" />
          <span>Comments & Feedback</span>
          {comments && comments.length > 0 && (
            <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-normal">
              {comments.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="text-muted-foreground flex items-center justify-center py-6 text-xs">
            <Loader2 className="mr-1.5 size-4 animate-spin" /> Loading comments...
          </div>
        ) : !comments || comments.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-xs">
            No feedback or comments added yet.
          </p>
        ) : (
          comments.map((item) => {
            const isEdited = item.modified !== item.creation
            return (
              <div key={item.name} className="bg-muted/40 flex gap-3 rounded-lg p-3 text-sm">
                <Avatar className="size-7">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium uppercase">
                    {item.comment_by ? item.comment_by[0] : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground text-xs font-medium">
                      {item.comment_by || 'Anonymous'}
                    </span>
                    <div className="flex items-center gap-2">
                      {isEdited && (
                        <Badge variant={'secondary'} className="text-xs">
                          <Pencil /> Edited
                        </Badge>
                      )}
                      <span className="text-muted-foreground text-[10px]">
                        {new Date(item.creation).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <div
                    className="prose prose-sm text-muted-foreground max-w-none text-xs leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.content as string }}
                  />
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
