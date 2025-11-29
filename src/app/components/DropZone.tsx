'use client';

import React, { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface DropZoneProps {
    onFileSelect: (file: File) => void;
    selectedFile: File | null;
    onClearFile: () => void;
}

export default function DropZone({ onFileSelect, selectedFile, onClearFile }: DropZoneProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type === 'application/pdf') {
            onFileSelect(files[0]);
        }
    }, [onFileSelect]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0 && files[0].type === 'application/pdf') {
            onFileSelect(files[0]);
        }
    }, [onFileSelect]);

    return (
        <div className="w-full">
            {!selectedFile ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
            relative overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300
            ${isDragging
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 scale-[1.02]'
                            : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/10'
                        }
          `}
                >
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                    <div className="relative z-10">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/30 animate-pulse">
                            <Upload className="h-12 w-12 text-white" />
                        </div>

                        <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                            Drop your PDF here
                        </h3>
                        <p className="mb-6 text-gray-600 dark:text-gray-400">
                            or click to browse your files
                        </p>

                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105">
                            <FileText className="h-5 w-5" />
                            Browse Files
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileInput}
                                className="hidden"
                            />
                        </label>

                        <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">
                            Supported format: PDF (Max 50MB)
                        </p>
                    </div>
                </div>
            ) : (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                                <FileText className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                    {selectedFile.name}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClearFile}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 transition-all hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                            aria-label="Remove file"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
