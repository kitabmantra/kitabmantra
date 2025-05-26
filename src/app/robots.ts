import { MetadataRoute } from "next";
import { BASE_URL } from "./sitemap";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/dashboard", "/dashboard/chats", "/dashboard/comments"]
            }
        ],
        sitemap: `${BASE_URL}/sitemap.xml`
    }
}