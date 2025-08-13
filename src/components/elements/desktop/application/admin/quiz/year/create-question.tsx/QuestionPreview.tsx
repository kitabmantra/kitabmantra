"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"
import { QuestionData } from "@/lib/types/quiz"

interface QuestionPreviewProps {
  questionData: QuestionData
}

export function QuestionPreview({ questionData }: QuestionPreviewProps) {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Eye className="w-5 h-5" />
          Question Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question Preview */}
        <div className="p-3 bg-muted rounded-lg">
          <h4 className="font-medium mb-2 text-sm">Question:</h4>
          <p className="text-sm leading-relaxed">{questionData.question || "Your question will appear here..."}</p>
        </div>

        {/* Options Preview */}
        <div>
          <h4 className="font-medium mb-2 text-sm">Options:</h4>
          <div className="space-y-1">
            {questionData.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 p-2 border rounded-md transition-colors ${
                  questionData.correctAnswer === index
                    ? "border-green-500 bg-green-50 dark:bg-green-950"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <span className="w-5 h-5 bg-muted rounded-full flex items-center justify-center text-xs font-medium">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-sm flex-1">
                  {option || `Option ${String.fromCharCode(65 + index)} will appear here...`}
                </span>
                {questionData.correctAnswer === index && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    Correct
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Metadata Preview */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {questionData.difficulty.charAt(0).toUpperCase() + questionData.difficulty.slice(1)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Priority {questionData.priority}
            </Badge>
            {questionData.tags.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {questionData.tags.length} tag{questionData.tags.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          {questionData.hint && (
            <div className="p-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
              <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1 text-xs">Hint:</h5>
              <p className="text-blue-700 dark:text-blue-300 text-xs">{questionData.hint}</p>
            </div>
          )}

          {questionData.referenceUrl && (
            <div className="p-2 bg-muted border rounded-md">
              <h5 className="font-medium mb-1 text-xs">Reference:</h5>
              <a
                href={questionData.referenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-xs break-all"
              >
                {questionData.referenceUrl}
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
