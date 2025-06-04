/*eslint-disable*/
"use client";

import { useEffect, useState } from "react";
import { BookOpen, Facebook, Instagram, Twitter } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useUpdateHitCount } from "@/lib/hooks/hitcounter/use-update-hit-counter";

const PAGE_KEY = "page-visit-date-dashboard";

const Footer = ({count}: {count: number}) => {
    const [, setHasCounted] = useState(false);
    const {mutate: hitcounter} = useUpdateHitCount();

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        const lastVisit = localStorage.getItem(PAGE_KEY);

        if (lastVisit !== today) {
            localStorage.setItem(PAGE_KEY, today);
            setHasCounted(true);
            hitcounter()
        }
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <motion.footer 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="border-t bg-gradient-to-b from-white to-[#F9FAFB]"
        >
            <div className="container px-4 py-12 md:px-6 md:py-16">
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
                    <motion.div variants={itemVariants} className="space-y-4">
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-2"
                        >
                            <BookOpen className="h-8 w-8 text-[#1E3A8A]" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] bg-clip-text text-transparent">
                                Kitab Mantra
                            </span>
                        </motion.div>
                        <p className="text-sm text-[#4B5563]">
                            Your neighborhood bookstore since 2005. Connecting readers with stories that matter.
                        </p>
                    </motion.div>

                    {[
                        {
                            title: "Shop",
                            links: ["New Releases", "Bestsellers", "Staff Picks", "Gift Cards"]
                        },
                        {
                            title: "About",
                            links: ["Our Story", "Events", "Book Clubs", "Careers"]
                        },
                        {
                            title: "Support",
                            links: ["Contact Us", "FAQs", "Shipping & Returns", "Privacy Policy"]
                        }
                    ].map((section, index) => (
                        <motion.div key={section.title} variants={itemVariants}>
                            <h3 className="mb-4 text-sm font-medium text-[#1E3A8A]">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <motion.li 
                                        key={link}
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Link 
                                            href="#" 
                                            className="text-sm text-[#4B5563] hover:text-[#0D9488] transition-colors"
                                        >
                                            {link}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    variants={itemVariants}
                    className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#1E3A8A]/10 pt-8 sm:flex-row"
                >
                    <p className="text-xs text-[#4B5563]">
                        © {new Date().getFullYear()} Kitab Mantra. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        {[
                            { icon: Facebook, href: "#", label: "Facebook" },
                            { icon: Instagram, href: "#", label: "Instagram" },
                            { icon: Twitter, href: "#", label: "Twitter" }
                        ].map((social) => (
                            <motion.div
                                key={social.label}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link 
                                    href={social.href} 
                                    className="text-[#4B5563] hover:text-[#0D9488] transition-colors"
                                >
                                    <social.icon className="h-5 w-5" />
                                    <span className="sr-only">{social.label}</span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div 
                    variants={itemVariants}
                    className="mt-4 text-center text-xs text-[#4B5563]"
                >
                    Page Views: {count}
                </motion.div>
            </div>
        </motion.footer>
    )
}

export default Footer
