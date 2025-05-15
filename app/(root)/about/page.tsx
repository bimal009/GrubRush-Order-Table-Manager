import Image from 'next/image'
import React from 'react'

const AboutUs = () => {
    return (
        <section className="relative overflow-hidden">
            {/* About Us Content */}
            <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
                    {/* Text Content */}
                    <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
                        <div className="space-y-2">
                            <p className="inline-block text-sm font-medium bg-primary/10 text-primary px-4 py-1.5 rounded-full">
                                Who We Are
                            </p>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                                Fueling Cravings, <span className="text-primary">Fast</span> & <span className="text-primary">Fresh</span>
                            </h1>
                        </div>

                        <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                            At GrubRush, we connect you with your favorite local restaurants and bring the flavors you love—right to your doorstep. From quick bites to late-night feasts, we deliver with lightning speed, unmatched convenience, and a hunger to serve.
                        </p>

                        <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                            We’re not just a delivery service—we’re a movement that believes food should never keep you waiting. Powered by smart tech and a passion for great taste, GrubRush is changing the way people satisfy their cravings.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/60">
                            <div>
                                <p className="text-2xl font-bold">500+</p>
                                <p className="text-sm text-muted-foreground">Orders Delivered</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">10k+</p>
                                <p className="text-sm text-muted-foreground">Happy Users</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">50+</p>
                                <p className="text-sm text-muted-foreground">Menu Items</p>
                            </div>
                        </div>
                    </div>

                    {/* About Us Image */}
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-md lg:max-w-none">
                            <div className="aspect-square md:aspect-[4/3] relative">
                                <Image
                                    src="/aboutus.png"
                                    alt="GrubRush team delivering happiness"
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

export default AboutUs
