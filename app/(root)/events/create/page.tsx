import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { EventForm } from "@/components/shared/event-form"

export default async function CreateEventPage() {
  const session = await getSession()

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create Event</h1>
          <p className="text-muted-foreground mt-2">Fill in the details to create your event</p>
        </div>

        <div className="bg-card rounded-xl p-6 sm:p-8 border border-border">
          <EventForm userId={session._id} type="Create" />
        </div>
      </div>
    </div>
  )
}
