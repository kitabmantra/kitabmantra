export type CreateQuizQuestionType = {
    correctAnswer : string;
    difficulty : "easy" | "medium" | "hard";
    hint ?: string
    metadata? : {
        key : string;
        value : string;
    }[];
    question : string;
    referenceUrl? : string;
    options : string[];
}


export interface QuestionData {
    question: string
    options: string[]
    correctAnswer: number
    difficulty: "easy" | "medium" | "hard"
    hint?: string
    referenceUrl?: string
    tags: string[]
    priority: number
    subjectName: string
  }
  
  export interface CreateQuestionRequest {
    type: "academic"
    levelName: string
    faculty: string
    yearName: string
    question: string
    options: string[]
    correctAnswer: string
    difficulty: "easy" | "medium" | "hard"
    tags: string[]
    priority: number
    hint?: string
    subjectName: string
    referenceUrl?: string
  }
  
  export type CreationMode = "single" | "multiple" | "import" | "ai"
  
