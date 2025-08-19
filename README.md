# Productive Browser

A modern, productive web browser built with Electron, React, and TypeScript.

## Features

- Modern UI with dark/light theme support
- Tabbed browsing
- Bookmark management
- Navigation controls (back, forward, refresh, home)
- Responsive design
- Cross-platform (Windows, macOS, Linux)

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm (v7 or later) or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd productive-browser
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To run the application in development mode:

```bash
# Start the Vite dev server and Electron
npm run electron:dev
```

### Building for Production

To create a production build:

```bash
# Build the application
npm run build

# Package the application
npm run electron:build
```

The built application will be available in the `dist` directory.

## Project Structure

```
productive-browser/
├── public/             # Static files
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Application pages
│   ├── styles/         # Global styles
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── main.js             # Electron main process
├── package.json        # Project configuration
└── vite.config.ts      # Vite configuration
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
