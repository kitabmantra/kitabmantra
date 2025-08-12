"use client"

import type React from "react"
import { useState, useMemo, useCallback, useRef} from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useGetLevelFaculty } from "@/lib/hooks/tanstack-query/query-hook/quiz/academic/faculty/use-get-level-faculty"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, BookOpen, TrendingUp, AlertCircle, X, RefreshCw, ArrowLeft, Building2, Filter } from "lucide-react"
import { toast } from "react-hot-toast"
import {
  createNewFaculty,
  type CreateNewFacultyProps,
} from "@/lib/actions/quiz/academic/faculty/post/create-new-faculty"
import { useQueryClient } from "@tanstack/react-query"
import { deleteFaculty } from "@/lib/actions/quiz/academic/faculty/delete/delete-faculty"
import { useLevelName } from "@/lib/hooks/params/useLevelName"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { updateFaculty, type UpdateFacultyProps } from "@/lib/actions/quiz/academic/faculty/put/update-faculty"
import { DesktopFacultyGrid } from "@/components/elements/desktop/application/admin/quiz/faculty/desktop-faculty.grid"
import { MobileFacultyList } from "@/components/elements/desktop/application/admin/quiz/faculty/mobile-faculty-list"

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
        .replace(/\s+/g, "-") // Replace one or more spaces with single hyphen
        .replace(/[^a-z0-9\-_]/g, "") // Allow only a-z, 0-9, -, _
      // Remove hyphens and underscores from start and end
      return formatted.replace(/^[-_]+|[-_]+$/g, "")
    })
    .refine((val) => val.length >= 2, "Faculty name must be at least 2 characters after formatting")
    .refine(
      (val) => !val.startsWith("-") && !val.startsWith("_") && !val.endsWith("-") && !val.endsWith("_"),
      "Faculty name cannot start or end with hyphens or underscores"
    ),
})

type FacultyFormValues = z.infer<typeof facultySchema>

interface FacultyResponse {
  id: string
  levelName: string
  type: string
  faculty: string
  displayName?: string
  createdAt: string
  updatedAt: string
}

type SortOption = "name-asc" | "name-desc" | "created-asc" | "created-desc"

