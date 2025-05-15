import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

const Hero = () => {
    return (
        <section className="relative overflow-hidden">
            {/* Hero Content */}
            <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
                    {/* Text Content */}
                    <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
                        <div className="space-y-2">
                            <p className="inline-block text-sm font-medium bg-primary/10 text-primary px-4 py-1.5 rounded-full">
                                Hunger doesn’t wait
                            </p>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                                Rush, <span className="text-primary">in</span> The  <span className="text-primary">Flavor</span>
                            </h1>
                        </div>

                        <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                            Whether you’re craving a quick bite, a late-night snack, or a full feast, GrubRush delivers it with lightning speed and unbeatable convenience
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

                            <Button size="lg" variant="outline" className="rounded-full px-8 bg-primary text-white">
                                <Link href="/events/create">Order Now</Link>
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/60">
                            <div>
                                <p className="text-2xl font-bold">500+</p>
                                <p className="text-sm text-muted-foreground">Delivered</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">10k+</p>
                                <p className="text-sm text-muted-foreground">Users</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">50+</p>
                                <p className="text-sm text-muted-foreground">Items</p>
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
    )
}

export default Hero
