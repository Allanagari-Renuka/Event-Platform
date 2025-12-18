import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm text-muted-foreground">Now accepting event submissions</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight text-balance mb-6">
            Host, Connect,
            <br />
            <span className="text-primary">Celebrate</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty leading-relaxed">
            Your platform for discovering and creating extraordinary events. Book and learn helpful tips from thousands
            of mentors in world-class companies.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/#events" className="flex items-center gap-2">
                Explore Events
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
              <Link href="/events/create">Create Your Event</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border max-w-xl mx-auto">
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-foreground">10K+</p>
              <p className="text-sm text-muted-foreground mt-1">Events Hosted</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-foreground">50K+</p>
              <p className="text-sm text-muted-foreground mt-1">Active Users</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-foreground">100+</p>
              <p className="text-sm text-muted-foreground mt-1">Categories</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
