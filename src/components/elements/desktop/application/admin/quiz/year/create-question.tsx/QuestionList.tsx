"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QuestionData } from "@/lib/types/quiz"

interface QuestionListProps {
  questions: QuestionData[]
  onSaveQuestion: (question: QuestionData, index: number) => void
  onRemoveQuestion: (index: number) => void
  isSaving?: boolean
}

export function QuestionList({ questions, onSaveQuestion, onRemoveQuestion, isSaving }: QuestionListProps) {
  if (questions.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Questions ({questions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-medium mb-2">Question {index + 1}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{question.question}</p>

                  <div className="space-y-2">
                    {question.options.map((option: string, optIndex: number) => (
                      <div
                        key={optIndex}
                        className={`flex items-center gap-2 text-xs p-2 rounded ${
                          question.correctAnswer === optIndex
                            ? "bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200"
                            : "bg-muted"
                        }`}
                      >
                        <span className="font-medium">{String.fromCharCode(65 + optIndex)}:</span>
                        <span>{option}</span>
                        {question.correctAnswer === optIndex && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            Correct
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="text-xs">
                      {question.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Priority {question.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {question.subjectName}
                    </Badge>
                  </div>

                  {question.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {question.tags.map((tag: string, tagIndex: number) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Button onClick={() => onSaveQuestion(question, index)} disabled={isSaving} size="sm">
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button onClick={() => onRemoveQuestion(index)} variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
