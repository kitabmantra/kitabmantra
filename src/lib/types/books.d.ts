import { bookCategoryLevel, bookCondition, bookStatus, bookType, examFaculty, mastersFaculty, bachelorsFaculty, highLevelFaculty } from "../utils/data";


declare type BookConditionType = typeof bookCondition[number];
declare type BookTypeType = typeof bookType[number];
declare type BookCategoryLevelType = typeof bookCategoryLevel[number];
declare type HighLevelFacultyType = typeof highLevelFaculty[number];
declare type BachelorsFacultyType = typeof bachelorsFaculty[number];
declare type MastersFacultyType = typeof mastersFaculty[number];
declare type ExamFacultyType = typeof examFaculty[number];
declare type BookStatusType = typeof bookStatus[number];






declare type LocationType = {
    address: string,
    lat?: number,
    lon?: number
}


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
    bookStatus : BookStatusType;
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
    bookStatus : BookStatusType;
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
    bookStatus : BookStatusType
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
    bookId : string
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
    bookStatus : BookStatusType
    
}




