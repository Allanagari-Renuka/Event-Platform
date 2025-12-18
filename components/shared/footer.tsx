import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-xl font-bold text-foreground">
              Evently
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              Your platform for discovering and creating extraordinary events. Connect with your community and celebrate
              together.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Platform</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/#events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link
                  href="/events/create"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Create Event
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Evently. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
