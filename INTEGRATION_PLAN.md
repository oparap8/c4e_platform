# C4E Platform — Frontend Integration Plan

This document describes every change required to connect the Vue SPA design
(`/home/janviere-munezero/Vue/C4E_Plattform/c4e_platform/`) to the Frappe backend
(`/apps/c4e_platform/`). Nothing gets executed until you have reviewed and approved this plan.

---

## Guiding rule

> The Frappe app and its doctypes dictate the data model and workflow.
> The Vue design is kept for its UI/UX; its internal data structures are updated
> to mirror what Frappe already has. No core API function logic is changed.

---

## What is NOT touched

- `api/company_memo.py` — `check_memo()` logic, prompts, and response format are unchanged
- `api/data_room.py` — `data_room_feedback()` unchanged
- `api/ai_config.py` — unchanged
- All doctype `.json` field definitions — user controls these
- The AI prompts and response-parsing logic in all existing API files

---

## Part 1 — Backend fixes (broken by the doctype deletions)

The C4E Student, C4E Mentor, and C4E Manager *doctypes* were deleted, but several
Python files still reference them. These will throw errors until fixed.

### 1.1 `hooks.py`

**Remove** the three dead entries that point to deleted doctypes:

```python
# DELETE these lines:
permission_query_conditions = {
    "C4E Student": "c4e_platform.permissions.get_permission_query_conditions_for_c4e_student",
    "C4E Mentor":  "c4e_platform.permissions.get_permission_query_conditions_for_c4e_mentor",
}

has_permission = {
    "C4E Student": "c4e_platform.c4e_platform.doctype.c4e_student.c4e_student.student_has_permission",
}
```

**Add** a new permission filter so a C4E Student user only sees their own ideas:

```python
permission_query_conditions = {
    "C4E Student Idea": "c4e_platform.permissions.get_permission_query_conditions_for_student_idea",
}
```

---

### 1.2 `permissions.py`

**Replace** the broken function (queries `tabC4E Student`, which is deleted):

```python
# REMOVE the old get_permission_query_conditions_for_c4e_student()

# ADD:
def get_permission_query_conditions_for_student_idea(user):
    if not user:
        user = frappe.session.user
    if user == "Administrator" or "C4E Manager" in frappe.get_roles(user):
        return None
    return f"(`tabC4E Student Idea`.student = '{user}')"
```

---

### 1.3 `c4e_student_idea.py` (doctype controller)

Three methods are broken by the field and doctype changes.

**`set_student()`** — currently looks up a deleted C4E Student doctype:
```python
# Replace body with:
def set_student(self):
    if not self.student:
        self.student = frappe.session.user
```

**`ensure_idea_limit()`** — counts ideas via C4E Student doc (deleted):
```python
# Replace body with:
def ensure_idea_limit(self):
    if not self.is_new():
        return
    count = frappe.db.count("C4E Student Idea", {"student": frappe.session.user})
    if count >= 3:
        frappe.throw("You can only submit a maximum of 3 ideas.")
```

**`validate_char_count()`** — references deleted fields (`onboarding_idea`,
`onboarding_target_customer`, `onboarding_differentiation`):
```python
# Replace body with:
def validate_char_count(self):
    if len(self.onboarding_problem or "") < 10:
        frappe.throw("The problem must be at least 10 characters long.")
    if len(self.onboarding_solution or "") < 10:
        frappe.throw("The solution must be at least 10 characters long.")
```

**Add `after_insert()`** — automatically create an empty linked Company Memo
(decided: memo is created when the idea is created):
```python
def after_insert(self):
    memo = frappe.get_doc({
        "doctype": "C4E Company Memo",
        "idea": self.name
    })
    memo.insert(ignore_permissions=True)
```

---

### 1.4 `api/student_idea.py`

Both functions use a deleted C4E Student lookup and return deleted fields.

**`get_student_idea_count_per_user()`**:
```python
@frappe.whitelist()
def get_student_idea_count_per_user():
    count = frappe.db.count("C4E Student Idea", {"student": frappe.session.user})
    return {"count": count, "max_ideas": 3}
```

