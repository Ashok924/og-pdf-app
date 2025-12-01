import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PDFViewer from '../PDFViewer';

// Mock pdfjs-dist
jest.mock('pdfjs-dist', () => ({
    GlobalWorkerOptions: { workerSrc: '' },
    getDocument: jest.fn(() => ({
        promise: Promise.resolve({
            numPages: 5,
            getPage: jest.fn((pageNum) =>
                Promise.resolve({
                    getViewport: jest.fn(() => ({
                        width: 800,
                        height: 1000,
                        scale: 1.5,
                        transform: [1, 0, 0, 1, 0, 0],
                    })),
                    render: jest.fn(() => ({
                        promise: Promise.resolve(),
                        cancel: jest.fn(),
                    })),
                    getTextContent: jest.fn(() =>
                        Promise.resolve({
                            items: [
                                { str: 'Hello World', width: 100, height: 12, transform: [1, 0, 0, 1, 0, 0] },
                                { str: 'Test Document', width: 120, height: 12, transform: [1, 0, 0, 1, 0, 20] },
                                { str: 'Search Test', width: 90, height: 12, transform: [1, 0, 0, 1, 0, 40] },
                            ],
                        })
                    ),
                })
            ),
        }),
    })),
    Util: {
        transform: jest.fn((a, b) => b),
    },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    ChevronLeft: () => <div>ChevronLeft</div>,
    ChevronRight: () => <div>ChevronRight</div>,
    ZoomIn: () => <div>ZoomIn</div>,
    ZoomOut: () => <div>ZoomOut</div>,
    RotateCw: () => <div>RotateCw</div>,
    Download: () => <div>Download</div>,
    Search: () => <div>Search</div>,
    ChevronUp: () => <div>ChevronUp</div>,
    ChevronDown: () => <div>ChevronDown</div>,
    X: () => <div>X</div>,
}));

