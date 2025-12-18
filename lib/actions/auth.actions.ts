"use server"

import { redirect } from "next/navigation"
import { createSession, deleteSession } from "@/lib/auth"
import { createUser, authenticateUser } from "@/lib/actions/user.actions"

export type SignUpFormData = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
}

export type SignInFormData = {
  email: string
  password: string
}

export async function signUp(data: SignUpFormData) {
  try {
    const user = await createUser({
      ...data,
      photo: "/diverse-user-avatars.png",
    })

    if (user) {
      await createSession({
        _id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        photo: user.photo,
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Sign up error:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to create account",
    }
  }
}

export async function signIn(data: SignInFormData) {
  try {
    const result = await authenticateUser(data.email, data.password)

    if (result.error) {
      return { error: result.error }
    }

    if (result.user) {
      await createSession({
        _id: result.user._id,
        email: result.user.email,
        username: result.user.username,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        photo: result.user.photo,
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Sign in error:", error)
    return { error: "Authentication failed" }
  }
}

export async function signOut() {
  await deleteSession()
  redirect("/")
}
