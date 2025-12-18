import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getEventById } from "@/lib/actions/event.actions"
import { EventForm } from "@/components/shared/event-form"

type UpdateEventPageProps = {
  params: Promise<{ id: string }>
}

export default async function UpdateEventPage({ params }: UpdateEventPageProps) {
  const { id } = await params
  const session = await getSession()

  if (!session) {
    redirect("/sign-in")
  }

  const event = await getEventById(id)

  if (!event) {
    notFound()
  }

  if (event.organizer._id !== session._id) {
    redirect("/")
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Update Event</h1>
          <p className="text-muted-foreground mt-2">Make changes to your event</p>
        </div>

        <div className="bg-card rounded-xl p-6 sm:p-8 border border-border">
          <EventForm userId={session._id} type="Update" event={event} eventId={event._id} />
        </div>
      </div>
    </div>
  )
}
