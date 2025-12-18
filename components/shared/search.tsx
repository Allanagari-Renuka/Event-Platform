"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils"

type SearchProps = {
  placeholder?: string
}

export function Search({ placeholder = "Search events..." }: SearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState("")

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = ""

      if (query) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: query,
        })
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["query"],
        })
      }

      router.push(newUrl, { scroll: false })
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query, searchParams, router])

  return (
    <div className="relative flex-1 max-w-md">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 bg-input border-border"
      />
    </div>
  )
}