**`get_student_ideas_for_current_user()`** — returns the new field names:
```python
@frappe.whitelist()
def get_student_ideas_for_current_user():
    ideas = frappe.get_list(
        "C4E Student Idea",
        filters={"student": frappe.session.user},
        fields=["name", "student_idea", "onboarding_problem",
                "onboarding_solution", "stage", "modified"],
        order_by="creation desc",
        limit=3,
    )
    for idea in ideas:
        idea["modified_pretty"] = frappe.utils.pretty_date(idea["modified"])
    return ideas
```

---

### 1.5 `api/ai_feedback.py`

**`get_idea_feedback()`** takes four old params; the doctype now has three fields.
Update the signature and user prompt only — the AI logic, model, and response
structure are untouched:

```python
# Old: get_idea_feedback(onboarding_idea, onboarding_problem, onboarding_target_customer, onboarding_differentiation)
# New:
@frappe.whitelist()
def get_idea_feedback(student_idea, onboarding_problem, onboarding_solution):
    # ... same system_prompt ...
    user_prompt = f"""Here is a student's business idea submission:

    Idea Title: {student_idea}
    Problem: {onboarding_problem}
    Solution: {onboarding_solution}"""
    # ... rest of function unchanged ...
```

---

### 1.6 New file: `api/auth.py`

Handles self-registration from the Vue signup form. All frontend signups create
a C4E Student user. Mentors and Managers have desk access only and are created
by admin — no role selection is needed or exposed.

```python
@frappe.whitelist(allow_guest=True)
def register(first_name, email, password):
    if frappe.db.exists("User", email):
        frappe.throw("An account with this email already exists.")

    user = frappe.get_doc({
        "doctype": "User",
        "email": email,
        "first_name": first_name,
        "send_welcome_email": 0,
        "new_password": password,
        "roles": [{"role": "C4E Student"}]
    })
    user.insert(ignore_permissions=True)
    frappe.db.commit()
    return {"success": True, "message": "Account created. Please log in."}
```

---

## Part 2 — Frontend integration

The Vue design source (`/home/janviere-munezero/Vue/C4E_Plattform/c4e_platform/`)
is copied into `/apps/c4e_platform/dashboard/src/` (replacing the doppio SPA).
Then each file below is updated.

### 2.1 Build configuration

**`vite.config.js`** in the new app — match the existing doppio build config:
```js
build: {
    outDir: '../c4e_platform/public/dashboard',
    emptyOutDir: true,
    target: 'es2015',
    rollupOptions: {
        output: { entryFileNames: 'assets/index.js' }  // fixed name, no hash
    }
}
```

Using a fixed entry filename means `dashboard.html` never needs updating after a
rebuild. The existing `dashboard.html` already has `window.csrf_token` injected —
we keep it and update the `<script src>` to point to `assets/index.js`.

---

### 2.2 New utility: `src/utils/frappe.js`

A thin fetch wrapper used by all views/store instead of direct `fetch` calls or
the Anthropic client. All calls go through this.

```js
// Reads CSRF token injected by dashboard.html
function csrfToken() { return window.csrf_token || '' }

// POST to a @frappe.whitelist() method
export async function frappeCall(method, args = {}) { ... }

// Frappe resource REST API helpers
export async function frappeInsert(doc) { ... }
export async function frappeGet(doctype, name) { ... }
export async function frappeSetValue(doctype, name, field, value) { ... }
export async function frappeGetList(doctype, { filters, fields, limit } = {}) { ... }

// Auth
export async function frappeLogin(email, password) { ... }
export async function frappeLogout() { ... }
export async function frappeGetCurrentUser() { ... }  // GET /api/method/frappe.auth.get_logged_user
```

---

### 2.3 `src/store/appStore.js` — rewrite

Replace all localStorage logic with Frappe API calls.

