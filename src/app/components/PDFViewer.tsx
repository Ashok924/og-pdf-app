'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download, Search, ChevronUp, ChevronDown, X } from 'lucide-react';

// Set up the worker - use static file from public directory
if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

interface PDFViewerProps {
    file: File;
}

interface SearchMatch {
    pageNum: number;
    textIndex: number;
    charIndex: number;
}

export default function PDFViewer({ file }: PDFViewerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const highlightLayerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const renderTaskRef = useRef<any>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // PDF State
    const [pdfDoc, setPdfDoc] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [scale, setScale] = useState(1.5);
    const [rotation, setRotation] = useState(0);
    const [loading, setLoading] = useState(true);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchMatches, setSearchMatches] = useState<SearchMatch[]>([]);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const [showSearch, setShowSearch] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Load PDF
    useEffect(() => {
        const loadPDF = async () => {
            setLoading(true);
            try {
                const fileReader = new FileReader();

                fileReader.onload = async (e) => {
                    try {
                        const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
                        const pdf = await pdfjsLib.getDocument({
                            data: typedArray,
                            standardFontDataUrl: '/standard_fonts/'
                        }).promise;
                        setPdfDoc(pdf);
                        setTotalPages(pdf.numPages);
                        setCurrentPage(1);
                        setLoading(false);
                    } catch (error) {
                        console.error('Error loading PDF:', error);
                        setLoading(false);
                    }
                };

                fileReader.onerror = () => {
                    console.error('FileReader error');
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

    // Render Page
    useEffect(() => {
        let isCancelled = false;

        const renderPage = async () => {
            if (!pdfDoc || !canvasRef.current) return;

            // Cancel previous render task if it exists
            if (renderTaskRef.current) {
                try {
                    renderTaskRef.current.cancel();
                    renderTaskRef.current = null;
                } catch (error) {
                    // Ignore cancel errors
                }
            }

            try {
                const page = await pdfDoc.getPage(currentPage);

                // Check if component unmounted or state changed
                if (isCancelled || !canvasRef.current) return;

                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');

                const viewport = page.getViewport({ scale, rotation });
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Clear the canvas before rendering
                context?.clearRect(0, 0, canvas.width, canvas.height);

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };

                const renderTask = page.render(renderContext);
                renderTaskRef.current = renderTask;

                await renderTask.promise;

                // Render highlights after page is rendered
                // We pass the page and viewport explicitly to ensure we use the current render state
                if (searchQuery.trim()) {
                    await renderHighlights(page, viewport);
                } else if (highlightLayerRef.current) {
                    highlightLayerRef.current.innerHTML = '';
                }

                // Only clear the ref if this render wasn't cancelled
                if (!isCancelled && renderTaskRef.current === renderTask) {
                    renderTaskRef.current = null;
                }
            } catch (error: any) {
                if (error.name !== 'RenderingCancelledException') {
                    console.error('Error rendering page:', error);
                }
            }
        };

        renderPage();

        // Cleanup function to cancel render on unmount or when dependencies change
        return () => {
            isCancelled = true;
            if (renderTaskRef.current) {
                try {
                    renderTaskRef.current.cancel();
                } catch (e) {
                    // Ignore errors
                }
                renderTaskRef.current = null;
            }
        };
    }, [pdfDoc, currentPage, scale, rotation, searchQuery, currentMatchIndex, searchMatches]); // Added search dependencies to re-render highlights

    // Search Functionality
    const performSearch = async () => {
        if (!pdfDoc || !searchQuery.trim()) {
            setSearchMatches([]);
            if (highlightLayerRef.current) {
                highlightLayerRef.current.innerHTML = '';
            }
            return;
        }

        setIsSearching(true);
        const matches: SearchMatch[] = [];

        try {
            for (let i = 1; i <= totalPages; i++) {
                const page = await pdfDoc.getPage(i);
                const textContent = await page.getTextContent();

                textContent.items.forEach((item: any, textIndex: number) => {
                    const text = item.str;
                    const searchTerm = searchQuery.toLowerCase();
                    const textLower = text.toLowerCase();
                    let charIndex = 0;

                    while ((charIndex = textLower.indexOf(searchTerm, charIndex)) !== -1) {
                        matches.push({
                            pageNum: i,
                            textIndex,
                            charIndex
                        });
                        charIndex += searchTerm.length;
                    }
                });
            }

            setSearchMatches(matches);
            setCurrentMatchIndex(0);

            // Navigate to first match
            if (matches.length > 0) {
                setCurrentPage(matches[0].pageNum);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const renderHighlights = async (page: any, viewport: any) => {
        if (!highlightLayerRef.current || !searchQuery.trim()) return;

        const highlightLayer = highlightLayerRef.current;
        highlightLayer.innerHTML = '';

        // Set highlight layer dimensions to match canvas
        highlightLayer.style.width = `${viewport.width}px`;
        highlightLayer.style.height = `${viewport.height}px`;

        try {
            // Get text content for current page
            const textContent = await page.getTextContent();
            const searchTerm = searchQuery.toLowerCase();

            // Get matches for current page
            const currentPageMatches = searchMatches.filter(m => m.pageNum === currentPage);

            currentPageMatches.forEach((match) => {
                const item = textContent.items[match.textIndex];
                if (!item) return;

                // Recalculate position for current viewport
                const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);

                // Calculate dimensions
                // item.width is the width in PDF units
                // item.height is the height in PDF units
                const fontHeight = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);
                const itemHeight = item.height > 0 ? item.height * viewport.scale : fontHeight;

                const itemWidth = item.width * viewport.scale;
                const charWidth = itemWidth / (item.str.length || 1);

                const matchWidth = charWidth * searchTerm.length;
                const offset = charWidth * match.charIndex;

                // Calculate coordinates
                // tx[4] is x, tx[5] is y (baseline)
                const left = tx[4] + offset;
                const top = tx[5] - itemHeight; // Move up from baseline

                // Create highlight div
                const highlightDiv = document.createElement('div');

                // Determine if this is the current active match
                const globalMatchIndex = searchMatches.findIndex(
                    m => m.pageNum === match.pageNum &&
                        m.textIndex === match.textIndex &&
                        m.charIndex === match.charIndex
                );
                const isCurrentMatch = globalMatchIndex === currentMatchIndex;

                // Style the highlight box
                highlightDiv.style.position = 'absolute';
                highlightDiv.style.left = `${left}px`;
                highlightDiv.style.top = `${top}px`;
                highlightDiv.style.width = `${matchWidth}px`;
                highlightDiv.style.height = `${itemHeight}px`;
                highlightDiv.style.backgroundColor = isCurrentMatch ? '#FF9632' : '#FFEB3B'; // Orange for active, Yellow for others
                highlightDiv.style.opacity = '0.4';
                highlightDiv.style.pointerEvents = 'none';
                highlightDiv.style.borderRadius = '2px';
                highlightDiv.style.mixBlendMode = 'multiply'; // Better highlighting effect

                highlightLayer.appendChild(highlightDiv);
            });
        } catch (error) {
            console.error('Error rendering highlights:', error);
        }
    };

    // Navigation Handlers
    const goToNextMatch = () => {
        if (searchMatches.length === 0) return;
        const nextIndex = (currentMatchIndex + 1) % searchMatches.length;
        setCurrentMatchIndex(nextIndex);
        setCurrentPage(searchMatches[nextIndex].pageNum);
    };

    const goToPrevMatch = () => {
        if (searchMatches.length === 0) return;
        const prevIndex = currentMatchIndex === 0 ? searchMatches.length - 1 : currentMatchIndex - 1;
        setCurrentMatchIndex(prevIndex);
        setCurrentPage(searchMatches[prevIndex].pageNum);
    };

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
                        <span className="font-semibold text-gray-900 dark:text-white" data-testid="current-page">
                            {currentPage}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">/</span>
                        <span className="text-gray-600 dark:text-gray-400" data-testid="total-pages">{totalPages}</span>
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
                        onClick={() => setShowSearch(!showSearch)}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${showSearch
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                        aria-label="Search"
                    >
                        <Search className="h-5 w-5" />
                    </button>

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

            {/* Search Bar */}
            {showSearch && (
                <div ref={searchContainerRef} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900 animate-fade-in">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && performSearch()}
                                placeholder="Search in PDF..."
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSearchMatches([]);
                                        if (highlightLayerRef.current) {
                                            highlightLayerRef.current.innerHTML = '';
                                        }
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>

                        <button
                            onClick={performSearch}
                            disabled={!searchQuery.trim() || isSearching}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Search className="h-5 w-5" />
                            {isSearching ? 'Searching...' : 'Search'}
                        </button>

                        {searchMatches.length > 0 && (
                            <>
                                <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 dark:bg-gray-800">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {currentMatchIndex + 1} / {searchMatches.length}
                                    </span>
                                </div>

                                <button
                                    onClick={goToPrevMatch}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    aria-label="Previous match"
                                >
                                    <ChevronUp className="h-5 w-5" />
                                </button>

                                <button
                                    onClick={goToNextMatch}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    aria-label="Next match"
                                >
                                    <ChevronDown className="h-5 w-5" />
                                </button>
                            </>
                        )}
                    </div>

                    {searchMatches.length === 0 && searchQuery && !isSearching && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            No results found
                        </p>
                    )}
                </div>
            )}

            {/* PDF Canvas with Highlight Layer */}
            <div className="flex justify-center rounded-2xl border border-gray-200 bg-gray-50 p-8 dark:border-gray-800 dark:bg-gray-900/50">
                {loading ? (
                    <div className="flex flex-col items-center gap-4 py-20">
                        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading PDF...</p>
                    </div>
                ) : (
                    <div className="overflow-auto max-h-[70vh]">
                        <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
                            <canvas
                                ref={canvasRef}
                                className="mx-auto shadow-2xl"
                                style={{ display: 'block' }}
                            />
                            <div
                                ref={highlightLayerRef}
                                className="pdf-highlight-layer"
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    right: 0,
                                    bottom: 0,
                                    overflow: 'hidden',
                                    pointerEvents: 'none'
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
