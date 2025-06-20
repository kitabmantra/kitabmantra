/*eslint-disable*/
"use server"
import { getBookModel } from "@/lib/hooks/database/get-book-model"

export type GetBooksOptions = {
  page?: number,
  limit?: number
  search?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  type?: string
  level?: string
  faculty?: string
  year?: string
  class?: string
}

export async function getBooks(options: GetBooksOptions = {}) {
  const {

    search = '',
    minPrice,
    maxPrice,
    condition,
    type,
    level,
    faculty,
    year,
    class: bookClass
  } = options
  let { page = 1,
    limit = 30, } = options;

  try {

    const query : any = {

    }


    if (search && search.trim() != "") {
       query.$text =  {$search : search.trim()}
    }
    

     const priceConditions: any = {};
    let hasPriceConditions = false;

    if (minPrice !== undefined && minPrice > 0) {
      priceConditions.$gte = Number(minPrice);
      hasPriceConditions = true;
    }
    if (maxPrice !== undefined && maxPrice < 10000) {
      priceConditions.$lte = Number(maxPrice);
      hasPriceConditions = true;
    }

    if (hasPriceConditions) {
      query.price = priceConditions;
    }

    if (condition) {
      query.condition = condition
    }

    if (type) {
      query.type = type
    }

    if (level) {
      query['category.level'] = level
    }

    if (faculty) {
      query['category.faculty'] = faculty
    }

    if (year) {
      query['category.year'] = year
    }

    if (bookClass) {
      query['category.class'] = bookClass
    }

    const Book = await getBookModel()

    if (limit > 30) limit = 30;
    if (page < 0) page = 1;

    const skip = (Number(page) - 1) * Number(limit)
    query.bookStatus = 'available';



    const [books, totalBooks] = await Promise.all([
      await Book.find(query)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
      await Book.countDocuments(query).exec()
    ])




    const totalPages = Math.ceil(totalBooks / Number(limit))
    const hasNextPage = Number(page) < totalPages
    const hasPrevPage = Number(page) > 1

    const bookToBeSent = books.map(book => ({
      ...book,
      createdAt: book.createdAt?.toISOString(),
      updatedAt: book.updatedAt?.toISOString()
    }));

 

    return {
      success: true,
      books: JSON.stringify(bookToBeSent),
      totalBooks,
      totalPages,
      currentPage: Number(page),
      hasNextPage,
      hasPrevPage,
      limit: Number(limit)
    }

  } catch (error) {
    console.error('Error fetching books:', error)
    return {
      success: false,
      error: 'Failed to fetch books',
      books: JSON.stringify([]),
      totalBooks: 0,
      totalPages: 0,
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false,
      limit: Number(limit)
    }
  }
}