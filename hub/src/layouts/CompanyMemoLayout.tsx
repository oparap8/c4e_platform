import { CompanyMemoComment, CompanyMemoNav } from '@/components/companyMemo'
import CompanyMemoNavDrawer from '@/components/companyMemo/CompanyMemoNavDrawer'
import CompanyMemoResources from '@/components/companyMemo/CompanyMemoResources'
import { PageContainer, PageHeader } from '@/components/Page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { Outlet } from 'react-router-dom'

export default function CompanyMemoLayout() {
  return (
    <PageContainer className="relative">
      <PageHeader
        title="Company Memo"
        subtitle="Develop and refine your venture idea with AI guidance and staff feedback."
        action={
          <>
            <Badge variant="outline">In Review</Badge>
            <Button variant={'secondary'}>
              <Download className="mr-2 h-4 w-4" />
              Download Draft
            </Button>
          </>
        }
      />

      <div className="flex items-start gap-8">
        <CompanyMemoNav />

        <main className="min-w-0 flex-1 pb-20 md:pb-0">
          <Outlet />
          <CompanyMemoComment />
          <CompanyMemoResources />
        </main>
      </div>

      <div className="fixed right-6 bottom-6 z-50 block md:hidden">
        <CompanyMemoNavDrawer />
      </div>
    </PageContainer>
  )
}
