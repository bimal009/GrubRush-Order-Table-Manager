import React from 'react';
import { Search, Clock, Utensils, Star } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: <Search className="h-12 w-12 text-white" />,
            title: "Browse",
            description: "Find your favorite foods from local restaurants with our easy search."
        },
        {
            icon: <Clock className="h-12 w-12 text-white" />,
            title: "Order",
            description: "Place your order with our secure and simple checkout process."
        },
        {
            icon: <Utensils className="h-12 w-12 text-white" />,
            title: "Enjoy",
            description: "Receive your food hot and fresh at your doorstep in minutes."
        },
        {
            icon: <Star className="h-12 w-12 text-white" />,
            title: "Review",
            description: "Rate your experience and help others discover great meals."
        }
    ];

    return (
        <div className="text-center mb-12 mt-24">
            <p className="inline-block text-sm font-medium bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-4">
                Simple Process
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How GrubRush Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
                Order delicious food in just a few simple steps
            </p>

            <div className="relative">
                {/* Connector Line */}
                <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-primary/20 z-0"></div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center">
                            <div className="bg-primary p-4 rounded-full mb-4 border-4 border-white shadow-md">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;