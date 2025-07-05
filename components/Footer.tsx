import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Github } from 'lucide-react'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    // Footer navigation links
    const footerLinks = [
        {
            title: "Company",
            links: [
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Careers", href: "/careers" },
            ]
        },
        {
            title: "Resources",
            links: [
                { label: "Blog", href: "/blog" },
                { label: "FAQ", href: "/faq" },
                { label: "Support", href: "/support" },
            ]
        },
        {
            title: "Legal",
            links: [
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Cookie Policy", href: "/cookies" },
            ]
        }
    ]

    // Social media links
    const socialLinks = [
        { icon: <Facebook size={20} />, href: "https://facebook.com", label: "Facebook" },
        { icon: <Twitter size={20} />, href: "https://twitter.com", label: "Twitter" },
        { icon: <Instagram size={20} />, href: "https://instagram.com", label: "Instagram" },
        { icon: <Github size={20} />, href: "https://github.com", label: "Github" }
    ]

    return (
        <footer className="bg-background border-t border-border/40">
            <div className="container mx-auto px-4 py-12">
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                    {/* Brand section */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Image
                                src="/logo.svg"
                                alt="GrubRush logo"
                                width={32}
                                height={32}
                                className="h-8 w-8 object-contain"
                            />
                            <p className="text-xl font-bold">GrubRush</p>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-6 max-w-md">
                            GrubRush offers a diverse menu with delicious meals. Order your favorite food online or reserve a table for a great dining experience.
                        </p>
                        {/* Social links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 w-10 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Footer navigation links */}
                    {footerLinks.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-medium text-base mb-4">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom section with copyright */}
                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground order-2 md:order-1">
                        &copy; {currentYear} GrubRush. All rights reserved.
                    </p>
                    <div className="flex gap-6 order-1 md:order-2">
                        <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                            Terms
                        </Link>
                        <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                            Privacy
                        </Link>
                        <Link href="/cookies" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer