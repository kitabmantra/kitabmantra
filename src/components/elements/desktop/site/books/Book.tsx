"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, MessageSquare, ChevronLeft, ChevronRight, MapPin, Clock, BookOpen, User, Star, Shield, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from "date-fns"
import { PublicBook } from '@/lib/types/books'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"

interface BookProps {
    book: string | undefined
    success: boolean
}

const Book = ({
    book: bookString,
    success
}: BookProps) => {
    if (!success) toast.error("Something went wrong!")
    const book: PublicBook = JSON.parse(bookString as string);
    const bookCategories = book.category
    const lat = book.location.lat;
    const lon = book.location.lon;
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const images = book.imageUrl || []

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20">
            <div className="pt-20">
                <div className="container mx-auto py-8 px-4 max-w-7xl">
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        <div className="xl:col-span-5">
                            <div className="sticky top-24">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="relative group"
                                >
                                    <Link
                                        href={"/marketplace/"}
                                        className="absolute left-4 lg:-left-32 top-0 lg:top-2 z-50 inline-flex items-center text-slate-600 hover:text-blue-700 transition-all duration-200 group"
                                    >
                                        <motion.div whileHover={{ x: -4 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                        </motion.div>
                                        <span className="font-medium">Back</span>
                                    </Link>

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-white shadow-lg border border-slate-200/60 cursor-pointer">
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent z-10" />
                                                <Image
                                                    src={images[currentImageIndex] || "/kitabmantra.png"}
                                                    alt={book.title}
                                                    fill
                                                    className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                                                    priority
                                                />
                                                {images.length > 1 && (
                                                    <>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-md hover:bg-white shadow-md border border-white/20 flex items-center justify-center transition-all duration-200 z-20"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                prevImage();
                                                            }}
                                                        >
                                                            <ChevronLeft className="h-5 w-5 text-slate-700" />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-md hover:bg-white shadow-md border border-white/20 flex items-center justify-center transition-all duration-200 z-20"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                nextImage();
                                                            }}
                                                        >
                                                            <ChevronRight className="h-5 w-5 text-slate-700" />
                                                        </motion.button>
                                                    </>
                                                )}
                                                {images.length > 1 && (
                                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                                        {images.map((_, index) => (
                                                            <motion.button
                                                                key={index}
                                                                whileHover={{ scale: 1.2 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                className={cn(
                                                                    "h-2 rounded-full transition-all duration-300 cursor-pointer",
                                                                    index === currentImageIndex
                                                                        ? "bg-blue-600 w-6 shadow-md"
                                                                        : "bg-white/60 w-2 hover:bg-white/80",
                                                                )}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setCurrentImageIndex(index);
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                                {images.length > 1 && (
                                                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium z-20">
                                                        {currentImageIndex + 1} / {images.length}
                                                    </div>
                                                )}
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl">
                                            <div className="relative aspect-[4/5] w-full">
                                                <Image
                                                    src={images[currentImageIndex] || "/kitabmantra.png"}
                                                    alt={book.title}
                                                    fill
                                                    className="object-contain"
                                                    priority
                                                />
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="mt-6 space-y-3 max-w-md mx-auto"
                                >
                                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                        <Button
                                            className="w-full h-12 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-base"
                                            onClick={() => alert("This is a demo. Contact functionality is not implemented.")}
                                        >
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            Contact Seller
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>

                        <div className="xl:col-span-7">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="space-y-6"
                            >
                                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
                                    <CardContent className="p-8">
                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-teal-500 rounded-full"></div>
                                                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">{book.title}</h1>
                                                </div>
                                                <div className="flex items-center text-xl text-slate-600 mb-4">
                                                    <User className="h-5 w-5 mr-2 text-teal-600" />
                                                    <span className="font-medium">by {book.author}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-slate-500">
                                                    <Clock className="h-4 w-4 mr-2 text-teal-600" />
                                                    <span>Posted {formatDistanceToNow(new Date(book.createdAt), { addSuffix: true })}</span>
                                                </div>
                                            </div>

                                            <div className="lg:text-right">
                                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-50 to-blue-50 px-6 py-3 rounded-2xl border border-teal-200/50">
                                                    <span className="text-sm font-medium text-slate-600">Price</span>
                                                    <span className="text-3xl lg:text-4xl font-bold text-teal-600">₹{book.price}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3 mb-8">
                                            <Badge className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200 px-4 py-2 rounded-xl font-medium text-sm hover:from-blue-200 hover:to-blue-100 transition-all">
                                                {bookCategories.level.replace("highschool", "High School")}
                                            </Badge>
                                            {bookCategories.faculty && (
                                                <Badge className="bg-gradient-to-r from-teal-100 to-teal-50 text-teal-700 border-teal-200 px-4 py-2 rounded-xl font-medium text-sm hover:from-teal-200 hover:to-teal-100 transition-all">
                                                    {bookCategories.faculty.replace("-", " ")}
                                                </Badge>
                                            )}
                                            {bookCategories.year && (
                                                <Badge className="bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border-purple-200 px-4 py-2 rounded-xl font-medium text-sm hover:from-purple-200 hover:to-purple-100 transition-all">
                                                    Year {bookCategories.year}
                                                </Badge>
                                            )}
                                            {bookCategories.class && (
                                                <Badge className="bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border-orange-200 px-4 py-2 rounded-xl font-medium text-sm hover:from-orange-200 hover:to-orange-100 transition-all">
                                                    Class {bookCategories.class}
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="space-y-6">
                                            <div className="border-l-4 border-gradient-to-b from-blue-500 to-teal-500 pl-6">
                                                <h3 className="text-xl font-bold mb-4 text-slate-900 flex items-center">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                                                        <BookOpen className="h-4 w-4 text-white" />
                                                    </div>
                                                    Description
                                                </h3>
                                                <p className="text-slate-600 leading-relaxed text-lg">{book.description}</p>
                                            </div>

                                            <div className="border-l-4 border-gradient-to-b from-teal-500 to-blue-500 pl-6">
                                                <h3 className="text-xl font-bold mb-4 text-slate-900 flex items-center">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                                                        <MapPin className="h-4 w-4 text-white" />
                                                    </div>
                                                    Location
                                                </h3>
                                                {lat && lon ? (
                                                    <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-xl border border-teal-200">
                                                        <Eye className="h-4 w-4" />
                                                        <span className="font-medium">View location on map</span>
                                                    </div>
                                                ) : (
                                                    <p className="text-slate-500 italic">Location not provided</p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                >
                                    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
                                        <CardContent className="p-8">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                                                    <Shield className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-900">Seller Information</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                        <span className="text-sm text-slate-600 font-medium">Verified Seller</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-slate-600 leading-relaxed mb-6">
                                                This book was posted by a verified user. Contact them to arrange a meeting for the exchange.
                                            </p>

                                            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <Shield className="h-4 w-4 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-red-800 mb-2">Safety Guidelines</h4>
                                                        <p className="text-red-700 text-sm leading-relaxed">
                                                            Always meet in a public place for your safety when exchanging books. Consider meeting at
                                                            libraries, cafes, or university campuses.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Book
