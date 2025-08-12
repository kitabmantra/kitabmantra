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
import { Hash, Calendar, MoreVertical, Edit, Trash2, Eye, Building2 } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
interface FacultyResponse {
  id: string
  levelName: string
  type: string
  faculty: string
  displayName?: string
  createdAt: string
  updatedAt: string
}

interface FacultyFormValues {
  faculty: string
}

interface DesktopFacultyGridProps {
  faculties: FacultyResponse[]
  editingFaculty: FacultyResponse | null
  editForm: UseFormReturn<FacultyFormValues>
  handleEditSubmit: (values: FacultyFormValues) => Promise<void>
  handleUpdate: (faculty: FacultyResponse) => void
  handleDelete: (faculty: FacultyResponse) => Promise<void>
  handleVisit: (faculty: FacultyResponse) => void
  setEditingFaculty: (faculty: FacultyResponse | null) => void
  editFormReset: () => void
  creating: boolean
  updating: boolean
  deleting: boolean
  parentRef: React.RefObject<HTMLDivElement | null>
  isLoading?: boolean
  handleEditInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

interface DesktopFacultyCardProps {
  faculty: FacultyResponse
  editingFaculty: FacultyResponse | null
  editForm: UseFormReturn<FacultyFormValues>
  handleEditSubmit: (values: FacultyFormValues) => Promise<void>
  handleUpdate: (faculty: FacultyResponse) => void
  handleDelete: (faculty: FacultyResponse) => Promise<void>
  handleVisit: (faculty: FacultyResponse) => void
  setEditingFaculty: (faculty: FacultyResponse | null) => void
  editFormReset: () => void
  creating: boolean
  updating: boolean
  deleting: boolean
  handleEditInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

// Loading skeleton for desktop cards
function DesktopFacultyCardSkeleton() {
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

function DesktopFacultyCard({
  faculty,
  editingFaculty,
  editForm,
  handleEditSubmit,
  handleUpdate,
  handleDelete,
  handleVisit,
  setEditingFaculty,
  editFormReset,
  creating,
  updating,
  deleting,
  handleEditInputChange,
}: DesktopFacultyCardProps) {
  const router = useRouter()

  return (
    <Card 
      className="w-80 h-80 flex flex-col border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-white cursor-pointer"
      onMouseEnter={()=>router.prefetch(`/quiz-section/academic/level/${faculty.levelName}/faculty/${faculty.faculty}`)}
      onClick={(e) => {
        // Don't navigate if clicking on buttons or if editing
        if (editingFaculty?.id === faculty.id || 
            (e.target as HTMLElement).closest('button') || 
            (e.target as HTMLElement).closest('[role="menuitem"]')) {
          return;
        }
        handleVisit(faculty);
      }}
    >
      {/* Header */}
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" />
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
                onClick={() => handleVisit(faculty)}
                className="cursor-pointer text-sm"
                disabled={creating || updating || deleting}
              >
                <Eye className="w-4 h-4 mr-2 text-blue-600" />
                Visit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUpdate(faculty)}
                className="cursor-pointer text-sm"
                disabled={creating || updating || deleting}
              >
                <Edit className="w-4 h-4 mr-2 text-green-600" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(faculty)}
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
        {editingFaculty?.id === faculty.id ? (
          <div className="space-y-3">
            <div>
              <Input
                value={editForm.watch("faculty")}
                onChange={handleEditInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !updating) {
                    editForm.handleSubmit(handleEditSubmit)();
                  }
                }}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                placeholder="Faculty code (e.g., computer-information-systems)"
                disabled={updating}
                autoFocus
                ref={(el) => {
                  if (el && editingFaculty?.id === faculty.id) {
                    setTimeout(() => el.focus(), 100)
                  }
                }}
              />
              {editForm.watch("faculty") && (
                <p className="text-xs text-gray-500 mt-1">
                  Formatted: <span className="font-mono text-blue-600">{editForm.watch("faculty")}</span>
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
                  setEditingFaculty(null);
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
              {faculty.faculty.replace(/-/g, " ").toUpperCase()}
            </CardTitle>

            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-800">
                  {faculty.faculty.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
                <Hash className="w-4 h-4 text-gray-400" />
                {faculty.id.slice(0, 8)}...
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4 text-gray-400" />
                {new Date(faculty.createdAt).toLocaleDateString("en-US", {
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
            faculty.type === "academic"
              ? "bg-green-50 text-green-700"
              : "bg-purple-50 text-purple-700"
          }`}
        >
          {faculty.type}
        </span>
      </CardFooter>
    </Card>
  )
}

export function DesktopFacultyGrid({
  faculties,
  editingFaculty,
  editForm,
  handleEditSubmit,
  handleUpdate,
  handleDelete,
  handleVisit,
  setEditingFaculty,
  editFormReset,
  creating,
  updating,
  deleting,
  parentRef,
  isLoading = false,
  handleEditInputChange,
}: DesktopFacultyGridProps) {
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
  const rowCount = Math.ceil(faculties.length / itemsPerRow)

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
            <DesktopFacultyCardSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: "relative" }}>
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const startIndex = virtualRow.index * itemsPerRow
        const endIndex = Math.min(startIndex + itemsPerRow, faculties.length)
        const rowFaculties = faculties.slice(startIndex, endIndex)

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
              {rowFaculties.map((faculty) => (
                <DesktopFacultyCard
                  key={faculty.id}
                  faculty={faculty}
                  editingFaculty={editingFaculty}
                  editForm={editForm}
                  handleEditSubmit={handleEditSubmit}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                  handleVisit={handleVisit}
                  setEditingFaculty={setEditingFaculty}
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
