"use client"
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sparkles, FileText, Upload } from "lucide-react";

interface AIGenerationDropdownProps {
    onGenerateSingle: () => void;
    onGenerateMultiple: () => void;
    onImportFromFile: () => void;
    isGenerating: boolean;
}

function AIGenerationDropdown({ 
    onGenerateSingle, 
    onGenerateMultiple, 
    onImportFromFile, 
    isGenerating 
}: AIGenerationDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="outline" 
                    className="border-purple-200 text-purple-700 hover:bg-purple-50"
                    disabled={isGenerating}
                >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate with AI
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onGenerateSingle}>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Single Question
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onGenerateMultiple}>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Multiple Questions
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onImportFromFile}>
                    <Upload className="w-4 h-4 mr-2" />
                    Import from Files
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default AIGenerationDropdown;