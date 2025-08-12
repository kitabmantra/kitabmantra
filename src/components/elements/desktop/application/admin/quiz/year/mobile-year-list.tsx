"use client"

import type React from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

interface MobileYearListProps {
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

interface MobileYearItemProps {
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

// Loading skeleton for mobile list items
function MobileYearItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg mx-4 mb-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  )
}

function MobileYearItem({
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
}: MobileYearItemProps) {
  return (
    <div 
      className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors border border-gray-200 rounded-lg group mx-4 mb-4 cursor-pointer"
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
      {editingYear?.id === year.id ? (
        <div className="flex-1 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <Input
                value={editForm.watch("yearName")}
                onChange={handleEditInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !updating) {
                    editForm.handleSubmit(handleEditSubmit)()
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
                  setEditingYear(null)
                  editFormReset()
                }}
                disabled={updating}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {year.yearName.replace(/-/g, " ").toUpperCase()}
                </h3>
                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex-shrink-0">
                  {year.yearName.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  <span className="font-mono">{year.id.slice(0, 8)}...</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(year.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    year.typeName === "academic" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {year.typeName}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVisit(year)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              disabled={creating || updating || deleting}
            >
              <Eye className="w-4 h-4 mr-1" />
              Visit
            </Button>
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
        </>
      )}
    </div>
  )
}

export function MobileYearList({
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
}: MobileYearListProps) {
  // Show loading skeletons if loading

  const rowVirtualizer = useVirtualizer({
    count: years.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Increased height for better spacing
    overscan: 5,
    gap: 16, // Added gap between items
  })
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <MobileYearItemSkeleton key={index} />
        ))}
      </div>
    )
  }


  return (
    <div
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
        width: "100%",
        position: "relative",
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const year = years[virtualRow.index]

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
          >
            <MobileYearItem
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
          </div>
        )
      })}
    </div>
  )
} 