| Old action | New implementation |
|---|---|
| `signup(...)` | `frappeCall('c4e_platform.api.auth.register', {first_name, email, password})` |
| `login(...)` | `frappeLogin(email, password)` (session cookie) |
| `logout()` | `frappeLogout()` |
| `restoreSession()` | `frappeGetCurrentUser()` to check active session |
| `addIdea(...)` | `frappeInsert({doctype:'C4E Student Idea', ...})` |
| `loadIdeas()` | `frappeCall('c4e_platform.api.student_idea.get_student_ideas_for_current_user')` |
| `updateMemo(...)` | `frappeSetValue('C4E Company Memo', ...)` — handled in MemoView directly |
| `updateDataRoom(...)` | `frappeSetValue('C4E Data Room', ...)` — handled in DataRoomView directly |

State held in the store:
- `user` — `{ name, email, full_name, roles[] }` from Frappe session
- `ideas` — array from `get_student_ideas_for_current_user`

No more `c4e_session`, `c4e_ideas_*`, or `c4e_users` localStorage keys.

---

### 2.4 `src/router/index.js`

Route changes:
- Remove doppio imports
- Auth guard checks `store.user` (set by `restoreSession()`)
- `/idea/:id/dataroom` route **removed** (Data Room is standalone)
- Add new standalone route: `/dataroom` (for C4E Builder users)

```js
// Routes after change:
/              → SignUp.vue  (guest only)
/dashboard     → Dashboard.vue  (requiresAuth)
/idea/:id      → IdeaHub → IdeaOverview.vue  (requiresAuth)
/idea/:id/memo → IdeaHub → MemoView.vue  (requiresAuth)
/dataroom      → DataRoomView.vue  (requiresAuth + C4E Builder role)
```

---

### 2.5 `src/views/SignUp.vue`

- Login: call `store.login(email, password)` → Frappe session
- Signup: call `store.register(first_name, email, password)` — no role field
- Rename field "Username" → "First Name" (Frappe User needs `first_name`)
- **Remove the role dropdown entirely** — all frontend signups are C4E Students
- Handle Frappe error messages (duplicate email, wrong password, etc.)

---

### 2.6 `src/views/Dashboard.vue` + `IdeaCard.vue`

- Load ideas from `store.loadIdeas()` on mount (replaces localStorage restore)
- Max ideas shown: change `5` → `3`
- `IdeaCard` uses `idea.name` (e.g., `CSI-05-26-001`) as the route param,
  displays `idea.student_idea` as the card title

---

### 2.7 `src/components/dashboard/IdeaWizardModal.vue`

| Wizard step | Change |
|---|---|
| Step 1 — Idea Name | Field value saved to `student_idea` (was `title`) |
| Step 2 — Problem + Solution | Fields map to `onboarding_problem`, `onboarding_solution` |
| Step 3 — Stage | Labels aligned to Frappe's Select options (see below) |
| Step 4 — AI Feedback | Replace direct Anthropic call → `frappeCall('c4e_platform.api.ai_feedback.get_idea_feedback', {student_idea, onboarding_problem, onboarding_solution})` |
| On save | `frappeInsert({doctype:'C4E Student Idea', student_idea, onboarding_problem, onboarding_solution, stage})` → navigate to `/idea/{name}/memo` |

**Step 4 AI results are saved back to the idea record** (not display-only).
After `get_idea_feedback` returns, call `frappeSetValue` (or a single doc update) to
persist the four AI fields on the `C4E Student Idea`:

| API response key | Frappe fieldname |
|---|---|
| `overview` | `ai_feedback` |
| `industry_tag` | `industry` |
| `approach` | `approach` |
| `ai_stage_recommendation` | `ai_stage_recommendation` |

`ai_feedback_html` is a display-only HTML field on the desk; the SPA renders
`ai_feedback` markdown directly — no need to write to `ai_feedback_html`.

Frappe stage options (must match exactly):
```
"Just an idea in my head"
"I know the problem well, haven't built anything"
"I have a prototype — something people can see or try"
"I've tested it with real users and have feedback"
"I already have customers or people using it"
```
Map the Vue's 5 emoji-labeled options to these strings.

---

### 2.8 `src/views/IdeaHub.vue`

