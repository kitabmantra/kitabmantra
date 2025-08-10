import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        
        // Set a test cookie
        cookieStore.set("test_cookie", "test_value", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            path: "/",
        });

        // Get all cookies
        const allCookies = cookieStore.getAll();
        
        return NextResponse.json({
            success: true,
            message: "Test cookie set successfully",
            cookies: allCookies.map(cookie => ({
                name: cookie.name,
                value: cookie.value
            }))
        });
    } catch (error) {
        console.error("Error setting test cookie:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to set test cookie"
        }, { status: 500 });
    }
} 