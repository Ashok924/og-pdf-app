'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';

// Set up the worker - use static file from public directory
if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

interface PDFViewerProps {
    file: File;
}

export default function PDFViewer({ file }: PDFViewerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const renderTaskRef = useRef<any>(null);
    const [pdfDoc, setPdfDoc] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [scale, setScale] = useState(1.5);
    const [rotation, setRotation] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPDF = async () => {
            setLoading(true);
            try {
                const fileReader = new FileReader();
                fileReader.onload = async (e) => {
                    const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
                    const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
                    setPdfDoc(pdf);
                    setTotalPages(pdf.numPages);
                    setCurrentPage(1);
                    setLoading(false);
                };
                fileReader.readAsArrayBuffer(file);
            } catch (error) {
                console.error('Error loading PDF:', error);
                setLoading(false);
            }
        };

        loadPDF();
    }, [file]);

    useEffect(() => {
        const renderPage = async () => {
            if (!pdfDoc || !canvasRef.current) return;

            // Cancel previous render task if it exists
            if (renderTaskRef.current) {
                try {
                    await renderTaskRef.current.cancel();
                } catch (error) {
                    // Ignore cancel errors
                }
            }

            try {
                const page = await pdfDoc.getPage(currentPage);
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');

                const viewport = page.getViewport({ scale, rotation });
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };

                const renderTask = page.render(renderContext);
                renderTaskRef.current = renderTask;

                await renderTask.promise;
                renderTaskRef.current = null;
            } catch (error: any) {
                if (error.name !== 'RenderingCancelledException') {
                    console.error('Error rendering page:', error);
                }
            }
        };

        renderPage();

        // Cleanup function to cancel render on unmount
        return () => {
            if (renderTaskRef.current) {
                renderTaskRef.current.cancel();
            }
        };
    }, [pdfDoc, currentPage, scale, rotation]);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleZoomIn = () => {
        setScale((prev) => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
        setScale((prev) => Math.max(prev - 0.25, 0.5));
    };

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const handleDownload = () => {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900">
                {/* Page Navigation */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 dark:bg-gray-800">
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {currentPage}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">/</span>
                        <span className="text-gray-600 dark:text-gray-400">{totalPages}</span>
                    </div>

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        aria-label="Next page"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleZoomOut}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        aria-label="Zoom out"
                    >
                        <ZoomOut className="h-5 w-5" />
                    </button>

                    <div className="rounded-lg bg-gray-100 px-4 py-2 dark:bg-gray-800">
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {Math.round(scale * 100)}%
                        </span>
                    </div>

                    <button
                        onClick={handleZoomIn}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        aria-label="Zoom in"
                    >
                        <ZoomIn className="h-5 w-5" />
                    </button>
                </div>

                {/* Additional Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRotate}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        aria-label="Rotate"
                    >
                        <RotateCw className="h-5 w-5" />
                    </button>

                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40"
                        aria-label="Download"
                    >
                        <Download className="h-5 w-5" />
                        <span className="hidden sm:inline">Download</span>
                    </button>
                </div>
            </div>

            {/* PDF Canvas */}
            <div className="flex justify-center rounded-2xl border border-gray-200 bg-gray-50 p-8 dark:border-gray-800 dark:bg-gray-900/50">
                {loading ? (
                    <div className="flex flex-col items-center gap-4 py-20">
                        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading PDF...</p>
                    </div>
                ) : (
                    <div className="overflow-auto max-h-[70vh]">
                        <canvas
                            ref={canvasRef}
                            className="mx-auto shadow-2xl"
                            style={{ display: 'block' }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
