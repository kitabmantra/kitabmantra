"use client"

import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { MoreVertical, Pen, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BookForStore } from "@/lib/types/books"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { DialogTitle } from "@radix-ui/react-dialog"

interface BookCardProps {
  book: BookForStore
  success: boolean
  handleDelete: (id: string) => void
}

export function BookCard({ book, success, handleDelete }: BookCardProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  if (!success) {
    toast.error("There was an issue loading book details.")
  }

  const bookCategories = book.category
  const images = book.imageUrl || [];

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

  const onOpenChange = (open: boolean) => {
    if (open && !success) {
    }
  }

  return (
    <Card className="w-[280px] h-[300px] flex flex-col overflow-hidden transition-shadow duration-200 ease-in-out hover:shadow-xl border-[#1E3A8A] relative group">
      <div className="absolute top-2 right-2 z-20">
        <AlertDialog>
          <DropdownMenu onOpenChange={onOpenChange}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full bg-white/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4 text-[#4B5563]" />
                <span className="sr-only">Book options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-red-600 hover:!text-red-600 hover:!bg-red-50 focus:!text-red-600 focus:!bg-red-50"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  <span className="text-xs">Delete</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <DropdownMenuItem
                className="text-[#4B5563] hover:!bg-[#F9FAFB]"
                onSelect={(e) => {
                  e.preventDefault();
                  router.push(`/dashboard/my-listings/${book._id}/edit-book`)
                }}
              >
                <Pen className="mr-2 h-3.5 w-3.5" />
                <span className="text-xs">Edit</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-base">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-xs">
                This action cannot be undone. This will permanently delete the book listing for &quot;{book.title}&quot;.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="text-xs h-8">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete(book._id)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs h-8"
              >
                Yes, delete book
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex flex-col flex-grow h-full">
        <Badge
          variant="secondary"
          className={cn(
            "text-[0.65rem] absolute top-2 left-2 z-10 py-0.5 px-1.5 border",
            book.type === "Free" && "bg-green-100 text-green-800 border-green-600",
            book.type === "Sell" && "bg-amber-100 text-amber-800 border-amber-600",
            book.type === "Exchange" && "bg-blue-100 text-blue-800 border-blue-600",
            !["Free", "Sell", "Exchange"].includes(book.type) && "bg-gray-100 text-gray-800 border-gray-600"
          )}
        >
          {book.type}
        </Badge>

        <Dialog>
          <DialogTrigger asChild>
            <div className="relative h-48 w-full bg-[#F9FAFB] overflow-hidden cursor-pointer">
              <Image
                src={images[currentImageIndex] || "/kitabmantra.png"}
                alt={`Cover image of ${book.title}`}
                fill
                className="object-cover w-full h-full"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                priority
              />
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
          <DialogTitle>Images</DialogTitle>
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={images[currentImageIndex] || "/kitabmantra.png"}
                alt={`Cover image of ${book.title}`}
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
        <Link href={`/dashboard/my-listings/${book._id}`}>
          <CardContent className="p-3 flex-grow flex flex-col">
            <div className="flex justify-between items-start gap-1 mb-1 relative">
             
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate text-[#1E3A8A]" title={book.title}>
                  {book.title}
                </h3>
                <p className="text-[#4B5563] text-xs truncate" title={book.author}>
                  {book.author}
                </p>
              </div>
              <p className="font-semibold text-sm text-[#0D9488] whitespace-nowrap">Rs. {book.price}</p>
            </div>

            <div className="mt-1 mb-2 flex flex-wrap gap-1">
              {bookCategories.level && (
                <Badge variant="secondary" className="capitalize text-[0.65rem] py-0.5 px-1.5 bg-[#F9FAFB] text-[#4B5563] border-[#1E3A8A]">
                  {bookCategories.level.replace("highschool", "High School")}
                </Badge>
              )}
              {bookCategories.faculty && (
                <Badge variant="secondary" className="capitalize text-[0.65rem] py-0.5 px-1.5 bg-[#F9FAFB] text-[#4B5563] border-[#1E3A8A]">
                  {bookCategories.faculty.replace("-", " ")}
                </Badge>
              )}
              {bookCategories.year && (
                <Badge variant="secondary" className="text-[0.65rem] py-0.5 px-1.5 bg-[#F9FAFB] text-[#4B5563] border-[#1E3A8A]">
                  Year {bookCategories.year}
                </Badge>
              )}
              {bookCategories.class && (
                <Badge variant="secondary" className="text-[0.65rem] py-0.5 px-1.5 bg-[#F9FAFB] text-[#4B5563] border-[#1E3A8A]">
                  Class {bookCategories.class}
                </Badge>
              )}

              
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
              <span className="capitalize ">
                {book.bookStatus}
              </span>
              <span className="whitespace-nowrap">
                {formatDistanceToNow(new Date(book.createdAt), { addSuffix: true })}
              </span>
            </div>
          </CardFooter>
        </Link>
      </div>
    </Card>
  )
}