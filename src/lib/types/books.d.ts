declare type Book = {
    bookId: string;
    userId: string;
    title: string;
    author: string;
    description: string;
    price: number;
    condition: BookCondition
    imageUrl: string[];
    category: string;
    type: BookType;
    location: string;
    createdAt: string;
}

type BookType = "Free" | "Exchange" | "Sell"

type BookCondition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor'

declare type CreateBook = {
    userId: string;
    title: string;
    author: string;
    description: string;
    price: number;
    condition: BookCondition
    imageUrl: string[];
    category: string;
    type: BookType
    location: string;
}