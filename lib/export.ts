import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Export layout as JSON
 */
export async function exportLayoutAsJSON(
  projectName: string,
  layout: any,
  scores?: any
): Promise<Blob> {
  const data = {
    projectName,
    exportedAt: new Date().toISOString(),
    layout,
    scores,
  };

  const json = JSON.stringify(data, null, 2);
  return new Blob([json], { type: 'application/json' });
}

/**
 * Export layout as PNG image from canvas element
 */
export async function exportLayoutAsImage(
  canvasElement: HTMLElement,
  width: number = 1200,
  height: number = 900
): Promise<Blob> {
  try {
    const canvas = await html2canvas(canvasElement, {
      width,
      height,
      backgroundColor: '#ffffff',
      scale: 2, // High quality
    });

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        },
        'image/png',
        1
      );
    });
  } catch (error) {
    throw new Error(`Failed to export image: ${error}`);
  }
}

/**
 * Export layout as PDF with room details
 */
export async function exportLayoutAsPDF(
  projectName: string,
  layout: any,
  scores?: any,
  canvasElement?: HTMLElement
): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Title
  pdf.setFontSize(20);
  pdf.text(projectName, 20, yPosition);
  yPosition += 15;

  // Export date
  pdf.setFontSize(10);
  pdf.text(`Exported: ${new Date().toLocaleString()}`, 20, yPosition);
  yPosition += 10;

  // Layout image (if canvas provided)
  if (canvasElement) {
    try {
      const canvas = await html2canvas(canvasElement, {
        width: 400,
        height: 300,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 20, yPosition, 170, 127.5);
      yPosition += 137.5;
    } catch (error) {
      console.warn('Failed to add canvas to PDF:', error);
    }
  }

  // Room details
  if (layout.rooms && layout.rooms.length > 0) {
    pdf.setFontSize(12);
    pdf.text('Room Details', 20, yPosition);
    yPosition += 8;

    pdf.setFontSize(9);
    layout.rooms.forEach((room: any) => {
      const area = (room.width * room.height) / 40 / 40;
      pdf.text(
        `${room.name}: ${Math.round(room.width / 40)} × ${Math.round(
          room.height / 40
        )} units (${area.toFixed(1)} sq units)`,
        25,
        yPosition
      );
      yPosition += 6;

      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }
    });

    yPosition += 5;
  }

  // Layout scores
  if (scores) {
    pdf.setFontSize(12);
    pdf.text('Layout Scores', 20, yPosition);
    yPosition += 8;

    pdf.setFontSize(9);
    const scoreLabels = [
      { label: 'Space Efficiency', key: 'spaceEfficiency' },
      { label: 'Natural Light', key: 'naturalLight' },
      { label: 'Privacy', key: 'privacy' },
      { label: 'Circulation', key: 'circulation' },
      { label: 'Energy Efficiency', key: 'energy' },
      { label: 'Overall Score', key: 'overall' },
    ];

    scoreLabels.forEach(({ label, key }) => {
      const value = scores[key as keyof typeof scores] || 0;
      pdf.text(`${label}: ${value}/100`, 25, yPosition);
      yPosition += 6;

      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }
    });
  }

  // Footer
  pdf.setFontSize(8);
  pdf.text('SmartHomeViz AI - Digital Home Layout Designer', pageWidth / 2, pageHeight - 10, {
    align: 'center',
  });

  return new Promise((resolve) => {
    const pdfBlob = pdf.output('blob');
    resolve(pdfBlob as Blob);
  });
}

/**
 * Helper function to download blob as file
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
