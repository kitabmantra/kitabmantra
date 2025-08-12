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
import { Hash, Calendar, MoreVertical, Edit, Trash2, Eye, Building2 } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { Skeleton } from "@/components/ui/skeleton"

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

interface MobileFacultyListProps {
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

interface MobileFacultyItemProps {
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

// Loading skeleton for mobile list items
function MobileFacultyItemSkeleton() {
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

function MobileFacultyItem({
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
}: MobileFacultyItemProps) {
 

  return (
    <div 
      className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors border border-gray-200 rounded-lg group mx-4 mb-4 cursor-pointer"
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
      {editingFaculty?.id === faculty.id ? (
        <div className="flex-1 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <Input
                value={editForm.watch("faculty")}
                onChange={handleEditInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !updating) {
                    editForm.handleSubmit(handleEditSubmit)()
                  }
                }}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                placeholder="Faculty code (e.g., computer-information-systems)"
                disabled={updating}
                autoFocus
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
                  setEditingFaculty(null)
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
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {faculty.faculty.replace(/-/g, " ").toUpperCase()}
                </h3>
                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex-shrink-0">
                  {faculty.faculty.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  <span className="font-mono">{faculty.id.slice(0, 8)}...</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(faculty.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    faculty.type === "academic" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {faculty.type}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVisit(faculty)}
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
        </>
      )}
    </div>
  )
}

export function MobileFacultyList({
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
}: MobileFacultyListProps) {
    const rowVirtualizer = useVirtualizer({
        count: faculties.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 120, // Increased height for better spacing
        overscan: 5,
        gap: 16, // Added gap between items
      })
  // Show loading skeletons if loading
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <MobileFacultyItemSkeleton key={index} />
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
        const faculty = faculties[virtualRow.index]

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
            <MobileFacultyItem
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
          </div>
        )
      })}
    </div>
  )
}
