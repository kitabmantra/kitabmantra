"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from "date-fns"
import { PublicBook } from '@/lib/types/books'

interface BookProps {
    book: string | undefined
    success: boolean
}

const Book = ({
    book : bookString,
    success
}: BookProps) => {
    if (!success) toast.error("Something went wrong!")
    const book: PublicBook = JSON.parse(bookString as string);
    const bookCategories = book.category
    const lat = book.location.lat;
    const lon = book.location.lon;

  

    return (
        <div className="container mx-auto py-8 px-4">
            <Link href="/marketplace" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to books
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden border bg-gray-100">
                        <Image
                            src={book.imageUrl[0] || "/kitabmantra.png"}
                            alt={book.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="mt-4">
                        <Button
                            className="w-full"
                            onClick={() => alert("This is a demo. Contact functionality is not implemented.")}
                        >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Contact Seller
                        </Button>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="bg-white p-6 rounded-lg border">
                        <h1 className="text-3xl font-bold">{book.title}</h1>
                        <p className="text-xl mt-1">by {book.author}</p>

                        <div className="flex flex-wrap gap-2 mt-4">
                            <Badge variant="outline" className="capitalize">
                                {bookCategories.level.replace("highschool", "High School")}
                            </Badge>
                            {bookCategories.faculty && (
                                <Badge variant="outline" className="capitalize">
                                    {bookCategories.faculty.replace("-", " ")}
                                </Badge>
                            )}
                            {bookCategories.year && <Badge variant="outline">Year {bookCategories.year}</Badge>}
                            {bookCategories.class && <Badge variant="outline">Class {bookCategories.class}</Badge>}
                        </div>

                        <div className="mt-6">
                            <h2 className="text-2xl font-bold">Rs. {book.price}</h2>
                            <p className="text-muted-foreground">
                                Condition: <span className="font-medium">{book.condition}</span> • Posted{" "}
                                {formatDistanceToNow(new Date(book.createdAt), { addSuffix: true })}
                            </p>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <p className="text-muted-foreground whitespace-pre-line">{book.description}</p>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Location</h3>
                            {
                                lat && lon && (
                                    <div>View location</div>
                                ) 
                                // : (
                                //     <p className="text-muted-foreground whitespace-pre-line">
                                //         {(() => {
                                //             try {
                                //                 const parsedLocation = JSON.parse(book.location);
                                //                 return parsedLocation?.trim() ? parsedLocation : "Not provided";
                                //             } catch (e) {
                                //                 alert(e)
                                //                 return "Not provided";
                                //             }
                                //         })()}
                                //     </p>
                                // )
                            }
                        </div>
                    </div>

                    <Card className="mt-6">
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-2">Seller Information</h3>
                            <p className="text-sm text-muted-foreground">
                                This book was posted by a verified user. Contact them to arrange a meeting for the exchange.
                            </p>
                            <p className="text-sm mt-2 text-red-500">
                                <strong>Note:</strong> Always meet in a public place for your safety when exchanging books.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Book
