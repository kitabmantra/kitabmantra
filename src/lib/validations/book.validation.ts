import { z } from "zod";

export const BookFormValidation = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    author: z.string().min(2, "Author must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.coerce.number().min(0, "Price must be a positive number"),
    condition: z.enum(["New", "Like New", "Good", "Fair", "Poor"]),
    imageUrl: z.string().optional(),
    category: z.object({
      level: z.enum(["school", "highschool", "bachelors", "masters", "exam"]),
      faculty: z.string().optional(),
      year: z.string().optional(),
      class: z.string().optional(),
    }),
  })
  