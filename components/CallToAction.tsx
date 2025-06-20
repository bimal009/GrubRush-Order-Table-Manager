import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';

const CallToAction = () => {
    return (
        <div className="text-center mb-12 mt-24">
            <div className="bg-primary/5 rounded-2xl p-8 md:p-12">
                <p className="inline-block text-sm font-medium bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-4">
                    Ready to Order?
                </p>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Satisfy Your Cravings Now</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                    Join thousands of food lovers and get your favorite meals delivered to your doorstep in minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="rounded-full px-8 bg-primary text-white">
                        <Link href="/select-tables">Order Now</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-full px-8">
                        Browse Menu
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CallToAction;