import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookHeart, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { BookForStore } from "@/lib/types/books"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"

export function BookCard({ book }: {book : BookForStore}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = book.imageUrl || []

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getCategoryDisplay = () => {
    const { level, faculty, year, class: bookClass } = book.category
    const capitalize = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "")

    if (level === "school" && bookClass) return `Class ${bookClass}`
    if (level === "highschool" && bookClass && faculty) return `Class ${bookClass} - ${capitalize(faculty)}`
    if ((level === "bachelors" || level === "masters") && faculty && year)
      return `${capitalize(faculty)} - Year ${year}`
    if (level === "exam" && faculty) return capitalize(faculty)
    return capitalize(level)
  }

  const displayPrice = book.price === 0 ? "Free" : `Rs. ${book.price.toLocaleString()}`
  const primaryImageUrl = images[currentImageIndex] || `/placeholder.svg?width=400&height=300&text=${encodeURIComponent(book.title.substring(0, 12))}&bgColor=4f46e5&textColor=ffffff`

  const typeColors: Record<string, string> = {
    Free: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg",
    Sell: "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg",
    Exchange: "bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg",
  }

  const conditionColors: Record<string, string> = {
    New: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/30",
    "Like New": "bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800 dark:hover:bg-teal-900/30",
    Good: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/30",
    Fair: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800 dark:hover:bg-yellow-900/30",
    Poor: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/30",
  }

  return (
    <Card className="w-[280px] h-[300px] flex flex-col overflow-hidden transition-shadow duration-200 ease-in-out hover:shadow-xl border-[#1E3A8A] relative group">
      <div className="relative h-48 w-full bg-[#F9FAFB] overflow-hidden">
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative h-full w-full cursor-pointer">
              {primaryImageUrl.includes("/placeholder.svg") ? (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <BookHeart className="h-12 w-12 text-gray-400" />
                </div>
              ) : (
                <Image
                  src={primaryImageUrl}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              )}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, index) => (
                      <div
                        key={index}
                        className={cn(
                          "h-1.5 w-1.5 rounded-full transition-all",
                          index === currentImageIndex ? "bg-white w-3" : "bg-white/50"
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogTitle>Book Images: </DialogTitle>
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={primaryImageUrl}
                alt={book.title}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                priority
              />
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/70 backdrop-blur-sm"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/70 backdrop-blur-sm"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <div
                        key={index}
                        className={cn(
                          "h-2 w-2 rounded-full transition-all cursor-pointer",
                          index === currentImageIndex ? "bg-white w-4" : "bg-white/50"
                        )}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
        <Badge
          className={`absolute top-0 right-2 px-2 py-0.5 text-xs font-semibold transition-all duration-200 ${typeColors[book.type] || "bg-gray-500 hover:bg-gray-600 text-white shadow-sm hover:shadow-md"}`}
        >
          {book.type}
        </Badge>
      </div>

      <Link href={`/marketplace/books/${book._id}`}>
        <CardContent className="p-3 flex-grow flex flex-col">
          <div className="flex justify-between items-start gap-1 mb-1">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate text-[#1E3A8A]" title={book.title}>
                {book.title}
              </h3>
              <p className="text-[#4B5563] text-xs truncate" title={book.author}>
                {book.author}
              </p>
            </div>
            <p className="font-semibold text-sm text-[#0D9488] whitespace-nowrap">{displayPrice}</p>
          </div>

          <div className="mt-1 mb-2 flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-[0.65rem] py-0.5 px-1.5 bg-[#F9FAFB] text-[#4B5563] border-[#1E3A8A]">
              {getCategoryDisplay()}
            </Badge>
            <Badge
              className={`text-[0.65rem] py-0.5 px-1.5 font-medium ${conditionColors[book.condition] || "bg-gray-100 text-gray-700 border-gray-200"}`}
            >
              {book.condition}
            </Badge>
          </div>

          <p className="mt-auto text-xs line-clamp-2 text-[#4B5563] flex-grow-0 leading-tight">
            {book.description}
          </p>
        </CardContent>
        <CardFooter className="pt-1 text-[0.65rem] text-[#4B5563] border-t border-[#1E3A8A]">
          <div className="flex justify-between w-full font-bold">
            <span className="truncate" title={book.condition}>
              {book.condition}
            </span>
            <span className="capitalize">
              {book.bookStatus}
            </span>
            <span className="whitespace-nowrap">
              {new Date(book.createdAt).toLocaleDateString()}
            </span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  )
}
