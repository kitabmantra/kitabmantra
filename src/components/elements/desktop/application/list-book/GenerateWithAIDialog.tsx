import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import React, { useState } from 'react'
import ImageAnalyzer from "./ImageAnalyzer"
import { Sparkles } from "lucide-react"

interface GenerateWithAIDialogProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    handleDataFromAi: (base64Image: string, file: File) => Promise<void>;
}

function GenerateWithAIDialog({ isOpen, setOpen, handleDataFromAi }: GenerateWithAIDialogProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleImageAnalysis = async (base64Image: string, file: File) => {
        setIsGenerating(true);
        try {
            await handleDataFromAi(base64Image, file);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isGenerating && setOpen(open)}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-[#1E3A8A]">
                        <Sparkles className="h-5 w-5 text-[#0D9488]" />
                        Extract Book Details with AI
                    </DialogTitle>
                    <DialogDescription className="text-[#4B5563]">
                        Upload a clear image of your book cover or title page to automatically extract book details.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    <ImageAnalyzer 
                        handleDataFromAi={handleImageAnalysis} 
                        isGenerating={isGenerating}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default GenerateWithAIDialog
