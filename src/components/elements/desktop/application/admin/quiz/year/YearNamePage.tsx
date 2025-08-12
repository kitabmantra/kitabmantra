"use client"
import React, { useState } from 'react'
import { useYearName } from "@/lib/hooks/params/useYearName";
import { useLevelName } from "@/lib/hooks/params/useLevelName";
import { useFacultyName } from "@/lib/hooks/params/useFaucltyName";
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, FileText, Target, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

function YearNamePage() {
    const yearName = useYearName();
    const levelName = useLevelName();
    const facultyName = useFacultyName();
    const router = useRouter();
    
    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 10;
    
    // Mock data - replace with actual data fetching
    const totalQuestions = 0;
    const easyQuestions = 0;
    const mediumQuestions = 0;
    const hardQuestions = 0;

    if(!yearName || !levelName || !facultyName){
        redirect("/quiz-section/academic")
    }

    const handleCreateQuestion = () => {
        router.push(`/quiz-section/academic/level/${levelName}/faculty/${facultyName}/${yearName}/create-question`);
    };

    const totalPages = Math.ceil(totalQuestions / questionsPerPage);

  return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto py-8 px-4">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {yearName} - Question Management
                            </h1>
                            <p className="text-gray-600">
                                {levelName} • {facultyName}
                            </p>
                        </div>
                    </div>
                    
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Quiz Section</span>
                        <span>•</span>
                        <span>Academic</span>
                        <span>•</span>
                        <span>{levelName}</span>
                        <span>•</span>
                        <span>{facultyName}</span>
                        <span>•</span>
                        <span className="text-blue-600 font-medium">{yearName}</span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Questions</p>
                                    <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
                                </div>
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Easy Questions</p>
                                    <p className="text-2xl font-bold text-green-600">{easyQuestions}</p>
                                </div>
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Target className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Medium Questions</p>
                                    <p className="text-2xl font-bold text-yellow-600">{mediumQuestions}</p>
                                </div>
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Target className="w-5 h-5 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Hard Questions</p>
                                    <p className="text-2xl font-bold text-red-600">{hardQuestions}</p>
                                </div>
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <Target className="w-5 h-5 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Create Question Button */}
                <div className="mb-8">
                    <Button 
                        onClick={handleCreateQuestion}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Question
                    </Button>
                </div>

                {/* Questions List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {totalQuestions === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                                <p className="text-gray-600 mb-4">
                                    Start by creating your first question
                                </p>
                                <Button onClick={handleCreateQuestion}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Question
                                </Button>
                            </div>
                        ) : (
                            <div>
                                {/* Questions list will go here */}
                                <div className="text-center py-8 text-gray-500">
                                    Questions will be displayed here
                                </div>
                                
                                {/* Pagination */}
                                <div className="flex items-center justify-between mt-6">
                                    <div className="text-sm text-gray-600">
                                        Showing {((currentPage - 1) * questionsPerPage) + 1} to {Math.min(currentPage * questionsPerPage, totalQuestions)} of {totalQuestions} questions
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Previous
                                        </Button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setCurrentPage(page)}
                                                    className="w-8 h-8 p-0"
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
  )
}

export default YearNamePage
