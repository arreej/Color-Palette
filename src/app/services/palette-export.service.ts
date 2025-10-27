import { Injectable } from '@angular/core';
import { Color } from './color-extraction.service';

@Injectable({
  providedIn: 'root'
})
export class PaletteExportService {
  constructor() {}

  /**
   * Export palette as JSON
   */
  exportAsJson(colors: Color[], filename: string = 'palette.json'): void {
    const data = {
      colors: colors.map((c) => ({
        hex: c.hex,
        rgb: c.rgb,
        hsl: c.hsl,
        percentage: c.percentage
      })),
      exportedAt: new Date().toISOString()
    };

    this.downloadFile(JSON.stringify(data, null, 2), filename, 'application/json');
  }

  /**
   * Export palette as CSS variables
   */
  exportAsCss(colors: Color[], filename: string = 'palette.css'): void {
    let css = ':root {\n';
    colors.forEach((color, index) => {
      css += `  --color-${index + 1}: ${color.hex};\n`;
    });
    css += '}\n';

    this.downloadFile(css, filename, 'text/css');
  }

  /**
   * Export palette as SCSS variables
   */
  exportAsScss(colors: Color[], filename: string = 'palette.scss'): void {
    let scss = '';
    colors.forEach((color, index) => {
      scss += `$color-${index + 1}: ${color.hex};\n`;
    });

    this.downloadFile(scss, filename, 'text/x-scss');
  }

  /**
   * Export palette as Tailwind config
   */
  exportAsTailwind(colors: Color[], filename: string = 'tailwind-colors.js'): void {
    const colorObj: { [key: string]: string } = {};
    colors.forEach((color, index) => {
      colorObj[`palette-${index + 1}`] = color.hex;
    });

    const config = `module.exports = {
  theme: {
    extend: {
      colors: {
${Object.entries(colorObj)
  .map(([name, hex]) => `        '${name}': '${hex}',`)
  .join('\n')}
      }
    }
  }
}`;

    this.downloadFile(config, filename, 'text/javascript');
  }

  /**
   * Export palette as SVG swatches
   */
  exportAsSvg(colors: Color[], filename: string = 'palette.svg'): void {
    const swatchSize = 100;
    const width = colors.length * swatchSize;
    const height = 150;

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

    colors.forEach((color, index) => {
      const x = index * swatchSize;
      svg += `
  <rect x="${x}" y="0" width="${swatchSize}" height="100" fill="${color.hex}" stroke="#ccc" stroke-width="1"/>
  <text x="${x + swatchSize / 2}" y="125" text-anchor="middle" font-size="12" font-family="Arial">${color.hex}</text>`;
    });

    svg += '\n</svg>';

    this.downloadFile(svg, filename, 'image/svg+xml');
  }

  /**
   * Export palette as PNG image (requires canvas)
   */
  exportAsPng(colors: Color[], filename: string = 'palette.png'): void {
    const swatchSize = 120;
    const swatchHeight = 80;
    const labelHeight = 40;
    const padding = 20;
    const width = colors.length * swatchSize + padding * 2;
    const height = swatchHeight + labelHeight + padding * 2;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    colors.forEach((color, index) => {
      const x = padding + index * swatchSize;
      const y = padding;

      // Draw color swatch
      ctx.fillStyle = color.hex;
      ctx.fillRect(x, y, swatchSize - 10, swatchHeight);

      // Draw border
      ctx.strokeStyle = '#CCCCCC';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, swatchSize - 10, swatchHeight);

      // Draw hex code
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(color.hex, x + (swatchSize - 10) / 2, y + swatchHeight + 25);
    });

