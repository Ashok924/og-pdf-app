// Type definitions for Electron API exposed via preload script

export interface ElectronAPI {
    platform: NodeJS.Platform;
    versions: {
        node: string;
        chrome: string;
        electron: string;
    };
}

declare global {
    interface Window {
        electron?: ElectronAPI;
    }
}

export { };
