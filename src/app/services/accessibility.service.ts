import { Injectable } from '@angular/core';
import { Color } from './color-extraction.service';

export interface AccessibilityScore {
  contrast: number;
  wcag: string;
  readable: boolean;
}

export interface ColorPair {
  foreground: Color;
  background: Color;
  contrastRatio: number;
  wcagLevel: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  constructor() {}

  /**
   * Calculate relative luminance of a color (WCAG formula)
   */
  private getLuminance(rgb: { r: number; g: number; b: number }): number {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((value) => {
      value = value / 255;
      return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Calculate contrast ratio between two colors
   */
  calculateContrastRatio(color1: Color, color2: Color): number {
    const lum1 = this.getLuminance(color1.rgb);
    const lum2 = this.getLuminance(color2.rgb);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Get WCAG compliance level based on contrast ratio
   */
  getWcagLevel(contrastRatio: number): string {
    if (contrastRatio >= 7) return 'AAA';
    if (contrastRatio >= 4.5) return 'AA';
    if (contrastRatio >= 3) return 'AA (Large text)';
    return 'Fail';
  }

  /**
   * Calculate accessibility score for each color in palette
   */
  calculatePaletteAccessibility(colors: Color[]): AccessibilityScore[] {
    // Use white and black as reference backgrounds
    const whiteBackground: Color = {
      hex: '#FFFFFF',
      rgb: { r: 255, g: 255, b: 255 },
      hsl: { h: 0, s: 0, l: 100 }
    };

    const blackBackground: Color = {
      hex: '#000000',
      rgb: { r: 0, g: 0, b: 0 },
      hsl: { h: 0, s: 0, l: 0 }
    };

    return colors.map((color) => {
      const contrastOnWhite = this.calculateContrastRatio(color, whiteBackground);
      const contrastOnBlack = this.calculateContrastRatio(color, blackBackground);
      const bestContrast = Math.max(contrastOnWhite, contrastOnBlack);
      const wcagLevel = this.getWcagLevel(bestContrast);

      return {
        contrast: Math.round(bestContrast * 100) / 100,
        wcag: wcagLevel,
        readable: wcagLevel !== 'Fail'
      };
    });
  }

  /**
   * Find best text color (black or white) for a background color
   */
  getBestTextColor(backgroundColor: Color): Color {
    const whiteText: Color = {
      hex: '#FFFFFF',
      rgb: { r: 255, g: 255, b: 255 },
      hsl: { h: 0, s: 0, l: 100 }
    };

    const blackText: Color = {
      hex: '#000000',
      rgb: { r: 0, g: 0, b: 0 },
      hsl: { h: 0, s: 0, l: 0 }
    };

    const contrastWithWhite = this.calculateContrastRatio(whiteText, backgroundColor);
    const contrastWithBlack = this.calculateContrastRatio(blackText, backgroundColor);

    return contrastWithWhite > contrastWithBlack ? whiteText : blackText;
  }

  /**
   * Calculate brightness of a color (0-255)
   */
  getBrightness(rgb: { r: number; g: number; b: number }): number {
    return Math.round((rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000);
  }

  /**
   * Check if color is considered dark
   */
  isDarkColor(color: Color): boolean {
    return this.getBrightness(color.rgb) < 128;
  }

  /**
   * Get accessibility report for a color palette
   */
  generateAccessibilityReport(colors: Color[]): {
    scores: AccessibilityScore[];
    averageContrast: number;
    allWcagAA: boolean;
    allWcagAAA: boolean;
  } {
    const scores = this.calculatePaletteAccessibility(colors);
    const averageContrast =
      Math.round((scores.reduce((sum, s) => sum + s.contrast, 0) / scores.length) * 100) / 100;

    const allWcagAA = scores.every((s) => s.wcag === 'AA' || s.wcag === 'AAA');
    const allWcagAAA = scores.every((s) => s.wcag === 'AAA');

    return {
      scores,
      averageContrast,
      allWcagAA,
      allWcagAAA
    };
  }
}
