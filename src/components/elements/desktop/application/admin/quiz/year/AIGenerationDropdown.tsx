"use client"
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkles, FileText, Upload, Loader2 } from "lucide-react";

interface AIGenerationDropdownProps {
  onGenerateSingle: () => void;
  onGenerateMultiple: () => void;
  onImportFromFile: () => void;
  isGenerating: boolean;
}

const AIGenerationDropdown: React.FC<AIGenerationDropdownProps> = ({
  onGenerateSingle,
  onGenerateMultiple,
  onImportFromFile,
  isGenerating
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:from-purple-600 hover:to-blue-600"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2" />
          )}
          Generate with AI
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem 
          onClick={onGenerateSingle}
          disabled={isGenerating}
          className="cursor-pointer"
        >
          <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
          Generate Single Question
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onGenerateMultiple}
          disabled={isGenerating}
          className="cursor-pointer"
        >
          <FileText className="w-4 h-4 mr-2 text-blue-600" />
          Generate Multiple Questions
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={onImportFromFile}
          disabled={isGenerating}
          className="cursor-pointer"
        >
          <Upload className="w-4 h-4 mr-2 text-green-600" />
          Import from File
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AIGenerationDropdown;