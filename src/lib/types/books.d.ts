import { bookCategoryLevel, bookCondition, bookStatus, bookType, examFaculty, mastersFaculty, bachelorsFaculty, highLevelFaculty } from "../utils/data";


declare type BookConditionType = typeof bookCondition[number];
declare type BookTypeType = typeof bookType[number];
declare type BookCategoryLevelType = typeof bookCategoryLevel[number];
declare type HighLevelFacultyType = typeof highLevelFaculty[number];
declare type BachelorsFacultyType = typeof bachelorsFaculty[number];
declare type MastersFacultyType = typeof mastersFaculty[number];
declare type ExamFacultyType = typeof examFaculty[number];
declare type BookStatusType = typeof bookStatus[number];


declare type ActivityType = {
    _id: string,
    customerId: string,
    customerName: string,
    customerEmail: string,
    customerPhoneNumber: string,
    bookOwnerId: string,
    bookStatus: BookStatusType,
    bookTitle: string,
    bookAuthor: string,
    bookDescription: string,
    bookPrice: number,
    requestStatus: "pending" | "rejected" | "accepted",
    bookId: string,
    bookOwnerName: string,
    bookOwnerEmail: string,
    bookOwnerPhoneNumber: string,
    bookStatus: string,
    createdAt: Date,
    updatedAt: Date,
}



declare type LocationType = {
    address: string;
    coordinates?: [number, number];
};


declare type Book = {
    userId: string
    bookId: string;
    title: string;
    author: string;
    description: string;
    price: number;
    condition: BookConditionType
    imageUrl: string[];
    category: string;
    type: BookTypeType;
    location: string;
    createdAt: string;
    bookStatus: BookStatusType;
}

declare type BookForStore = {
    userId: string;
    _id: string;
    title: string;
    author: string;
    description: string;
    price: number;
    condition: BookConditionType
    imageUrl: string[];
    category: {
        level: BookCategoryLevelType
        faculty?: string,
        year?: string,
        class?: string,

    };
    type: BookTypeType;
    location: LocationType,
    createdAt: string;
    bookStatus: BookStatusType;
}

declare type PublicBook = {
    userId: string;
    bookId: string;
    title: string;
    author: string;
    description: string;
    price: number;
    condition: BookConditionType
    imageUrl: string[];
    category: {
        level: BookCategoryLevelType
        faculty?: string,
        year?: string,
        class?: string,

    };
    type: BookTypeType
    bookStatus: BookStatusType
    location: LocationType
    createdAt: string;
}


declare type PublicBookWithId = {
    userId: string;
    userName: string,
    bookId: string;
    title: string;
    author: string;
    description: string;
    price: number;
    condition: BookConditionType
    imageUrl: string[];
    category: {
        level: BookCategoryLevelType
        faculty?: string,
        year?: string,
        class?: string,

    };
    type: BookTypeType
    bookStatus: BookStatusType
    location: LocationType
    createdAt: string;

}





declare type CreateBook = {
    userId: string;
    title: string;
    author: string;
    description: string;
    price: number;
    condition: BookConditionType
    imageUrl: string[];
    category: {
        level: BookCategoryLevelType,
        faculty?: string,
        year?: string,
        class?: string

    };
    type: BookTypeType
    location: LocationType

}


declare type UpdateBook = {
    bookId: string
    title: string;
    author: string;
    description: string;
    price: number;
    condition: BookConditionType
    imageUrl: string[];
    category: {
        level: BookCategoryLevelType,
        faculty?: string,
        year?: string,
        class?: string

    };
    type: BookTypeType
    location: LocationType
    bookStatus: BookStatusType

}




