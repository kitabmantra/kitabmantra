
declare type Book = {
    bookId: string;
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

declare type BookForStore = {
    userId: string;
    _id: string;
    title: string;
    author: string;
    description: string;
    price: number;
    condition: BookCondition
    imageUrl: string[];
    category: {
        level : "school" | "highschool" | "bachelors" | "masters" | "exam",
        faculty ?: string,
        year ?: string,
        class ?: string,
        
    };
    type: BookType;
    location: {lat : number, lon : number};
    createdAt: string;
}

declare type PublicBook = {
    userId: string;
    bookId: string;
    title: string;
    author: string;
    description: string;
    price: number;
    condition: BookCondition
    imageUrl: string[];
    category: {
        level : "school" | "highschool" | "bachelors" | "masters" | "exam",
        faculty ?: string,
        year ?: string,
        class ?: string,
        
    };
    type: "Free" | "Exchange" | "Sell";
    location: {lat : number, lon : number};
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
    category: {
        level ?: "school" | "highschool" | "bachelors" | "masters" | "exam",
        faculty ?: string,
        year ?: string,
        
    };
    type: BookType
    location: string;
}