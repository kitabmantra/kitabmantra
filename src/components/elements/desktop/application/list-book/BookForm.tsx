/*eslint-disable*/
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { createBook } from "@/lib/actions/books/post/createBook"
import { BookFormValidation } from "@/lib/validations/book.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowLeft,
  BookOpen,
  Upload
} from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

interface PostBookPageProps {
  userId: string
}

export default function BookForm({
  userId
}: PostBookPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<[]>([]);
  const [location, setLocation] = useState("");

  const form = useForm<z.infer<typeof BookFormValidation>>({
    resolver: zodResolver(BookFormValidation),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      price: 0,
      condition: "Good",
      imageUrl: "",
      category: {
        level: "school",
      },
      type: "Free"
    },
  })

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setLocation(e.target.value)
  }
  const handleAutoLocation = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(6)
        const longitude = position.coords.longitude.toFixed(6)
        const accuracy = position.coords.accuracy // in meters
        setLocation(`Lat: ${latitude}, Lon: ${longitude}`)
      },
      (error) => {
        console.error("Error getting location:", error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }



  const watchLevel = form.watch("category.level")

  async function onSubmit(values: z.infer<typeof BookFormValidation>) {
    const bookData: CreateBook = {
      userId: userId,
      title: values.title,
      author: values.author,
      description: values.description,
      price: values.price,
      condition: values.condition,
      imageUrl: images,
      category: values.category,
      type: values.type,
      location: JSON.stringify(location),
    }
    console.log(bookData)
    const response = await createBook({ bookData })
    if (response?.success) {
      form.reset()
      toast.success("Book Listed successfully!..")
    }
  }

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
  console.log("this is form data : ",form.getValues());

  return (
    <div className="p-4 w-full bg-gradient-to-b from-slate-50 to-white min-h-screen flex justify-start items-start">
      <ScrollArea className="h-[calc(100vh-5rem)] w-full">
        <Link href="/dashboard/my-listings" className="inline-flex fixed items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to books
        </Link>
        <Card className="max-w-3xl mx-auto shadow-lg border-slate-200 w-full">
          <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 border-b">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-slate-700" />
              <div>
                <CardTitle className="text-2xl text-slate-800">Post a Book</CardTitle>
                <CardDescription>Fill in the details to list your book for sale</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Book Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter book title"
                              {...field}
                              className="border-slate-300 focus:border-slate-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Author</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter author name"
                              {...field}
                              className="border-slate-300 focus:border-slate-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the book, its condition, etc."
                            {...field}
                            className="min-h-[120px] border-slate-300 focus:border-slate-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Price (Rs.)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                placeholder="Enter price"
                                {...field}
                                className="pl-10 border-slate-300 focus:border-slate-500"
                              />
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">Rs.</span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Condition</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-slate-300 w-full focus:border-slate-500">
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="New">New</SelectItem>
                              <SelectItem value="Like New">Like New</SelectItem>
                              <SelectItem value="Good">Good</SelectItem>
                              <SelectItem value="Fair">Fair</SelectItem>
                              <SelectItem value="Poor">Poor</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-slate-300 w-full focus:border-slate-500">
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Free">Free</SelectItem>
                              <SelectItem value="Exchange">Exchange</SelectItem>
                              <SelectItem value="Sell">Sell</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">Image URL</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter image URL (optional)"
                              {...field}
                              className="pl-10 border-slate-300 focus:border-slate-500"
                            />
                            <Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          </div>
                        </FormControl>
                        <FormDescription className="text-slate-500">
                          Provide a URL to an image of the book
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <Label className="text-slate-700 mb-1">Location</Label>
                    <Input
                      type="text"
                      placeholder="Enter location manually..."
                      onChange={handleLocationChange}
                    />
                  </div>
                  <div>
                    <Button onClick={handleAutoLocation}>
                      Get Current Location
                    </Button>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <h3 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-6 bg-slate-700 rounded-full mr-1"></span>
                    Book Category
                  </h3>

                  <Tabs
                    defaultValue={watchLevel}
                    onValueChange={(value) => form.setValue("category.level", value as any)}
                  >
                    <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6 bg-slate-100">
                      {["school", "highschool", "bachelors", "masters", "exam"].map((level) => (
                        <TabsTrigger
                          key={level}
                          value={level}
                          className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                        >
                          {getLevelName(level)}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <TabsContent value="school" className="mt-0">
                      <div className="bg-white p-4 rounded-md border border-slate-200">
                        <FormField
                          control={form.control}
                          name="category.class"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700">Class</FormLabel>
                              <div className="grid grid-cols-5 gap-2">
                                {[...Array(10)].map((_, i) => (
                                  <Badge
                                    key={i}
                                    variant={field.value === (i + 1).toString() ? "default" : "outline"}
                                    className={`py-2 cursor-pointer hover:bg-slate-100 ${field.value === (i + 1).toString()
                                      ? "bg-slate-800 hover:bg-slate-700"
                                      : "bg-white text-slate-800 hover:text-slate-900"
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
                      <div className="bg-white p-4 rounded-md border border-slate-200 space-y-4">
                        <FormField
                          control={form.control}
                          name="category.class"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700">Class</FormLabel>
                              <div className="flex gap-2">
                                <Badge
                                  variant={field.value === "11" ? "default" : "outline"}
                                  className={`py-2 cursor-pointer hover:bg-slate-100 ${field.value === "11"
                                    ? "bg-slate-800 hover:bg-slate-700"
                                    : "bg-white text-slate-800 hover:text-slate-900"
                                    }`}
                                  onClick={() => form.setValue("category.class", "11")}
                                >
                                  Class 11
                                </Badge>
                                <Badge
                                  variant={field.value === "12" ? "default" : "outline"}
                                  className={`py-2 cursor-pointer hover:bg-slate-100 ${field.value === "12"
                                    ? "bg-slate-800 hover:bg-slate-700"
                                    : "bg-white text-slate-800 hover:text-slate-900"
                                    }`}
                                  onClick={() => form.setValue("category.class", "12")}
                                >
                                  Class 12
                                </Badge>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="category.faculty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700">Faculty</FormLabel>
                              <div className="flex gap-2">
                                <Badge
                                  variant={field.value === "science" ? "default" : "outline"}
                                  className={`py-2 cursor-pointer hover:bg-slate-100 ${field.value === "science"
                                    ? "bg-slate-800 hover:bg-slate-700"
                                    : "bg-white text-slate-800 hover:text-slate-900"
                                    }`}
                                  onClick={() => form.setValue("category.faculty", "science")}
                                >
                                  Science
                                </Badge>
                                <Badge
                                  variant={field.value === "management" ? "default" : "outline"}
                                  className={`py-2 cursor-pointer hover:bg-slate-100 ${field.value === "management"
                                    ? "bg-slate-800 hover:bg-slate-700"
                                    : "bg-white text-slate-800 hover:text-slate-900"
                                    }`}
                                  onClick={() => form.setValue("category.faculty", "management")}
                                >
                                  Management
                                </Badge>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="bachelors" className="mt-0">
                      <div className="bg-white p-4 rounded-md border border-slate-200 space-y-4">
                        <FormField
                          control={form.control}
                          name="category.faculty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700">Faculty</FormLabel>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {["engineering", "medical", "business", "it"].map((faculty) => (
                                  <Badge
                                    key={faculty}
                                    variant={field.value === faculty ? "default" : "outline"}
                                    className={`py-2 cursor-pointer hover:bg-slate-100 ${field.value === faculty
                                      ? "bg-slate-800 hover:bg-slate-700"
                                      : "bg-white text-slate-800 hover:text-slate-900"
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
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700">Year</FormLabel>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {["1", "2", "3", "4"].map((year) => (
                                  <Badge
                                    key={year}
                                    variant={field.value === year ? "default" : "outline"}
                                    className={`py-2 cursor-pointer hover:bg-slate-100 ${field.value === year
                                      ? "bg-slate-800 hover:bg-slate-700"
                                      : "bg-white text-slate-800 hover:text-slate-900"
                                      }`}
                                    onClick={() => form.setValue("category.year", year)}
                                  >
                                    {year === "1" ? "First" : year === "2" ? "Second" : year === "3" ? "Third" : "Fourth"}{" "}
                                    Year
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
                      <div className="bg-white p-4 rounded-md border border-slate-200 space-y-4">
                        <FormField
                          control={form.control}
                          name="category.faculty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700">Faculty</FormLabel>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {["engineering", "medical", "business", "it"].map((faculty) => (
                                  <Badge
                                    key={faculty}
                                    variant={field.value === faculty ? "default" : "outline"}
                                    className={`py-2 cursor-pointer hover:bg-slate-100 ${field.value === faculty
                                      ? "bg-slate-800 hover:bg-slate-700"
                                      : "bg-white text-slate-800 hover:text-slate-900"
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
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700">Year</FormLabel>
                              <div className="flex gap-2">
                                <Badge
                                  variant={field.value === "1" ? "default" : "outline"}
                                  className={`py-2 cursor-pointer hover:bg-slate-100 ${field.value === "1"
                                    ? "bg-slate-800 hover:bg-slate-700"
                                    : "bg-white text-slate-800 hover:text-slate-900"
                                    }`}
                                  onClick={() => form.setValue("category.year", "1")}
                                >
                                  First Year
                                </Badge>
                                <Badge
                                  variant={field.value === "2" ? "default" : "outline"}
                                  className={`py-2 cursor-pointer hover:bg-slate-100 ${field.value === "2"
                                    ? "bg-slate-800 hover:bg-slate-700"
                                    : "bg-white text-slate-800 hover:text-slate-900"
                                    }`}
                                  onClick={() => form.setValue("category.year", "2")}
                                >
                                  Second Year
                                </Badge>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="exam" className="mt-0">
                      <div className="bg-white p-4 rounded-md border border-slate-200">
                        <FormField
                          control={form.control}
                          name="category.faculty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700">Exam Type</FormLabel>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                {["losewa", "engineering-entrance", "it-entrance"].map((exam) => (
                                  <Badge
                                    key={exam}
                                    variant={field.value === exam ? "default" : "outline"}
                                    className={`py-2 cursor-pointer hover:bg-slate-100 ${field.value === exam
                                      ? "bg-slate-800 hover:bg-slate-700"
                                      : "bg-white text-slate-800 hover:text-slate-900"
                                      }`}
                                    onClick={() => form.setValue("category.faculty", exam)}
                                  >
                                    {exam === "losewa"
                                      ? "LOSEWA"
                                      : exam === "engineering-entrance"
                                        ? "Engineering Entrance"
                                        : "IT Entrance"}
                                  </Badge>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white py-6"
                >
                  {isSubmitting ? "Posting..." : "Post Book"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  )
}
