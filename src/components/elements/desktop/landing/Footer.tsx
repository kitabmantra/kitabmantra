/*eslint-disable*/
"use client";

import { useEffect, useState } from "react";
import { BookOpen } from 'lucide-react'
import Link from 'next/link'
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

    return (
        < footer className="border-t bg-[#fcf9f2]" >
            <div className="container px-4 py-8 md:px-6 md:py-12">
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-amber-700" />
                            <span className="text-xl font-bold">Kitab Mantra</span>
                        </div>
                        <p className="text-sm text-gray-600">
                            Your neighborhood bookstore since 2005. Connecting readers with stories that matter.
                        </p>
                    </div>
                    <div>
                        <h3 className="mb-3 text-sm font-medium">Shop</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <Link href="#" className="hover:underline">
                                    New Releases
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">
                                    Bestsellers
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">
                                    Staff Picks
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">
                                    Gift Cards
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-3 text-sm font-medium">About</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <Link href="#" className="hover:underline">
                                    Our Story
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">
                                    Events
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">
                                    Book Clubs
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">
                                    Careers
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-3 text-sm font-medium">Support</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <Link href="#" className="hover:underline">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">
                                    FAQs
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">
                                    Shipping & Returns
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        hit count {count}
                    </div>
                </div>
                <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
                    <p className="text-xs text-gray-600">© {new Date().getFullYear()} Kitab Mantra. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="#" className="text-gray-600 hover:text-amber-700">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                            <span className="sr-only">Facebook</span>
                        </Link>
                        <Link href="#" className="text-gray-600 hover:text-amber-700">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                            <span className="sr-only">Instagram</span>
                        </Link>
                        <Link href="#" className="text-gray-600 hover:text-amber-700">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                            </svg>
                            <span className="sr-only">Twitter</span>
                        </Link>
                    </div>
                </div>

            </div>
        </footer >
    )
}

export default Footer
