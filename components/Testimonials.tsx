import React from 'react';
import { Star } from 'lucide-react';
import Image from 'next/image';

const Testimonials = () => {
    const testimonials = [
        {
            name: "Sarah Johnson",
            location: "Downtown",
            image: "/api/placeholder/64/64",
            content: "GrubRush has completely changed how I eat during busy workdays. The delivery is insanely fast and the food always arrives hot!",
            rating: 5
        },
        {
            name: "David Chen",
            location: "Westside",
            image: "/api/placeholder/64/64",
            content: "As a night shift worker, finding good food late at night was always a challenge until I found GrubRush. Their late-night delivery options are a lifesaver!",
            rating: 5
        },
        {
            name: "Maria Rodriguez",
            location: "Uptown",
            image: "/api/placeholder/64/64",
            content: "The variety of restaurants available is impressive. I've discovered so many amazing local spots I would have never tried otherwise.",
            rating: 4
        }
    ];

    return (
        <div className="text-center mb-12 mt-24">
            <p className="inline-block text-sm font-medium bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-4">
                Customer Stories
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What Our Customers Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
                Don't just take our word for it – hear from our satisfied customers
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-border/20">
                        <div className="flex items-center mb-4">
                            <div className="relative w-12 h-12 mr-4">
                                <Image
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    fill
                                    className="rounded-full object-cover"
                                />
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold">{testimonial.name}</h3>
                                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                            </div>
                        </div>

                        <div className="flex mb-3">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                        }`}
                                />
                            ))}
                        </div>

                        <p className="text-muted-foreground text-left">"{testimonial.content}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonials;