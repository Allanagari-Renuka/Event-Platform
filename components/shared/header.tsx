import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth"
import { MobileNav } from "./mobile-nav"
import { UserNav } from "./user-nav"

export async function Header() {
  const session = await getSession()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-foreground tracking-tight">
              Evently
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/#events"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Events
              </Link>
              {session && (
                <Link
                  href="/events/create"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Create Event
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              {session ? (
                <UserNav user={session} />
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/sign-up">Get Started</Link>
                  </Button>
                </>
              )}
            </div>

            <MobileNav session={session} />
          </div>
        </div>
      </nav>
    </header>
  )
}
