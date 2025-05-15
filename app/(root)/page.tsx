import Hero from '@/components/Hero'
import React from 'react'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import Testimonials from '@/components/Testimonials'
import CallToAction from '@/components/CallToAction'

const Home = () => {
  return (
    <main>
      {/* Hero Section */}
      <Hero />

      {/* Events Section */}
      <section id="events" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Features />

            <HowItWorks />

            <Testimonials />

            <CallToAction />
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home