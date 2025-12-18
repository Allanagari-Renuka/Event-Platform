import Link from "next/link"
import { redirect } from "next/navigation"
import { Plus, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth"
import { getEventsByUser } from "@/lib/actions/event.actions"
import { Collection } from "@/components/shared/collection"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const session = await getSession()

  if (!session) {
    redirect("/sign-in")
  }

  const organizedEvents = await getEventsByUser({ userId: session._id })

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {session.firstName?.charAt(0)}
                {session.lastName?.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {session.firstName} {session.lastName}
              </h1>
              <p className="text-muted-foreground">{session.email}</p>
            </div>
          </div>
        </div>

        {/* My Events */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                My Events
              </h2>
              <p className="text-muted-foreground">
                Events you have created
              </p>
            </div>
            <Button asChild className="gap-2">
              <Link href="/events/create">
                <Plus className="h-4 w-4" />
                Create Event
              </Link>
            </Button>
          </div>

          <Collection
            data={organizedEvents?.data || []}
            emptyTitle="No events created yet"
            emptyStateSubtext="Create your first event to see it here"
            collectionType="Events_Organized"
            limit={6}
          />
        </div>
      </div>
    </div>
  )
}
