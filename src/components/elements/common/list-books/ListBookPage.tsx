"use client"
import React from 'react'
import BookForm from '../../desktop/application/list-book/BookForm';
import { useIsMobile } from '@/lib/hooks/responsive/useIsMobile';
import MBookForm from '../../mobile/list-books/MBookForm';

interface ListBookPageProps {
    userId: string;
}

const ListBookPage = ({
    userId
}: ListBookPageProps) => {
    const isMobile = useIsMobile()
    if (isMobile === null) return null 
    return isMobile
        ? <MBookForm userId={userId} />
        : <BookForm userId={userId} />
}

export default ListBookPage
