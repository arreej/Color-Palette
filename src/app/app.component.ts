import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorExtractionService, Color, PaletteResult } from './services/color-extraction.service';
import { AccessibilityService, AccessibilityScore } from './services/accessibility.service';
import { PaletteExportService } from './services/palette-export.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  title = 'Color Palette Generator';
  colors: Color[] = [];
  dominantColor: Color | null = null;
  uploadedImage: string | null = null;
  loading = false;
  error: string | null = null;
  colorCount = 5;
  accessibilityScores: AccessibilityScore[] = [];
  selectedColorIndex: number | null = null;
  dragOver = false;

  constructor(
    private colorExtraction: ColorExtractionService,
    private accessibility: AccessibilityService,
    private exportService: PaletteExportService
  ) {}

  /**
   * Handle file selection
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processFile(input.files[0]);
    }
  }

  /**
   * Handle drag over
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  /**
   * Handle drag leave
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  /**
   * Handle drop
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;

    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  /**
   * Process uploaded file
   */
  private processFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.error = 'Please upload a valid image file';
      return;
    }

    this.loading = true;
    this.error = null;

    this.colorExtraction.extractPalette(file, this.colorCount).then(
      (result: PaletteResult) => {
        this.colors = result.colors;
        this.dominantColor = result.dominantColor;
        this.uploadedImage = result.imageDataUrl;
        this.accessibilityScores = this.accessibility.calculatePaletteAccessibility(
          this.colors
        );
        this.loading = false;
      },
      (err: Error) => {
        this.error = err.message;
        this.loading = false;
      }
    );
  }

  /**
   * Trigger file input
   */
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  /**
   * Copy color hex to clipboard
   */
  copyToClipboard(hex: string): void {
    navigator.clipboard.writeText(hex).then(() => {
      // Visual feedback could be added here
    });
  }

  /**
   * Get text color for contrast
   */
  getTextColor(color: Color): string {
    return this.accessibility.getBestTextColor(color).hex;
  }

  /**
   * Update color count and re-extract
   */
  updateColorCount(): void {
    if (this.uploadedImage && this.fileInput.nativeElement.files) {
      this.processFile(this.fileInput.nativeElement.files[0]);
    }
  }

  /**
   * Export functions
   */
  exportAsJson(): void {
    this.exportService.exportAsJson(this.colors, 'color-palette.json');
  }

  exportAsCss(): void {
    this.exportService.exportAsCss(this.colors, 'color-palette.css');
  }

  exportAsScss(): void {
    this.exportService.exportAsScss(this.colors, 'color-palette.scss');
  }

  exportAsTailwind(): void {
    this.exportService.exportAsTailwind(this.colors, 'tailwind-colors.js');
  }

  exportAsSvg(): void {
    this.exportService.exportAsSvg(this.colors, 'color-palette.svg');
  }

  exportAsPng(): void {
    this.exportService.exportAsPng(this.colors, 'color-palette.png');
  }

  exportAsHtml(): void {
    this.exportService.exportAsHtml(this.colors, this.uploadedImage || undefined, 'color-palette.html');
  }

  exportAsAse(): void {
    this.exportService.exportAsAse(this.colors, 'color-palette.ase');
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.colors = [];
    this.dominantColor = null;
    this.uploadedImage = null;
    this.accessibilityScores = [];
    this.selectedColorIndex = null;
    this.fileInput.nativeElement.value = '';
  }
}
