import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"

interface BookCardProps {
    book: PublicBook
    success: boolean;
}

export function BookCard({ book, success }: BookCardProps) {
    if (!success) toast.error("Something went wrong!")
    const bookCategories = JSON.parse(book.category)
    return (
        <Link href={`/marketplace/books/${book.bookId}`}>
            <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full bg-gray-100">
                    <Image
                        src={book.imageUrl[0] || "/kitabmantra.png"}
                        alt={book.title}
                        fill
                        className="object-contain"
                    />
                </div>
                <CardContent className="p-4">
                    <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">{book.title}</h3>
                            <p className="text-muted-foreground text-sm truncate">{book.author}</p>
                        </div>
                        <p className="font-bold text-lg whitespace-nowrap">Rs. {book.price}</p>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
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

                    <p className="mt-2 text-sm line-clamp-2 text-muted-foreground">{book.description}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 text-xs text-muted-foreground border-t mt-2">
                    <div className="flex justify-between w-full">
                        <span>{book.condition}</span>
                        <span>{formatDistanceToNow(new Date(book.createdAt), { addSuffix: true })}</span>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}
