# PDF Viewer Pro - Desktop Application

A modern, professional PDF viewer desktop application built with **Next.js**, **React**, **Electron.js**, and **PDF.js**.

## 🚀 Features

- ✨ **Drag & Drop Upload** - Easily upload PDF files by dragging and dropping
- 📄 **PDF Preview** - High-quality PDF rendering using PDF.js
- 🔍 **Zoom Controls** - Zoom in/out with precision controls
- 📑 **Page Navigation** - Navigate through pages with intuitive controls
- 🔄 **Rotation** - Rotate PDF pages for better viewing
- 💾 **Download** - Download PDFs with a single click
- 🎨 **Modern UI** - Beautiful, premium design with dark mode support
- 💻 **Desktop App** - Packaged as a Windows executable

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons
- **PDF.js** - PDF rendering

### Desktop
- **Electron.js** - Desktop application framework
- **Electron Builder** - Application packaging

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd og-pdf-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## 🏃 Running the Application

### Development Mode (Web)
Run the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Development Mode (Electron)
Run the application as a desktop app:
```bash
npm run electron:dev
```
This will start both the Next.js dev server and Electron window.

### Production Build (Web)
Build the Next.js application:
```bash
npm run build
npm start
```

## 📱 Building Desktop Application

### Build for Windows

1. **Build the Next.js app**
   ```bash
   npm run build
   ```

2. **Package as Windows EXE**
   ```bash
   npm run dist
   ```

The executable will be created in the `dist` folder.

### Build Options

- `npm run pack` - Build unpacked directory (for testing)
- `npm run dist` - Build installer (NSIS for Windows)
- `npm run electron:build` - Build Next.js and package in one command

## 📁 Project Structure

```
og-pdf-app/
├── electron/
│   ├── main.js          # Electron main process
│   └── preload.js       # Preload script for IPC
├── src/
│   └── app/
│       ├── components/
│       │   ├── Header.tsx      # App header
│       │   ├── DropZone.tsx    # File upload zone
│       │   └── PDFViewer.tsx   # PDF viewer component
│       ├── globals.css         # Global styles
│       ├── layout.tsx          # Root layout
│       └── page.tsx            # Main page
├── public/              # Static assets
├── package.json         # Dependencies and scripts
├── next.config.ts       # Next.js configuration
└── README.md           # This file
```

## 🎯 Usage

1. **Launch the application** (web or desktop)
2. **Upload a PDF** by:
   - Dragging and dropping a PDF file onto the drop zone
   - Clicking "Browse Files" to select a PDF
3. **View your PDF** with the following controls:
   - **Previous/Next** - Navigate between pages
   - **Zoom In/Out** - Adjust the zoom level
   - **Rotate** - Rotate the page view
   - **Download** - Save the PDF to your device
4. **Clear the file** by clicking the X button to upload a new PDF

## 🔧 Configuration

### Electron Builder
The `build` section in `package.json` configures the desktop application:
- **App ID**: `com.ogpdfapp.app`
- **Product Name**: PDF Viewer Pro
- **Output Directory**: `dist`
- **Windows Target**: NSIS installer

### Next.js
The `next.config.ts` is configured for static export to work with Electron:
- Static export enabled
- Image optimization disabled (for Electron compatibility)
- Trailing slashes enabled

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Component styles use Tailwind CSS classes
- Color scheme uses gradients (blue, purple, pink)

### Branding
- Update the app name in `src/app/components/Header.tsx`
- Change the icon in `public/favicon.ico`
- Modify colors in component files

## 🐛 Troubleshooting

### PDF.js Worker Error
If you see worker-related errors, ensure the PDF.js worker is loaded from CDN:
```javascript
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
```

### Electron Window Not Opening
- Check that port 3000 is available
- Ensure Next.js dev server is running before Electron
- Use `npm run electron:dev` which handles this automatically

### Build Errors
- Clear `.next` and `out` folders
- Delete `node_modules` and reinstall
- Ensure all dependencies are installed

## 📄 License

This project is private and for educational/business purposes.

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

## 📞 Support

For support and questions, please contact the project maintainer.

---

**Built with ❤️ using modern web technologies**
