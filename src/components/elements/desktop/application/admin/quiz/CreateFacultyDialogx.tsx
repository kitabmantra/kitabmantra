"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import toast from "react-hot-toast"

const facultySchema = z.object({
  name: z.string().min(2, "Faculty name is required").max(20, "Max 20 characters"),
  code: z.string().min(2, "Faculty code is required").max(10, "Max 10 characters"),
})

type FacultyFormValues = z.infer<typeof facultySchema>

interface CreateFacultyDialogProps {
  onCreated?: (faculty: FacultyFormValues) => void | Promise<void>
  triggerLabel?: string
}

function CreateFacultyDialog({ onCreated, triggerLabel = "Create Faculty" }: CreateFacultyDialogProps) {
  const [open, setOpen] = useState(false)

  const form = useForm<FacultyFormValues>({
    resolver: zodResolver(facultySchema),
    defaultValues: { name: "", code: "" },
    mode: "onChange",
  })

  const onSubmit = async (values: FacultyFormValues) => {
    // Simulate API call or delegate to parent
    await new Promise(resolve => setTimeout(resolve, 400))
    try {
      if (onCreated) await onCreated(values)
      toast.success(`Faculty created: ${values.name} (${values.code})`)
      form.reset({ name: "", code: "" })
      setOpen(false)
    } catch (err) {
      toast.error("Failed to create faculty")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Faculty</DialogTitle>
          <DialogDescription>Enter basic details to create a new faculty.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faculty Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Computer Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faculty Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CS" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateFacultyDialog
