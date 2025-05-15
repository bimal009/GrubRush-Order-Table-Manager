import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ContactPage = () => {
    return (
        <main>
            {/* Contact Header */}
            <section className="relative overflow-hidden">
                <div className="container mx-auto px-4 py-16 relative z-10">
                    <div className="text-center space-y-4 max-w-3xl mx-auto">
                        <p className="inline-block text-sm font-medium bg-primary/10 text-primary px-4 py-1.5 rounded-full">
                            Get In Touch
                        </p>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            We'd Love to <span className="text-primary">Hear</span> From You
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Have questions about our service, need help with an order, or want to partner with us? We're here to help!
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-8 rounded-lg shadow-sm border border-border/20">
                                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="bg-primary/10 p-3 rounded-full mr-4">
                                            <Mail className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Email Us</p>
                                            <p className="text-muted-foreground">support@grubrush.com</p>
                                            <p className="text-muted-foreground">partners@grubrush.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-primary/10 p-3 rounded-full mr-4">
                                            <Phone className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Call Us</p>
                                            <p className="text-muted-foreground">Customer Support: (555) 123-4567</p>
                                            <p className="text-muted-foreground">Restaurant Partners: (555) 987-6543</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-primary/10 p-3 rounded-full mr-4">
                                            <MapPin className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Visit Us</p>
                                            <p className="text-muted-foreground">123 Delivery Street</p>
                                            <p className="text-muted-foreground">Foodville, FD 12345</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-primary/10 p-3 rounded-full mr-4">
                                            <Clock className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Support Hours</p>
                                            <p className="text-muted-foreground">Monday - Friday: 8am - 11pm</p>
                                            <p className="text-muted-foreground">Weekends: 10am - 9pm</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white p-8 rounded-lg shadow-sm border border-border/20">
                                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium mb-2">Your Name</label>
                                            <Input
                                                id="name"
                                                placeholder="John Doe"
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="john@example.com"
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                                        <Input
                                            id="subject"
                                            placeholder="How can we help you?"
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium mb-2">Your Message</label>
                                        <Textarea
                                            id="message"
                                            placeholder="Tell us more about your inquiry..."
                                            className="w-full min-h-[150px]"
                                        />
                                    </div>

                                    <div>
                                        <Button className="w-full sm:w-auto bg-primary text-white">
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Send Message
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="inline-block text-sm font-medium bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-4">
                            Frequently Asked Questions
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Common Questions</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Find quick answers to the most common questions about our service
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto grid gap-6">
                        {[
                            {
                                question: "What areas do you deliver to?",
                                answer: "We currently deliver to most areas within the city limits. You can check if we deliver to your location by entering your address on our ordering page."
                            },
                            {
                                question: "How long does delivery take?",
                                answer: "Our average delivery time is 30-45 minutes, depending on your location and the restaurant's preparation time. You can track your order in real-time through our app."
                            },
                            {
                                question: "What if there's an issue with my order?",
                                answer: "If there's any problem with your order, please contact our customer support immediately. We offer a satisfaction guarantee and will work quickly to resolve any issues."
                            },
                            {
                                question: "How can restaurants partner with GrubRush?",
                                answer: "If you're a restaurant owner interested in partnering with us, please email partners@grubrush.com or fill out the partnership form on our website."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-border/20">
                                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                                <p className="text-muted-foreground">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="rounded-lg overflow-hidden shadow-sm border border-border/20 h-96 bg-slate-200 flex items-center justify-center">
                        <p className="text-muted-foreground">Map would be displayed here</p>
                        {/* You would typically integrate a map service like Google Maps here */}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ContactPage;