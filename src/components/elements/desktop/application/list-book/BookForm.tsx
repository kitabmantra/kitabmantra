/*eslint-disable*/
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { createBook } from "@/lib/actions/books/post/createBook"
import { removeMultipleImages } from "@/lib/actions/uploadthing/delete-images"
import type { CreateBook } from "@/lib/types/books"
import {
  bachelorsFaculty,
  bookCategoryLevel,
  bookCondition,
  bookType,
  examFaculty,
  highLevelFaculty,
  mastersFaculty,
} from "@/lib/utils/data"
import { useUploadThing } from "@/lib/utils/uploadthing-client"
import { BookFormValidation } from "@/lib/validations/book.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, BookOpen, Upload, X } from "lucide-react"
import Link from "next/link"
import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import type { z } from "zod"

interface PostBookPageProps {
  userId: string
}

export default function BookForm({ userId }: PostBookPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { startUpload } = useUploadThing("imageUploader")

  const form = useForm<z.infer<typeof BookFormValidation>>({
    resolver: zodResolver(BookFormValidation),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      price: 0,
      condition: "Good",
      imageUrl: [],
      category: {
        level: "school",
      },
      type: "Free",
      location: {
        address: "",
        lat: undefined,
        lon: undefined,
      },
    },
  })

  const watchLevel = form.watch("category.level")
  const watchType = form.watch("type")

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "category.level") {
        form.resetField("category.faculty")
        form.resetField("category.year")
        form.resetField("category.class")
      }
      if (name === "type" && value.type !== "Sell") {
        form.setValue("price", 0)
      }
    })
    return () => subscription.unsubscribe()
  }, [form.watch])

  useEffect(() => {
    const newPreviewUrls: string[] = []
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviewUrls.push(reader.result as string)
        if (newPreviewUrls.length === files.length) {
          setPreviewUrls(newPreviewUrls)
        }
      }
      reader.readAsDataURL(file)
    })

    if (files.length === 0) {
      setPreviewUrls([])
    }
  }, [files])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files
    if (!newFiles) return

    const fileArray = Array.from(newFiles)

    if (files.length + fileArray.length > 5) {
      toast.error("You can only upload up to 5 images")
      return
    }

    for (const file of fileArray) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large (max 5MB)`)
        return
      }
    }

    setFiles((prev) => [...prev, ...fileArray])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("location.address", e.target.value)
  }

  const handleAutoLocation = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.")
      return
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        })
      })

      const latitude = position.coords.latitude
      const longitude = position.coords.longitude

      let address = "Current location"
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        )
        const data = await response.json()
        if (data.display_name) {
          address = data.display_name
        }
      } catch (error) {
        console.error("Error getting address from coordinates:", error)
      }

      form.setValue("location", {
        address,
        lat: latitude,
        lon: longitude,
      })

      toast.success("Location set successfully!")
    } catch (error) {
      console.error("Error getting location:", error)
      toast.error("Failed to get your location. Please enter it manually.")
    }
  }

  async function handleSubmit() {
    let deleteImageOnError: string[] = []
    setIsSubmitting(true)
    try {
      // Validate the form first
      const validationResult = await form.trigger();
      if (!validationResult) {
        toast.error("Please fill in all required fields correctly");
        setIsSubmitting(false);
        return;
      }

      // Additional validation for category fields based on level
      const level = form.getValues("category.level");
      const category = form.getValues("category");
      
      if (level === "school" && !category.class) {
        toast.error("Please select a class for school level");
        setIsSubmitting(false);
        return;
      }
      
      if (level === "highschool" && (!category.class || !category.faculty)) {
        toast.error("Please select both class and faculty for high school level");
        setIsSubmitting(false);
        return;
      }
      
      if ((level === "bachelors" || level === "masters") && (!category.faculty || !category.year)) {
        toast.error("Please select both faculty and year for " + level);
        setIsSubmitting(false);
        return;
      }
      
      if (level === "exam" && !category.faculty) {
        toast.error("Please select an exam type");
        setIsSubmitting(false);
        return;
      }

      // Validate images
      if (files.length === 0) {
        toast.error("Please upload at least one image");
        setIsSubmitting(false);
        return;
      }

      let uploadedImages: string[] = []
      const values = form.getValues();

      if (files.length > 0) {
        try {
          const uploadResults = await startUpload(files);
          if (uploadResults) {
            uploadedImages = uploadResults.map((result) => result.ufsUrl);
            deleteImageOnError = uploadedImages;
          }
        } catch (uploadError) {
          console.error("Error uploading images:", uploadError);
          toast.error("Failed to upload images. Please try again.");
          return;
        }
      }

      const bookData: CreateBook = {
        userId: userId,
        title: values.title,
        author: values.author,
        description: values.description,
        price: values.type === "Sell" ? values.price : 0,
        condition: values.condition,
        imageUrl: uploadedImages,
        category: values.category,
        type: values.type,
        location: {
          address: values.location.address,
          lat: values.location.lat,
          lon: values.location.lon,
        },
      }

      console.log(bookData)
      const response = await createBook({ bookData })
      if (response?.success) {
        form.reset()
        setFiles([])
        setPreviewUrls([])
        toast.success("Book Listed successfully!..")
      } else {
        toast.error("Failed to list the book. Please try again.")
      }
    } catch (error) {
      await removeMultipleImages(deleteImageOnError)
      deleteImageOnError = []
      console.error("Error submitting form:", error)
      toast.error("An error occurred while listing the book")
    } finally {
      setIsSubmitting(false)
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

  return (
    <div className="min-h-screen w-full bg-[#F9FAFB]">
      <div className="py-3 px-2 h-full">
        <ScrollArea className="h-[calc(100vh-5rem)] w-full">
          <Link
            href="/dashboard/my-listings"
            className="inline-flex fixed items-center text-[#1E3A8A] hover:text-[#0D9488] mb-6 transition-colors z-90"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to books
          </Link>
          <Card className="max-w-4xl mx-auto shadow-lg border-[#1E3A8A] w-full">
            <CardHeader className="bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] border-b">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-white" />
                <div>
                  <CardTitle className="text-2xl text-white">Post a Book</CardTitle>
                  <CardDescription className="text-white/80">
                    Fill in the details to list your book for sale
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8 bg-white">
              <Form {...form}>
                <form className="space-y-8">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#1E3A8A] font-medium">Book Title</FormLabel>
                            <FormControl>
                              <Input
                                disabled={isSubmitting}
                                placeholder="Enter book title"
                                {...field}
                                className="border-[#1E3A8A] focus:border-[#0D9488] focus:ring-[#0D9488] bg-[#F9FAFB]"
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
                            <FormLabel className="text-[#1E3A8A] font-medium">Author</FormLabel>
                            <FormControl>
                              <Input
                                disabled={isSubmitting}
                                placeholder="Enter author name"
                                {...field}
                                className="border-[#1E3A8A] focus:border-[#0D9488] focus:ring-[#0D9488] bg-[#F9FAFB]"
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
                          <FormLabel className="text-[#1E3A8A] font-medium">Description</FormLabel>
                          <FormControl>
                            <Textarea
                              disabled={isSubmitting}
                              placeholder="Describe the book, its condition, etc."
                              {...field}
                              className="min-h-[120px] border-[#1E3A8A] focus:border-[#0D9488] focus:ring-[#0D9488] bg-[#F9FAFB]"
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
                            <FormLabel className="text-[#1E3A8A] font-medium">
                              Price (Rs.){" "}
                              {watchType !== "Sell" && (
                                <FormDescription className="text-[#1E3A8A]">[ No Fee applicable ]</FormDescription>
                              )}
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  placeholder="Enter price"
                                  {...field}
                                  className="pl-10 border-[#1E3A8A] focus:border-[#0D9488] focus:ring-[#0D9488] bg-[#F9FAFB]"
                                  disabled={watchType !== "Sell" || isSubmitting}
                                  min={0}
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1E3A8A]">Rs.</span>
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
                            <FormLabel className="text-[#1E3A8A] font-medium">Condition</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-[#1E3A8A] w-full focus:border-[#0D9488] focus:ring-[#0D9488] bg-[#F9FAFB]">
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {bookCondition.map((condition) => (
                                  <SelectItem disabled={isSubmitting} key={condition} value={condition}>
                                    {condition}
                                  </SelectItem>
                                ))}
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
                            <FormLabel className="text-[#1E3A8A] font-medium">Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-[#1E3A8A] w-full focus:border-[#0D9488] focus:ring-[#0D9488] bg-[#F9FAFB]">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {bookType.map((type) => (
                                  <SelectItem disabled={isSubmitting} key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <FormLabel className="text-[#1E3A8A] font-medium block mb-2">
                        Book Images (Max 5 images)
                        <span className="text-sm text-[#1E3A8A] ml-2">({files.length}/5 images selected)</span>
                      </FormLabel>
                      <div className="border-2 border-dashed border-[#1E3A8A] rounded-lg p-6 text-center bg-[#F9FAFB]">
                        <Input
                          type="file"
                          multiple
                          accept="image/*"
                          id="bookImages"
                          className="hidden"
                          onChange={handleImageChange}
                          ref={fileInputRef}
                          disabled={files.length >= 5 || isSubmitting}
                        />
                        <label
                          htmlFor="bookImages"
                          className={`flex flex-col items-center justify-center ${files.length >= 5 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[#F9FAFB] rounded-lg p-4 transition-colors"}`}
                        >
                          <Upload className="h-10 w-10 text-[#1E3A8A] mb-2" />
                          <span className="text-sm text-[#1E3A8A] font-medium">
                            {files.length >= 5 ? "Maximum 5 images reached" : "Drag & drop images or click to browse"}
                          </span>
                          <span className="text-xs text-[#1E3A8A] mt-1">Max file size: 5MB each</span>
                        </label>
                        {previewUrls.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {previewUrls.map((url, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={url || "/placeholder.svg"}
                                  alt={`Preview ${index}`}
                                  className="w-full h-32 object-cover rounded-lg border border-[#1E3A8A]"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  disabled={isSubmitting}
                                  size="icon"
                                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                                  onClick={() => removeFile(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <FormDescription className="text-[#1E3A8A] mt-2">
                        Upload clear photos of the book cover and important pages
                      </FormDescription>
                    </div>

                    <div className="space-y-4 bg-[#F9FAFB] p-4 rounded-lg border border-[#1E3A8A]">
                      <FormField
                        control={form.control}
                        name="location.address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#1E3A8A] font-medium">Location Address*</FormLabel>
                            <FormControl>
                              <Input
                                disabled={isSubmitting}
                                placeholder="Enter your address"
                                {...field}
                                className="border-[#1E3A8A] focus:border-[#0D9488] focus:ring-[#0D9488] bg-white"
                                onChange={handleAddressChange}
                              />
                            </FormControl>
                            <FormDescription>This address will be shown to potential buyers</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center gap-4">
                        <FormField
                          control={form.control}
                          name="location.lat"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="text-[#1E3A8A] font-medium">Latitude</FormLabel>
                              <FormControl>
                                <Input
                                  disabled={isSubmitting}
                                  placeholder="Latitude"
                                  {...field}
                                  value={field.value || ""}
                                  className="border-[#1E3A8A] focus:border-[#0D9488] focus:ring-[#0D9488] bg-white"
                                  readOnly
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location.lon"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="text-[#1E3A8A] font-medium">Longitude</FormLabel>
                              <FormControl>
                                <Input
                                  disabled={isSubmitting}
                                  placeholder="Longitude"
                                  {...field}
                                  value={field.value || ""}
                                  className="border-[#1E3A8A] focus:border-[#0D9488] focus:ring-[#0D9488] bg-white"
                                  readOnly
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        onClick={handleAutoLocation}
                        variant="outline"
                        type="button"
                        disabled={isSubmitting}
                        className="border-[#1E3A8A] hover:bg-[#F9FAFB] text-[#1E3A8A]"
                      >
                        Use Current Location
                      </Button>
                      {form.watch("location.lat") && form.watch("location.lon") && (
                        <FormDescription className="text-green-600">Location coordinates have been set</FormDescription>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#F9FAFB] px-4 py-4 rounded-lg border border-[#1E3A8A]">
                    <h3 className="font-medium text-[#1E3A8A] mb-6 flex p-2 items-center gap-2">
                      <span className="inline-block w-1.5 h-6 bg-[#0D9488] rounded-full mr-1"></span>
                      Book Category
                    </h3>

                    <Tabs
                      defaultValue={watchLevel}
                      onValueChange={(value) => form.setValue("category.level", value as any)}
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

                      <TabsContent value="school" className="mt-0 ">
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
                                      className={`py-3 px-4 cursor-pointer transition-all duration-200 text-center justify-center ${field.value === (i + 1).toString()
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
                                      className={`py-3 px-6 cursor-pointer transition-all duration-200 ${field.value === val
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
                                      className={`py-3 px-4 cursor-pointer transition-all duration-200 ${field.value === faculty
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
                                      className={`py-3 px-4 cursor-pointer transition-all duration-200 text-center justify-center ${field.value === faculty
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
                                      className={`py-3 px-4 cursor-pointer transition-all duration-200 text-center justify-center ${field.value === year
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
                                      className={`py-3 px-4 cursor-pointer transition-all duration-200 text-center justify-center ${field.value === faculty
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
                                      className={`py-3 px-6 cursor-pointer transition-all duration-200 ${field.value === year
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
                                      className={`py-3 px-4 cursor-pointer transition-all duration-200 text-center justify-center ${field.value === exam
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

                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-[#1E3A8A] hover:bg-[#0D9488] text-white py-6 text-lg font-medium transition-colors"
                  >
                    {isSubmitting ? "Posting..." : "Post Book"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </ScrollArea>
      </div>
    </div>
  )
}