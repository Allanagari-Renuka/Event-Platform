import { Suspense } from "react"
import { HeroSection } from "@/components/home/hero-section"
import { Collection } from "@/components/shared/collection"
import { Search } from "@/components/shared/search"
import { CategoryFilter } from "@/components/shared/category-filter"
import { getAllEvents } from "@/lib/actions/event.actions"

type SearchParamProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function HomePage({ searchParams }: SearchParamProps) {
  const params = await searchParams
  const page = Number(params?.page) || 1
  const searchText = (params?.query as string) || ""
  const category = (params?.category as string) || ""

  const events = await getAllEvents({
    query: searchText,
    category,
    page,
    limit: 6,
  })

  return (
    <>
      <HeroSection />

      <section id="events" className="py-16 sm:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Discover Events</h2>
              <p className="text-muted-foreground mt-1">Explore thousands of events from around the world</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Suspense>
                <Search placeholder="Search events..." />
              </Suspense>
              <Suspense>
                <CategoryFilter />
              </Suspense>
            </div>
          </div>

          <Collection
            data={events?.data || []}
            emptyTitle="No Events Found"
            emptyStateSubtext="Check back later for new events or try a different search"
            collectionType="All_Events"
            limit={6}
            page={page}
            totalPages={events?.totalPages}
          />
        </div>
      </section>
    </>
  )
}
