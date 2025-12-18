import { EventCard } from "./event-card"
import type { IEvent } from "@/lib/database/models/event.model"
import { Pagination } from "./pagination"

type CollectionProps = {
  data: IEvent[]
  emptyTitle: string
  emptyStateSubtext: string
  limit: number
  page: number | string
  totalPages?: number
  urlParamName?: string
  collectionType?: "Events_Organized" | "My_Tickets" | "All_Events"
}

export function Collection({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages = 0,
  collectionType,
  urlParamName,
}: CollectionProps) {
  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((event) => {
              const hasOrderLink = collectionType === "Events_Organized"
              const hidePrice = collectionType === "My_Tickets"

              return <EventCard key={event._id} event={event} hasOrderLink={hasOrderLink} hidePrice={hidePrice} />
            })}
          </div>

          {totalPages > 1 && <Pagination urlParamName={urlParamName} page={page} totalPages={totalPages} />}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl bg-card border border-border">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">{emptyTitle}</h3>
          <p className="text-muted-foreground text-center max-w-md">{emptyStateSubtext}</p>
        </div>
      )}
    </>
  )
}
