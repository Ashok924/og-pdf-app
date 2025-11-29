---
description: Development workflow for PDF Viewer Pro
---

# Development Workflow

## Initial Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Verify installation**
   ```bash
   npm list --depth=0
   ```

## Development

### Web Development (Recommended)

// turbo
1. **Start the development server**
   ```bash
   npm run dev
   ```
   - Opens at http://localhost:3000
   - Hot reload enabled
   - Fast refresh for React components

2. **Make changes**
   - Edit files in `src/app/`
   - Changes reflect immediately
   - Check browser console for errors

3. **Test features**
   - Upload PDFs
   - Test all controls
   - Check responsive design

### Electron Development

1. **Start Electron in dev mode**
   ```bash
   npm run electron:dev
   ```
   - Starts Next.js dev server
   - Waits for server to be ready
   - Opens Electron window
   - DevTools open by default

2. **Debug**
   - Use Chrome DevTools in Electron window
   - Check main process logs in terminal
   - Use `console.log()` for debugging

## Building

### Web Build

// turbo
1. **Build Next.js**
   ```bash
   npm run build
   ```
   - Creates optimized production build
   - Outputs to `out/` directory

2. **Test production build**
   ```bash
   npm start
   ```

### Desktop Build

1. **Build for Windows**
   ```bash
   npm run electron:build
   ```
   - Builds Next.js
   - Packages with Electron
   - Creates installer in `dist/`

2. **Quick package (no installer)**
   ```bash
   npm run pack
   ```
   - Faster for testing
   - Creates unpacked app

## Testing

1. **Test web version**
   - Run `npm run dev`
   - Open http://localhost:3000
   - Test all features

2. **Test Electron version**
   - Run `npm run electron:dev`
   - Test desktop-specific features
   - Check window behavior

3. **Test production build**
   - Run `npm run build`
   - Run `npm run electron`
   - Verify production behavior

## Deployment

### Web Deployment
- Deploy `out/` folder to any static host
- Vercel, Netlify, GitHub Pages, etc.

### Desktop Distribution
1. Build installer: `npm run dist`
2. Test installer on clean Windows machine
3. Distribute the `.exe` file from `dist/`

## Code Quality

1. **Linting**
   ```bash
   npm run lint
   ```

2. **Type checking**
   - TypeScript checks automatically
   - Fix type errors before building

## Common Tasks

### Add a new component
1. Create file in `src/app/components/`
2. Use TypeScript and React
3. Import and use in `page.tsx`

### Update dependencies
```bash
npm update
```

### Clean build artifacts
```bash
# Windows
rmdir /s /q .next out dist
```

### Restart development
```bash
# Stop current dev server (Ctrl+C)
npm run dev
```

## Troubleshooting

### Build fails
1. Delete `.next` and `out` folders
2. Delete `node_modules`
3. Run `npm install`
4. Try build again

### Electron won't start
1. Ensure port 3000 is free
2. Check for errors in terminal
3. Try `npm run dev` first, then `npm run electron` separately

### PDF not rendering
1. Check PDF.js worker URL
2. Verify PDF file is valid
3. Check browser console

## Best Practices

1. **Always test in both web and Electron**
2. **Keep components modular**
3. **Use TypeScript types**
4. **Test with various PDF files**
5. **Check responsive design**
6. **Commit frequently**

## Git Workflow

1. **Check status**
   ```bash
   git status
   ```

2. **Stage changes**
   ```bash
   git add .
   ```

3. **Commit**
   ```bash
   git commit -m "Description of changes"
   ```

4. **Push**
   ```bash
   git push origin main
   ```

## Performance Tips

1. **Use React DevTools** for component profiling
2. **Optimize images** before adding to public/
3. **Lazy load** heavy components if needed
4. **Monitor bundle size** with build output

---

**Follow this workflow for efficient development! 🚀**
