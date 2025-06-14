"use client"
import { useEffect, useRef } from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchAndFilterProps {
    searchInput: string;
    setSearchInput: (value: string) => void;
    isLoading: boolean;
    isFetching: boolean;
}

export const SearchAndFilter = ({ 
    searchInput, 
    setSearchInput, 
    isLoading, 
    isFetching 
}: SearchAndFilterProps) => {
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isLoading && !isFetching && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isLoading, isFetching]);

    return (
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0D9488] h-4 w-4" />
            <Input
                ref={searchInputRef}
                placeholder="Search activities..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 border-[#1E3A8A] focus:border-[#0D9488] focus:ring-[#0D9488]"
                disabled={isLoading || isFetching}
            />
        </div>
    );
}; 