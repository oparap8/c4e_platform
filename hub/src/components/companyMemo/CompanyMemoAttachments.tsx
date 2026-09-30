import { FileIcon, Download, Loader2 } from 'lucide-react'
import type { File } from '@/types/Core/File'

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle
} from '@/components/ui/attachment'
import { useFrappeGetDocList } from 'frappe-react-sdk'
import { Banner } from '../Banner'
import { getFrappeErrorMessage } from '@/lib/utils'

function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export default function CompanyMemoAttachments() {
  const {
    data: files,
    isLoading,
    error
  } = useFrappeGetDocList<File>('File', {
    fields: ['file_name', 'file_size', 'file_type', 'file_url', 'name'],
    filters: [
      ['is_private', '=', 0],
      ['is_folder', '=', 0]
    ]
  })

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 p-4 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading attachments...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Banner
        variant="error"
        title="Error loading files"
        description={getFrappeErrorMessage(error)}
      />
    )
  }

  if (!files || files.length === 0) {
    return <p className="text-muted-foreground p-2 text-sm">No files found</p>
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {files.map((file) => (
        <Attachment key={file.name} className="w-full">
          <AttachmentMedia>
            <FileIcon className="h-4 w-4" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{file.file_name}</AttachmentTitle>
            <AttachmentDescription>
              {`${file.file_type || 'File'} · ${formatBytes(file.file_size)}`}
            </AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction
              render={
                <a
                  href={file.file_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4"
                >
                  <Download className="size-4" />
                </a>
              }
              aria-label={`Download ${file.file_name}`}
            ></AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}
    </div>
  )
}
