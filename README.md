# Color Palette Generator

A modern, responsive Angular application that extracts cohesive color palettes from images with accessibility analysis and multiple export options.

## Features

### 🎨 Image Upload & Processing
- **Drag & Drop Support**: Easily upload images by dragging and dropping
- **Click to Upload**: Browse and select images from your device
- **Image Preview**: View the source image used for color extraction
- **Responsive Design**: Works seamlessly on all devices and screen sizes

### 🎯 Color Palette Extraction
- **Smart Color Sampling**: Intelligent pixel sampling for optimal color representation
- **Configurable Colors**: Extract 3-10 colors from your image
- **Dominant Color**: Highlights the most prominent color from the image
- **Color Formats**: View colors in Hex, RGB, and HSL formats
- **Percentage Distribution**: See the percentage of each color in the palette

### ♿ Accessibility Analysis
- **WCAG Compliance**: Automatic contrast ratio calculation against standard backgrounds
- **Accessibility Badges**:
  - **AAA**: Excellent contrast (7:1 or higher)
  - **AA**: Good contrast (4.5:1 or higher)
  - **AA Large**: Suitable for large text (3:1 or higher)
  - **Fail**: Insufficient contrast
- **Contrast Ratios**: View exact contrast ratios for each color
- **Best Text Color**: Automatic text color selection (black/white) for optimal readability

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

## Project Structure

```
src/
├── app/
│   ├── services/
│   │   ├── color-extraction.service.ts    # Image color extraction logic
│   │   ├── accessibility.service.ts       # WCAG accessibility calculations
│   │   └── palette-export.service.ts      # Export functionality
│   ├── app.component.ts                   # Main component logic
│   ├── app.component.html                 # Template
│   ├── app.component.scss                 # Styles
│   └── app.routes.ts                      # Routing configuration
├── styles.scss                            # Global styles
└── main.ts                                # Application entry point
```

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

## Key Components & Services

### ColorExtractionService
Extracts dominant colors from images using canvas pixel sampling.

**Key Methods:**
- `extractPalette(imageUrl, colorCount)` - Main extraction method
- Color conversion utilities (RGB ↔ Hex ↔ HSL)

### AccessibilityService
Calculates WCAG contrast ratios and accessibility compliance levels.

**Key Methods:**
- `calculateContrastRatio(color1, color2)` - WCAG contrast calculation
- `getWcagLevel(contrastRatio)` - Determine WCAG compliance level
- `getBestTextColor(backgroundColor)` - Auto-select optimal text color
- `generateAccessibilityReport(colors)` - Full palette accessibility analysis

### PaletteExportService
Exports color palettes in multiple formats.

**Key Methods:**
- `exportAsJson(colors, filename)`
- `exportAsCss(colors, filename)`
- `exportAsScss(colors, filename)`
- `exportAsTailwind(colors, filename)`
- `exportAsSvg(colors, filename)`
- `exportAsPng(colors, filename)`
- `exportAsHtml(colors, imageSrc, filename)`
- `exportAsAse(colors, filename)`

## Usage

1. **Upload an Image**: Click "Choose Image" or drag & drop an image
2. **Adjust Color Count**: Use the slider to select 3-10 colors
3. **View Results**: See extracted colors with hex codes and accessibility scores
4. **Copy Colors**: Click the clipboard icon to copy hex codes
5. **Export**: Choose your desired export format

## Accessibility Features

- **WCAG 2.1 Compliance**: All colors are analyzed for accessibility
- **High Contrast**: Interface uses high-contrast colors for readability
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Semantic HTML**: Proper markup for screen readers

## Performance

- **Optimized Color Sampling**: Efficient pixel sampling for fast processing
- **Canvas-Based**: Uses browser Canvas API for efficient image processing
- **Lightweight**: Minimal dependencies for fast loading
- **Bundle Size**: ~310KB initial bundle (gzipped)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- Color harmony suggestions
- Palette from URL support
- Custom color count limits
- Palette history
- Color accessibility checker
- Export to additional formats
- Real-time color preview
- Dark mode support

## License

This project is provided as-is for personal and commercial use.

## Support

For issues or feature requests, please check the project documentation or contact support.
