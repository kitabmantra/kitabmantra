/*eslint-disable*/
"use client"
import { useState, useCallback,  } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Search, X, Filter, ChevronDown, ChevronUp, MapPin, DollarSign, BookOpen, GraduationCap, Calendar, Users } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

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

type FilterFormValues = z.infer<typeof formSchema>

export function BookFiltersMobile() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    },
  })

  const watchLevel = form.watch("level")

  const updateActiveFilters = () => {
    const values = form.getValues()
    const newActiveFilters: string[] = []

    if (values.search) {
      newActiveFilters.push(`"${values.search}"`)
    }
    if (values.minPrice && values.minPrice > 0) {
      newActiveFilters.push(`Rs ${values.minPrice}+`)
    }
    if (values.maxPrice && values.maxPrice < 10000) {
      newActiveFilters.push(`Under Rs ${values.maxPrice}`)
    }
    if (values.condition) {
      newActiveFilters.push(values.condition)
    }
    if (values.type) {
      newActiveFilters.push(values.type)
    }
    if (values.level) {
      newActiveFilters.push(values.level)
    }
    if (values.faculty && values.faculty !== "all") {
      newActiveFilters.push(values.faculty)
    }
    if (values.year && values.year !== "all") {
      newActiveFilters.push(`Year ${values.year}`)
    }
    if (values.class && values.class !== "all") {
      newActiveFilters.push(`Class ${values.class}`)
    }
    if (values.location) {
      newActiveFilters.push(values.location)
    }
    setActiveFilters(newActiveFilters)
  }

  const onSubmit = (values: FilterFormValues) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(values).forEach(([key, value]) => {
      if (value && 
          value !== "all" && 
          !(key === "minPrice" && value === 0) && 
          !(key === "maxPrice" && value === 10000)) {
        params.set(key, String(value))
      } else {
        params.delete(key)
      }
    })

    router.push(`/?${params.toString()}`)
    setShowFilters(false)
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
    setExpandedSections([])
    router.replace("/")
  }, [form, router])

  const clearSearch = (field: string) => {
    form.setValue(field as any, "")
    updateActiveFilters()
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const handleLevelChange = (level: string) => {
    form.setValue("level", level)
    form.setValue("faculty", "all")
    form.setValue("year", "all")
    form.setValue("class", "all")
    
    // Auto-expand next relevant section
    if (level) {
      const newExpanded = expandedSections.filter(s => !s.startsWith("education"))
      if (getFacultyOptions(level).length > 0) {
        newExpanded.push("education-faculty")
      } else if (getClassOptions(level).length > 0) {
        newExpanded.push("education-class")
      }
      setExpandedSections(newExpanded)
    }
    
    updateActiveFilters()
  }

  const handleFacultyChange = (faculty: string) => {
    form.setValue("faculty", faculty)
    form.setValue("year", "all")
    
    if (faculty && faculty !== "all") {
      const newExpanded = expandedSections.filter(s => s !== "education-faculty")
      if (getYearOptions(watchLevel).length > 0) {
        newExpanded.push("education-year")
      }
      setExpandedSections(newExpanded)
    }
    
    updateActiveFilters()
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
      return [
        { value: "science", label: "Science" },
        { value: "management", label: "Management" }
      ]
    }
    if (currentLevel === "bachelors" || currentLevel === "masters") {
      return [
        { value: "engineering", label: "Engineering" },
        { value: "medical", label: "Medical" },
        { value: "business", label: "Business" },
        { value: "it", label: "IT" }
      ]
    }
    if (currentLevel === "exam") {
      return [
        { value: "loksewa", label: "Loksewa" },
        { value: "cmat", label: "CMAT" },
        { value: "csit", label: "CSIT" },
        { value: "ioe", label: "IOE" }
      ]
    }
    return []
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

  const FilterSection = ({ 
    id, 
    title, 
    icon: Icon, 
    children, 
    badge 
  }: { 
    id: string
    title: string
    icon: any
    children: React.ReactNode
    badge?: string
  }) => {
    const isExpanded = expandedSections.includes(id)
    
    return (
      <div className="border-b border-gray-100">
        <button
          type="button"
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">{title}</span>
            {badge && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                {badge}
              </Badge>
            )}
          </div>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        {isExpanded && (
          <div className="px-4 pb-4 space-y-3 bg-gray-50/50">
            {children}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="lg:hidden">
      {/* Search Bar */}
      <div className="p-4 bg-white border-b sticky top-0 z-10">
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search books..." 
                    className="pl-10 pr-10 h-12 text-base rounded-xl border-gray-200" 
                    {...field} 
                  />
                  {field.value && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-8 w-8 p-0 rounded-full"
                      onClick={() => clearSearch("search")}
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

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="p-4 bg-white border-b">
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm rounded-full">
                {filter}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Filter Button */}
      <div className="p-4 bg-white border-b">
        <Button
          type="button"
          onClick={() => setShowFilters(true)}
          className="w-full h-12 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilters.length > 0 && (
            <Badge className="bg-white text-slate-800 ml-2">
              {activeFilters.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Bottom Sheet Filter Modal */}
      {showFilters && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowFilters(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
                className="h-8 w-8 p-0 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {/* Location & Price */}
                  <FilterSection id="location-price" title="Location & Price" icon={MapPin}>
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter location..." className="h-11 rounded-lg" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="minPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Min Price (Rs)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                min={0}
                                className="h-11 rounded-lg"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e.target.valueAsNumber || 0)
                                  updateActiveFilters()
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
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Max Price (Rs)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="10000"
                                className="h-11 rounded-lg"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e.target.valueAsNumber || 0)
                                  updateActiveFilters()
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </FilterSection>

                  {/* Condition & Type */}
                  <FilterSection id="condition-type" title="Condition & Type" icon={BookOpen}>
                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Condition</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => {
                                field.onChange(value === "all" ? "" : value)
                                updateActiveFilters()
                              }}
                              value={field.value || "all"}
                              className="grid grid-cols-2 gap-2 mt-2"
                            >
                              {["all", "New", "Like New", "Good", "Fair", "Poor"].map((condition) => (
                                <div key={condition} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50">
                                  <RadioGroupItem value={condition} id={`condition-${condition}`} />
                                  <FormLabel htmlFor={`condition-${condition}`} className="text-sm cursor-pointer">
                                    {condition === "all" ? "All" : condition}
                                  </FormLabel>
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
                          <FormLabel className="text-sm font-medium text-gray-700">Type</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => {
                                field.onChange(value === "all" ? "" : value)
                                updateActiveFilters()
                              }}
                              value={field.value || "all"}
                              className="grid grid-cols-2 gap-2 mt-2"
                            >
                              {["all", "Free", "Exchange", "Sell"].map((type) => (
                                <div key={type} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50">
                                  <RadioGroupItem value={type} id={`type-${type}`} />
                                  <FormLabel htmlFor={`type-${type}`} className="text-sm cursor-pointer">
                                    {type === "all" ? "All Types" : type}
                                  </FormLabel>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </FilterSection>

                  {/* Education Level */}
                  <FilterSection id="education-level" title="Education Level" icon={GraduationCap}>
                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={handleLevelChange}
                              value={field.value || ""}
                              className="space-y-2"
                            >
                              {[
                                { value: "school", label: "School (1-10)" },
                                { value: "highschool", label: "High School (11-12)" },
                                { value: "bachelors", label: "Bachelor's" },
                                { value: "masters", label: "Master's" },
                                { value: "exam", label: "Entrance Exam" }
                              ].map((level) => (
                                <div key={level.value} className="flex items-center space-x-3 p-3 border rounded-xl hover:bg-gray-50">
                                  <RadioGroupItem value={level.value} id={level.value} />
                                  <FormLabel htmlFor={level.value} className="flex-1 cursor-pointer font-medium">
                                    {level.label}
                                  </FormLabel>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </FilterSection>

                  {/* Class (for school/highschool) */}
                  {watchLevel && getClassOptions().length > 0 && (
                    <FilterSection id="education-class" title="Class" icon={Users}>
                      <FormField
                        control={form.control}
                        name="class"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={(value) => {
                                  field.onChange(value)
                                  updateActiveFilters()
                                }}
                                value={field.value || "all"}
                                className="grid grid-cols-3 gap-2"
                              >
                                <div className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50">
                                  <RadioGroupItem value="all" id="class-all" />
                                  <FormLabel htmlFor="class-all" className="text-sm cursor-pointer">All</FormLabel>
                                </div>
                                {getClassOptions().map((classNum) => (
                                  <div key={classNum} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50">
                                    <RadioGroupItem value={classNum} id={`class-${classNum}`} />
                                    <FormLabel htmlFor={`class-${classNum}`} className="text-sm cursor-pointer">
                                      {classNum}
                                    </FormLabel>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </FilterSection>
                  )}

                  {/* Faculty */}
                  {watchLevel && getFacultyOptions().length > 0 && (
                    <FilterSection 
                      id="education-faculty" 
                      title={watchLevel === "exam" ? "Exam Type" : "Faculty"} 
                      icon={BookOpen}
                    >
                      <FormField
                        control={form.control}
                        name="faculty"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={handleFacultyChange}
                                value={field.value || "all"}
                                className="space-y-2"
                              >
                                <div className="flex items-center space-x-3 p-3 border rounded-xl hover:bg-gray-50">
                                  <RadioGroupItem value="all" id="faculty-all" />
                                  <FormLabel htmlFor="faculty-all" className="flex-1 cursor-pointer font-medium">
                                    All {watchLevel === "exam" ? "Exams" : "Faculties"}
                                  </FormLabel>
                                </div>
                                {getFacultyOptions().map((option) => (
                                  <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-xl hover:bg-gray-50">
                                    <RadioGroupItem value={option.value} id={`faculty-${option.value}`} />
                                    <FormLabel htmlFor={`faculty-${option.value}`} className="flex-1 cursor-pointer font-medium">
                                      {option.label}
                                    </FormLabel>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </FilterSection>
                  )}

                  {/* Year */}
                  {watchLevel && getYearOptions().length > 0 && (
                    <FilterSection id="education-year" title="Year" icon={Calendar}>
                      <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={(value) => {
                                  field.onChange(value)
                                  updateActiveFilters()
                                }}
                                value={field.value || "all"}
                                className="grid grid-cols-2 gap-2"
                              >
                                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                  <RadioGroupItem value="all" id="year-all" />
                                  <FormLabel htmlFor="year-all" className="cursor-pointer font-medium">All Years</FormLabel>
                                </div>
                                {getYearOptions().map((option) => (
                                  <div key={option.value} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                    <RadioGroupItem value={option.value} id={`year-${option.value}`} />
                                    <FormLabel htmlFor={`year-${option.value}`} className="cursor-pointer font-medium">
                                      {option.label}
                                    </FormLabel>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </FilterSection>
                  )}
                </form>
              </Form>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-white border-t sticky bottom-0">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetFilters}
                  className="flex-1 h-12 rounded-xl"
                >
                  Reset
                </Button>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  className="flex-1 h-12 bg-slate-800 hover:bg-slate-700 text-white rounded-xl"
                >
                  Apply Filters
                  {activeFilters.length > 0 && (
                    <Badge className="bg-white text-slate-800 ml-2">
                      {activeFilters.length}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}