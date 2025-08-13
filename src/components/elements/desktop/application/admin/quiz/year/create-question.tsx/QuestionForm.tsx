"use client"

import type React from "react"

import { useState, memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, X } from "lucide-react"
import { QuestionData } from "@/lib/types/quiz"

interface QuestionFormProps {
  questionData: QuestionData
  onQuestionChange: (data: QuestionData) => void
  onAddToList?: () => void
  showAddToList?: boolean
  isSaving?: boolean
}

export const QuestionForm = memo(function QuestionForm({
  questionData,
  onQuestionChange,
  onAddToList,
  showAddToList,
  isSaving,
}: QuestionFormProps) {
  const [tagInput, setTagInput] = useState("")

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...questionData.options]
    newOptions[index] = value.toLowerCase()
    onQuestionChange({ ...questionData, options: newOptions })
  }

  const handleCorrectAnswerChange = (index: number) => {
    onQuestionChange({ ...questionData, correctAnswer: index })
  }

  const formatTagInput = (input: string): string => {
    return input
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\-_]/g, "")
  }

  const handleAddTag = () => {
    const formattedTag = formatTagInput(tagInput)
    if (formattedTag && formattedTag.length >= 2 && questionData.tags.length < 5) {
      if (!questionData.tags.includes(formattedTag)) {
        onQuestionChange({
          ...questionData,
          tags: [...questionData.tags, formattedTag],
        })
        setTagInput("")
      }
    }
  }

  const handleRemoveTag = (indexToRemove: number) => {
    onQuestionChange({
      ...questionData,
      tags: questionData.tags.filter((_, index) => index !== indexToRemove),
    })
  }

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTagInput(e.target.value)
    setTagInput(formatted)
  }

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Question Details</span>
          <div className="flex gap-2">
            {showAddToList && onAddToList && (
              <Button onClick={onAddToList} variant="outline" className="gap-2 bg-transparent">
                <Save className="w-4 h-4" />
                Add to List
              </Button>
            )}
           
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question Text */}
        <div>
          <label className="block text-sm font-medium mb-2">Question Text * (5-1000 characters)</label>
          <Textarea
            value={questionData.question}
            onChange={(e) => onQuestionChange({ ...questionData, question: e.target.value })}
            placeholder="Enter your question here..."
            rows={4}
            className="resize-none"
            maxLength={1000}
            disabled={isSaving}
          />
          <p className="text-xs text-muted-foreground mt-1">{questionData.question.length}/1000 characters</p>
        </div>

        {/* Options */}
        <div>
          <label className="block text-sm font-medium mb-3">Answer Options * (All 4 required)</label>
          <div className="space-y-3">
            {questionData.options.map((option, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={questionData.correctAnswer === index}
                  onChange={() => handleCorrectAnswerChange(index)}
                  className="text-primary"
                  disabled={isSaving}
                />
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  disabled={isSaving}
                  className={
                    questionData.correctAnswer === index ? "border-green-500 bg-green-50 dark:bg-green-950" : ""
                  }
                />
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

        {/* Difficulty, Priority, Subject */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Difficulty *</label>
            <Select
              value={questionData.difficulty}
              onValueChange={(value: "easy" | "medium" | "hard") =>
                onQuestionChange({ ...questionData, difficulty: value })
              }
              disabled={isSaving}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Priority *</label>
            <Select
              value={questionData.priority.toString()}
              onValueChange={(value) => onQuestionChange({ ...questionData, priority: Number.parseInt(value) })}
              disabled={isSaving}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 - Low</SelectItem>
                <SelectItem value="2">2 - Medium</SelectItem>
                <SelectItem value="3">3 - High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subject *</label>
            <Input
              value={questionData.subjectName}
              onChange={(e) => {
                const formattedSubject = formatTagInput(e.target.value)
                onQuestionChange({ ...questionData, subjectName: formattedSubject })
              }}
              placeholder="Enter subject name"
              disabled={isSaving}
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">Tags * (1-5 tags required)</label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyUp={handleTagInputKeyPress}
                placeholder="Enter tag (letters, numbers, - or _ only)"
                disabled={questionData.tags.length >= 5 || isSaving}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tagInput.length < 2 || questionData.tags.length >= 5 || isSaving}
                size="sm"
                variant="outline"
              >
                Add
              </Button>
            </div>
            {questionData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {questionData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{questionData.tags.length}/5 tags</span>
              <span>Only letters, numbers, hyphens (-) and underscores (_) allowed</span>
            </div>
          </div>
        </div>

        {/* Hint */}
        <div>
          <label className="block text-sm font-medium mb-2">Hint (Optional)</label>
          <Textarea
            value={questionData.hint || ""}
            onChange={(e) => onQuestionChange({ ...questionData, hint: e.target.value })}
            placeholder="Optional hint for students..."
            rows={2}
            className="resize-none"
          />
        </div>

        {/* Reference URL */}
        <div>
          <label className="block text-sm font-medium mb-2">Reference URL (Optional)</label>
          <Input
            type="url"
            value={questionData.referenceUrl || ""}
            onChange={(e) => onQuestionChange({ ...questionData, referenceUrl: e.target.value })}
            placeholder="https://example.com/reference"
          />
        </div>
      </CardContent>
    </Card>
  )
})
