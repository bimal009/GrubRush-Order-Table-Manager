import React from 'react';
import { Utensils, Clock, MapPin, Tag } from 'lucide-react';

const Features = () => {
    const features = [
        {
            icon: <Utensils className="h-12 w-12 text-primary" />,
            title: "Fresh & Delicious",
            description: "Enjoy restaurant-quality meals delivered hot and fresh directly to your doorstep."
        },
        {
            icon: <Clock className="h-12 w-12 text-primary" />,
            title: "Lightning Fast",
            description: "We guarantee quick delivery times so your food arrives when hunger strikes."
        },
        {
            icon: <MapPin className="h-12 w-12 text-primary" />,
            title: "Local Restaurants",
            description: "Support your favorite local eateries with our wide selection of partner restaurants."
        },
        {
            icon: <Tag className="h-12 w-12 text-primary" />,
            title: "Special Offers",
            description: "Enjoy exclusive deals and discounts on your favorite meals and cuisines."
        }
    ];

    return (
        <div className="text-center mb-12">
            <p className="inline-block text-sm font-medium bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-4">
                Why Choose GrubRush
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Features You'll Love</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
                We make ordering food simple, fast, and rewarding
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                        <div className="mb-4">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Features;