# Parquet Viewer Browser

A high-performance static single page application for viewing and analyzing Parquet files directly in the browser.

## Features

- 📊 **Upload Parquet Files**: Drag-and-drop or click to upload `.parquet` files
- 🔍 **Advanced Filtering**: Filter data by column with support for regex patterns
- ⬆️⬇️ **Column Sorting**: Click column headers to sort data in ascending/descending order
- 🎨 **Canvas-based Rendering**: Uses glide-data-grid for optimal performance
- 💨 **Large File Support**: Designed to handle files with up to 100M rows efficiently
- 📱 **Responsive Design**: Works seamlessly on desktop browsers

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Bun** - JavaScript runtime and package manager
- **Tailwind CSS** - Styling
- **glide-data-grid** - High-performance data grid with canvas rendering
- **hyparquet** - Browser-compatible Parquet file parsing
- **Docker** - Containerization for dev and production

## Prerequisites

- [Bun](https://bun.sh/) installed (or Node.js 18+ with npm/yarn)
- Docker and Docker Compose (for containerized development)

## Deployment

### GitHub Pages

This project includes a GitHub Actions workflow that automatically builds and deploys to GitHub Pages on every push to the `main` branch.

#### Setup Instructions:

1. **Enable GitHub Pages in your repository:**
   - Go to your repository Settings → Pages
   - Under "Build and deployment", select "GitHub Actions" as the source

2. **Configure base path (if needed):**
   - If your repository name is not your GitHub username, update the workflow:
   ```yaml
   # In .github/workflows/deploy.yml, add to the Build step:
   - name: Build
     run: bun run build
     env:
       VITE_BASE_PATH: /your-repo-name/
   ```

3. **Push to main branch:**
   - The workflow will automatically trigger and deploy your site
   - Your site will be available at: `https://your-username.github.io/your-repo-name/`

The workflow will:
- Install dependencies using Bun
- Build the production bundle
- Deploy to GitHub Pages
- Make the site available at your GitHub Pages URL

## Getting Started

### Local Development (with Bun)

1. Install dependencies:
```bash
bun install
```

2. Start the development server:
```bash
bun run dev
```

3. Open your browser at `http://localhost:3000`

### Docker Development

1. Build and start the development container:
```bash
docker-compose up dev
```

2. Open your browser at `http://localhost:3000`

### Production Build (Docker)

1. Build the production container:
```bash
docker-compose up build
```

2. Open your browser at `http://localhost:8080`

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run lint` - Run ESLint
- `bun run lint:fix` - Fix ESLint errors
- `bun run format` - Format code with Prettier
- `bun run type-check` - Run TypeScript type checking

## Browser Support

Supports the last 3 versions of:
- Chrome
- Firefox

## Usage

1. **Upload a Parquet File**: 
   - Drag and drop a `.parquet` file onto the upload area
   - Or click to browse and select a file

2. **Filter Data**:
   - Select a column from the dropdown
   - Enter a filter value
   - Toggle "Regex" checkbox to use regular expressions

3. **Sort Data**:
   - Click on any column header to sort by that column
   - Click again to reverse the sort order

4. **Upload New File**:
   - Click "Upload New File" button to reset and upload a different file

## Performance Optimization

- Canvas-based rendering for smooth scrolling with large datasets
- Virtualized rows - only visible rows are rendered
- Memoized data processing to prevent unnecessary re-calculations
- Efficient filtering and sorting algorithms
- Code splitting for faster initial load

## Project Structure

```
parquet-viewer-browser/
├── src/
│   ├── components/
│   │   ├── FileUpload.tsx    # File upload component
│   │   └── DataGrid.tsx      # Data grid with filtering/sorting
│   ├── utils/
│   │   └── parquetParser.ts  # Parquet parsing logic
│   ├── types.ts              # TypeScript type definitions
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── Dockerfile.dev            # Development Dockerfile
├── Dockerfile.build          # Production Dockerfile
├── docker-compose.yml        # Docker Compose configuration
├── nginx.conf                # Nginx configuration for production
└── vite.config.ts            # Vite configuration
```

## License

MIT
