# Quick Start Guide - PDF Viewer Pro

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies (if not already done)
```bash
npm install
```

### Step 2: Run the Application

#### Option A: Web Version (Recommended for Development)
```bash
npm run dev
```
Then open http://localhost:3000 in your browser.

#### Option B: Desktop Version (Electron)
```bash
npm run electron:dev
```
This will open the app in a desktop window.

### Step 3: Use the Application
1. **Upload a PDF**: Drag & drop or click "Browse Files"
2. **View**: The PDF will render automatically
3. **Navigate**: Use the controls to zoom, rotate, and navigate pages
4. **Download**: Click the download button to save the PDF

---

## 📦 Building for Production

### Build Windows Executable

1. **Build the Next.js app**:
   ```bash
   npm run build
   ```

2. **Create the installer**:
   ```bash
   npm run dist
   ```

3. **Find your executable**:
   - Location: `dist/PDF Viewer Pro Setup 0.1.0.exe`
   - Double-click to install

---

## 🎯 Key Features

- ✨ Drag & drop PDF upload
- 📄 High-quality PDF rendering
- 🔍 Zoom in/out (50% - 300%)
- 📑 Page-by-page navigation
- 🔄 Rotate pages
- 💾 Download PDFs
- 🎨 Beautiful modern UI
- 🌙 Dark mode support

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build Next.js for production |
| `npm run electron:dev` | Run Electron app in development |
| `npm run electron:build` | Build Next.js and package Electron |
| `npm run dist` | Create Windows installer |
| `npm run pack` | Create unpacked app (for testing) |

---

## 🐛 Common Issues

### Issue: "Port 3000 is already in use"
**Solution**: Kill the process using port 3000 or use a different port:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: PDF not rendering
**Solution**: 
- Check browser console for errors
- Ensure PDF.js worker is loading correctly
- Try a different PDF file

### Issue: Electron window not opening
**Solution**:
- Make sure Next.js dev server is running first
- Use `npm run electron:dev` which handles this automatically
- Check for errors in the terminal

---

## 📱 Testing

1. **Test with sample PDFs**: Use the included `og_pdf_project_document.pdf`
2. **Test features**:
   - Upload via drag & drop
   - Upload via file picker
   - Navigate pages
   - Zoom in/out
   - Rotate pages
   - Download PDF

---

## 🎨 Customization

### Change App Name
Edit `src/app/components/Header.tsx`:
```tsx
<h1>Your App Name</h1>
```

### Change Colors
Modify the gradient colors in components:
- Blue: `from-blue-600 to-purple-600`
- Purple: `from-purple-500 to-purple-600`
- Pink: `from-pink-500 to-pink-600`

### Change Icon
Replace `public/favicon.ico` with your own icon.

---

## 📞 Need Help?

- Check the main README.md for detailed documentation
- Review the code comments in component files
- Check the Next.js and Electron documentation

---

**Happy PDF Viewing! 🎉**
