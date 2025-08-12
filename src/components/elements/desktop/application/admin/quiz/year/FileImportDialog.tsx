 "use client"
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileText, FileSpreadsheet, File } from "lucide-react";

interface FileImportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function FileImportDialog({ open, onOpenChange }: FileImportDialogProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setSelectedFiles(files);
    };

    const handleUpload = async () => {
        setIsUploading(true);
        // Simulate file upload and processing
        setTimeout(() => {
            setIsUploading(false);
            onOpenChange(false);
            setSelectedFiles([]);
        }, 2000);
    };

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf':
                return <FileText className="w-5 h-5 text-red-500" />;
            case 'docx':
            case 'doc':
                return <FileText className="w-5 h-5 text-blue-500" />;
            case 'xlsx':
            case 'xls':
            case 'csv':
                return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
            default:
                return <File className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-green-600" />
                        Import Questions from Files
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Files
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-600 mb-2">
                                Drag and drop files here, or click to select
                            </p>
                            <p className="text-xs text-gray-500 mb-4">
                                Supported formats: PDF, DOCX, XLSX, CSV (Max 10MB each)
                            </p>
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.docx,.doc,.xlsx,.xls,.csv"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload">
                                <Button variant="outline" className="cursor-pointer">
                                    Choose Files
                                </Button>
                            </label>
                        </div>
                    </div>

                    {selectedFiles.length > 0 && (
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Selected Files:</h4>
                            <div className="space-y-2">
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                        {getFileIcon(file.name)}
                                        <span className="text-sm text-gray-700 flex-1">{file.name}</span>
                                        <span className="text-xs text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleUpload}
                            disabled={selectedFiles.length === 0 || isUploading}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isUploading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Processing...
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

export default FileImportDialog;