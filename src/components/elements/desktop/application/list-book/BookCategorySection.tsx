import { Badge } from "@/components/ui/badge"
import {  FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  bachelorsFaculty,
  bookCategoryLevel,
  examFaculty,
  highLevelFaculty,
  mastersFaculty,
} from "@/lib/utils/data"
import { UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { BookFormValidation } from "@/lib/validations/book.validation"
import { BookCategoryLevelType } from "@/lib/types/books"

interface BookCategorySectionProps {
  form: UseFormReturn<z.infer<typeof BookFormValidation>>
  isSubmitting: boolean
}

export default function BookCategorySection({ form, isSubmitting }: BookCategorySectionProps) {
  const watchLevel = form.watch("category.level")

  const getLevelName = (level: string) => {
    const names: Record<string, string> = {
      school: "School (1-10)",
      highschool: "High School (11-12)",
      bachelors: "Bachelor's",
      masters: "Master's",
      exam: "Exam Preparation",
    }
    return names[level] || level
  }

  const handleLevelChange = (value: string) => {
    form.setValue("category.level", value as BookCategoryLevelType);
    form.setValue("category.faculty", undefined);
    form.setValue("category.year", undefined);
    form.setValue("category.class", undefined);
  }

  return (
    <div className="bg-[#F9FAFB] px-4 py-4 rounded-lg border border-[#1E3A8A]">
      <h3 className="font-medium text-[#1E3A8A] mb-6 flex p-2 items-center gap-2">
        <span className="inline-block w-1.5 h-6 bg-[#0D9488] rounded-full mr-1"></span>
        Book Category
      </h3>

      <Tabs
        value={watchLevel}
        onValueChange={handleLevelChange}
      >
        <TabsList className="inline-flex h-auto p-1 bg-[#F9FAFB] rounded-lg border border-[#1E3A8A] mb-6 flex-wrap gap-1">
          {bookCategoryLevel.map((level) => (
            <TabsTrigger
              key={level}
              value={level}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:border-[#0D9488] data-[state=active]:text-[#0D9488] data-[state=active]:shadow-md hover:bg-white text-[#4B5563] whitespace-nowrap"
            >
              {getLevelName(level)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="school" className="mt-0">
          <div className="bg-white p-6 rounded-lg border border-[#1E3A8A]">
            <FormField
              disabled={isSubmitting}
              control={form.control}
              name="category.class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1E3A8A] font-medium text-lg mb-4 block">Class</FormLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {[...Array(10)].map((_, i) => (
                      <Badge
                        key={i}
                        variant={field.value === (i + 1).toString() ? "default" : "outline"}
                        className={`py-3 px-4 cursor-pointer transition-all duration-200 text-center justify-center ${
                          field.value === (i + 1).toString()
                            ? "bg-white text-[#0D9488] shadow-md border-[#0D9488]"
                            : "bg-white text-[#1E3A8A] hover:text-[#0D9488] border-[#1E3A8A]"
                        }`}
                        onClick={() => form.setValue("category.class", (i + 1).toString())}
                      >
                        Class {i + 1}
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </TabsContent>

        <TabsContent value="highschool" className="mt-0">
          <div className="bg-white p-6 rounded-lg border border-[#1E3A8A] space-y-6">
            <FormField
              control={form.control}
              disabled={isSubmitting}
              name="category.class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1E3A8A] font-medium text-lg mb-4 block">Class</FormLabel>
                  <div className="flex gap-3">
                    {["11", "12"].map((val) => (
                      <Badge
                        key={val}
                        variant={field.value === val ? "default" : "outline"}
                        className={`py-3 px-6 cursor-pointer transition-all duration-200 ${
                          field.value === val
                            ? "bg-white text-[#0D9488] shadow-md border-[#0D9488]"
                            : "bg-white text-[#1E3A8A] hover:text-[#0D9488] border-[#1E3A8A]"
                        }`}
                        onClick={() => form.setValue("category.class", val)}
                      >
                        Class {val}
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              disabled={isSubmitting}
              name="category.faculty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1E3A8A] font-medium text-lg mb-4 block">Faculty</FormLabel>
                  <div className="flex flex-wrap gap-3">
                    {highLevelFaculty.map((faculty) => (
                      <Badge
                        key={faculty}
                        variant={field.value === faculty ? "default" : "outline"}
                        className={`py-3 px-4 cursor-pointer transition-all duration-200 ${
                          field.value === faculty
                            ? "bg-white text-[#0D9488] shadow-md border-[#0D9488]"
                            : "bg-white text-[#1E3A8A] hover:text-[#0D9488] border-[#1E3A8A]"
                        }`}
                        onClick={() => form.setValue("category.faculty", faculty)}
                      >
                        {faculty.charAt(0).toUpperCase() + faculty.slice(1)}
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </TabsContent>

        <TabsContent value="bachelors" className="mt-0">
          <div className="bg-white p-6 rounded-lg border border-[#1E3A8A] space-y-6">
            <FormField
              disabled={isSubmitting}
              control={form.control}
              name="category.faculty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1E3A8A] font-medium text-lg mb-4 block">Faculty</FormLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {bachelorsFaculty.map((faculty) => (
                      <Badge
                        key={faculty}
                        variant={field.value === faculty ? "default" : "outline"}
                        className={`py-3 px-4 cursor-pointer transition-all duration-200 text-center justify-center ${
                          field.value === faculty
                            ? "bg-white text-[#0D9488] shadow-md border-[#0D9488]"
                            : "bg-white text-[#1E3A8A] hover:text-[#0D9488] border-[#1E3A8A]"
                        }`}
                        onClick={() => form.setValue("category.faculty", faculty)}
                      >
                        {faculty.charAt(0).toUpperCase() + faculty.slice(1)}
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category.year"
              disabled={isSubmitting}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1E3A8A] font-medium text-lg mb-4 block">Year</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["1", "2", "3", "4"].map((year) => (
                      <Badge
                        key={year}
                        variant={field.value === year ? "default" : "outline"}
                        className={`py-3 px-4 cursor-pointer transition-all duration-200 text-center justify-center ${
                          field.value === year
                            ? "bg-white text-[#0D9488] shadow-md border-[#0D9488]"
                            : "bg-white text-[#1E3A8A] hover:text-[#0D9488] border-[#1E3A8A]"
                        }`}
                        onClick={() => form.setValue("category.year", year)}
                      >
                        {year === "1" ? "First" : year === "2" ? "Second" : year === "3" ? "Third" : "Fourth"} Year
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </TabsContent>

        <TabsContent value="masters" className="mt-0">
          <div className="bg-white p-6 rounded-lg border border-[#1E3A8A] space-y-6">
            <FormField
              disabled={isSubmitting}
              control={form.control}
              name="category.faculty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1E3A8A] font-medium text-lg mb-4 block">Faculty</FormLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {mastersFaculty.map((faculty) => (
                      <Badge
                        key={faculty}
                        variant={field.value === faculty ? "default" : "outline"}
                        className={`py-3 px-4 cursor-pointer transition-all duration-200 text-center justify-center ${
                          field.value === faculty
                            ? "bg-white text-[#0D9488] shadow-md border-[#0D9488]"
                            : "bg-white text-[#1E3A8A] hover:text-[#0D9488] border-[#1E3A8A]"
                        }`}
                        onClick={() => form.setValue("category.faculty", faculty)}
                      >
                        {faculty.charAt(0).toUpperCase() + faculty.slice(1)}
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              disabled={isSubmitting}
              name="category.year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1E3A8A] font-medium text-lg mb-4 block">Year</FormLabel>
                  <div className="flex gap-3">
                    {["1", "2"].map((year) => (
                      <Badge
                        key={year}
                        variant={field.value === year ? "default" : "outline"}
                        className={`py-3 px-6 cursor-pointer transition-all duration-200 ${
                          field.value === year
                            ? "bg-white text-[#0D9488] shadow-md border-[#0D9488]"
                            : "bg-white text-[#1E3A8A] hover:text-[#0D9488] border-[#1E3A8A]"
                        }`}
                        onClick={() => form.setValue("category.year", year)}
                      >
                        {year === "1" ? "First" : "Second"} Year
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </TabsContent>

        <TabsContent value="exam" className="mt-0">
          <div className="bg-white p-6 rounded-lg border border-[#1E3A8A]">
            <FormField
              control={form.control}
              name="category.faculty"
              disabled={isSubmitting}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1E3A8A] font-medium text-lg mb-4 block">Exam Type</FormLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {examFaculty.map((exam) => (
                      <Badge
                        key={exam}
                        variant={field.value === exam ? "default" : "outline"}
                        className={`py-3 px-4 cursor-pointer transition-all duration-200 text-center justify-center ${
                          field.value === exam
                            ? "bg-white text-[#0D9488] shadow-md border-[#0D9488]"
                            : "bg-white text-[#1E3A8A] hover:text-[#0D9488] border-[#1E3A8A]"
                        }`}
                        onClick={() => form.setValue("category.faculty", exam)}
                      >
                        {exam === "lok-sewa"
                          ? "Lok Sewa"
                          : exam === "engineering-entrance"
                            ? "Engineering Entrance"
                            : exam === "it-entrance"
                              ? "IT Entrance"
                              : exam === "medical"
                                ? "Medical"
                                : exam === "neb"
                                  ? "NEB"
                                  : "Others"}
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </TabsContent>
        <TabsContent value="others"></TabsContent>
      </Tabs>
    </div>
  )
} 