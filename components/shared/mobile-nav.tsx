"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import type { SessionUser } from "@/lib/auth"

type MobileNavProps = {
  session: SessionUser | null
}

export function MobileNav({ session }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] bg-background border-border">
        <div className="flex flex-col gap-6 mt-8">
          <Link
            href="/#events"
            onClick={() => setOpen(false)}
            className="text-lg font-medium text-foreground hover:text-primary transition-colors"
          >
            Events
          </Link>
          {session && (
            <>
              <Link
                href="/events/create"
                onClick={() => setOpen(false)}
                className="text-lg font-medium text-foreground hover:text-primary transition-colors"
              >
                Create Event
              </Link>
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="text-lg font-medium text-foreground hover:text-primary transition-colors"
              >
                Profile
              </Link>
            </>
          )}

          <div className="border-t border-border pt-6 mt-2">
            {session ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  Signed in as <span className="text-foreground font-medium">{session.firstName}</span>
                </p>
                <form action="/api/auth/signout" method="POST">
                  <Button variant="outline" className="w-full bg-transparent">
                    Sign Out
                  </Button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Button variant="outline" asChild>
                  <Link href="/sign-in" onClick={() => setOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up" onClick={() => setOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
