export interface C4EStudentIdea {
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
  /**	Student : Link - User	*/
  student?: string
  /**	Student Idea : Data	*/
  student_idea?: string
  /**	Problem : Small Text	*/
  onboarding_problem: string
  /**	Solution : Small Text	*/
  onboarding_solution: string
  /**	What stage are you at? : Select	*/
  stage:
    | 'Just an idea in my head'
    | "I know the problem well, haven't built anything"
    | 'I have a prototype — something people can see or try'
    | "I've tested it with real users and have feedback"
    | 'I already have customers or people using it'
  /**	AI Feedback : Markdown Editor	*/
  ai_feedback?: string
  /**	Approach : Data	*/
  approach?: string
  /**	Industry : Data	*/
  industry?: string
  /**	AI Stage Recommendation : Small Text	*/
  ai_stage_recommendation?: string
}
