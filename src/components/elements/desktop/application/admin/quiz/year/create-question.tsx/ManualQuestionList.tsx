"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import { QuestionData } from "@/lib/types/quiz"

interface ManualQuestionListProps {
  questions: QuestionData[]
  onEditQuestion: (index: number) => void
  onRemoveQuestion: (index: number) => void
  onSaveAll: () => void
  isSaving?: boolean
}

export function ManualQuestionList({
  questions,
  onEditQuestion,
  onRemoveQuestion,
  onSaveAll,
  isSaving,
}: ManualQuestionListProps) {
  if (questions.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Questions to Save ({questions.length})</span>
          <Button onClick={onSaveAll} disabled={isSaving || questions.length === 0}>
            {isSaving ? "Saving..." : `Save All ${questions.length} Questions`}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-medium mb-2">Question {index + 1}</h4>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{question.question}</p>

                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`flex items-center gap-2 text-xs p-2 rounded ${
                          question.correctAnswer === optIndex
                            ? "bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200"
                            : "bg-muted"
                        }`}
                      >
                        <span className="font-medium">{String.fromCharCode(65 + optIndex)}:</span>
                        <span className="truncate">{option}</span>
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
                      {question.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Button onClick={() => onEditQuestion(index)} variant="outline" size="sm" className="gap-1">
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button onClick={() => onRemoveQuestion(index)} variant="outline" size="sm" className="gap-1">
                    <Trash2 className="w-3 h-3" />
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
