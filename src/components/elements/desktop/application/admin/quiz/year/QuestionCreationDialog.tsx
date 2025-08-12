"use client"
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit3, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuestionCreationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    yearName: string;
    levelName: string;
    facultyName: string;
}

function QuestionCreationDialog({ open, onOpenChange, yearName, levelName, facultyName }: QuestionCreationDialogProps) {
    const router = useRouter();

    const handleCreateQuestion = () => {
        router.push("/quiz-section/create-question");
        onOpenChange(false);
    };

    const handleAIGeneration = () => {
        onOpenChange(false);
        // This will be handled by the AI Generation Dialog
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
                        <Plus className="w-6 h-6 text-blue-600" />
                        Create New Question
                    </DialogTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Badge variant="outline">{levelName}</Badge>
                        <Badge variant="outline">{facultyName}</Badge>
                        <Badge variant="outline">{yearName}</Badge>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* Left Panel - Question Creation */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Edit3 className="w-5 h-5" />
                                Question Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Question Text *
                                    </label>
                                    <textarea 
                                        className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24"
                                        placeholder="Enter your question here..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Options *
                                    </label>
                                    <div className="space-y-2">
                                        {['A', 'B', 'C', 'D'].map((option) => (
                                            <div key={option} className="flex items-center gap-2">
                                                <input 
                                                    type="radio" 
                                                    name="correctAnswer" 
                                                    id={`option-${option}`}
                                                    className="text-blue-600"
                                                />
                                                <input 
                                                    type="text"
                                                    placeholder={`Option ${option}`}
                                                    className="flex-1 p-2 border border-gray-300 rounded-md"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Difficulty *
                                        </label>
                                        <select className="w-full p-2 border border-gray-300 rounded-md">
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hint
                                    </label>
                                    <textarea 
                                        className="w-full p-2 border border-gray-300 rounded-md resize-none h-16"
                                        placeholder="Optional hint for students..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reference URL
                                    </label>
                                    <input 
                                        type="url"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="https://example.com/reference"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tags
                                    </label>
                                    <input 
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="Enter tags separated by commas..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button onClick={handleCreateQuestion} className="flex-1">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Question
                                </Button>
                                <Button variant="outline" onClick={handleAIGeneration}>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate with AI
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Panel - Preview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="w-5 h-5" />
                                Question Preview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-3">Question Preview</h4>
                                    <p className="text-gray-600 text-sm">
                                        Your question will appear here as you type...
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <h5 className="font-medium text-gray-700">Options:</h5>
                                    <div className="space-y-2">
                                        {['A', 'B', 'C', 'D'].map((option) => (
                                            <div key={option} className="flex items-center gap-2 p-2 border border-gray-200 rounded">
                                                <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                                                    {option}
                                                </span>
                                                <span className="text-gray-600 text-sm">
                                                    Option {option} will appear here...
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">Difficulty: Medium</Badge>
                                    <Badge variant="outline">Tags: None</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default QuestionCreationDialog; 