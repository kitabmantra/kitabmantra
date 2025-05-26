import { useEffect, useState } from "react"

export function useMediaQuery(query: string): boolean | null {
    const [matches, setMatches] = useState<boolean | null>(null)

    useEffect(() => {
        const media = window.matchMedia(query)
        const listener = () => setMatches(media.matches)
        setMatches(media.matches)
        media.addEventListener("change", listener)
        return () => media.removeEventListener("change", listener)
    }, [query])

    return matches
}
