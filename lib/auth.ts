import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"
import { connectToDatabase } from "./database"
import User from "./database/models/user.model"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export type SessionUser = {
  _id: string
  email: string
  username: string
  firstName: string
  lastName: string
  photo: string
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({ userId: user._id })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET)

  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  return token
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = payload.userId as string

    await connectToDatabase()
    const user = await User.findById(userId)

    if (!user) return null

    return {
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      photo: user.photo,
    }
  } catch {
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
