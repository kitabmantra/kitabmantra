import { z } from "zod";
import { bookCategoryLevel, bookCondition, bookStatus, bookType } from "../utils/data";


const coordinatesSchema = z
  .array(z.number())
  .length(2, { message: "Coordinates must contain exactly [longitude, latitude]" })
  .optional();

export const BookFormValidation = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  author: z.string().min(2, { message: "Author must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number" }),
  
  condition: z.enum(bookCondition, {
    errorMap: () => ({ message: "Please select a valid book condition" }),
  }),

  imageUrl: z.array(z.string().url({ message: "Each image must be a valid URL" })).min(1, {
    message: "At least one image URL is required",
  }),
  
  category: z.object({
    level: z.enum(bookCategoryLevel, {
      errorMap: () => ({ message: "Please select a valid category level" }),
    }),
    faculty: z.string().optional(),
    year: z.string().optional(),
    class: z.string().optional(),
  }).refine((data) => {
    // School level validation
    if (data.level === "school" && !data.class) {
      return false;
    }
    // High school level validation
    if (data.level === "highschool" && (!data.class || !data.faculty)) {
      return false;
    }
    // Bachelors and Masters level validation
    if ((data.level === "bachelors" || data.level === "masters") && (!data.faculty || !data.year)) {
      return false;
    }
    // Exam level validation
    if (data.level === "exam" && !data.faculty) {
      return false;
    }
    return true;
  }, {
    message: "Please fill in all required category fields",
  }),

  type: z.enum(bookType, {
    errorMap: () => ({ message: "Please select a valid book type" }),
  }),

  location: z.object({
    address: z.string().min(1, { message: "Address is required" }),
    coordinates : coordinatesSchema
  }),
});

export const EditBookFormValidation = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  author: z.string().min(2, { message: "Author must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number" }),
  
  condition: z.enum(bookCondition, {
    errorMap: () => ({ message: "Please select a valid book condition" }),
  }),

  imageUrl: z.array(z.string().url({ message: "Each image must be a valid URL" })).min(1, {
    message: "At least one image URL is required",
  }),

  bookStatus : z.enum(bookStatus,{
    errorMap : () =>({message : "plese select a book status"}),
  }),
  category: z.object({
    level: z.enum(bookCategoryLevel, {
      errorMap: () => ({ message: "Please select a valid category level" }),
    }),
    faculty: z.string().optional(),
    year: z.string().optional(),
    class: z.string().optional(),
  }).refine((data) => {
    // School level validation
    if (data.level === "school" && !data.class) {
      return false;
    }
    // High school level validation
    if (data.level === "highschool" && (!data.class || !data.faculty)) {
      return false;
    }
    // Bachelors and Masters level validation
    if ((data.level === "bachelors" || data.level === "masters") && (!data.faculty || !data.year)) {
      return false;
    }
    // Exam level validation
    if (data.level === "exam" && !data.faculty) {
      return false;
    }
    return true;
  }, {
    message: "Please fill in all required category fields",
  }),

  type: z.enum(bookType, {
    errorMap: () => ({ message: "Please select a valid book type" }),
  }),

  location: z.object({
    address: z.string().min(1, { message: "Address is required" }),
    coordinates: coordinatesSchema
  }),
});
