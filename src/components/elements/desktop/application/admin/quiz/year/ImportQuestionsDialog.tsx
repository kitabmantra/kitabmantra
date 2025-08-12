"use client"
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Link, Database,  } from "lucide-react";

interface ImportQuestionsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    yearName: string;
    levelName: string;
    facultyName: string;
}

function ImportQuestionsDialog({ open, onOpenChange, yearName, levelName, facultyName }: ImportQuestionsDialogProps) {
    const [importType, setImportType] = useState<'file' | 'url' | 'database'>('file');
    const [isImporting, setIsImporting] = useState(false);

    const handleImport = async () => {
        setIsImporting(true);
        // Simulate import process
        setTimeout(() => {
            setIsImporting(false);
            onOpenChange(false);
        }, 2000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
                        <Upload className="w-6 h-6 text-green-600" />
                        Import Questions
                    </DialogTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Badge variant="outline">{levelName}</Badge>
                        <Badge variant="outline">{facultyName}</Badge>
                        <Badge variant="outline">{yearName}</Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                    {/* Import Type Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Import Source</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card 
                                    className={`cursor-pointer transition-all ${
                                        importType === 'file' 
                                            ? 'border-green-500 bg-green-50' 
                                            : 'hover:border-gray-300'
                                    }`}
                                    onClick={() => setImportType('file')}
                                >
                                    <CardContent className="p-4 text-center">
                                        <FileText className="w-8 h-8 mx-auto mb-2 text-green-600" />
                                        <h4 className="font-medium">File Upload</h4>
                                        <p className="text-sm text-gray-600">Import from files</p>
                                    </CardContent>
                                </Card>

                                <Card 
                                    className={`cursor-pointer transition-all ${
                                        importType === 'url' 
                                            ? 'border-green-500 bg-green-50' 
                                            : 'hover:border-gray-300'
                                    }`}
                                    onClick={() => setImportType('url')}
                                >
                                    <CardContent className="p-4 text-center">
                                        <Link className="w-8 h-8 mx-auto mb-2 text-green-600" />
                                        <h4 className="font-medium">URL Import</h4>
                                        <p className="text-sm text-gray-600">Import from URL</p>
                                    </CardContent>
                                </Card>

                                <Card 
                                    className={`cursor-pointer transition-all ${
                                        importType === 'database' 
                                            ? 'border-green-500 bg-green-50' 
                                            : 'hover:border-gray-300'
                                    }`}
                                    onClick={() => setImportType('database')}
                                >
                                    <CardContent className="p-4 text-center">
                                        <Database className="w-8 h-8 mx-auto mb-2 text-green-600" />
                                        <h4 className="font-medium">Database</h4>
                                        <p className="text-sm text-gray-600">Import from database</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Import Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Import Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {importType === 'file' && (
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
                                                Supports CSV, Excel, JSON, XML (Max 10MB each)
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                File Format
                                            </label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select format" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="csv">CSV</SelectItem>
                                                    <SelectItem value="excel">Excel</SelectItem>
                                                    <SelectItem value="json">JSON</SelectItem>
                                                    <SelectItem value="xml">XML</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Encoding
                                            </label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select encoding" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="utf-8">UTF-8</SelectItem>
                                                    <SelectItem value="ascii">ASCII</SelectItem>
                                                    <SelectItem value="iso-8859-1">ISO-8859-1</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {importType === 'url' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            URL
                                        </label>
                                        <Input placeholder="https://example.com/questions.json" />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Authentication (Optional)
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input placeholder="Username" />
                                            <Input placeholder="Password" type="password" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {importType === 'database' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Database Connection
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input placeholder="Host" />
                                            <Input placeholder="Port" />
                                            <Input placeholder="Database Name" />
                                            <Input placeholder="Username" />
                                            <Input placeholder="Password" type="password" />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Query
                                        </label>
                                        <Textarea 
                                            placeholder="SELECT * FROM questions WHERE subject = 'Mathematics'"
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Import Options
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" className="rounded" />
                                        <span className="text-sm">Skip duplicate questions</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" className="rounded" />
                                        <span className="text-sm">Validate questions before import</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" className="rounded" />
                                        <span className="text-sm">Create backup before import</span>
                                    </label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Import Preview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Import Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8">
                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">
                                    Preview will be available after selecting files or configuring import
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleImport}
                            disabled={isImporting}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isImporting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Importing...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Import Questions
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ImportQuestionsDialog;