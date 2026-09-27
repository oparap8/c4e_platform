import { MEMO_SECTIONS, MEMO_STATUS_COLORS } from '@/constants'
import { NavLink } from 'react-router-dom'
import CompanyMemoNavPopover from './CompanyMemoNavDrawer'

export default function CompanyMemoNav() {
  const completedSections = MEMO_SECTIONS.filter((s) => s.status === 'complete').length
  const totalSections = MEMO_SECTIONS.length
  const progressPercentage = (completedSections / totalSections) * 100

  return (
    <>
      <div className="mt-2 mb-4 flex flex-col items-start justify-between gap-4 px-1 md:flex-row md:items-center">
        {/* Progress Bar */}
        <div className="flex w-full items-center gap-3 md:max-w-sm">
          <div className="bg-muted ring-border/50 h-2 flex-1 overflow-hidden rounded-full ring-1 ring-inset">
            <div
              className="bg-primary h-full transition-all duration-500 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-sm font-medium whitespace-nowrap">
            {completedSections} of {totalSections} sections complete
          </span>
        </div>

        {/* Status Legend */}
        <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs font-medium md:gap-4 md:text-sm">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-sm" />
            <span>Complete</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="bg-destructive h-2.5 w-2.5 rounded-full shadow-sm" />
            <span>Needs work</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 shadow-sm" />
            <span>Edited, not reviewed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="bg-border h-2.5 w-2.5 rounded-full shadow-sm" />
            <span>Not started</span>
          </div>
        </div>
      </div>

      <nav className="bg-muted mb-6 flex scrollbar-none flex-nowrap items-center gap-1 overflow-x-auto rounded-xl p-1.5 [&::-webkit-scrollbar]:hidden">
        {MEMO_SECTIONS.map((section) => {
          return (
            <NavLink
              key={section.name}
              to={section.name.toLowerCase().replace(/\s+/g, '-')}
              className={({ isActive }: { isActive: boolean }) =>
                `flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-background text-primary ring-border/50 shadow-sm ring-1'
                    : 'text-muted-foreground hover:text-foreground hover:bg-border/50'
                }`
              }
            >
              <span
                className={`h-2 w-2 rounded-full shadow-sm ${MEMO_STATUS_COLORS[section.status]}`}
              />
              {section.name}
            </NavLink>
          )
        })}
      </nav>
      <CompanyMemoNavPopover />
    </>
  )
}
