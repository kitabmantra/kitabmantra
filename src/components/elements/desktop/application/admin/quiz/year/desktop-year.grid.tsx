"use client"

import type React from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Hash, Calendar, MoreVertical, Edit, Trash2, Eye, Clock } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"

interface YearResponse {
  id: string
  levelName: string
  typeName: string
  faculty: string
  yearName: string
  createdAt: string
  updatedAt: string
}

interface YearFormValues {
  yearName: string
}

interface DesktopYearGridProps {
  years: YearResponse[]
  editingYear: YearResponse | null
  editForm: UseFormReturn<YearFormValues>
  handleEditSubmit: (values: YearFormValues) => Promise<void>
  handleUpdate: (year: YearResponse) => void
  handleDelete: (year: YearResponse) => Promise<void>
  handleVisit: (year: YearResponse) => void
  setEditingYear: (year: YearResponse | null) => void
  editFormReset: () => void
  creating: boolean
  updating: boolean
  deleting: boolean
  parentRef: React.RefObject<HTMLDivElement | null>
  isLoading?: boolean
  handleEditInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

interface DesktopYearCardProps {
  year: YearResponse
  editingYear: YearResponse | null
  editForm: UseFormReturn<YearFormValues>
  handleEditSubmit: (values: YearFormValues) => Promise<void>
  handleUpdate: (year: YearResponse) => void
  handleDelete: (year: YearResponse) => Promise<void>
  handleVisit: (year: YearResponse) => void
  setEditingYear: (year: YearResponse | null) => void
  editFormReset: () => void
  creating: boolean
  updating: boolean
  deleting: boolean
  handleEditInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

// Loading skeleton for desktop cards
function DesktopYearCardSkeleton() {
  return (
    <Card className="w-80 h-80 flex flex-col border border-gray-200 rounded-xl shadow-sm bg-white">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-7 w-7 rounded" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 flex-1">
        <Skeleton className="h-5 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
      <CardFooter className="pt-3 flex-shrink-0">
        <Skeleton className="h-6 w-16 rounded-full" />
      </CardFooter>
    </Card>
  )
}

function DesktopYearCard({
  year,
  editingYear,
  editForm,
  handleEditSubmit,
  handleUpdate,
  handleDelete,
  handleVisit,
  setEditingYear,
  editFormReset,
  creating,
  updating,
  deleting,
  handleEditInputChange,
}: DesktopYearCardProps) {
  const router = useRouter()

  return (
    <Card 
      className="w-80 h-80 flex flex-col border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-white cursor-pointer"
      onMouseEnter={() => router.prefetch(`/quiz-section/academic/level/${year.levelName}/faculty/${year.faculty}/year/${year.yearName}`)}
      onClick={(e) => {
        // Don't navigate if clicking on buttons or if editing
        if (editingYear?.id === year.id || 
            (e.target as HTMLElement).closest('button') || 
            (e.target as HTMLElement).closest('[role="menuitem"]')) {
          return;
        }
        handleVisit(year);
      }}
    >
      {/* Header */}
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                onClick={() => handleVisit(year)}
                className="cursor-pointer text-sm"
                disabled={creating || updating || deleting}
              >
                <Eye className="w-4 h-4 mr-2 text-blue-600" />
                Visit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUpdate(year)}
                className="cursor-pointer text-sm"
                disabled={creating || updating || deleting}
              >
                <Edit className="w-4 h-4 mr-2 text-green-600" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(year)}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 text-sm"
                disabled={creating || updating || deleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex flex-col gap-3 flex-1">
        {editingYear?.id === year.id ? (
          <div className="space-y-3">
            <div>
              <Input
                value={editForm.watch("yearName")}
                onChange={handleEditInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !updating) {
                    editForm.handleSubmit(handleEditSubmit)();
                  }
                }}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                placeholder="Year name (e.g., first-year)"
                disabled={updating}
                autoFocus
                ref={(el) => {
                  if (el && editingYear?.id === year.id) {
                    setTimeout(() => el.focus(), 100)
                  }
                }}
              />
              {editForm.watch("yearName") && (
                <p className="text-xs text-gray-500 mt-1">
                  Formatted: <span className="font-mono text-blue-600">{editForm.watch("yearName")}</span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => editForm.handleSubmit(handleEditSubmit)()}
                disabled={updating}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {updating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingYear(null);
                  editFormReset();
                }}
                disabled={updating}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 flex-1">
            <CardTitle className="text-base font-semibold text-gray-900 capitalize line-clamp-2">
              {year.yearName.replace(/-/g, " ").toUpperCase()}
            </CardTitle>

            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-800">
                  {year.yearName.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
                <Hash className="w-4 h-4 text-gray-400" />
                {year.id.slice(0, 8)}...
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4 text-gray-400" />
                {new Date(year.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="pt-3 flex-shrink-0">
        <span
          className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
            year.typeName === "academic"
              ? "bg-green-50 text-green-700"
              : "bg-purple-50 text-purple-700"
          }`}
        >
          {year.typeName}
        </span>
      </CardFooter>
    </Card>
  )
}

export function DesktopYearGrid({
  years,
  editingYear,
  editForm,
  handleEditSubmit,
  handleUpdate,
  handleDelete,
  handleVisit,
  setEditingYear,
  editFormReset,
  creating,
  updating,
  deleting,
  parentRef,
  isLoading = false,
  handleEditInputChange,
}: DesktopYearGridProps) {
  const getItemsPerRow = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth
      if (width >= 1024) return 4 // lg and above - 4 cards
      if (width >= 768) return 3 // md - 3 cards
      return 1 // mobile/tablet
    }
    return 3 // default
  }

  const itemsPerRow = getItemsPerRow()
  const rowCount = Math.ceil(years.length / itemsPerRow)

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 350, // Increased height for bigger cards
    overscan: 2,
  })

  // Show loading skeletons if loading
  if (isLoading) {
    return (
      <div className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <DesktopYearCardSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: "relative" }}>
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const startIndex = virtualRow.index * itemsPerRow
        const endIndex = Math.min(startIndex + itemsPerRow, years.length)
        const rowYears = years.slice(startIndex, endIndex)

        return (
          <div
            key={virtualRow.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
            className="px-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {rowYears.map((year) => (
                <DesktopYearCard
                  key={year.id}
                  year={year}
                  editingYear={editingYear}
                  editForm={editForm}
                  handleEditSubmit={handleEditSubmit}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                  handleVisit={handleVisit}
                  setEditingYear={setEditingYear}
                  editFormReset={editFormReset}
                  creating={creating}
                  updating={updating}
                  deleting={deleting}
                  handleEditInputChange={handleEditInputChange}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
} 