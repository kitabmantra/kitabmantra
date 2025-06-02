import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, BookHeart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function BookCard({ book }: {book : BookForStore}) {
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
  const primaryImageUrl =
    book.imageUrl && book.imageUrl.length > 0
      ? book.imageUrl[0]
      : `/placeholder.svg?width=400&height=300&text=${encodeURIComponent(book.title.substring(0, 12))}&bgColor=4f46e5&textColor=ffffff`

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
    <Card className="group h-[500px] flex flex-col overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600">
      {/* Image with better height */}
      <div className="relative w-full h-60 sm:h-64 md:h-72 lg:h-80 xl:h-96 overflow-hidden">
        {primaryImageUrl.includes("/placeholder.svg") ? (
          <div className="w-full h-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
            <BookHeart className="h-12 w-12 text-gray-400 dark:text-slate-500" />
          </div>
        ) : (
          <Image
            src={primaryImageUrl || "/placeholder.svg"}
            alt={book.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-102"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
        <Badge
          className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold transition-all duration-200 ${typeColors[book.type] || "bg-gray-500 hover:bg-gray-600 text-white shadow-sm hover:shadow-md"}`}
        >
          {book.type}
        </Badge>
      </div>

      <CardContent className="flex-1 p-4 space-y-2">
        <h3 className="font-semibold text-base leading-tight line-clamp-2 text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
          {book.title}
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">by {book.author}</p>

        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            {displayPrice}
          </span>
          <Badge
            className={`text-xs px-2 py-0.5 font-medium transition-all duration-200 cursor-pointer ${conditionColors[book.condition] || "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-600"}`}
          >
            {book.condition}
          </Badge>
        </div>

        <Badge
          className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 px-2 py-0.5 font-medium border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors duration-200 cursor-pointer"
        >
          {getCategoryDisplay()}
        </Badge>

        <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">
          {book.description}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-2 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
        <Link href={`/marketplace/test/${book._id}`}>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium py-2 px-3 rounded-md text-sm shadow-sm hover:shadow-md transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 dark:focus:ring-offset-slate-800 group">
          <span className="flex items-center justify-center space-x-1">
            <span>View Details</span>
            <ExternalLink className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-200" />
          </span>
        </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
