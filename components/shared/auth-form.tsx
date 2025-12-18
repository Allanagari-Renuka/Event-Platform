"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUp, signIn } from "@/lib/actions/auth.actions"

type AuthFormProps = {
  type: "sign-in" | "sign-up"
}

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isSignUp = type === "sign-up"

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      if (isSignUp) {
        const result = await signUp({
          firstName: data.firstName as string,
          lastName: data.lastName as string,
          username: data.username as string,
          email: data.email as string,
          password: data.password as string,
        })

        if (result.error) {
          setError(result.error)
        } else {
          router.push("/")
          router.refresh()
        }
      } else {
        const result = await signIn({
          email: data.email as string,
          password: data.password as string,
        })

        if (result.error) {
          setError(result.error)
        } else {
          router.push("/")
          router.refresh()
        }
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-xl p-8 border border-border">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp ? "Join our community of event enthusiasts" : "Sign in to access your events"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" placeholder="John" required className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" placeholder="Doe" required className="bg-background" />
              </div>
            </div>
          )}

          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" placeholder="johndoe" required className="bg-background" />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              required
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              minLength={6}
              className="bg-background"
            />
          </div>

          {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">{error}</div>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </>
          ) : (
            <>
              {"Don't have an account?"}{" "}
              <Link href="/sign-up" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