function LevelNamePage() {
  const levelName = useLevelName()
  const { data: levelFaculty,error, isLoading,  refetch } = useGetLevelFaculty("academic", levelName)
  


  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("name-asc")
  const [editingFaculty, setEditingFaculty] = useState<FacultyResponse | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()
  const parentRef = useRef<HTMLDivElement>(null)

  const faculties = useMemo(() => {
    // Check if levelFaculty exists and has success: true
    if (!levelFaculty || levelFaculty.success !== true) {
      return [];
    }

    // Ensure we have a valid array of faculties
    const allFaculties = Array.isArray(levelFaculty.faculties) ? levelFaculty.faculties : [];
    console.log("Processing faculties:", allFaculties);
    console.log("Search term:", searchTerm);
    console.log("Sort by:", sortBy);
    
    // First filter by search term
    let filtered = allFaculties;
    if (searchTerm.trim()) {
      filtered = allFaculties.filter((faculty: FacultyResponse) => {
        const facultyName = faculty.faculty.toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        return facultyName.includes(searchLower);
      });
    }
    
    // Then sort the filtered results
    const sorted = [...filtered].sort((a: FacultyResponse, b: FacultyResponse) => {
      switch (sortBy) {
        case "name-asc":
          return a.faculty.localeCompare(b.faculty);
        case "name-desc":
          return b.faculty.localeCompare(a.faculty);
        case "created-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "created-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
    
    console.log("Filtered and sorted faculties:", sorted);
    return sorted;
  }, [levelFaculty, searchTerm, sortBy])

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
          // Invalidate with the correct query key
          queryClient.invalidateQueries({ queryKey: ["get-level-faculty", "academic", levelName] })
        } else {
          toast.error(res.error || "Failed to create faculty. Please try again.")
        }
      } catch (error) {
        toast.error((error as string) || "An error occurred while creating the faculty")
      } finally {
        setCreating(false)
      }
    },
    [creating, form, queryClient, levelName]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      // Apply real-time formatting while typing
      const formattedValue = value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\-_]/g, "")
      form.setValue("faculty", formattedValue)
    },
    [form]
  )

  const handleEditInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      // Apply real-time formatting while typing
      const formattedValue = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-_]/g, "")
        .replace(/^[-_]+|[-_]+$/g, "") // Remove -/_ from start/end
      editForm.setValue("faculty", formattedValue)
    },
    [editForm]
  )

  const stats = useMemo(() => {
    const total = faculties.length
    // Since all faculties are academic, we don't need to filter by type
    return { total, academic: total, entrance: 0 }
  }, [faculties])

  // Action handlers
  const handleDelete = useCallback(
    async (faculty: FacultyResponse) => {
      try {
        setDeleting(true)
        const res = await deleteFaculty(faculty.id)
        if (res.success) {
          toast.success(`"${faculty.faculty}" deleted successfully`)
          // Invalidate with the correct query key
          queryClient.invalidateQueries({ queryKey: ["get-level-faculty", "academic", levelName] })
        } else {
          toast.error(res.error || "Failed to delete faculty")
        }
      } catch (error) {
        toast.error(error as string || "Failed to delete faculty")
      } finally {
        setDeleting(false)
      }
    },
    [queryClient, levelName]
  )

  const handleUpdate = useCallback(
    (faculty: FacultyResponse) => {
      setEditingFaculty(faculty)
      editForm.reset({ faculty: faculty.faculty })
    },
    [editForm]
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
          oldName: editingFaculty.faculty,
        }
        const res = await updateFaculty(updateData)
        if (res.success) {
          toast.success(`"${editingFaculty.faculty}" updated successfully`)
          // Invalidate with the correct query key
          queryClient.invalidateQueries({ queryKey: ["get-level-faculty", "academic", levelName] })
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
    [editingFaculty, editForm, queryClient, levelName]
  )

  const handleVisit = useCallback(
    (faculty: FacultyResponse) => {
      router.push(`/quiz-section/academic/level/${levelName}/faculty/${faculty.faculty}`)
    },
    [router, levelName]
  )

  const clearSearch = useCallback(() => {
    setSearchTerm("")
  }, [])

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Handle API error (network error, etc.)
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Faculties</h3>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : "Failed to load faculty data"}
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Handle backend error (success: false)
  if (levelFaculty && levelFaculty.success === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Faculties</h3>
          <p className="text-gray-600 mb-4">
            {levelFaculty.error || "Failed to load faculty data from server"}
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header Section */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
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
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search faculties..."
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
              {/* Sort Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="w-40 h-9">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                    <SelectItem value="name-desc">Name Z-A</SelectItem>
                    <SelectItem value="created-asc">Oldest First</SelectItem>
                    <SelectItem value="created-desc">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md h-9 text-sm sm:text-base"
                disabled={creating || updating || deleting || (isLoading && !levelFaculty)}
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Create New Faculty</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Create Form Card */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle >Create New Faculty</DialogTitle>
            <DialogDescription>
              Add a new academic faculty to the level. Examples: Computer Information Systems (CIS), Bachelor of
              Computer Science (BCS), Information Technology (IT)
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="faculty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Faculty Code/Abbreviation</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., computer-information-systems, bachelor-of-computer-science"
                        value={field.value}
                        onChange={handleInputChange}
                        disabled={creating}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                        autoFocus
                        ref={(el) => {
                          if (el && showCreateForm) {
                            setTimeout(() => el.focus(), 100)
                          }
                        }}
                      />
                    </FormControl>
                    {field.value && (
                      <p className="text-xs text-gray-500 mt-1">
                        Formatted: <span className="font-mono text-blue-600">{field.value}</span>
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false)
                    form.reset()
                  }}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={creating} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {creating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : null}
                  {creating ? "Creating..." : "Create Faculty"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto h-full">
          {isLoading ? (
            // Loading state - show simple skeletons without virtualizer
            <div className="h-full overflow-y-auto" style={{ height: "calc(100vh - 200px)" }}>
              <div className="lg:hidden py-4">
                <div className="space-y-4">
                  {Array.from({ length: 4}).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg mx-4"
                    >
                      <div className="flex items-center gap-4">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-48" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden lg:block py-4">
                <div className="px-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="w-80 h-96 flex flex-col border border-gray-200 rounded-xl shadow-sm bg-white"
                      >
                        <div className="p-4 pb-2 flex-shrink-0">
                          <div className="flex items-center justify-between">
                            <Skeleton className="w-8 h-8 rounded-lg" />
                            <Skeleton className="h-7 w-7 rounded" />
                          </div>
                        </div>
                        <div className="p-4 flex flex-col gap-3 flex-1">
                          <Skeleton className="h-5 w-3/4" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                        <div className="p-4 pt-2 flex-shrink-0">
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : faculties.length > 0 ? (
            // Data available - show faculties
            <div
              ref={parentRef}
              className="h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full"
              style={{ height: "calc(100vh - 200px)" }}
            >
              <div className="lg:hidden py-4">
                <MobileFacultyList
                  faculties={faculties}
                  editingFaculty={editingFaculty}
                  editForm={editForm}
                  handleEditSubmit={handleEditSubmit}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                  handleVisit={handleVisit}
                  setEditingFaculty={setEditingFaculty}
                  editFormReset={() => editForm.reset()}
                  creating={creating}
                  updating={updating}
                  deleting={deleting}
                  parentRef={parentRef}
                  isLoading={false}
                  handleEditInputChange={handleEditInputChange}
                />
              </div>

              <div className="hidden lg:block py-4">
                <DesktopFacultyGrid
                  faculties={faculties}
                  editingFaculty={editingFaculty}
                  editForm={editForm}
                  handleEditSubmit={handleEditSubmit}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                  handleVisit={handleVisit}
                  setEditingFaculty={setEditingFaculty}
                  editFormReset={() => editForm.reset()}
                  creating={creating}
                  updating={updating}
                  deleting={deleting}
                  parentRef={parentRef}
                  isLoading={false}
                  handleEditInputChange={handleEditInputChange}
                />
              </div>
            </div>
          ) : (
            // No data - show empty state
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
                    : "Create your first faculty to get started with examples like computer-information-systems, bachelor-of-computer-science."}
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
  )
}

export default LevelNamePage