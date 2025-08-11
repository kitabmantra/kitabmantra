"use client"

import type React from "react"
import { useState, useMemo, useCallback, useRef } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useGetLevelFaculty } from "@/lib/hooks/tanstack-query/query-hook/quiz/academic/faculty/use-get-level-faculty"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Plus,
  Calendar,
  Hash,
  Search,
  BookOpen,
  TrendingUp,
  AlertCircle,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  X,
  RefreshCw,
  ArrowLeft,
  Building2,
} from "lucide-react"
import { toast } from "react-hot-toast"
import {
  createNewFaculty,
  type CreateNewFacultyProps,
} from "@/lib/actions/quiz/academic/faculty/post/create-new-faculty"
import { useQueryClient } from "@tanstack/react-query"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteFaculty } from "@/lib/actions/quiz/academic/faculty/delete/delete-faculty"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { updateFaculty, type UpdateFacultyProps } from "@/lib/actions/quiz/academic/faculty/put/update-faculty"
import { useLevelName } from "@/lib/hooks/params/useLevelName"

// Skeleton Components
function FacultySkeleton() {
  return (
    <Card className="h-full border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-5 w-32 mb-3" />
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3">
        <Skeleton className="h-6 w-16 rounded-full" />
      </CardFooter>
    </Card>
  )
}

function FacultyListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <FacultySkeleton key={index} />
      ))}
    </div>
  )
}

// Enhanced validation schema
const facultySchema = z.object({
  faculty: z
    .string()
    .min(2, "Faculty name must be at least 2 characters")
    .max(50, "Faculty name must be less than 50 characters")
    .regex(/^[a-zA-Z0-9\-_\s]+$/, "Only letters, numbers, hyphens, underscores, and spaces are allowed")
    .transform((val) => {
      // Trim spaces from front and back
      const trimmed = val.trim()
      // Convert to lowercase and replace spaces with hyphens
      const formatted = trimmed
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9\-_]/g, "")
      // Remove hyphens from start and end
      return formatted.replace(/^-+|-+$/g, "")
    })
    .refine((val) => val.length >= 2, "Faculty name must be at least 2 characters after formatting")
    .refine((val) => !val.startsWith("-") && !val.endsWith("-"), "Faculty name cannot start or end with hyphens"),
})

type FacultyFormValues = z.infer<typeof facultySchema>

interface FacultyResponse {
  id: string
  levelName: string
  type: string
  faculty: string
  createdAt: string
  updatedAt: string
}