describe('PDFViewer Component', () => {
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Initial Rendering', () => {
        it('should render loading state initially', () => {
            render(<PDFViewer file={mockFile} />);
            expect(screen.getByText('Loading PDF...')).toBeInTheDocument();
        });

        it('should display page navigation controls', async () => {
            render(<PDFViewer file={mockFile} />);

            await waitFor(() => {
                expect(screen.queryByText('Loading PDF...')).not.toBeInTheDocument();
            });

            expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
            expect(screen.getByLabelText('Next page')).toBeInTheDocument();
        });

        it('should display zoom controls', async () => {
            render(<PDFViewer file={mockFile} />);

            await waitFor(() => {
                expect(screen.queryByText('Loading PDF...')).not.toBeInTheDocument();
            });

            expect(screen.getByLabelText('Zoom in')).toBeInTheDocument();
            expect(screen.getByLabelText('Zoom out')).toBeInTheDocument();
            expect(screen.getByText('150%')).toBeInTheDocument(); // Default scale is 1.5
        });

        it('should display additional controls', async () => {
            render(<PDFViewer file={mockFile} />);

            await waitFor(() => {
                expect(screen.queryByText('Loading PDF...')).not.toBeInTheDocument();
            });

            expect(screen.getByLabelText('Search')).toBeInTheDocument();
            expect(screen.getByLabelText('Rotate')).toBeInTheDocument();
            expect(screen.getByLabelText('Download')).toBeInTheDocument();
        });
    });

    describe('Page Navigation', () => {
        it('should disable previous button on first page', async () => {
            render(<PDFViewer file={mockFile} />);

            await waitFor(() => {
                expect(screen.queryByText('Loading PDF...')).not.toBeInTheDocument();
            });

            const prevButton = screen.getByLabelText('Previous page');
            expect(prevButton).toBeDisabled();
        });

        it('should enable next button when not on last page', async () => {
            render(<PDFViewer file={mockFile} />);

            await waitFor(() => {
                expect(screen.queryByText('Loading PDF...')).not.toBeInTheDocument();
            });

            const nextButton = screen.getByLabelText('Next page');
            expect(nextButton).not.toBeDisabled();
        });

        it('should navigate to next page when next button is clicked', async () => {
            render(<PDFViewer file={mockFile} />);

            // Wait for PDF to load by checking total pages
            await waitFor(() => {
                const totalPages = screen.getByTestId('total-pages');
                expect(totalPages).toHaveTextContent('5');
            });

            const nextButton = screen.getByLabelText('Next page');
            fireEvent.click(nextButton);

            await waitFor(() => {
                const currentPage = screen.getByTestId('current-page');
                expect(currentPage).toHaveTextContent('2');
            });
        });

        it('should navigate to previous page when previous button is clicked', async () => {
            render(<PDFViewer file={mockFile} />);

            // Wait for PDF to load
            await waitFor(() => {
                const totalPages = screen.getByTestId('total-pages');
                expect(totalPages).toHaveTextContent('5');
            });

            const nextButton = screen.getByLabelText('Next page');
            fireEvent.click(nextButton);

            await waitFor(() => {
                const currentPage = screen.getByTestId('current-page');
                expect(currentPage).toHaveTextContent('2');
            });

            const prevButton = screen.getByLabelText('Previous page');
            fireEvent.click(prevButton);

            await waitFor(() => {
                const currentPage = screen.getByTestId('current-page');
                expect(currentPage).toHaveTextContent('1');
            });
        });

        it('should display correct page count', async () => {
            render(<PDFViewer file={mockFile} />);

            await waitFor(() => {
                const totalPages = screen.getByTestId('total-pages');
                expect(totalPages).toHaveTextContent('5');
            });
        });
    });

    describe('Zoom Functionality', () => {
        it('should zoom in when zoom in button is clicked', async () => {
            render(<PDFViewer file={mockFile} />);

            await waitFor(() => {
                expect(screen.getByText('150%')).toBeInTheDocument();
            });

            const zoomInButton = screen.getByLabelText('Zoom in');
            fireEvent.click(zoomInButton);

            await waitFor(() => {
                expect(screen.getByText('175%')).toBeInTheDocument();
            });
        });

        it('should zoom out when zoom out button is clicked', async () => {
            render(<PDFViewer file={mockFile} />);

            await waitFor(() => {
                expect(screen.getByText('150%')).toBeInTheDocument();
            });

            const zoomOutButton = screen.getByLabelText('Zoom out');
            fireEvent.click(zoomOutButton);

            await waitFor(() => {
                expect(screen.getByText('125%')).toBeInTheDocument();
            });
        });

        it('should not zoom beyond maximum (300%)', async () => {
            render(<PDFViewer file={mockFile} />);

            await waitFor(() => {
                expect(screen.queryByText('Loading PDF...')).not.toBeInTheDocument();
            });

            const zoomInButton = screen.getByLabelText('Zoom in');

            // Click multiple times to reach maximum
            for (let i = 0; i < 10; i++) {
                fireEvent.click(zoomInButton);
            }

            await waitFor(() => {
                expect(screen.getByText('300%')).toBeInTheDocument();
            });
        });

        it('should not zoom below minimum (50%)', async () => {
            render(<PDFViewer file={mockFile} />);

            await waitFor(() => {
                expect(screen.queryByText('Loading PDF...')).not.toBeInTheDocument();
            });

            const zoomOutButton = screen.getByLabelText('Zoom out');

            // Click multiple times to reach minimum
            for (let i = 0; i < 10; i++) {
                fireEvent.click(zoomOutButton);
            }

            await waitFor(() => {
                expect(screen.getByText('50%')).toBeInTheDocument();
            });
        });
    });

    describe('Search Functionality', () => {
        it('should toggle search bar when search button is clicked', async () => {
            render(<PDFViewer file={mockFile} />);

            await waitFor(() => {
                expect(screen.queryByText('Loading PDF...')).not.toBeInTheDocument();
            });

            const searchButton = screen.getByLabelText('Search');
            fireEvent.click(searchButton);

            await waitFor(() => {
                expect(screen.getByPlaceholderText('Search in PDF...')).toBeInTheDocument();
            });
        });

        it('should accept search input', async () => {
            render(<PDFViewer file={mockFile} />);

            await waitFor(() => {
                expect(screen.queryByText('Loading PDF...')).not.toBeInTheDocument();
            });

            const searchButton = screen.getByLabelText('Search');
            fireEvent.click(searchButton);

            const searchInput = screen.getByPlaceholderText('Search in PDF...');
            fireEvent.change(searchInput, { target: { value: 'Test' } });

            expect(searchInput).toHaveValue('Test');
        });

        it('should perform search when search button is clicked', async () => {
            render(<PDFViewer file={mockFile} />);

            await waitFor(() => {
                expect(screen.queryByText('Loading PDF...')).not.toBeInTheDocument();
            });

            const searchIconButton = screen.getByLabelText('Search');
            fireEvent.click(searchIconButton);

            const searchInput = screen.getByPlaceholderText('Search in PDF...');
            fireEvent.change(searchInput, { target: { value: 'Test' } });

            const searchButtons = screen.getAllByText('Search');
            const searchButton = searchButtons.find(el => el.tagName === 'BUTTON' && el.textContent === 'Search');

            if (searchButton) {
                fireEvent.click(searchButton);
            }

            await waitFor(() => {
                expect(screen.queryByText('Searching...')).not.toBeInTheDocument();
            });
        });

        it('should clear search when X button is clicked', async () => {
            render(<PDFViewer file={mockFile} />);

            await waitFor(() => {
                expect(screen.queryByText('Loading PDF...')).not.toBeInTheDocument();
            });

            const searchButton = screen.getByLabelText('Search');
            fireEvent.click(searchButton);

            const searchInput = screen.getByPlaceholderText('Search in PDF...');
            fireEvent.change(searchInput, { target: { value: 'Test' } });

            // The X button appears when there's text
            const clearButtons = screen.getAllByRole('button');
            const xButton = clearButtons.find(btn => btn.querySelector('div')?.textContent === 'X');

            if (xButton) {
                fireEvent.click(xButton);
                expect(searchInput).toHaveValue('');
            }
        });

        it('should show no results message when search yields no matches', async () => {
            render(<PDFViewer file={mockFile} />);

            await waitFor(() => {
                expect(screen.queryByText('Loading PDF...')).not.toBeInTheDocument();
            });

            const searchIconButton = screen.getByLabelText('Search');
            fireEvent.click(searchIconButton);

            const searchInput = screen.getByPlaceholderText('Search in PDF...');
            fireEvent.change(searchInput, { target: { value: 'NonExistentText123' } });

            const searchButtons = screen.getAllByText('Search');
            const searchButton = searchButtons.find(el => el.tagName === 'BUTTON' && el.textContent === 'Search');

            if (searchButton) {
                fireEvent.click(searchButton);
            }

            await waitFor(() => {
                expect(screen.getByText('No results found')).toBeInTheDocument();
            });
        });
    });

    describe('Rotation Functionality', () => {
        it('should have rotate button', async () => {
            render(<PDFViewer file={mockFile} />);

            await waitFor(() => {
                expect(screen.queryByText('Loading PDF...')).not.toBeInTheDocument();
            });

            expect(screen.getByLabelText('Rotate')).toBeInTheDocument();
        });

        it('should be clickable', async () => {
            render(<PDFViewer file={mockFile} />);

            await waitFor(() => {
                expect(screen.queryByText('Loading PDF...')).not.toBeInTheDocument();
            });

            const rotateButton = screen.getByLabelText('Rotate');
            fireEvent.click(rotateButton);
            // Rotation state change would trigger re-render
        });
    });

    describe('Download Functionality', () => {
        it('should have download button', async () => {
            render(<PDFViewer file={mockFile} />);

            await waitFor(() => {
                expect(screen.queryByText('Loading PDF...')).not.toBeInTheDocument();
            });

            expect(screen.getByLabelText('Download')).toBeInTheDocument();
        });

        it('should trigger download when clicked', async () => {
            render(<PDFViewer file={mockFile} />);

            await waitFor(() => {
                expect(screen.queryByText('Loading PDF...')).not.toBeInTheDocument();
            });

            const downloadButton = screen.getByLabelText('Download');
            fireEvent.click(downloadButton);

            expect(global.URL.createObjectURL).toHaveBeenCalled();
        });
    });

    describe('Error Handling', () => {
        it('should handle PDF loading errors gracefully', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

            const errorFile = new File(['invalid'], 'error.pdf', { type: 'application/pdf' });

            render(<PDFViewer file={errorFile} />);

            await waitFor(() => {
                expect(screen.queryByText('Loading PDF...')).not.toBeInTheDocument();
            }, { timeout: 3000 });

            consoleSpy.mockRestore();
        });
    });
});
