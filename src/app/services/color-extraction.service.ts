import { Injectable } from '@angular/core';

export interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  name?: string;
  percentage?: number;
}

export interface PaletteResult {
  colors: Color[];
  dominantColor: Color;
  imageDataUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ColorExtractionService {
  constructor() {}

  /**
   * Extract color palette from an image
   */
  extractPalette(imageUrl: string | File, colorCount: number = 5): Promise<PaletteResult> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'Anonymous';

      const loadHandler = () => {
        try {
          const colors = this.extractColorsFromImage(image, colorCount);
          const imageDataUrl = this.imageToDataUrl(image);

          resolve({
            colors: colors.sort((a, b) => (b.percentage || 0) - (a.percentage || 0)),
            dominantColor: colors[0],
            imageDataUrl
          });
        } catch (error) {
          reject(new Error('Failed to extract colors from image'));
        }
      };

      const errorHandler = () => {
        reject(new Error('Failed to load image'));
      };

      image.onload = loadHandler;
      image.onerror = errorHandler;

      if (typeof imageUrl === 'string') {
        image.src = imageUrl;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          image.src = e.target?.result as string;
        };
        reader.onerror = errorHandler;
        reader.readAsDataURL(imageUrl);
      }
    });
  }

  /**
   * Extract colors from canvas using pixel sampling
   */
  private extractColorsFromImage(image: HTMLImageElement, colorCount: number): Color[] {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Could not get canvas context');

    // Resize canvas to image dimensions
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Sample colors from image (skip alpha and use every nth pixel for performance)
    const sampleSize = Math.max(1, Math.floor(Math.sqrt((canvas.width * canvas.height) / 1000)));
    const colors: { hex: string; count: number }[] = [];
    const colorMap = new Map<string, number>();

    for (let i = 0; i < data.length; i += 4 * sampleSize) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Skip transparent and near-transparent pixels
      if (a < 128) continue;

      // Skip nearly white and black pixels for better palette
      const brightness = (r + g + b) / 3;
      if (brightness > 245 || brightness < 10) continue;

      const hex = this.rgbToHex(r, g, b);
      colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
    }

    // Convert to array and get top colors
    const sortedColors = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, colorCount);

    const totalCount = Array.from(colorMap.values()).reduce((a, b) => a + b, 0);

    return sortedColors.map(([hex, count]) => ({
      hex,
      rgb: this.hexToRgb(hex),
      hsl: this.hexToHsl(hex),
      percentage: Math.round((count / totalCount) * 100)
    }));
  }

  /**
   * Convert RGB to Hex
   */
  private rgbToHex(r: number, g: number, b: number): string {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
        .toUpperCase()
    );
  }

  /**
   * Convert Hex to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : { r: 0, g: 0, b: 0 };
  }

  /**
   * Convert Hex to HSL
   */
  private hexToHsl(hex: string): { h: number; s: number; l: number } {
    const rgb = this.hexToRgb(hex);
    return this.rgbToHsl(rgb.r, rgb.g, rgb.b);
  }

  /**
   * Convert RGB to HSL
   */
  private rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    (r /= 255), (g /= 255), (b /= 255);
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  /**
   * Convert canvas image to data URL
   */
  private imageToDataUrl(image: HTMLImageElement): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    return canvas.toDataURL('image/png');
  }

  /**
   * Get color name based on hex code (basic naming)
   */
  getColorName(hex: string): string {
    const colorNames: { [key: string]: string } = {
      '#FF0000': 'Red',
      '#00FF00': 'Green',
      '#0000FF': 'Blue',
      '#FFFF00': 'Yellow',
      '#FF00FF': 'Magenta',
      '#00FFFF': 'Cyan',
      '#FFFFFF': 'White',
      '#000000': 'Black'
    };

    return colorNames[hex] || 'Color';
  }
}
