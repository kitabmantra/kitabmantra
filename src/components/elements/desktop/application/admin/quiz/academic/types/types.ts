import { z } from "zod"

// Validation schema
export const levelSchema = z.object({
  levelName: z
    .string()
    .min(2, "Level name must be at least 2 characters")
    .max(50, "Level name must be less than 50 characters")
    .regex(/^[a-zA-Z0-9\-_\s]+$/, "Only letters, numbers, hyphens, underscores, and spaces are allowed")
    .transform((val) =>
      val
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9\-_]/g, ""),
    ),
})

export type LevelFormValues = z.infer<typeof levelSchema>

export interface AcademicCategory {
  id: string
  type: "academic" | "entrance"
  levelName: string
  createdAt: string
} 