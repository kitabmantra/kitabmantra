import { getAllBooks } from "@/lib/actions/books/get/getAllBooks";
import { MetadataRoute } from "next";

export const BASE_URL = "https://kitabmantra.vercel.app"
// export const BASE_URL = "http://localhost:3000"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { formattedBooks } = await getAllBooks()

    const bookEntries: MetadataRoute.Sitemap = formattedBooks?.map(({ bookId }) => ({
        url: `${BASE_URL}/marketplace/books/${bookId}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: 0.8,
    })) ?? [];
    return [
        {
            url: `${BASE_URL}`,
            priority: 1,
        },
        {
            url: `${BASE_URL}/login`,
            priority: 1,
        },
        {
            url: `${BASE_URL}/marketplace`,
            priority: 1,
        },
        ...bookEntries
    ]
}