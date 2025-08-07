"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { updateBookData } from "@/lib/actions/books/update/update-book-data"
import { removeMultipleImages } from "@/lib/actions/uploadthing/delete-images"
import { BookCategoryLevelType, PublicBook, UpdateBook } from "@/lib/types/books"
import {
  bachelorsFaculty,
  bookCategoryLevel,
  bookCondition,
  bookStatus,
  bookType,
  examFaculty,
  highLevelFaculty,
  mastersFaculty,
} from "@/lib/utils/data"
import { useUploadThing } from "@/lib/utils/uploadthing-client"
import {  EditBookFormValidation } from "@/lib/validations/book.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, BookOpen,  Trash2, Upload, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"


interface BookEditFormProps {
  initialData: PublicBook
}

export function BookEditForm({ initialData }: BookEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverImages, setServerImages] = useState<string[]>(initialData.imageUrl || [])
  const [newImages, setNewImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [removedServerImages, setRemovedServerImages] = useState<string[]>([])
  const [showCoordinates, setShowCoordinates] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { startUpload } = useUploadThing("imageUploader")
  const router = useRouter();

  const form = useForm<z.infer<typeof EditBookFormValidation>>({
    resolver: zodResolver(EditBookFormValidation),
    defaultValues: {
      title: initialData.title,
      author: initialData.author,
      description: initialData.description,
      price: initialData.price,
      condition: initialData.condition,
      bookStatus: initialData.bookStatus,
      type: initialData.type,
      category: {
        level: initialData.category.level,
        faculty: initialData.category.faculty || "",
        year: initialData.category.year || "",
        class: initialData.category.class || "",
      },
      location: {
        address: initialData.location.address,
        coordinates: initialData.location.coordinates ? [initialData.location.coordinates[0], initialData.location.coordinates[1]] as [number, number] : undefined,
      },
    },
  })

  useEffect(() => {
    if (initialData.location.coordinates) {
      setShowCoordinates(true);
    }
  }, [initialData.location.coordinates]);

  console.log("this is new files : ",newImages)
  console.log("this is server Images : ",serverImages)
  console.log("this is deleted ServerImages : ",removedServerImages)
  

  const watchLevel = form.watch("category.level")
  const watchType = form.watch("type")

  useEffect(() => {
    if (watchType === "Free" || watchType === "Exchange") {
      form.setValue("price", 0)
    }
  }, [watchType, form])

  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  
  useEffect(() => {
    if (!initialLoadComplete) {
      setInitialLoadComplete(true)
      return
    }

    switch (watchLevel) {
      case "school":
        form.setValue("category.faculty", "")
        form.setValue("category.year", "")
        break
      case "highschool":
        form.setValue("category.year", "")
        break
      case "bachelors":
      case "masters":
        form.setValue("category.class", "")
        break
      case "exam":
        form.setValue("category.year", "")
        form.setValue("category.class", "")
        break
    }
  }, [watchLevel, form, initialLoadComplete])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      const totalImages = serverImages.length + newImages.length
      
      if (filesArray.length + totalImages > 5) {
        toast.error("You can upload a maximum of 5 images")
        return
      }

      const newFiles = filesArray.slice(0, 5 - totalImages)
      setNewImages(prev => [...prev, ...newFiles])

      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file))
      setPreviewUrls(prev => [...prev, ...newPreviewUrls])
    }
  }

  const removeServerImage = (index: number) => {
    const imageToRemove = serverImages[index]
    setRemovedServerImages(prev => [...prev, imageToRemove])
    setServerImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeNewImage = (index: number) => {
    const imageToRemove = previewUrls[index]
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove)
    }
    
    setNewImages(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleAutoLocation = async () => {
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
        coordinates: [longitude, latitude] as [number, number],
      })
      setShowCoordinates(true)
      toast.success("Location set successfully!")
    } catch (error) {
      console.error("Error getting location:", error)
      toast.error("Failed to get your location. Please enter it manually.")
    }
  }

  const handleCoordinateChange = (type: 'lat' | 'lon', value: string) => {
    const currentLocation = form.getValues("location");
    const coordinates = currentLocation.coordinates || [0, 0] as [number, number];
    
    if (type === 'lat') {
      coordinates[1] = parseFloat(value) || 0;
    } else {
      coordinates[0] = parseFloat(value) || 0;
    }
    
    form.setValue("location.coordinates", coordinates as [number, number]);
  }

  const handleFormSubmit = async () => {
    setIsSubmitting(true)
    let deleteImagesOnError: string[] = [];
    try {
      const values = form.getValues();
      let newUploadedImage: string[] = [];

      const [, uploadResult] = await Promise.all([
        removedServerImages.length > 0 ? removeMultipleImages(removedServerImages) : Promise.resolve(),
        newImages.length > 0 ? startUpload(newImages) : Promise.resolve([])
      ]);

      if (uploadResult) {
        newUploadedImage = uploadResult.map((result) => result.ufsUrl);
        deleteImagesOnError = newUploadedImage;
      }

      const newBookData: UpdateBook = {
        bookId: initialData.bookId,
        title: values.title,
        author: values.author,
        description: values.description,
        price: values.price,
        condition: values.condition,
        imageUrl: [...serverImages, ...newUploadedImage],
        category: values.category,
        type: values.type,
        location: {
          address: values.location.address,
          coordinates: values.location.coordinates ? [values.location.coordinates[0], values.location.coordinates[1]] as [number, number] : undefined,
        },
        bookStatus: values.bookStatus,
      }

      const response = await updateBookData({ bookData: newBookData });
      
      if (response.success && response.message) {
        toast.success(response.message);
        router.push(`/dashboard/my-listings/${initialData.bookId}`);
      } else if (response.error && !response.success) {
        toast.error(response.error);
        if (deleteImagesOnError.length > 0) {
          try {
            await removeMultipleImages(deleteImagesOnError);
          } catch (cleanupError) {
            console.error("Failed to clean up uploaded images:", cleanupError);
          }
        }
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to update book");
      if (deleteImagesOnError.length > 0) {
        try {
          await removeMultipleImages(deleteImagesOnError);
        } catch (cleanupError) {
          console.error("Failed to clean up uploaded images:", cleanupError);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  const isPriceDisabled = watchType === "Free" || watchType === "Exchange"

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
    <div className="min-h-screen flex justify-center w-full bg-[#F9FAFB]">
      <div className="py-3 px-2 h-full w-full max-w-7xl">
        <ScrollArea className="h-[calc(100vh-5rem)] w-full">
          <Link
            href={`/dashboard/my-listings/${initialData.bookId}`}
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
                  <CardTitle className="text-2xl text-white">Edit Book</CardTitle>
                  <CardDescription className="text-white/80">
                    Update your book details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8 bg-white">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
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

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#1E3A8A] font-medium">
                              Price (Rs.){" "}
                              {isPriceDisabled && (
                                <FormDescription className="text-[#4B5563]">[ No Fee ]</FormDescription>
                              )}
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  placeholder="Enter price"
                                  {...field}
                                  className="pl-10 border-[#1E3A8A] focus:border-[#0D9488] focus:ring-[#0D9488] bg-[#F9FAFB]"
                                  disabled={isPriceDisabled || isSubmitting}
                                  min={0}
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0D9488]">Rs.</span>
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
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-[#1E3A8A] focus:border-[#0D9488] focus:ring-[#0D9488] bg-[#F9FAFB]">
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
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-[#1E3A8A] focus:border-[#0D9488] focus:ring-[#0D9488] bg-[#F9FAFB]">
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
                      <FormField
                        control={form.control}
                        name="bookStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#1E3A8A] font-medium">Book Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-[#1E3A8A] focus:border-[#0D9488] focus:ring-[#0D9488] bg-[#F9FAFB]">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {bookStatus.map((status) => (
                                  <SelectItem disabled={isSubmitting} key={status} value={status}>
                                    {status}
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
                        <span className="text-sm text-[#4B5563] ml-2">({serverImages.length + newImages.length}/5 images selected)</span>
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
                          disabled={serverImages.length + newImages.length >= 5 || isSubmitting}
                        />
                        <label
                          htmlFor="bookImages"
                          className={`flex flex-col items-center justify-center ${serverImages.length + newImages.length >= 5 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-white rounded-lg p-4 transition-colors"}`}
                        >
                          <Upload className="h-10 w-10 text-[#0D9488] mb-2" />
                          <span className="text-sm text-[#4B5563] font-medium">
                            {serverImages.length + newImages.length >= 5 ? "Maximum 5 images reached" : "Drag & drop images or click to browse"}
                          </span>
                          <span className="text-xs text-[#0D9488] mt-1">Max file size: 5MB each</span>
                        </label>

                        {/* Server images */}
                        {serverImages.length > 0 && (
                          <div className="mt-6">
                            <h4 className="text-sm font-medium mb-2 text-left text-[#1E3A8A]">Existing Images</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                              {serverImages.map((url, index) => (
                                <div key={`server-${index}`} className="relative group">
                                  <Image
                                    src={url}
                                    width={500}
                                    height={500}
                                    alt={`Existing ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border border-[#1E3A8A]"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                                    onClick={() => removeServerImage(index)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* New images */}
                        {previewUrls.length > 0 && (
                          <div className="mt-6">
                            <h4 className="text-sm font-medium mb-2 text-left text-[#1E3A8A]">New Images</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                              {previewUrls.map((url, index) => (
                                <div key={`new-${index}`} className="relative group">
                                  <Image
                                    src={url}
                                    height={500}
                                    width={500}
                                    alt={`New ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border border-[#1E3A8A]"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                                    onClick={() => removeNewImage(index)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <FormDescription className="text-[#4B5563] mt-2">
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
                              />
                            </FormControl>
                            <FormDescription>This address will be shown to potential buyers</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        onClick={handleAutoLocation}
                        variant="outline"
                        type="button"
                        disabled={isSubmitting}
                        className="border-[#1E3A8A] hover:bg-[#F9FAFB] text-[#1E3A8A] hover:text-[#0D9488]"
                      >
                        Use Current Location
                      </Button>

                      {showCoordinates && (
                        <>
                          <div className="flex items-center gap-4 mt-4">
                            <FormField
                              control={form.control}
                              name="location.coordinates.0"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel className="text-[#1E3A8A] font-medium">Latitude</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="any"
                                      disabled={isSubmitting}
                                      placeholder="Latitude"
                                      value={field.value || ""}
                                      onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                                      className="border-[#1E3A8A] focus:border-[#0D9488] focus:ring-[#0D9488] bg-white"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="location.coordinates.1"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel className="text-[#1E3A8A] font-medium">Longitude</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="any"
                                      disabled={isSubmitting}
                                      placeholder="Longitude"
                                      value={field.value || ""}
                                      onChange={(e) => handleCoordinateChange('lon', e.target.value)}
                                      className="border-[#1E3A8A] focus:border-[#0D9488] focus:ring-[#0D9488] bg-white"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormDescription className="text-green-600">Location coordinates have been set. You can edit them if needed.</FormDescription>
                        </>
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
                      onValueChange={(value) => form.setValue("category.level", value as BookCategoryLevelType)}
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
                                          ? "bg-[#F9FAFB] text-[#0D9488] shadow-md border-[#0D9488]"
                                          : "bg-[#F9FAFB] text-[#4B5563] hover:text-[#0D9488] border-[#1E3A8A]"
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
                                          ? "bg-[#F9FAFB] text-[#0D9488] shadow-md border-[#0D9488]"
                                          : "bg-[#F9FAFB] text-[#4B5563] hover:text-[#0D9488] border-[#1E3A8A]"
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
                                          ? "bg-[#F9FAFB] text-[#0D9488] shadow-md border-[#0D9488]"
                                          : "bg-[#F9FAFB] text-[#4B5563] hover:text-[#0D9488] border-[#1E3A8A]"
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
                                          ? "bg-[#F9FAFB] text-[#0D9488] shadow-md border-[#0D9488]"
                                          : "bg-[#F9FAFB] text-[#4B5563] hover:text-[#0D9488] border-[#1E3A8A]"
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
                                          ? "bg-[#F9FAFB] text-[#0D9488] shadow-md border-[#0D9488]"
                                          : "bg-[#F9FAFB] text-[#4B5563] hover:text-[#0D9488] border-[#1E3A8A]"
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
                                          ? "bg-[#F9FAFB] text-[#0D9488] shadow-md border-[#0D9488]"
                                          : "bg-[#F9FAFB] text-[#4B5563] hover:text-[#0D9488] border-[#1E3A8A]"
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
                                          ? "bg-[#F9FAFB] text-[#0D9488] shadow-md border-[#0D9488]"
                                          : "bg-[#F9FAFB] text-[#4B5563] hover:text-[#0D9488] border-[#1E3A8A]"
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
                                          ? "bg-[#F9FAFB] text-[#0D9488] shadow-md border-[#0D9488]"
                                          : "bg-[#F9FAFB] text-[#4B5563] hover:text-[#0D9488] border-[#1E3A8A]"
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
                    </Tabs>
                  </div>

                  <Button 
                    onClick={handleFormSubmit}
                    disabled={isSubmitting} 
                    className="w-full bg-[#1E3A8A] hover:bg-[#0D9488] text-white py-6 text-lg font-medium transition-colors"
                  >
                    {isSubmitting ? "Updating..." : "Update Book"}
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