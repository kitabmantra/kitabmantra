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