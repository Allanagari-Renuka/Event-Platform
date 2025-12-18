"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllCategories } from "@/lib/actions/category.actions"
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils"

type Category = {
  _id: string
  name: string
}

export function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories()
      categoryList && setCategories(categoryList)
    }

    getCategories()
  }, [])

  const onSelectCategory = (category: string) => {
    let newUrl = ""

    if (category && category !== "All") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "category",
        value: category,
      })
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["category"],
      })
    }

    router.push(newUrl, { scroll: false })
  }

  return (
    <Select onValueChange={(value: string) => onSelectCategory(value)}>
      <SelectTrigger className="w-full sm:w-[180px] bg-input border-border">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent className="bg-card border-border">
        <SelectItem value="All" className="cursor-pointer">
          All Categories
        </SelectItem>
        {categories.map((category) => (
          <SelectItem key={category._id} value={category.name} className="cursor-pointer">
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