- `route.params.id` is now a Frappe doc name (e.g., `CSI-05-26-001`), not a numeric ID
- Fetch idea: `frappeGet('C4E Student Idea', route.params.id)`
- Provide the idea object to child views via `provide/inject`

---

### 2.9 `src/views/IdeaOverview.vue`

- Display `idea.student_idea` as title, `idea.onboarding_problem`,
  `idea.onboarding_solution`, `idea.stage`
- Memo progress: fetch the linked `C4E Company Memo` and count filled fields
  out of the 11 sections
- Remove Data Room progress card (Data Room is no longer linked to an idea)

---

### 2.10 `src/views/MemoView.vue`

**Sections — from 13 to 11** (remove `tagline` and `contact`, remove Venture Story panel).

Three values matter for every section:
1. **Vue internal key** — the key used in local component state
2. **Frappe fieldname** — passed to `set_value` when saving
3. **API key** — passed as the `key` argument to `check_memo`; must match the
   template dict in `company_memo.py` exactly

For memo, Frappe fieldname == API key, so one rename handles both.

| Vue key (current) | Frappe fieldname = API key | Required |
|---|---|---|
| `purpose` | `purpose` | yes |
| `problem` | `problem` | yes |
| `solution` | `solution` | yes |
| `why_now` | `why_now` | optional |
| `market` ← **rename** | `market_potential` | yes |
| `competition` | `competition` | yes |
| `biz_model` ← **rename** | `business_model` | yes |
| `team` | `team` | yes |
| `traction` | `traction` | optional |
| `c4e_ask` ← **rename** | `what_you_need` | yes |
| `vision` | `vision` | optional |
| ~~`tagline`~~ | removed | — |
| ~~`contact`~~ | removed | — |

In the Vue component, the internal state key, the `set_value` fieldname, and the
`check_memo` key argument are **all the same string** (the Frappe fieldname).
No translation layer needed once the rename is done.

**Data flow:**
1. On load: `frappeGetList('C4E Company Memo', {filters: {idea: ideaName}, fields: ['name', ...all 11 fields]})`
   → always returns one record (created automatically when idea was saved)
2. Section save: `frappeSetValue('C4E Company Memo', memoName, sectionKey, text)`
   where `sectionKey` is the Frappe fieldname from the table above
3. AI feedback: `frappeCall('c4e_platform.api.company_memo.check_memo', {key: sectionKey, field: text})`
   same `sectionKey` — no separate mapping needed

**AI feedback display — replace `{ack, adv, flag}` boxes with checklist cards:**

`check_memo` returns `{ section_key: { criterion: { pass: bool, reason: string } } }`.
Display each criterion as a row:
- Green checkmark + criterion label when `pass: true`
- Red cross + criterion label + reason text when `pass: false`

The existing card/box styling in MemoView is reused; only the content structure changes.

Checklist criteria returned per section key:

| API key | Criteria returned by check_memo |
|---|---|
| `purpose` | person_named, outcome_clear, one_sentence |
| `problem` | problem_described_concretely, who_affected, significance_shown |
| `solution` | what_it_does_clear, links_to_problem, user_benefit_not_just_tech |
| `why_now` | named_recent_change, change_makes_solution_needed |
| `market_potential` | market_number_estimate_provided, target_market_mentioned, data_source_mentioned |
| `competition` | competitor_named, competitive_advantage_explained |
| `business_model` | who_pays, what_they_pay_for, amount_or_pricing_structure |
| `team` | everyone_working_named, role_description_for_each, team_skills_match_problem |
| `traction` | one_concrete_thing_done, if_user_revenue_stated |
| `what_you_need` | stated_what_needed, what_want_next_clear |
| `vision` | future_bigger_than_now_described, connection_to_current_solution |

---

### 2.11 `src/views/DataRoomView.vue`

**Route:** Moves to standalone `/dataroom` (no longer `/idea/:id/dataroom`).

