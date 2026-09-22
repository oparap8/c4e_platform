export { cn } from 'cn'

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function getFrappeErrorMessage(error: unknown): string {
  if (!error) {
    return 'Something went wrong.'
  }

  if (typeof error === 'string') {
    return error
  }

  if (typeof error !== 'object') {
    return 'Something went wrong.'
  }

  const err = error as {
    _server_messages?: string
    message?: string
    exception?: string
    exc_type?: string
    exc?: string
  }

  if (err._server_messages) {
    try {
      const messages = JSON.parse(err._server_messages)

      if (Array.isArray(messages) && messages.length > 0) {
        const firstMessage = messages[0]

        if (typeof firstMessage === 'string') {
          try {
            const parsed = JSON.parse(firstMessage)

            if (parsed?.message) {
              return parsed.message
            }
          } catch {
            return firstMessage
          }
        }

        if (firstMessage?.message) {
          return firstMessage.message
        }
      }
    } catch {
      // Ignore malformed _server_messages and use fallback
    }
  }

  return err.message || err.exception || err.exc_type || 'Something went wrong.'
}
