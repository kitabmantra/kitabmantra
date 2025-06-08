/*eslint-disable*/
'use client';
import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from 'next/image';

interface BookCategory {
    level: string;
    year?: number;
    faculty?: string;
    class?: number;
}

interface BookMetadata {
    title: string;
    author: string;
    description: string;
    category: BookCategory;
}

interface ImageAnalyzerProps {
    handleDataFromAi: (base64Image: string, file: File) => Promise<void>;
    isGenerating: boolean;
}

export default function ImageAnalyzer({ handleDataFromAi, isGenerating }: ImageAnalyzerProps) {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [result, setResult] = useState<BookMetadata | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const validateAndSetFile = (selectedFile: File) => {
        if (selectedFile.size > 5 * 1024 * 1024) {
            toast.error("File size too large. Please upload an image under 5MB.");
            return false;
        }
        if (!selectedFile.type.startsWith('image/')) {
            toast.error("Please upload an image file (JPG, PNG, or WEBP)");
            return false;
        }

        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setResult(null);
        return true;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleRemoveFile = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setFile(null);
        setPreviewUrl(null);
        setResult(null);
    };

    const handleAnalyze = async () => {
        if (!file) {
            toast.error("Please select an image file first");
            return;
        }

        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = async () => {
                const base64Image = reader.result as string;
                await handleDataFromAi(base64Image, file);
            };

            reader.onerror = () => {
                throw new Error("Failed to read image file");
            };
        } catch (err: any) {
            if (err.message?.includes('No book is found')) {
                toast.error("This image doesn't appear to be a book cover. Please upload a clear image of a book cover.");
            } else {
                toast.error(err.message || 'Failed to analyze image');
            }
            console.error('Analysis error:', err);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto p-4">
            <div className="space-y-4">
                <div className="space-y-2">
                    <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                            isDragging 
                                ? 'border-[#0D9488] bg-[#0D9488]/5' 
                                : 'border-[#1E3A8A]/25 hover:border-[#1E3A8A]/50'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {!file ? (
                            <div className="space-y-2">
                                <Upload className="mx-auto h-12 w-12 text-[#1E3A8A]" />
                                <div className="text-sm text-[#4B5563]">
                                    <span>Drag and drop your image here, or</span>
                                    <Label
                                        htmlFor="image"
                                        className="mx-1 inline-flex items-center justify-center text-[#0D9488] cursor-pointer hover:underline"
                                    >
                                        Browse
                                    </Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        disabled={isGenerating}
                                        className="hidden"
                                    />
                                </div>
                                <p className="text-xs text-[#4B5563]">
                                    Supported formats: JPG, PNG, WEBP (max 5MB)
                                </p>
                            </div>
                        ) : (
                            <div className="relative h-48 w-full flex items-center justify-center">
                                <div className="relative h-full w-full max-w-md">
                                    <Image
                                        src={previewUrl || "/placeholder.svg"}
                                        alt="Preview"
                                        fill
                                        className="object-contain rounded-md"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                                    />
                                </div>
                                <Button
                                    onClick={handleRemoveFile}
                                    className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                                    disabled={isGenerating}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <Button
                    onClick={handleAnalyze}
                    disabled={isGenerating || !file}
                    className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] hover:from-[#0D9488] hover:to-[#1E3A8A] text-white transition-all duration-300"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Extract Details
                        </>
                    )}
                </Button>
            </div>

            {result && (
                <div className="mt-6 p-4 border rounded-lg space-y-4">
                    <h3 className="font-bold text-lg">Analysis Result:</h3>

                    <div className="space-y-2">
                        <div>
                            <span className="font-medium">Title:</span> {result.title}
                        </div>
                        <div>
                            <span className="font-medium">Author:</span> {result.author}
                        </div>
                        <div>
                            <span className="font-medium">Description:</span> {result.description}
                        </div>

                        <div className="pt-2 border-t">
                            <span className="font-medium">Category:</span>
                            <div className="ml-4 mt-1 space-y-1">
                                <div>Level: {result.category.level}</div>
                                {result.category.year && (
                                    <div>Year: {result.category.year}</div>
                                )}
                                {result.category.class && (
                                    <div>Class: {result.category.class}</div>
                                )}
                                {result.category.faculty && (
                                    <div>Faculty: {result.category.faculty}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}