    canvas.toBlob((blob) => {
      if (blob) {
        this.downloadBlob(blob, filename);
      }
    });
  }

  /**
   * Export palette as HTML document
   */
  exportAsHtml(
    colors: Color[],
    imageSrc?: string,
    filename: string = 'palette.html'
  ): void {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Color Palette</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      padding: 30px;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .header h1 {
      font-size: 32px;
      margin-bottom: 10px;
    }
    .image-section {
      padding: 20px 30px;
      text-align: center;
    }
    .image-section img {
      max-width: 100%;
      max-height: 400px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .palette-section {
      padding: 30px;
    }
    .palette-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .color-card {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .color-swatch {
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      text-shadow: 0 1px 3px rgba(0,0,0,0.3);
    }
    .color-info {
      padding: 12px;
      background: #f9f9f9;
      border-top: 1px solid #eee;
    }
    .color-hex {
      font-family: 'Courier New', monospace;
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 6px;
    }
    .color-percentage {
      font-size: 12px;
      color: #666;
    }
    .footer {
      padding: 20px 30px;
      border-top: 1px solid #eee;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Color Palette</h1>
      <p>Extracted palette colors</p>
    </div>
    ${imageSrc ? `<div class="image-section"><img src="${imageSrc}" alt="Source image"></div>` : ''}
    <div class="palette-section">
      <div class="palette-grid">
${colors
  .map(
    (color) => `
        <div class="color-card">
          <div class="color-swatch" style="background-color: ${color.hex}"></div>
          <div class="color-info">
            <div class="color-hex">${color.hex}</div>
            <div class="color-percentage">${color.percentage || 0}%</div>
          </div>
        </div>`
  )
  .join('')}
      </div>
    </div>
    <div class="footer">
      <p>Generated on ${new Date().toLocaleString()}</p>
    </div>
  </div>
</body>
</html>`;

    this.downloadFile(html, filename, 'text/html');
  }

  /**
   * Export as ASE (Adobe Swatch Exchange) format
   */
  exportAsAse(colors: Color[], filename: string = 'palette.ase'): void {
    const data = new ArrayBuffer(12 + colors.length * 20);
    const view = new Uint8Array(data);

    // ASE header: "ASEF" + version (0x0001) + number of blocks
    view[0] = 0x41; // A
    view[1] = 0x53; // S
    view[2] = 0x45; // E
    view[3] = 0x46; // F
    view[4] = 0x00;
    view[5] = 0x01; // version
    view[6] = 0x00;
    view[7] = 0x00;

    // Number of colors (big-endian)
    const colorCount = colors.length;
    view[8] = (colorCount >> 24) & 0xff;
    view[9] = (colorCount >> 16) & 0xff;
    view[10] = (colorCount >> 8) & 0xff;
    view[11] = colorCount & 0xff;

    let offset = 12;
    colors.forEach((color) => {
      // Block type: color group entry (0x0001)
      view[offset++] = 0x00;
      view[offset++] = 0x01;

      // Block length (will be 20 bytes per color)
      const blockLen = 20;
      view[offset++] = (blockLen >> 24) & 0xff;
      view[offset++] = (blockLen >> 16) & 0xff;
      view[offset++] = (blockLen >> 8) & 0xff;
      view[offset++] = blockLen & 0xff;

      // RGB values (each as IEEE 754 float)
      const rgb = color.rgb;
      offset = this.setFloat32(view, offset, rgb.r / 255);
      offset = this.setFloat32(view, offset, rgb.g / 255);
      offset = this.setFloat32(view, offset, rgb.b / 255);

      // Color type (0 = global, 1 = spot, 2 = normal)
      view[offset++] = 0x00;
      view[offset++] = 0x00;
    });

    this.downloadBlob(new Blob([data], { type: 'application/octet-stream' }), filename);
  }

  /**
   * Helper: Set float32 in big-endian format
   */
  private setFloat32(view: Uint8Array, offset: number, value: number): number {
    const arrayBuf = new ArrayBuffer(4);
    new DataView(arrayBuf).setFloat32(0, value, false);
    const bytes = new Uint8Array(arrayBuf);
    view[offset] = bytes[0];
    view[offset + 1] = bytes[1];
    view[offset + 2] = bytes[2];
    view[offset + 3] = bytes[3];
    return offset + 4;
  }

  /**
   * Generic file download helper
   */
  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    this.downloadBlob(blob, filename);
  }

  /**
   * Download blob helper
   */
  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