function LevelNamePage() {
  const levelName = useLevelName()
  const { data: levelFaculty, isLoading, error } = useGetLevelFaculty("academic", levelName)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingFaculty, setEditingFaculty] = useState<FacultyResponse | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  // Virtualizer setup
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil((levelFaculty?.faculties?.length || 0) / 4), // Calculate rows based on 4 columns
    getScrollElement: () => parentRef.current,
    estimateSize: () => 280, // Increased estimated height for proper card sizing
    overscan: 2,
  })

  const faculties = useMemo(() => {
    const allFaculties = levelFaculty?.faculties || []
    if (!searchTerm) return allFaculties
    return allFaculties.filter((faculty: FacultyResponse) =>
      faculty.faculty.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [levelFaculty, searchTerm])

  const form = useForm<FacultyFormValues>({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      faculty: "",
    },
  })

  const editForm = useForm<FacultyFormValues>({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      faculty: "",
    },
  })

  const onSubmit = useCallback(
    async (values: FacultyFormValues) => {
      if (creating) return
      setCreating(true)
      try {
        const formData: CreateNewFacultyProps = {
          levelName: levelName,
          type: "academic" as const,
          faculty: values.faculty,
        }
        const res = await createNewFaculty(formData)
        if (res.success) {
          toast.success("Faculty created successfully!")
          form.reset()
          setShowCreateForm(false)
          queryClient.invalidateQueries({ queryKey: ["get-level-faculty"] })
        } else {
          toast.error(res.error || "Failed to create faculty. Please try again.")
        }
      } catch (error) {
        toast.error((error as string) || "An error occurred while creating the faculty")
      } finally {
        setCreating(false)
      }
    },
    [creating, form, queryClient, levelName],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      form.setValue("faculty", value)
    },
    [form],
  )

  const getFormattedPreview = useCallback((value: string) => {
    // Trim spaces from front and back
    const trimmed = value.trim()
    // Convert to lowercase and replace spaces with hyphens
    const formatted = trimmed
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\-_]/g, "")
    // Remove hyphens from start and end
    return formatted.replace(/^-+|-+$/g, "")
  }, [])

  const stats = useMemo(() => {
    const total = faculties.length
    const academic = faculties.filter((f: FacultyResponse) => f.type === "academic").length
    const entrance = faculties.filter((f: FacultyResponse) => f.type === "entrance").length
    return { total, academic, entrance }
  }, [faculties])

  // Action handlers
  const handleDelete = useCallback(
    async (faculty: FacultyResponse) => {
      try {
        setDeleting(true)
        const res = await deleteFaculty(faculty.id)
        if (res.success) {
          toast.success(`"${faculty.faculty}" deleted successfully`)
          queryClient.invalidateQueries({ queryKey: ["get-level-faculty"] })
        } else {
          toast.error(res.error || "Failed to delete faculty")
        }
      } catch (error) {
        toast.error("Failed to delete faculty")
        console.error("Error deleting faculty:", error)
      } finally {
        setDeleting(false)
      }
    },
    [queryClient],
  )

  const handleUpdate = useCallback(
    (faculty: FacultyResponse) => {
      setEditingFaculty(faculty)
      editForm.reset({ faculty: faculty.faculty })
    },
    [editForm],
  )

  const handleEditSubmit = useCallback(
    async (values: FacultyFormValues) => {
      if (!editingFaculty) return

      if (values.faculty.toLowerCase().replace(/\s+/g, "-") === editingFaculty.faculty) {
        toast.error("Please make some changes to the faculty name before updating")
        return
      }

      try {
        setUpdating(true)
        const updateData: UpdateFacultyProps = {
          id: editingFaculty.id,
          faculty: values.faculty,
        }
        const res = await updateFaculty(updateData)
        if (res.success) {
          toast.success(`"${editingFaculty.faculty}" updated successfully`)
          queryClient.invalidateQueries({ queryKey: ["get-level-faculty"] })
          setEditingFaculty(null)
          editForm.reset()
        } else {
          toast.error(res.error || "Failed to update faculty")
        }
      } catch (error) {
        toast.error((error as string) || "An error occurred while updating the faculty")
      } finally {
        setUpdating(false)
      }
    },
    [editingFaculty, editForm, queryClient],
  )

  const handleVisit = useCallback(
    (faculty: FacultyResponse) => {
      router.push(`/quiz-section/academic/level/${levelName}/faculty/${faculty.faculty}`)
    },
    [router, levelName],
  )

  const clearSearch = useCallback(() => {
    setSearchTerm("")
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Faculties</h3>
          <p className="text-gray-600 mb-4">Failed to load faculty data</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header Section */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2 hover:bg-gray-100">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Faculty Management</h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Academic &gt; {levelName.replace(/-/g, " ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards - Mobile Responsive */}
            <div className="flex gap-2 sm:gap-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-2 sm:px-3 py-2 min-w-[80px] sm:min-w-[100px]">
                <div className="flex items-center gap-1 sm:gap-2">
                  <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-blue-900">Total</p>
                    <p className="text-lg sm:text-xl font-bold text-blue-600">{stats.total}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg px-2 sm:px-3 py-2 min-w-[80px] sm:min-w-[100px]">
                <div className="flex items-center gap-1 sm:gap-2">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-green-900">Academic</p>
                    <p className="text-lg sm:text-xl font-bold text-green-600">{stats.academic}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Controls Section */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search academic levels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  disabled={creating || updating || deleting}
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => window.location.reload()} variant="outline" size="sm" disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md h-9 text-sm sm:text-base"
                disabled={creating || updating || deleting}
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{showCreateForm ? "Cancel" : "Create New Level"}</span>
                <span className="sm:hidden">{showCreateForm ? "Cancel" : "Create"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Create Form Card */}
      {showCreateForm && (
        <div className="bg-white border-b border-gray-200 flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Plus className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">Create New Academic Level</h3>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="faculty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Level Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Bachelor of Science, Master Degree"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                            {...field}
                            onChange={(e) => {
                              handleInputChange(e)
                              field.onChange(e)
                            }}
                            disabled={creating || updating || deleting}
                          />
                        </FormControl>
                        <FormMessage />

                        {field.value && (
                          <div className="mt-2 p-2 bg-blue-100 border border-blue-300 rounded-lg">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-blue-700 font-medium">Preview:</span>
                              <code className="bg-blue-200 text-blue-800 px-2 py-1 rounded font-mono text-xs">
                                {getFormattedPreview(field.value)}
                              </code>
                            </div>
                          </div>
                        )}

                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-amber-800">
                              <p className="font-medium mb-1">Formatting Rules:</p>
                              <ul className="space-y-1 text-xs">
                                <li>{"• Spaces will be replaced with hyphens (-)"}</li>
                                <li>• Text will be converted to lowercase</li>
                                <li>• Only letters, numbers, hyphens, and underscores allowed</li>
                                <li>• Maximum 50 characters</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCreateForm(false)
                        form.reset()
                      }}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={creating || updating || deleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={creating || updating || deleting}
                      className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px] transition-colors"
                    >
                      {creating ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating...
                        </div>
                      ) : (
                        "Create Level"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area - Takes remaining height with no scrolling */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          {/* Make the card container take full height and prevent overflow */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
            {/* Fixed Faculties Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Faculties</h2>
                <span className="bg-gray-100 text-gray-600 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  {faculties.length} {faculties.length === 1 ? "faculty" : "faculties"}
                </span>
              </div>
            </div>

            {/* Scrollable Faculties List with Virtualization */}
            {isLoading ? (
              <div className="p-4 sm:p-6">
                <FacultyListSkeleton />
              </div>
            ) : faculties.length > 0 ? (
              <div
                ref={parentRef}
                className="overflow-y-auto overflow-x-hidden p-4 sm:p-6 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full"
                style={{ height: "600px" }}
              >
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const startIndex = virtualRow.index * 4
                    const endIndex = Math.min(startIndex + 4, faculties.length)
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
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 h-full">
                          {rowFaculties.map((faculty: FacultyResponse) => (
                            <Card
                              key={faculty.id}
                              className="h-full hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] cursor-pointer border-gray-200 flex flex-col"
                            >
                              <CardHeader className="pb-3 flex-shrink-0">
                                <div className="flex items-center justify-between">
                                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Building2 className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
                                      >
                                        <MoreVertical className="w-4 h-4 text-gray-500" />
                                        <span className="sr-only">Open menu</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-36 sm:w-40">
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

                              <CardContent className="flex-1 flex flex-col">
                                {editingFaculty?.id === faculty.id ? (
                                  <div className="space-y-3 flex-1">
                                    <Input
                                      value={editForm.watch("faculty")}
                                      onChange={(e) => editForm.setValue("faculty", e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" && !updating) {
                                          editForm.handleSubmit(handleEditSubmit)()
                                        }
                                      }}
                                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                      placeholder="Enter faculty name"
                                      disabled={updating}
                                      autoFocus
                                    />
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
                                          editForm.reset()
                                        }}
                                        disabled={updating}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex-1 flex flex-col">
                                    <CardTitle className="text-lg font-semibold text-gray-900 capitalize mb-3 line-clamp-2">
                                      {faculty.faculty.replace(/-/g, " ")}
                                    </CardTitle>

                                    <div className="space-y-3 flex-1">
                                      <div className="flex items-center gap-2">
                                        <Hash className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600 font-mono">
                                          {faculty.id.slice(0, 8)}...
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                          {new Date(faculty.createdAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                          })}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </CardContent>

                              <CardFooter className="pt-3 flex-shrink-0">
                                <span
                                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                    faculty.type === "academic"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-purple-100 text-purple-800"
                                  }`}
                                >
                                  {faculty.type}
                                </span>
                              </CardFooter>
                            </Card>
                          ))}
                          {Array.from({ length: 4 - rowFaculties.length }).map((_, index) => (
                            <div key={`placeholder-${startIndex}-${index}`} className="invisible" />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[300px] p-4 sm:p-6">
                <div className="text-center max-w-sm">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                    {searchTerm ? "No matching faculties found" : "No faculties yet"}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    {searchTerm
                      ? `No faculties match "${searchTerm}". Try adjusting your search.`
                      : "Create your first faculty to get started."}
                  </p>
                  {searchTerm && (
                    <Button
                      onClick={clearSearch}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors bg-transparent"
                      size="sm"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LevelNamePage