**On load:**
1. Check if user has `C4E Builder` role (from `store.user.roles`)
2. `frappeGetList('C4E Data Room', {filters: {owner: currentUser}})` to find existing record
3. If none found: show a creation form with `venture_name`, `industry`, and a
   program field pre-filled with the most recently created C4E Program
   (`frappeGetList('C4E Program', {order_by: 'creation desc', limit: 1})`).
   The builder can still change it if needed.
4. Once a record exists, fetch the full doc and populate all fields

**Removed sections entirely:** `exec` (one-page summary), `team_bios`,
`impact.social_impact`, `impact.sdg`

---

**Three values matter for every text field:**
1. **Vue internal key** — key used in component state (`fd` object)
2. **Frappe fieldname** — passed to `set_value` when saving
3. **API key** — passed as `key` to `data_room_feedback`; must match the
   C4E Data Room Hint fieldname so `hints.get(key)` returns the guidance text

In `data_room.py`, `key` is used twice: `hints.get(key)` for the hint lookup, and
as a label in the user prompt. These must match the Hint doctype fieldnames.
Most fields have the same value for all three. Exceptions are marked ⚠️.

---

*Market Research*

| Vue key | Frappe fieldname (`set_value`) | API key (`data_room_feedback`) |
|---|---|---|
| `problem_statement` | `problem` | `problem` |
| `market_size` | `market_size` | `market_size` |
| `competition` | `competition_and_edge` | `competition_and_edge` |
| `discovery` | `discovery` | `discovery` |

*Product*

| Vue key | Frappe fieldname | API key |
|---|---|---|
| `stage` | `stage` | `stage` |
| `features` | `features` | `features` |
| `testing` | `testing` | `testing` |

*Sales & Marketing*

| Vue key | Frappe fieldname | API key |
|---|---|---|
| `uvp` | `uvp` | `uvp` |
| `gtm` | `gtm_strategy` | `gtm_strategy` |
| `traction` | `traction` | `traction` |
| `marketing_assets` | `marketing_assets` | `marketing_assets` |

*Finance*

| Vue key | Frappe fieldname | API key |
|---|---|---|
| `historical` | `financial_history` | `financial_history` |
| `projections` | `projections` | `projections` |
| `unit_econ` | `unit_economics` | `unit_economics` |
| `ask` | `ask` | `ask` |

*Legal*

| Vue key | Frappe fieldname | API key | Attach fieldname |
|---|---|---|---|
| `registration` | `business_registration` | `business_registration` | `registration_certificate` |
| `contracts` | `contracts` | `contracts` | `agreement_contracts` |
| `ip` | `ip` | `ip` | `ip_filing` |
| `regulatory` | `compliance` | `compliance` | — |
| `cap_table` | `cap_table` | `cap_table` | `cap_table_atttach` |

*Impact & Partnerships*

| Vue key | Frappe fieldname | API key | Attach fieldname |
|---|---|---|---|
| `partnerships` | `partnerships` | `partnerships` | `signed_agreements` |
| `impact_metrics` | `impact_metrics` | `impact_metrics` | — |
| ADD `testimonials` | `testimonials` | `testimonials` | — |

*Pitch*

| Vue key | Frappe fieldname | API key | Notes |
|---|---|---|---|
| `narrative` | `company_hook` | `narrative` ⚠️ | Hint field is `narrative`; Data Room field is `company_hook`. Save to `company_hook`, pass `key="narrative"` to the API |
| `deck` | `pitch_deck_link` | — | URL/text input only, no AI feedback |
| — | `slides` | — | Attach field for deck file, file upload only |

⚠️ **`company_hook` / `narrative` is the one field where Frappe fieldname ≠ API key.**
The Vue component must hold two separate values for this field:
- `frappefield = 'company_hook'` (used in `set_value`)
- `apiKey = 'narrative'` (used in `data_room_feedback`)

All other fields: `apiKey === frappefield`, so a single value drives both calls.

---

**Save per text field:**
`frappeSetValue('C4E Data Room', recordName, frappefield, value)`

**AI feedback per text field:**
`frappeCall('c4e_platform.api.data_room.data_room_feedback', {venture_name, industry, key: apiKey, field: text})`

