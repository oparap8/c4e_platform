import { CompanyMemoNav } from '@/components/companyMemo'
import { PageContainer, PageHeader } from '@/components/Page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { Outlet } from 'react-router-dom'

export default function CompanyMemoLayout() {
  return (
    <PageContainer>
      <PageHeader
        title="Company Memo"
        subtitle="Develop and refine your venture idea with AI guidance and staff feedback."
        action={
          <>
            <Badge variant={'outline'}>In Review</Badge>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download Draft
            </Button>
          </>
        }
      />

      <CompanyMemoNav />

      <Outlet />
    </PageContainer>
  )
}
