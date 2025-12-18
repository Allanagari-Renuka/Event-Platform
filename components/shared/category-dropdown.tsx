"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { createCategory, getAllCategories } from "@/lib/actions/category.actions"

type Category = {
  _id: string
  name: string
}

type CategoryDropdownProps = {
  value?: string
  onChangeHandler?: (value: string) => void
}

export function CategoryDropdown({ value, onChangeHandler }: CategoryDropdownProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState("")

  const handleAddCategory = async () => {
    const category = await createCategory({
      categoryName: newCategory.trim(),
    })

    if (category) {
      setCategories((prev) => [...prev, category])
    }
  }

  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories()

      if (categoryList) {
        setCategories(categoryList)
      }
    }

    getCategories()
  }, [])

  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className="bg-input border-border">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent className="bg-card border-border">
        {categories.length > 0 &&
          categories.map((category) => (
            <SelectItem key={category._id} value={category._id} className="cursor-pointer">
              {category.name}
            </SelectItem>
          ))}

        <AlertDialog>
          <AlertDialogTrigger className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent focus:bg-accent text-primary">
            Add new category
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle>New Category</AlertDialogTitle>
              <AlertDialogDescription>
                <Input
                  type="text"
                  placeholder="Category name"
                  className="mt-3 bg-input border-border"
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleAddCategory}>Add</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SelectContent>
    </Select>
  )
}
