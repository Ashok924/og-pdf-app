# PDF Viewer Desktop App (Next.js + React + Electron.js)

## 1. Project Overview
The **PDF Viewer Desktop App** is a desktop application that allows users to upload PDF files via drag & drop or file picker and preview them instantly. Built using **Next.js** for UI and **Electron.js** for packaging into a desktop executable.

## 2. Tech Stack
### Frontend
- Next.js  
- React.js  
- Tailwind CSS  

### Electron Integration
- Electron.js  
- Electron Builder  

### PDF Rendering
- pdf.js  

---

## 3. Core Features
- Drag & drop PDF upload  
- Browse and open PDF  
- PDF preview using pdf.js  
- Page navigation & zoom  
- Package as Windows EXE  

---

## 4. System Architecture
```
Electron (Main Process)
   └─ Loads Next.js build in BrowserWindow

Next.js (Renderer Process)
   ├─ Drag & Drop UI
   ├─ PDF Viewer using pdf.js
   └─ PDF worker file
```

---

## 5. Folder Structure
```
root/
 ├─ electron/
 │   ├─ main.js
 │   ├─ preload.js
 │   └─ package.json
 ├─ src/app/
 │   ├─ page.tsx
 │   └─ components/
 │       ├─ DropZone.tsx
 │       ├─ PDFViewer.tsx
 │       └─ Header.tsx
 ├─ public/pdf.worker.js
 ├─ package.json
 └─ next.config.js
```

---

## 6. Development Phases
### Phase 1: Setup Next.js  
### Phase 2: Build Drag & Drop Upload  
### Phase 3: Integrate pdf.js Viewer  
### Phase 4: Electron Integration  
### Phase 5: Build Windows EXE  

---

## 7. Functional Requirements
1. Drag & drop upload  
2. File browsing upload  
3. PDF preview  
4. Page navigation  
5. Zoom  
6. EXE packaging  

---

## 8. UI Layout
- Header  
- Drag & drop area  
- File button  
- PDF preview  

---

## 9. Expected Output
- Fully functional Next.js project  
- PDF Viewer UI  
- Electron desktop app  
- EXE builder configured  
