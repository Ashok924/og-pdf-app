'use client';

import React from 'react';
import { FileText } from 'lucide-react';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80">
            <div className="container mx-auto flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30">
                        <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            PDF Viewer Pro
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Professional PDF Management
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 dark:bg-gray-900">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Ready
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
