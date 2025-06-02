"use client"

import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { MoreVertical, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface BookCardProps {
  book: BookForStore
  success: boolean // As per original logic, related to fetching list of books
  handleDelete: (id: string) => void
}

export function BookCard({ book, success, handleDelete }: BookCardProps) {
  // This toast fires if the *list fetching* had an issue, for every card.
  // Kept as per "don't change logic" instruction.
  if (!success) {
    toast.error("There was an issue loading book details.")
  }

  const bookCategories = book.category

  const onOpenChange = (open: boolean) => {
    if (open && !success) {
      // This is an example if you wanted to prevent opening menu if !success
      // For now, it does nothing extra.
    }
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-shadow duration-200 ease-in-out hover:shadow-xl dark:border-gray-700 relative group">
      <div className="absolute top-2 right-2 z-20">
        <AlertDialog>
          <DropdownMenu onOpenChange={onOpenChange}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/70 dark:bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                <span className="sr-only">Book options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-red-600 hover:!text-red-600 hover:!bg-red-50 dark:hover:!bg-red-900/50 focus:!text-red-600 focus:!bg-red-50 dark:focus:!bg-red-900/50"
                  onSelect={(e) => e.preventDefault()} // Prevents Link navigation & auto-close
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the book listing for &quot;{book.title}&quot;.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete(book._id)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Yes, delete book
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Link href={`/dashboard/my-listings/${book._id}`} className="flex flex-col flex-grow h-full">
        <div className="relative h-56 w-full bg-gray-100 dark:bg-gray-800">
          <Image
            src={book.imageUrl[0] || "/kitabmantra.png"} // Using placeholder if imageUrl is empty or kitabmantra.png is not available
            alt={`Cover image of ${book.title}`}
            fill
            className="object-contain p-2" // Added padding to contain to prevent edge touching
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <CardContent className="p-4 flex-grow flex flex-col">
          <div className="flex justify-between items-start gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate text-gray-900 dark:text-gray-100" title={book.title}>
                {book.title}
              </h3>
              <p className="text-muted-foreground text-sm truncate" title={book.author}>
                {book.author}
              </p>
            </div>
            <p className="font-bold text-lg text-primary whitespace-nowrap">Rs. {book.price}</p>
          </div>

          <div className="mt-1 mb-3 flex flex-wrap gap-1.5">
            {bookCategories.level && (
              <Badge variant="secondary" className="capitalize">
                {bookCategories.level.replace("highschool", "High School")}
              </Badge>
            )}
            {bookCategories.faculty && (
              <Badge variant="secondary" className="capitalize">
                {bookCategories.faculty.replace("-", " ")}
              </Badge>
            )}
            {bookCategories.year && <Badge variant="secondary">Year {bookCategories.year}</Badge>}
            {bookCategories.class && <Badge variant="secondary">Class {bookCategories.class}</Badge>}
          </div>

          <p className="mt-auto text-sm line-clamp-2 text-muted-foreground flex-grow-0">{book.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-2 text-xs text-muted-foreground border-t dark:border-gray-700 mt-auto">
          <div className="flex justify-between w-full">
            <span className="truncate" title={book.condition}>
              {book.condition}
            </span>
            <span className="whitespace-nowrap">
              {formatDistanceToNow(new Date(book.createdAt), { addSuffix: true })}
            </span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  )
}
