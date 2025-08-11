/*eslint-disable*/
"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { createQuiz } from "@/lib/actions/quiz/post/create-quiz"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
export interface QuestionOutput {
  question: string
  options: string[]
  correctAnswer: string
  difficulty: string
  hints?: string
  referenceUrl?: string
  metadata: Record<string, string>
}

const questionFormSchema = z.object({
  question: z
    .string()
    .min(5, "Question must be at least 5 characters")
    .max(1000, "Question cannot exceed 1000 characters"),
  option1: z.string().min(1, "Option 1 is required"),
  option2: z.string().min(1, "Option 2 is required"),
  option3: z.string().min(1, "Option 3 is required"),
  option4: z.string().min(1, "Option 4 is required"),
  correctAnswer: z.enum(["option1", "option2", "option3", "option4"], {
    required_error: "Please select the correct answer",
  }),
  difficulty: z.enum(["easy", "medium", "hard"], {
    required_error: "Please select difficulty level",
  }),
  hints: z.string().optional(),
  referenceUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  metadata: z
    .array(
      z.object({
        key: z.string().min(1, "Key is required"),
        value: z.string().min(1, "Value is required"),
      }),
    )
    .max(6, "Maximum 6 metadata fields allowed")
    .optional(),
})

export type QuestionFormValues = z.infer<typeof questionFormSchema>



const defaultValues: QuestionFormValues = {
  question: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  correctAnswer: "option1",
  difficulty: "medium",
  hints: "",
  referenceUrl: "",
  metadata: [],
}

const difficulties = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
]

function CreateQuestionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [metadata, setMetadata] = useState<Array<{ key: string; value: string }>>([])
  const [metadataErrors, setMetadataErrors] = useState<string[]>([])
  const router = useRouter()

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const watchedValues = form.watch()

  const addCustomMetadata = () => {
    if (metadata.length < 6) {
      setMetadata([...metadata, { key: "", value: "" }])
      setMetadataErrors([])
      // Focus on the key input of the newly added field
      setTimeout(() => {
        const keyInputs = document.querySelectorAll('input[placeholder="Key"]')
        const lastKeyInput = keyInputs[keyInputs.length - 1] as HTMLInputElement
        if (lastKeyInput) {
          lastKeyInput.focus()
        }
      }, 100)
    }
  }

  const removeCustomMetadata = (index: number) => {
    setMetadata(metadata.filter((_, i) => i !== index))
    setMetadataErrors([])
  }

  const updateCustomMetadata = (index: number, field: "key" | "value", value: string) => {
    const updated = [...metadata]
    updated[index][field] = value
    setMetadata(updated)
    setMetadataErrors([])
  }

  const validateMetadata = () => {
    const errors: string[] = []
    const keys = new Set<string>()
    
    metadata.forEach((field, index) => {
      if (!field.key.trim()) {
        errors.push(`Field ${index + 1}: Key is required`)
      } else {
        const keyLower = field.key.trim().toLowerCase()
        if (keys.has(keyLower)) {
          errors.push(`Field ${index + 1}: Key "${field.key.trim()}" already exists (case-insensitive)`)
        } else {
          keys.add(keyLower)
        }
      }
      
      if (!field.value.trim()) {
        errors.push(`Field ${index + 1}: Value is required`)
      }
    })
    return errors
  }

  const resetAllMetadata = () => {
    setMetadata([])
    setMetadataErrors([])
  }

  const onSubmit = async (values: QuestionFormValues) => {
    const metadataErrors = validateMetadata()
    if (metadataErrors.length > 0) {
      setMetadataErrors(metadataErrors)
      return
    }

    setMetadataErrors([])
    setIsSubmitting(true)
    
    try {
      const questionOutput: QuestionOutput = {
        question: values.question,
        options: [
          values.option1.toLowerCase(),
          values.option2.toLowerCase(),
          values.option3.toLowerCase(),
          values.option4.toLowerCase()
        ],
        correctAnswer: values[values.correctAnswer].toLowerCase(),
        difficulty: values.difficulty,
        hints: values.hints || undefined,
        referenceUrl: values.referenceUrl || undefined,
        metadata: metadata.reduce((acc, item) => ({ 
          ...acc, 
          [item.key.toLowerCase()]: item.value.toLowerCase() 
        }), {}),
      }

      const res = await createQuiz(questionOutput)
      if(res.success && res.message){
        toast.success(res.message || "Question created successfully")
        // Only reset form after successful creation
        form.reset(defaultValues)
        setMetadata([])
        setMetadataErrors([])
        router.push("/quiz-section")
      }else if(res.error){
        toast.error(res.error  as string || "Failed to create question")

        // Don't reset form on error - let user fix and retry
      }

    } catch (error) {
      console.error("Failed to create question:", error)
      toast.error("Failed to create question. Please try again.")
      // Don't reset form on error - let user fix and retry
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-700 bg-green-50"
      case "medium":
        return "text-amber-700 bg-amber-50"
      case "hard":
        return "text-red-700 bg-red-50"
      default:
        return "text-gray-700 bg-gray-50"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-semibold">Create Question</CardTitle>
              <p className="text-sm text-gray-600">Add a new multiple choice question</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Question */}
                  <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              placeholder="Enter your question here..."
                              rows={3}
                              className="resize-none pr-16"
                              maxLength={1000}
                              {...field}
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                              {field.value.length}/1000
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Options */}
                  <div className="space-y-3">
                    <Label>Answer Options *</Label>
                    <RadioGroup
                      value={watchedValues.correctAnswer}
                      onValueChange={(value) => form.setValue("correctAnswer", value as any)}
                      className="space-y-2"
                    >
                      {(["option1", "option2", "option3", "option4"] as const).map((optionKey, index) => (
                        <div key={optionKey} className="flex items-center space-x-3">
                          <RadioGroupItem value={optionKey} id={optionKey} />
                          <div className="flex-1">
                            <FormField
                              control={form.control}
                              name={optionKey}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder={`Option ${index + 1}`}
                                      className={
                                        watchedValues.correctAnswer === optionKey ? "border-green-300 bg-green-50" : ""
                                      }
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          {watchedValues.correctAnswer === optionKey && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              Correct
                            </Badge>
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Difficulty */}
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty Level *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {difficulties.map((difficulty) => (
                              <SelectItem key={difficulty.value} value={difficulty.value}>
                                <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(difficulty.value)}`}>
                                  {difficulty.label}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="hints"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hints</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Optional hints..." rows={2} className="resize-none" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">Optional</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="referenceUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reference URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">Optional</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Metadata */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label>Metadata</Label>
                        <Badge variant="outline" className="text-xs">
                          {metadata.length}/6
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {metadata.length > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={resetAllMetadata}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Reset All
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addCustomMetadata}
                          disabled={metadata.length >= 6}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>

                    {metadata.length > 0 && (
                      <div className="space-y-2">
                        {metadata.map((field, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                            <Input
                              placeholder="Key"
                              value={field.key}
                              onChange={(e) => updateCustomMetadata(index, "key", e.target.value)}
                              className="flex-1"
                            />
                            <Input
                              placeholder="Value"
                              value={field.value}
                              onChange={(e) => updateCustomMetadata(index, "value", e.target.value)}
                              className="flex-1"
                            />
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeCustomMetadata(index)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {metadata.length >= 6 && (
                      <div className="flex items-center gap-2 text-amber-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>Maximum 6 fields reached</span>
                      </div>
                    )}

                    {metadataErrors.length > 0 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-800">Please fix these errors:</p>
                            <ul className="text-sm text-red-700 mt-1">
                              {metadataErrors.map((error, index) => (
                                <li key={index}>• {error}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to reset the form? All entered data will be lost.")) {
                          form.reset(defaultValues)
                          setMetadata([])
                          setMetadataErrors([])
                        }
                      }}
                      disabled={isSubmitting}
                    >
                      Reset
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating...
                        </div>
                      ) : (
                        "Create Question"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CreateQuestionPage
