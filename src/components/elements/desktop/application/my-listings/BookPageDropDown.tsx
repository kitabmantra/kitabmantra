"use client"
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { MoreVertical, Pen, Trash2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Book as bookType } from "@/lib/types/books";

interface BookPageDropDownProps {
  book: bookType;
  onStatusChange: () => void;
  onDeleteClick: () => void;
}

function BookPageDropDownPage({ book, onStatusChange, onDeleteClick }: BookPageDropDownProps) {
  const router = useRouter();

  return (
    <div className=" ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-pointer rounded-full bg-gray-200 hover:bg-gray-300 border-1 border-black/20  "
          >
            <MoreVertical className="h-4 w-4 text-slate-600" />
            <span className="sr-only">Book options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            className="text-slate-600 hover:!bg-slate-50"
            onSelect={(e) => {
              e.preventDefault();
              router.push(`/dashboard/my-listings/${book.bookId}/edit-book`);
            }}
          >
            <Pen className="mr-2 h-4 w-4" />
            <span>Edit Book</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-slate-600 hover:!bg-slate-50"
            onSelect={(e) => {
              e.preventDefault();
              onStatusChange();
            }}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            <span>Change Status</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-red-600 hover:!text-red-600 hover:!bg-red-50 focus:!text-red-600 focus:!bg-red-50"
            onSelect={(e) => {
              e.preventDefault();
              onDeleteClick();
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete Book</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default BookPageDropDownPage
