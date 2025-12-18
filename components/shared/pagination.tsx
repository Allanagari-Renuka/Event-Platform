"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { formUrlQuery } from "@/lib/utils"

type PaginationProps = {
  page: number | string
  totalPages: number
  urlParamName?: string
}

export function Pagination({ page, totalPages, urlParamName }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleClick = (btnType: string) => {
    const pageValue = btnType === "next" ? Number(page) + 1 : Number(page) - 1

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || "page",
      value: pageValue.toString(),
    })

    router.push(newUrl, { scroll: false })
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleClick("prev")}
        disabled={Number(page) <= 1}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <span className="px-4 py-2 text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>

      <Button
        size="sm"
        variant="outline"
        onClick={() => handleClick("next")}
        disabled={Number(page) >= totalPages}
        className="gap-1"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
