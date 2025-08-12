'use server'

export interface CreateQuestionRequestType{
    correctAnswer : string 
    difficulty : 'easy' | 'medium' | 'hard'
    hint : string 
    subjectName : string
    levelName : string
    yearName : string
    facultyName : string
    referenceUrl : string 
    tags : string[]
    priority : number 
    question : string 
    options : string[]
    uploadType : 'single' | 'multiple'
    type : "academic" | "entrance"
}


export async function CreateQuesiton  (){}