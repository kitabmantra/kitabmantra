"use client"

import { Button } from "@/components/ui/button"
import { Files, Upload, Brain } from "lucide-react"
import { CreationMode } from "@/lib/types/quiz"

interface ModeSelectorProps {
  mode: CreationMode
  onModeChange: (mode: CreationMode) => void
}

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Creation Mode:</span>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant={mode === "multiple" ? "default" : "outline"}
          onClick={() => onModeChange("multiple")}
          size="sm"
          className="gap-2"
        >
          <Files className="w-4 h-4" />
          Multiple Questions
        </Button>
        <Button
          variant={mode === "import" ? "default" : "outline"}
          onClick={() => onModeChange("import")}
          size="sm"
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          Import Questions
        </Button>
        <Button
          variant={mode === "ai" ? "default" : "outline"}
          onClick={() => onModeChange("ai")}
          size="sm"
          className="gap-2"
        >
          <Brain className="w-4 h-4" />
          AI Generate
        </Button>
      </div>
    </div>
  )
}
