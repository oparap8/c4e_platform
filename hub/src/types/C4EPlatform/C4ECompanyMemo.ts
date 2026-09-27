export interface C4ECompanyMemo {
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
  /**	Amended From : Link - C4E Company Memo	*/
  amended_from?: string
  /**	Idea : Link - C4E Student Idea	*/
  idea: string
  /**	Purpose : Small Text - Write one sentence: We help [who] do [what]. That's it.	*/
  purpose?: string
  /**	Who you help is named (a specific type of person or business, not 'everyone') : Check	*/
  has_who_is_helped?: 0 | 1
  /**	What you help them do is described in plain terms : Check	*/
  is_described_in_plain_terms?: 0 | 1
  /**	It fits in one sentence : Check	*/
  is_one_sentence?: 0 | 1
  /**	Problem : Small Text - Describe the problem your customers face. Be specific — what happens, how often, and what it costs them.
   */
  problem?: string
  /**	The problem is described concretely — what actually happens : Check	*/
  is_problem_described_concretely?: 0 | 1
  /**	You mention who experiences this problem : Check	*/
  is_who_in_problem?: 0 | 1
  /**	You give a sense of how significant the problem is (frequency, cost, frustration) : Check	*/
  is_problem_significant?: 0 | 1
  /**	Solution : Small Text - Describe what you've built or are building. Focus on what it does, not what technology it uses.	*/
  solution?: string
  /**	What the product or service does is described in plain terms : Check	*/
  is_solution_described_clearly?: 0 | 1
  /**	It's clear how the solution connects to the problem you described : Check	*/
  is_solution_aligned_with_problem?: 0 | 1
  /**	You haven't only described the technology — you've described what it does for the user : Check	*/
  is_user_value_clear?: 0 | 1
  /**	Why Now : Small Text - Why is this the right time to build this? Something has recently changed — in technology, behaviour, regulation, or the market — that makes this possible or urgent.	*/
  why_now?: string
  /**	You've named something that has recently changed : Check	*/
  something_changed?: 0 | 1
  /**	You've explained why that change makes your solution possible or more urgent now : Check	*/
  solution_possible?: 0 | 1
  /**	Market Potential : Small Text - How many people or businesses have this problem? Give your best estimate and say where it comes from.	*/
  market_potential?: string
  /**	You've given a number or an estimate (not just 'a large market') : Check	*/
  estimated_number?: 0 | 1
  /**	You've described who is in the market — not just how big it is : Check	*/
  market_person?: 0 | 1
  /**	You've mentioned where your number comes from, even if it's an estimate : Check	*/
  number_source?: 0 | 1
  /**	Competition : Small Text - Who else is solving this problem, and why would customers choose you instead?	*/
  competition?: string
  /**	You've named at least one alternative (including doing nothing or using a manual method) : Check	*/
  alternative_named?: 0 | 1
  /**	You've explained one specific reason customers would choose you over it : Check	*/
  specific_reason?: 0 | 1
  /**	Business Model : Small Text - How does this make money? Be direct.	*/
  business_model?: string
  /**	You've named who pays : Check	*/
  payer_named?: 0 | 1
  /**	You've described what they pay for : Check	*/
  pay_description?: 0 | 1
  /**	You've given a rough amount or pricing structure : Check	*/
  amount_provided?: 0 | 1
  /**	Team : Small Text - Who is working on this and what does each person bring?	*/
  team?: string
  /**	You've named everyone actively working on this : Check	*/
  team_named?: 0 | 1
  /**	You've described what each person contributes : Check	*/
  team_description?: 0 | 1
  /**	There's at least one sentence on why you are suited to solve this particular problem : Check	*/
  suitable_solver?: 0 | 1
  /**	Traction : Small Text - What have you done so far? Users, pilots, interviews, revenue, prototypes — anything counts.	*/
  traction?: string
  /**	You've described at least one concrete thing you've done : Check	*/
  concrete_thing?: 0 | 1
  /**	If you have users or revenue, you've given a number : Check	*/
  number_provided?: 0 | 1
  /**	What Do You Need from C4E : Small Text - What specifically are you asking for? Mentorship, network connections, workshop access, program application — be direct.	*/
  what_you_need?: string
  /**	You've stated at least one specific thing you're asking for : Check	*/
  need_stated?: 0 | 1
  /**	It's clear what you want next : Check	*/
  need_next?: 0 | 1
  /**	Vision : Small Text - Where is this in 3 to 5 years if it works?	*/
  vision?: string
  /**	You've described a future state that's bigger than where you are now : Check	*/
  future_described?: 0 | 1
  /**	It connects logically to what you're building today : Check	*/
  logical_connection?: 0 | 1
}
