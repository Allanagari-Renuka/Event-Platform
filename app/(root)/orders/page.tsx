import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export const dynamic = "force-static"

export default function OrdersPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Button variant="ghost" asChild className="gap-2 text-muted-foreground mb-6">
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Event Attendees</h1>
          <p className="text-muted-foreground">
            This project uses RSVP-based attendance. Payments are disabled.
          </p>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl bg-card border border-border">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No payment orders
          </h3>
          <p className="text-muted-foreground text-center max-w-md">
            This event platform supports free RSVP only. Attendee management
            will be handled via RSVP lists.
          </p>
        </div>
      </div>
    </div>
  )
}
