export interface Comment {
  name: string
  creation: string
  modified: string
  owner: string
  modified_by: string
  docstatus: 0 | 1 | 2
  parent?: string
  parentfield?: string
  parenttype?: string
  idx?: number
  /**	Comment Type : Select	*/
  comment_type:
    | 'Comment'
    | 'Like'
    | 'Info'
    | 'Label'
    | 'Workflow'
    | 'Created'
    | 'Submitted'
    | 'Cancelled'
    | 'Updated'
    | 'Deleted'
    | 'Assigned'
    | 'Assignment Completed'
    | 'Attachment'
    | 'Attachment Removed'
    | 'Shared'
    | 'Unshared'
    | 'Bot'
    | 'Relinked'
    | 'Edit'
  /**	Comment Email : Data	*/
  comment_email?: string
  /**	Subject : Text	*/
  subject?: string
  /**	Comment By : Data	*/
  comment_by?: string
  /**	Published : Check	*/
  published?: 0 | 1
  /**	Seen : Check	*/
  seen?: 0 | 1
  /**	Reference Document Type : Link - DocType	*/
  reference_doctype?: string
  /**	Reference Name : Dynamic Link	*/
  reference_name?: string
  /**	Reference Owner : Data	*/
  reference_owner?: string
  /**	Content : HTML Editor	*/
  content?: string
  /**	IP Address : Data	*/
  ip_address?: string
}
