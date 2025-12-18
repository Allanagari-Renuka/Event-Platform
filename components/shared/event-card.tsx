import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDateTime, formatPrice } from "@/lib/utils"
import type { IEvent } from "@/lib/database/models/event.model"

type EventCardProps = {
  event: IEvent
  hasOrderLink?: boolean
  hidePrice?: boolean
}

export function EventCard({ event, hasOrderLink, hidePrice }: EventCardProps) {
  return (
    <Card className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300">
      <Link href={`/events/${event._id}`}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={event.imageUrl || "/placeholder.svg"}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {!hidePrice && (
            <div className="absolute top-3 right-3">
              <Badge variant={event.isFree ? "secondary" : "default"} className="font-semibold">
                {event.isFree ? "FREE" : formatPrice(event.price)}
              </Badge>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-border text-foreground">
              {event.category?.name || "General"}
            </Badge>
          </div>
        </div>
      </Link>

      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Calendar className="h-4 w-4" />
          <span>{formatDateTime(event.startDateTime).dateTime}</span>
        </div>

        <Link href={`/events/${event._id}`}>
          <h3 className="font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {event.title}
          </h3>
        </Link>

        {event.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            By{" "}
            <span className="text-foreground font-medium">
              {event.organizer?.firstName} {event.organizer?.lastName}
            </span>
          </p>

          {hasOrderLink && (
            <Link
              href={`/orders?eventId=${event._id}`}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Orders
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
