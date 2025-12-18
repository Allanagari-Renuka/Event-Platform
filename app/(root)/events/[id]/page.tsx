import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Calendar, MapPin, LinkIcon, User, ArrowLeft, Edit, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSession } from "@/lib/auth"
import { getEventById, getRelatedEventsByCategory } from "@/lib/actions/event.actions"
import { formatDateTime } from "@/lib/utils"
import { Collection } from "@/components/shared/collection"
import { DeleteConfirmation } from "@/components/shared/delete-confirmation"

type EventDetailsPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const dynamic = "force-dynamic"

export default async function EventDetailsPage({ params, searchParams }: EventDetailsPageProps) {
  const { id } = await params
  const searchParamsResolved = await searchParams

  const event = await getEventById(id)

  if (!event) {
    notFound()
  }

  const session = await getSession()
  const isEventCreator = session?._id === event.organizer._id

  const relatedEvents = await getRelatedEventsByCategory({
    categoryId: event.category._id,
    eventId: event._id,
    page: Number(searchParamsResolved?.page) || 1,
  })

  return (
    <div className="min-h-screen">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Button variant="ghost" asChild className="gap-2 text-muted-foreground">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-muted">
              <Image
                src={event.imageUrl || "/placeholder.svg"}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline">{event.category.name}</Badge>
                <Badge variant="secondary">FREE EVENT</Badge>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                {event.title}
              </h1>

              {/* Organizer & Actions */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Organized by</p>
                    <p className="font-medium">
                      {event.organizer.firstName} {event.organizer.lastName}
                    </p>
                  </div>
                </div>

                {isEventCreator && (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/events/${event._id}/update`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <DeleteConfirmation eventId={event._id} />
                  </div>
                )}
              </div>

              {/* Event Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">
                      {formatDateTime(event.startDateTime).dateOnly}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(event.startDateTime).timeOnly} –{" "}
                      {formatDateTime(event.endDateTime).timeOnly}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <p className="font-medium">{event.location}</p>
                </div>

                {event.url && (
                  <div className="flex items-start gap-4">
                    <LinkIcon className="h-5 w-5 text-primary" />
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      Event Website
                    </a>
                  </div>
                )}
              </div>

              {/* RSVP Button */}
              <Button size="lg" className="gap-2">
                <Users className="h-5 w-5" />
                RSVP to this Event
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="bg-card py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mb-4">About this event</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {event.description}
          </p>
        </div>
      </section>

      {/* Related Events */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Related Events</h2>
          <Collection
            data={relatedEvents?.data || []}
            emptyTitle="No Related Events"
            emptyStateSubtext="Check out other events in different categories"
            collectionType="All_Events"
            limit={3}
            page={Number(searchParamsResolved?.page) || 1}
            totalPages={relatedEvents?.totalPages}
          />
        </div>
      </section>
    </div>
  )
}
