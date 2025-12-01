import '@testing-library/jest-dom';

// Mock PDF.js
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock canvas
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    fillStyle: '',
    save: jest.fn(),
    restore: jest.fn(),
    measureText: jest.fn((text: string) => ({ width: text.length * 10 })),
})) as any;

// Mock FileReader with proper async behavior
class MockFileReader {
    onload: ((event: any) => void) | null = null;
    onerror: ((event: any) => void) | null = null;
    result: ArrayBuffer | null = null;

    readAsArrayBuffer(blob: Blob) {
        // Simulate async file reading
        setTimeout(() => {
            // Create a mock ArrayBuffer
            const buffer = new ArrayBuffer(8);
            this.result = buffer;

            if (this.onload) {
                this.onload({
                    target: { result: buffer },
                });
            }
        }, 0);
    }
}

global.FileReader = MockFileReader as any;
