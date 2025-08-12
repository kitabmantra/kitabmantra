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
import { ArrowLeft, Eye, Save, X, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import AIGenerationDropdown from "./AIGenerationDropdown";
import FileImportDialog from './FileImportDialog';

interface QuestionData {
    question: string;
    options: string[];
    correctAnswer: number;
    difficulty: 'easy' | 'medium' | 'hard';
    hint?: string;
    referenceUrl?: string;
    tags: string[];
    priority: number;
    subjectName : string
}

function CreateQuestionYearPage() {
    const yearName = useYearName();
    const levelName = useLevelName();
    const facultyName = useFacultyName();
    const router = useRouter();
    
    const [questionData, setQuestionData] = useState<QuestionData>({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: -1,
        difficulty: 'medium',
        hint: '',
        referenceUrl: '',
        tags: [],
        priority: 3,
        subjectName : "",
    });
    
    const [tagInput, setTagInput] = useState('');
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
        newOptions[index] = value.toLowerCase();
        setQuestionData({ ...questionData, options: newOptions });
    };

    const handleCorrectAnswerChange = (index: number) => {
        setQuestionData({ ...questionData, correctAnswer: index });
    };

    const formatTagInput = (input: string): string => {
        const  formatted = input
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9\-_]/g, "")
        return formatted;
    };


    const handleAddTag = () => {
        const formattedTag = formatTagInput(tagInput);
        if (formattedTag && formattedTag.length >= 2 && questionData.tags.length < 5) {
            if (!questionData.tags.includes(formattedTag)) {
                setQuestionData({
                    ...questionData,
                    tags: [...questionData.tags, formattedTag]
                });
                setTagInput('');
            }
        }
    };

    const handleRemoveTag = (indexToRemove: number) => {
        setQuestionData({
            ...questionData,
            tags: questionData.tags.filter((_, index) => index !== indexToRemove)
        });
    };

    const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatTagInput(e.target.value);
        setTagInput(formatted);
    };

    const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleSave = () => {
        if (!questionData.question.trim()) {
            alert('Question is required');
            return;
        }
        if (questionData.question.length < 5 || questionData.question.length > 1000) {
            alert('Question must be between 5 and 1000 characters');
            return;
        }
        if (questionData.options.some(option => !option.trim())) {
            alert('All options are required');
            return;
        }
        if (questionData.correctAnswer === -1) {
            alert('Please select a correct answer');
            return;
        }
        if (questionData.tags.length === 0) {
            alert('At least one tag is required');
            return;
        }
        if (questionData.tags.length > 5) {
            alert('Maximum 5 tags allowed');
            return;
        }

        const backendData = {
            type: "academic" as const,
            levelName: levelName,
            faculty: facultyName,
            yearName: yearName,
            question: questionData.question.trim(),
            options: questionData.options.map(option => option.trim()),
            correctAnswer: questionData.options[questionData.correctAnswer],
            difficulty: questionData.difficulty,
            tags: questionData.tags,
            priority: questionData.priority,
            hint: questionData.hint?.trim() || undefined,
            referenceUrl: questionData.referenceUrl?.trim() || undefined
        };

        console.log('Saving question:', backendData);
    };

    const handleAIGeneration = (type: 'single' | 'multiple') => {
        setIsGenerating(true);
        console.log("Generating question...", type)
        setTimeout(() => {
            setIsGenerating(false);
        }, 2000);
    };

    const handleFileImport = () => {
        setShowFileImport(true);
    };

    const formatBreadcrumbText = (text: string) => {
        return text.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={handleBack} size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-gray-900">Create Question</h1>
                            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                <span className="font-medium">Academic</span>
                                <ChevronRight className="w-4 h-4" />
                                <span>{formatBreadcrumbText(levelName)}</span>
                                <ChevronRight className="w-4 h-4" />
                                <span>{formatBreadcrumbText(facultyName)}</span>
                                <ChevronRight className="w-4 h-4" />
                                <span>{formatBreadcrumbText(yearName)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                                    Question Text * (5-1000 characters)
                                </label>
                                <Textarea
                                    value={questionData.question}
                                    onChange={(e) => setQuestionData({ ...questionData, question: e.target.value })}
                                    placeholder="Enter your question here..."
                                    rows={4}
                                    className="resize-none"
                                    maxLength={1000}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {questionData.question.length}/1000 characters
                                </p>
                            </div>

                            {/* Options */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Answer Options * (All 4 required)
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

                            {/* Difficulty and Priority */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Difficulty *
                                    </label>
                                    <Select 
                                        value={questionData.difficulty} 
                                        onValueChange={(value: 'easy' | 'medium' | 'hard') => setQuestionData({ ...questionData, difficulty: value })}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Priority *
                                    </label>
                                    <Select 
                                        value={questionData.priority.toString()} 
                                        onValueChange={(value) => setQuestionData({ ...questionData, priority: parseInt(value) })}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <Input 
                                        value={questionData.subjectName}
                                        onChange={(e) =>{
                                            const formattedSubject = formatTagInput(e.target.value);
                                            setQuestionData({ ...questionData, subjectName: formattedSubject });
                                        }}
                                        placeholder="Enter subject name"
                                    />
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tags * (1-5 tags required)
                                </label>
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <Input
                                            value={tagInput}
                                            onChange={handleTagInputChange}
                                            onKeyPress={handleTagInputKeyPress}
                                            placeholder="Enter tag (letters, numbers, - or _ only)"
                                            disabled={questionData.tags.length >= 5}
                                            className="flex-1"
                                        />
                                        <Button 
                                            type="button" 
                                            onClick={handleAddTag}
                                            disabled={!tagInput.trim() || tagInput.length < 2 || questionData.tags.length >= 5}
                                            size="sm"
                                            className="px-4"
                                        >
                                            Add
                                        </Button>
                                    </div>
                                    {questionData.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {questionData.tags.map((tag, index) => (
                                                <Badge 
                                                    key={index} 
                                                    variant="secondary"
                                                    className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveTag(index)}
                                                        className="ml-1 hover:text-red-600 transition-colors"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{questionData.tags.length}/5 tags</span>
                                        <span>Only letters, numbers, hyphens (-) and underscores (_) allowed</span>
                                    </div>
                                </div>
                            </div>

                            {/* Hint */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hint (Optional)
                                </label>
                                <Textarea
                                    value={questionData.hint || ''}
                                    onChange={(e) => setQuestionData({ ...questionData, hint: e.target.value })}
                                    placeholder="Optional hint for students..."
                                    rows={2}
                                    className="resize-none"
                                />
                            </div>

                            {/* Reference URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reference URL (Optional)
                                </label>
                                <Input
                                    type="url"
                                    value={questionData.referenceUrl || ''}
                                    onChange={(e) => setQuestionData({ ...questionData, referenceUrl: e.target.value })}
                                    placeholder="https://example.com/reference"
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
                                                className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                                                    questionData.correctAnswer === index 
                                                        ? 'border-green-300 bg-green-50' 
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                                                    {String.fromCharCode(65 + index)}
                                                </span>
                                                <span className="text-gray-700 flex-1">
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
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                            Difficulty: {questionData.difficulty.charAt(0).toUpperCase() + questionData.difficulty.slice(1)}
                                        </Badge>
                                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                            Priority: {questionData.priority}
                                        </Badge>
                                        {questionData.tags.length > 0 && (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                Tags: {questionData.tags.join(', ')}
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