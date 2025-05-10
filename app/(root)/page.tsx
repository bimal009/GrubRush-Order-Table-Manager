import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Home = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero Content */}
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
            {/* Text Content */}
            <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
              <div className="space-y-2">
                <p className="inline-block text-sm font-medium bg-primary/10 text-primary px-4 py-1.5 rounded-full">
                  Discover Amazing Events
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Host, <span className="text-primary">Connect</span> and <span className="text-primary">Celebrate</span>
                </h1>
              </div>

              <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Buntly helps you discover and join events that match your interests.
                Connect with like-minded people and create memorable experiences.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="rounded-full px-8">
                  <Link href="#events">Explore Events</Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  <Link href="/events/create">Create Event</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/60">
                <div>
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-sm text-muted-foreground">Events</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">10k+</p>
                  <p className="text-sm text-muted-foreground">Users</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">50+</p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md lg:max-w-none">
                <div className="aspect-square md:aspect-[4/3] relative">
                  <Image
                    src="/hero.svg"
                    alt="People enjoying events"
                    fill
                    priority
                    className="object-contain drop-shadow-xl"
                  />
                </div>

                {/* Decorative Elements */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full bg-primary/10 blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover Events</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Find events that match your interests and connect with people who share your passions
            </p>
          </div>
        </div>
      </section>
    </main>

  )
}

export default Home