The response `{ack, adv, flag}` format is unchanged — existing feedback display UI stays as-is.

**File attachments:** Frappe's `/api/method/upload_file` endpoint with
`doctype`, `docname`, and `fieldname` params. After upload, the returned
file URL is stored in the relevant attach fieldname (see table above).

---

### 2.12 `src/layouts/DashboardLayout.vue`

- User name + role from `store.user` (Frappe session data)
- "Data Room" nav item: show **only if** `store.user.roles.includes('C4E Builder')`
- Data Room nav link → `/dataroom`
- Company Memo nav link → `/idea/{firstIdeaId}/memo` (or disabled if no ideas yet)
- Remove hardcoded sample notifications (leave panel, empty for now)

---

## Part 3 — Build and deployment

After the Vue source is in place and updated:

```bash
# 1. Install dependencies (run once)
cd /apps/c4e_platform/dashboard
npm install

# 2. Build (run after every frontend change)
npm run build
# → output goes to c4e_platform/public/dashboard/

# 3. Tell Frappe to pick up new static assets
cd /home/janviere-munezero/frappe-bench
bench --site [site-name] build --app c4e_platform
# OR just clear the asset cache:
bench --site [site-name] clear-cache
```

`dashboard.html` is updated once to reference `assets/index.js`
(fixed name, no hash) so it never needs touching again after rebuilds.

---

## Summary of files changed

### Frappe (Python)
| File | Change type |
|---|---|
| `hooks.py` | Remove 3 dead permission entries, add 1 new one |
| `permissions.py` | Replace broken function with corrected one |
| `c4e_platform/doctype/c4e_student_idea/c4e_student_idea.py` | Fix 3 methods, add `after_insert` |
| `api/student_idea.py` | Rewrite 2 functions |
| `api/ai_feedback.py` | Update `get_idea_feedback` signature + user prompt |
| `api/auth.py` | **New file** — registration endpoint |

### Frontend (Vue)
| File | Change type |
|---|---|
| `vite.config.js` | Update build output path + fixed entry filename |
| `www/dashboard.html` | Update script src to `assets/index.js` |
| `src/utils/frappe.js` | **New file** — Frappe API utility |
| `src/store/appStore.js` | Full rewrite (localStorage → Frappe API) |
| `src/router/index.js` | Remove doppio, update routes, add `/dataroom` |
| `src/views/SignUp.vue` | Wire to Frappe auth, remove role dropdown (all signups = C4E Student) |
| `src/views/Dashboard.vue` | Load from Frappe, max 3 ideas |
| `src/components/dashboard/IdeaWizardModal.vue` | Remap fields, route to Frappe AI |
| `src/views/IdeaHub.vue` | Fetch from Frappe by doc name |
| `src/views/IdeaOverview.vue` | Remove Data Room progress, show Frappe fields |
| `src/views/MemoView.vue` | Remove 2 sections, remap 3 keys, replace AI display |
| `src/views/DataRoomView.vue` | Standalone route, remap all fields, creation flow |
| `src/layouts/DashboardLayout.vue` | Role-gated Data Room nav, Frappe session user |

---

## Resolved decisions

| Item | Decision |
|---|---|
| Wizard step 4 AI results | Saved back to idea record (`ai_feedback`, `industry`, `approach`, `ai_stage_recommendation`) |
| C4E Builder data room — multiple records | Open most recent; pre-fill program dropdown with latest C4E Program |
| `c4e_student_idea_list.js` desk view | Out of scope — leave unchanged |
| Signup roles | C4E Student only; no role dropdown |
| Memo sections | 11 sections; `tagline` and `contact` removed; Venture Story panel removed |
| Memo AI display | Checklist format (`pass`/`reason` per criterion) |
| Memo auto-create | Empty `C4E Company Memo` created automatically in `after_insert` on Student Idea |
| Data Room route | Standalone `/dataroom`; not nested under idea |
| `company_hook` / `narrative` | Save to `company_hook`; pass `key="narrative"` to API |
