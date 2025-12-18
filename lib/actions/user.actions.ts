"use server"

import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/database"
import User from "@/lib/database/models/user.model"
import Order from "@/lib/database/models/order.model"
import Event from "@/lib/database/models/event.model"
import { handleError } from "@/lib/utils"

export type CreateUserParams = {
  email: string
  username: string
  firstName: string
  lastName: string
  photo: string
  password: string
}

export type UpdateUserParams = {
  firstName: string
  lastName: string
  username: string
  photo: string
}

// Extended User model for auth (includes password)
import { Schema, model, models } from "mongoose"

const UserAuthSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    photo: { type: String, required: true, default: "/diverse-user-avatars.png" },
    password: { type: String, required: true },
  },
  { timestamps: true },
)

const UserAuth = models.UserAuth || model("UserAuth", UserAuthSchema)

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase()

    // Check if user already exists
    const existingUser = await UserAuth.findOne({
      $or: [{ email: user.email }, { username: user.username }],
    })

    if (existingUser) {
      throw new Error("User with this email or username already exists")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(user.password, 12)

    const newUser = await UserAuth.create({
      ...user,
      password: hashedPassword,
    })

    // Also create in regular User model (without password) for relations
    await User.create({
      _id: newUser._id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      photo: user.photo,
    })

    return JSON.parse(JSON.stringify(newUser))
  } catch (error) {
    handleError(error)
  }
}

export async function authenticateUser(email: string, password: string) {
  try {
    await connectToDatabase()

    const user = await UserAuth.findOne({ email })
    if (!user) {
      return { error: "Invalid credentials" }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return { error: "Invalid credentials" }
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toObject()
    return { user: JSON.parse(JSON.stringify(userWithoutPassword)) }
  } catch (error) {
    handleError(error)
    return { error: "Authentication failed" }
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase()
    const user = await User.findById(userId)
    if (!user) throw new Error("User not found")
    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    handleError(error)
  }
}

export async function updateUser(userId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase()
    const updatedUser = await User.findByIdAndUpdate(userId, user, { new: true })
    if (!updatedUser) throw new Error("User update failed")
    revalidatePath("/profile")
    return JSON.parse(JSON.stringify(updatedUser))
  } catch (error) {
    handleError(error)
  }
}

export async function deleteUser(userId: string) {
  try {
    await connectToDatabase()

    const userToDelete = await User.findById(userId)
    if (!userToDelete) throw new Error("User not found")

    // Unlink relationships
    await Promise.all([
      Event.updateMany({ organizer: userId }, { $unset: { organizer: 1 } }),
      Order.updateMany({ buyer: userId }, { $unset: { buyer: 1 } }),
    ])

    const deletedUser = await User.findByIdAndDelete(userId)
    revalidatePath("/")
    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
  } catch (error) {
    handleError(error)
  }
}
