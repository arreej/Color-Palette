# Color Palette Generator

A modern, responsive Angular application that extracts cohesive color palettes from images with accessibility analysis and multiple export options.

## Features

###  Image Upload & Processing
- **Drag & Drop Support**: Easily upload images by dragging and dropping
- **Click to Upload**: Browse and select images from your device
- **Image Preview**: View the source image used for color extraction
- **Responsive Design**: Works seamlessly on all devices and screen sizes

###  Color Palette Extraction
- **Smart Color Sampling**: Intelligent pixel sampling for optimal color representation
- **Configurable Colors**: Extract 3-10 colors from your image
- **Dominant Color**: Highlights the most prominent color from the image
- **Color Formats**: View colors in Hex, RGB, and HSL formats
- **Percentage Distribution**: See the percentage of each color in the palette

### 📥 Export Options
Export your color palette in multiple formats:

1. **JSON** - Structured data format for programmatic use
2. **CSS** - CSS custom properties (variables)
3. **SCSS** - SCSS variable format
4. **Tailwind Config** - Tailwind CSS configuration
5. **SVG** - Scalable vector graphics with color swatches
6. **PNG** - High-quality image with hex codes
7. **HTML** - Standalone HTML document with styling
8. **ASE** - Adobe Swatch Exchange (compatible with Adobe Creative Suite)

## Technology Stack

- **Angular 19** - Modern web application framework
- **TypeScript** - Type-safe JavaScript
- **SCSS** - Advanced styling with variables and mixins
- **Canvas API** - Image processing and color extraction
- **RxJS** - Reactive programming


## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Development Server

Run the development server:
```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you modify source files.

### Build

Build the project for production:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Run Tests

Execute unit tests:
```bash
npm test
```
