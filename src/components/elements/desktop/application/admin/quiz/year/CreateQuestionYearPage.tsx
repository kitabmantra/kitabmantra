"use client"
import React, { useState } from 'react';
import { useYearName } from "@/lib/hooks/params/useYearName";
import { useLevelName } from "@/lib/hooks/params/useLevelName";
import { useFacultyName } from "@/lib/hooks/params/useFaucltyName";
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Eye, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import AIGenerationDropdown from "./AIGenerationDropdown";
import FileImportDialog from './FileImportDialog';

function CreateQuestionYearPage() {
    const yearName = useYearName();
    const levelName = useLevelName();
    const facultyName = useFacultyName();
    const router = useRouter();
    
    const [questionData, setQuestionData] = useState({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        difficulty: 'medium',
        hint: '',
        referenceUrl: '',
        tags: ''
    });
    
    const [showFileImport, setShowFileImport] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    if(!yearName || !levelName || !facultyName){
        redirect("/quiz-section/academic")
    }

    const handleBack = () => {
        router.back();
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...questionData.options];
        newOptions[index] = value;
        setQuestionData({ ...questionData, options: newOptions });
    };

    const handleCorrectAnswerChange = (index: number) => {
        setQuestionData({ ...questionData, correctAnswer: index });
    };

    const handleSave = () => {
        // Handle saving the question
        console.log('Saving question:', questionData);
    };

    const handleAIGeneration = (type: 'single' | 'multiple') => {
        setIsGenerating(true);
        
        // Simulate AI generation
        console.log("Generating question...", type)
        setTimeout(() => {
            setIsGenerating(false);
            // Handle AI generation result
        }, 2000);
    };

    const handleFileImport = () => {
        setShowFileImport(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto py-6 px-4">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Button variant="outline" onClick={handleBack}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Create Question</h1>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Badge variant="outline">{levelName}</Badge>
                                <Badge variant="outline">{facultyName}</Badge>
                                <Badge variant="outline">{yearName}</Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content - Split Screen */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Panel - Question Creation */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Question Details</span>
                                <div className="flex gap-2">
                                    <AIGenerationDropdown 
                                        onGenerateSingle={() => handleAIGeneration('single')}
                                        onGenerateMultiple={() => handleAIGeneration('multiple')}
                                        onImportFromFile={handleFileImport}
                                        isGenerating={isGenerating}
                                    />
                                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                                        <Save className="w-4 h-4 mr-2" />
                                        Save
                                    </Button>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Question Text */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Question Text *
                                </label>
                                <Textarea
                                    value={questionData.question}
                                    onChange={(e) => setQuestionData({ ...questionData, question: e.target.value })}
                                    placeholder="Enter your question here..."
                                    rows={4}
                                    className="resize-none"
                                />
                            </div>

                            {/* Options */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Answer Options *
                                </label>
                                <div className="space-y-3">
                                    {questionData.options.map((option, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="correctAnswer"
                                                checked={questionData.correctAnswer === index}
                                                onChange={() => handleCorrectAnswerChange(index)}
                                                className="text-blue-600"
                                            />
                                            <Input
                                                value={option}
                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                                className={questionData.correctAnswer === index ? "border-green-300 bg-green-50" : ""}
                                            />
                                            {questionData.correctAnswer === index && (
                                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                                    Correct
                                                </Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Difficulty */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Difficulty *
                                </label>
                                <Select 
                                    value={questionData.difficulty} 
                                    onValueChange={(value) => setQuestionData({ ...questionData, difficulty: value })}
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

                            {/* Hint */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hint
                                </label>
                                <Textarea
                                    value={questionData.hint}
                                    onChange={(e) => setQuestionData({ ...questionData, hint: e.target.value })}
                                    placeholder="Optional hint for students..."
                                    rows={2}
                                    className="resize-none"
                                />
                            </div>

                            {/* Reference URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reference URL
                                </label>
                                <Input
                                    type="url"
                                    value={questionData.referenceUrl}
                                    onChange={(e) => setQuestionData({ ...questionData, referenceUrl: e.target.value })}
                                    placeholder="https://example.com/reference"
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tags
                                </label>
                                <Input
                                    value={questionData.tags}
                                    onChange={(e) => setQuestionData({ ...questionData, tags: e.target.value })}
                                    placeholder="Enter tags separated by commas..."
                                />
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
                            <div className="space-y-6">
                                {/* Question Preview */}
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-3">Question:</h4>
                                    <p className="text-gray-700">
                                        {questionData.question || "Your question will appear here..."}
                                    </p>
                                </div>

                                {/* Options Preview */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Options:</h4>
                                    <div className="space-y-2">
                                        {questionData.options.map((option, index) => (
                                            <div 
                                                key={index} 
                                                className={`flex items-center gap-3 p-3 border rounded-lg ${
                                                    questionData.correctAnswer === index 
                                                        ? 'border-green-300 bg-green-50' 
                                                        : 'border-gray-200'
                                                }`}
                                            >
                                                <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                                                    {String.fromCharCode(65 + index)}
                                                </span>
                                                <span className="text-gray-700">
                                                    {option || `Option ${String.fromCharCode(65 + index)} will appear here...`}
                                                </span>
                                                {questionData.correctAnswer === index && (
                                                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                                        Correct Answer
                                                    </Badge>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Metadata Preview */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">
                                            Difficulty: {questionData.difficulty.charAt(0).toUpperCase() + questionData.difficulty.slice(1)}
                                        </Badge>
                                        {questionData.tags && (
                                            <Badge variant="outline">
                                                Tags: {questionData.tags}
                                            </Badge>
                                        )}
                                    </div>

                                    {questionData.hint && (
                                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <h5 className="font-medium text-blue-900 mb-1">Hint:</h5>
                                            <p className="text-blue-700 text-sm">{questionData.hint}</p>
                                        </div>
                                    )}

                                    {questionData.referenceUrl && (
                                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                            <h5 className="font-medium text-gray-900 mb-1">Reference:</h5>
                                            <a 
                                                href={questionData.referenceUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline text-sm"
                                            >
                                                {questionData.referenceUrl}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* File Import Dialog */}
            <FileImportDialog 
                open={showFileImport} 
                onOpenChange={setShowFileImport}
            />
        </div>
    );
}

export default CreateQuestionYearPage; 