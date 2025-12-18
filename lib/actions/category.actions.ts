"use server"

import { connectToDatabase } from "@/lib/database"
import Category from "@/lib/database/models/category.model"
import { handleError } from "@/lib/utils"

export const createCategory = async ({ categoryName }: { categoryName: string }) => {
  try {
    await connectToDatabase()
    const newCategory = await Category.create({ name: categoryName })
    return JSON.parse(JSON.stringify(newCategory))
  } catch (error) {
    handleError(error)
  }
}

export const getAllCategories = async () => {
  try {
    await connectToDatabase()
    const categories = await Category.find()
    return JSON.parse(JSON.stringify(categories))
  } catch (error) {
    handleError(error)
  }
}
