"use client"
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, FileText, Upload, Brain, Settings } from "lucide-react";

interface AIGenerationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    yearName: string;
    levelName: string;
    facultyName: string;
}

function AIGenerationDialog({ open, onOpenChange, yearName, levelName, facultyName }: AIGenerationDialogProps) {
    const [generationType, setGenerationType] = useState<'single' | 'multiple' | 'file'>('single');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        // Simulate AI generation
        setTimeout(() => {
            setIsGenerating(false);
            onOpenChange(false);
        }, 2000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-purple-600" />
                        Generate Questions with AI
                    </DialogTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Badge variant="outline">{levelName}</Badge>
                        <Badge variant="outline">{facultyName}</Badge>
                        <Badge variant="outline">{yearName}</Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                    {/* Generation Type Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                Generation Type
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card 
                                    className={`cursor-pointer transition-all ${
                                        generationType === 'single' 
                                            ? 'border-purple-500 bg-purple-50' 
                                            : 'hover:border-gray-300'
                                    }`}
                                    onClick={() => setGenerationType('single')}
                                >
                                    <CardContent className="p-4 text-center">
                                        <FileText className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                                        <h4 className="font-medium">Single Question</h4>
                                        <p className="text-sm text-gray-600">Generate one question at a time</p>
                                    </CardContent>
                                </Card>

                                <Card 
                                    className={`cursor-pointer transition-all ${
                                        generationType === 'multiple' 
                                            ? 'border-purple-500 bg-purple-50' 
                                            : 'hover:border-gray-300'
                                    }`}
                                    onClick={() => setGenerationType('multiple')}
                                >
                                    <CardContent className="p-4 text-center">
                                        <FileText className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                                        <h4 className="font-medium">Multiple Questions</h4>
                                        <p className="text-sm text-gray-600">Generate multiple questions</p>
                                    </CardContent>
                                </Card>

                                <Card 
                                    className={`cursor-pointer transition-all ${
                                        generationType === 'file' 
                                            ? 'border-purple-500 bg-purple-50' 
                                            : 'hover:border-gray-300'
                                    }`}
                                    onClick={() => setGenerationType('file')}
                                >
                                    <CardContent className="p-4 text-center">
                                        <Upload className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                                        <h4 className="font-medium">From Files</h4>
                                        <p className="text-sm text-gray-600">Generate from uploaded files</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Generation Parameters */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Brain className="w-5 h-5" />
                                Generation Parameters
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {generationType === 'single' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Topic or Subject
                                        </label>
                                        <Input placeholder="e.g., Mathematics, Physics, History..." />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Specific Topic (Optional)
                                        </label>
                                        <Input placeholder="e.g., Calculus, Newton's Laws, World War II..." />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Difficulty
                                            </label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select difficulty" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="easy">Easy</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="hard">Hard</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Question Type
                                            </label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="mcq">Multiple Choice</SelectItem>
                                                    <SelectItem value="true-false">True/False</SelectItem>
                                                    <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {generationType === 'multiple' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Topic or Subject
                                        </label>
                                        <Input placeholder="e.g., Mathematics, Physics, History..." />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Number of Questions
                                            </label>
                                            <Input type="number" min="1" max="50" placeholder="5" />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Difficulty Distribution
                                            </label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select distribution" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="balanced">Balanced (Easy/Medium/Hard)</SelectItem>
                                                    <SelectItem value="easy-heavy">Easy Heavy</SelectItem>
                                                    <SelectItem value="medium-heavy">Medium Heavy</SelectItem>
                                                    <SelectItem value="hard-heavy">Hard Heavy</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {generationType === 'file' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Upload Files
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            <p className="text-sm text-gray-600">
                                                Drag and drop files here, or click to select
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Supports PDF, DOC, DOCX, TXT (Max 10MB each)
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Generation Instructions (Optional)
                                        </label>
                                        <Textarea 
                                            placeholder="Provide specific instructions for question generation..."
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Context (Optional)
                                </label>
                                <Textarea 
                                    placeholder="Provide any additional context or specific requirements..."
                                    rows={2}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            {isGenerating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate Questions
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default AIGenerationDialog; 