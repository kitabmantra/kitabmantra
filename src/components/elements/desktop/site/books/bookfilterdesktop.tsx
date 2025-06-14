"use client"
import { useState, useCallback, useEffect, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Search, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { bookCondition, bookType, bookCategoryLevel, highLevelFaculty, bachelorsFaculty, mastersFaculty, examFaculty } from "@/lib/utils/data"

const formSchema = z.object({
  search: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  condition: z.string().optional(),
  type: z.string().optional(),
  level: z.string().optional(),
  faculty: z.string().optional(),
  year: z.string().optional(),
  class: z.string().optional(),
  location: z.string().optional(),
})

export type FilterFormValues = z.infer<typeof formSchema>

interface BookFilterDesktop {
  handleReset: () => void
}

export function BookFiltersDesktop({ handleReset }: BookFilterDesktop) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeFilters, setActiveFilters] = useState<string[]>([]) // Applied filters (from URL)
  const [pendingFilters, setPendingFilters] = useState<string[]>([]) // Current form state filters
  const [openAccordions, setOpenAccordions] = useState<string[]>([""])

  // Memoize params to avoid recreating on every render
  const params = useMemo(
    () => ({
      search: searchParams.get("search") || "",
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 10000,
      condition: searchParams.get("condition") || "",
      type: searchParams.get("type") || "",
      level: searchParams.get("level") || "",
      faculty: searchParams.get("faculty") || "all",
      year: searchParams.get("year") || "all",
      class: searchParams.get("class") || "all",
      location: searchParams.get("location") || "",
    }),
    [searchParams],
  )

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: params.search,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      condition: params.condition,
      type: params.type,
      level: params.level,
      faculty: params.faculty,
      year: params.year,
      class: params.class,
      location: params.location,
    },
  })

  const watchLevel = form.watch("level")

  // Fixed useEffect with proper dependencies
  useEffect(() => {
    const newActiveFilters: string[] = []

    if (params.search) {
      newActiveFilters.push(`Search: ${params.search}`)
    }
    if (params.minPrice && params.minPrice > 0) {
      newActiveFilters.push(`Min Price: Rs ${params.minPrice}`)
    }
    if (params.maxPrice && params.maxPrice < 10000) {
      newActiveFilters.push(`Max Price: Rs ${params.maxPrice}`)
    }
    if (params.condition) {
      newActiveFilters.push(`Condition: ${params.condition}`)
    }
    if (params.type) {
      newActiveFilters.push(`Type: ${params.type}`)
    }
    if (params.level) {
      newActiveFilters.push(`Level: ${params.level}`)
    }
    if (params.faculty && params.faculty !== "all") {
      newActiveFilters.push(`Faculty: ${params.faculty}`)
    }
    if (params.year && params.year !== "all") {
      newActiveFilters.push(`Year: ${params.year}`)
    }
    if (params.class && params.class !== "all") {
      newActiveFilters.push(`Class: ${params.class}`)
    }
    if (params.location) {
      newActiveFilters.push(`Location: ${params.location}`)
    }

    setActiveFilters(newActiveFilters)
  }, [params]) // Now properly includes all params dependencies

  // Update pending filters when form values change
  const updatePendingFilters = useCallback(() => {
    const values = form.getValues()
    const newPendingFilters: string[] = []

    if (values.search) {
      newPendingFilters.push(`Search: ${values.search}`)
    }
    if (values.minPrice && values.minPrice > 0) {
      newPendingFilters.push(`Min Price: Rs ${values.minPrice}`)
    }
    if (values.maxPrice && values.maxPrice < 10000) {
      newPendingFilters.push(`Max Price: Rs ${values.maxPrice}`)
    }
    if (values.condition) {
      newPendingFilters.push(`Condition: ${values.condition}`)
    }
    if (values.type) {
      newPendingFilters.push(`Type: ${values.type}`)
    }
    if (values.level) {
      newPendingFilters.push(`Level: ${values.level}`)
    }
    if (values.faculty && values.faculty !== "all") {
      newPendingFilters.push(`Faculty: ${values.faculty}`)
    }
    if (values.year && values.year !== "all") {
      newPendingFilters.push(`Year: ${values.year}`)
    }
    if (values.class && values.class !== "all") {
      newPendingFilters.push(`Class: ${values.class}`)
    }
    if (values.location) {
      newPendingFilters.push(`Location: ${values.location}`)
    }

    setPendingFilters(newPendingFilters)
  }, [form])

  const onSubmit = (values: FilterFormValues) => {
    const urlParams = new URLSearchParams()

    Object.entries(values).forEach(([key, value]) => {
      if (
        value &&
        value !== "all" &&
        !(key === "minPrice" && value === 0) &&
        !(key === "maxPrice" && value === 10000)
      ) {
        urlParams.set(key, String(value))
      }
    })

    router.replace(`?${urlParams.toString()}`, { scroll: false })
    // Clear pending filters after applying since they become active filters
    setPendingFilters([])
  }

  const resetFilters = useCallback(() => {
    form.reset({
      search: "",
      minPrice: 0,
      maxPrice: 10000,
      condition: "",
      type: "",
      level: "",
      faculty: "all",
      year: "all",
      class: "all",
      location: "",
    })
    setActiveFilters([])
    setPendingFilters([])
    setOpenAccordions([""])
    router.replace("?", { scroll: false })
    handleReset()
  }, [form, router, handleReset])

  const clearSearch = () => {
    form.setValue("search", "")
    updatePendingFilters()
  }

  const handleLevelChange = (level: string) => {
    form.setValue("level", level)
    form.setValue("faculty", "all")
    form.setValue("year", "all")
    form.setValue("class", "all")

    if (level) {
      // Close the level accordion
      setOpenAccordions((prev) => {
        const newAccordions = prev.filter((acc) => acc !== "education-level")

        // Open the next accordion in the hierarchy based on level
        if (level === "school" || level === "highschool") {
          newAccordions.push("education-class")
        } else if (level === "bachelors" || level === "masters" || level === "exam") {
          newAccordions.push("education-faculty")
        }
        return newAccordions
      })
    }

    updatePendingFilters()
  }

  const handleClassChange = (classValue: string) => {
    form.setValue("class", classValue)

    if (classValue && classValue !== "all") {
      setOpenAccordions((prev) => {
        const newAccordions = prev.filter((acc) => acc !== "education-class")

        if (watchLevel === "highschool") {
          newAccordions.push("education-faculty")
        }
        return newAccordions
      })
    }

    updatePendingFilters()
  }

  const handleFacultyChange = (faculty: string) => {
    form.setValue("faculty", faculty)
    form.setValue("year", "all")

    if (faculty && faculty !== "all") {
      setOpenAccordions((prev) => {
        const newAccordions = prev.filter((acc) => acc !== "education-faculty")

        if ((watchLevel === "bachelors" || watchLevel === "masters") && getYearOptions(watchLevel).length > 0) {
          newAccordions.push("education-year")
        }
        return newAccordions
      })
    }

    updatePendingFilters()
  }

  const removePendingFilter = (filterText: string) => {
    const [type] = filterText.split(": ")

    // Remove from form values
    switch (type.trim()) {
      case "Search":
        form.setValue("search", "")
        break
      case "Min Price":
        form.setValue("minPrice", 0)
        break
      case "Max Price":
        form.setValue("maxPrice", 10000)
        break
      case "Condition":
        form.setValue("condition", "")
        break
      case "Type":
        form.setValue("type", "")
        break
      case "Level":
        form.setValue("level", "")
        form.setValue("faculty", "all")
        form.setValue("year", "all")
        form.setValue("class", "all")
        // Reset accordion state when level is removed
        setOpenAccordions((prev) =>
          prev.filter((acc) => !["education-class", "education-faculty", "education-year"].includes(acc)),
        )
        break
      case "Faculty":
        form.setValue("faculty", "all")
        form.setValue("year", "all")
        // Reset year accordion when faculty is removed
        setOpenAccordions((prev) => prev.filter((acc) => acc !== "education-year"))
        break
      case "Year":
        form.setValue("year", "all")
        break
      case "Class":
        form.setValue("class", "all")
        // Reset faculty accordion when class is removed for highschool
        if (watchLevel === "highschool") {
          setOpenAccordions((prev) => prev.filter((acc) => acc !== "education-faculty"))
        }
        break
      case "Location":
        form.setValue("location", "")
        break
      default:
        break
    }

    // Update pending filters to reflect the change
    updatePendingFilters()
  }

  const getClassOptions = (level?: string) => {
    const currentLevel = level || watchLevel
    if (currentLevel === "school") {
      return Array.from({ length: 10 }, (_, i) => (i + 1).toString())
    }
    if (currentLevel === "highschool") {
      return ["11", "12"]
    }
    return []
  }

  const getFacultyOptions = (level?: string) => {
    const currentLevel = level || watchLevel
    if (currentLevel === "highschool") {
      return highLevelFaculty.map(faculty => ({
        value: faculty,
        label: faculty.charAt(0).toUpperCase() + faculty.slice(1)
      }))
    }
    if (currentLevel === "bachelors") {
      return bachelorsFaculty.map(faculty => ({
        value: faculty,
        label: faculty.charAt(0).toUpperCase() + faculty.slice(1)
      }))
    }
    if (currentLevel === "masters") {
      return mastersFaculty.map(faculty => ({
        value: faculty,
        label: faculty.charAt(0).toUpperCase() + faculty.slice(1)
      }))
    }
    if (currentLevel === "exam") {
      return examFaculty.map(faculty => ({
        value: faculty,
        label: faculty.split('-').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
      }))
    }
    return []
  }
  const handleYearChange = (year: string) => {
    form.setValue("year", year)

    // Close year accordion after selection
    if (year && year !== "all") {
      setOpenAccordions(prev => prev.filter(acc => acc !== "education-year"))
    }

    updatePendingFilters()
  }

  const getYearOptions = (level?: string) => {
    const currentLevel = level || watchLevel
    if (currentLevel === "bachelors") {
      return Array.from({ length: 5 }, (_, i) => ({ value: (i + 1).toString(), label: `Year ${i + 1}` }))
    }
    if (currentLevel === "masters") {
      return Array.from({ length: 3 }, (_, i) => ({ value: (i + 1).toString(), label: `Year ${i + 1}` }))
    }
    return []
  }

  return (
    <div className="w-full md:block bg-white rounded-lg shadow-lg p-6 border border-slate-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] bg-clip-text text-transparent">
          Find Your Perfect Book
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Use filters to discover books that match your needs
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            {/* Search Input */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#0D9488]" />
                        <Input
                          placeholder="Search by title or author..."
                          className="pl-10 border-slate-200 focus:border-[#0D9488] focus:ring-[#0D9488] h-11"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            updatePendingFilters()
                          }}
                        />
                        {field.value && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
                            onClick={clearSearch}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Accordion type="multiple" className="w-full" value={openAccordions} onValueChange={setOpenAccordions}>
              <AccordionItem value="basic-filters" className="border-slate-200">
                <AccordionTrigger className="text-[#1E3A8A] hover:text-[#0D9488] font-medium">
                  Basic Filters
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-slate-700">Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter location..."
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              updatePendingFilters()
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-x-4">
                    <FormField
                      control={form.control}
                      name="minPrice"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-xs font-medium text-slate-700">Min Price (Rs)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              min={0}
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.valueAsNumber || 0)
                                updatePendingFilters()
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxPrice"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-xs font-medium text-slate-700">Max Price (Rs)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="10000"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.valueAsNumber || 0)
                                updatePendingFilters()
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-slate-700">Condition</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value === "all" ? "" : value)
                              updatePendingFilters()
                            }}
                            value={field.value || "all"}
                            className="grid grid-cols-3 space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="all" id="condition-all" className="text-blue-600" />
                              <FormLabel htmlFor="condition-all" className="text-slate-700">All</FormLabel>
                            </div>
                            {bookCondition.map((condition) => (
                              <div key={condition} className="flex items-center space-x-2">
                                <RadioGroupItem value={condition} id={`condition-${condition.toLowerCase()}`} className="text-blue-600" />
                                <FormLabel htmlFor={`condition-${condition.toLowerCase()}`} className="text-slate-700">{condition}</FormLabel>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-slate-700">Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value === "all" ? "" : value)
                              updatePendingFilters()
                            }}
                            value={field.value || "all"}
                            className="grid grid-cols-2 space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="all" id="type-all" />
                              <FormLabel htmlFor="type-all">All Types</FormLabel>
                            </div>
                            {bookType.map((type) => (
                              <div key={type} className="flex items-center space-x-2">
                                <RadioGroupItem value={type} id={`type-${type.toLowerCase()}`} />
                                <FormLabel htmlFor={`type-${type.toLowerCase()}`}>{type}</FormLabel>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="education-level" className="border-slate-200">
                <AccordionTrigger className="text-[#1E3A8A] hover:text-[#0D9488] font-medium">
                  Education Level
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={handleLevelChange}
                            value={field.value || ""}
                            className="flex flex-col space-y-2"
                          >
                            {bookCategoryLevel.map((level) => (
                              <div key={level} className="flex items-center space-x-2">
                                <RadioGroupItem value={level} id={level} />
                                <FormLabel htmlFor={level}>
                                  {level === 'school' ? 'School (1-10)' :
                                    level === 'highschool' ? 'High School (11-12)' :
                                      level === 'bachelors' ? "Bachelor's" :
                                        level === 'masters' ? "Master's" :
                                          level === 'exam' ? 'Entrance Exam' :
                                            'Others'}
                                </FormLabel>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>

              {watchLevel && getClassOptions().length > 0 && (
                <AccordionItem value="education-class" className="border-slate-200">
                  <AccordionTrigger className="text-[#1E3A8A] hover:text-[#0D9488] font-medium">
                    Class
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="class"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={handleClassChange}
                              value={field.value || "all"}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all" id="class-all" />
                                <FormLabel htmlFor="class-all">All Classes</FormLabel>
                              </div>
                              {getClassOptions().map((classNum) => (
                                <div key={classNum} className="flex items-center space-x-2">
                                  <RadioGroupItem value={classNum} id={`class-${classNum}`} />
                                  <FormLabel htmlFor={`class-${classNum}`}>Class {classNum}</FormLabel>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              )}

              {watchLevel && getFacultyOptions().length > 0 && (
                <AccordionItem value="education-faculty" className="border-slate-200">
                  <AccordionTrigger className="text-[#1E3A8A] hover:text-[#0D9488] font-medium">
                    {watchLevel === "exam" ? "Exam Type" : "Faculty"}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="faculty"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={handleFacultyChange}
                              value={field.value || "all"}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all" id="faculty-all" />
                                <FormLabel htmlFor="faculty-all">
                                  All {watchLevel === "exam" ? "Exams" : "Faculties"}
                                </FormLabel>
                              </div>
                              {getFacultyOptions().map((option) => (
                                <div key={option.value} className="flex items-center space-x-2">
                                  <RadioGroupItem value={option.value} id={`faculty-${option.value}`} />
                                  <FormLabel htmlFor={`faculty-${option.value}`}>{option.label}</FormLabel>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              )}

              {watchLevel && getYearOptions().length > 0 && (
                <AccordionItem value="education-year" className="border-slate-200">
                  <AccordionTrigger className="text-[#1E3A8A] hover:text-[#0D9488] font-medium">
                    Year
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={handleYearChange}
                              value={field.value || "all"}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all" id="year-all" />
                                <FormLabel htmlFor="year-all">All Years</FormLabel>
                              </div>
                              {getYearOptions().map((option) => (
                                <div key={option.value} className="flex items-center space-x-2">
                                  <RadioGroupItem value={option.value} id={`year-${option.value}`} />
                                  <FormLabel htmlFor={`year-${option.value}`}>{option.label}</FormLabel>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            {/* Buttons */}
            <div className="flex justify-between gap-3 mt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetFilters} 
                className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition-colors"
              >
                Reset All
              </Button>
              <Button 
                type="submit" 
                className="bg-[#0D9488] text-white hover:bg-[#0D9488]/90 transition-colors"
              >
                Apply Filters
              </Button>
            </div>

            {/* Pending and Active Filters */}
            {(pendingFilters.length > 0 || activeFilters.length > 0) && (
              <div className="space-y-3 pt-4 border-t border-slate-200">
                {/* Pending Filters */}
                {pendingFilters.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-[#1E3A8A] mb-2">
                      Selected Filters (Click Apply to activate):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {pendingFilters.map((filter, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="px-2 py-1 cursor-pointer hover:bg-[#0D9488]/10 transition-colors border-[#0D9488] text-[#0D9488]"
                          onClick={() => removePendingFilter(filter)}
                        >
                          {filter}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Active Filters */}
                {activeFilters.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-[#1E3A8A] mb-2">Applied Filters:</p>
                    <div className="flex flex-wrap gap-2">
                      {activeFilters.map((filter, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-2 py-1 bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/20"
                        >
                          {filter}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
