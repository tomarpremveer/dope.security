# Virtualized Data Table

A high-performance React data table with virtualization, built to efficiently handle large datasets (1000+ rows) with smooth scrolling, filtering, and sorting capabilities.

## 🎯 What This Demonstrates

- **Performance Optimization**: Virtual scrolling renders only visible rows (~10-20 DOM nodes instead of 1000+)
- **React Best Practices**: Proper use of `React.memo`, `useCallback`, and `useMemo` to minimize re-renders
- **Modern UI/UX**: Clean dark theme with loading states, smooth transitions, and intuitive interactions
- **Scalable Architecture**: Component-based design that's easy to extend and maintain

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` (or the port shown in terminal)

## ✨ Key Features

### 1. Virtual Scrolling
- Handles 1000+ rows with constant performance
- Only renders visible rows (10-12 at a time)
- Smooth 60 FPS scrolling experience

### 2. Filtering & Sorting
- Multi-select column filters (Health status)
- Sortable columns (Power - ascending/descending)
- Global search across all columns
- Real-time updates with loading states

### 3. Row Selection
- Individual row selection via checkboxes
- Select all / deselect all functionality
- Visual feedback for selected rows

### 4. Performance Features
- **React.memo**: Prevents unnecessary component re-renders
- **useCallback**: Stable function references across renders
- **useMemo**: Cached expensive calculations
- **Virtualization**: 95% reduction in DOM nodes

## 🏗️ Technical Architecture

### Core Technologies
- **React 19** - Latest React features
- **Vite** - Fast build tool and dev server
- **TailwindCSS 4** - Utility-first styling
- **@tanstack/react-virtual** - Virtualization library

### Component Structure

```
Table.jsx              # Main table with virtualization logic
├── TableHeader.jsx    # Column headers with sort/filter controls
├── TableFilter.jsx    # Filter dropdown component
└── Checkbox.jsx       # Reusable checkbox component

CharactersPage.jsx     # Page component managing state
mockApi.js             # Simulated API with filtering/sorting
mockData.js            # 1005 mock records generator
```


## 📦 Dependencies

**Production**:
- `react` & `react-dom` - UI library
- `@tanstack/react-virtual` - Virtualization
- `react-router-dom` - Routing
- `clsx` & `tailwind-merge` - Styling utilities
- `lucide-react` - Icons

**Development**:
- `vite` - Build tool
- `tailwindcss` - CSS framework
- `eslint` - Linting

## 🎯 Future Enhancements

- Column resizing and reordering
- Export to CSV/Excel
- Inline cell editing
- Keyboard navigation
- Server-side pagination for massive datasets
- TypeScript migration

## 📄 Project Context

This project demonstrates production-ready table implementation with a focus on:
- Performance optimization for large datasets
- Modern React patterns and best practices
- Clean, maintainable code architecture
- Excellent user experience

---

**Built with React, Vite, and TailwindCSS**
