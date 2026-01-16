import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportLayoutAsJSON(projectName, layout, scores) {
  const data = {
    projectName,
    exportedAt: new Date().toISOString(),
    layout,
    scores,
  };

  const json = JSON.stringify(data, null, 2);
  return new Blob([json], { type: 'application/json' });
}

export async function exportLayoutAsImage(canvasElement, width = 1200, height = 900) {
  try {
    const canvas = await html2canvas(canvasElement, {
      width,
      height,
      backgroundColor: '#ffffff',
      scale: 2,
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

export async function exportLayoutAsPDF(projectName, layout, scores, canvasElement) {
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
  if (layout && layout.rooms) {
    pdf.setFontSize(14);
    pdf.text('Room Details', 20, yPosition);
    yPosition += 10;

    layout.rooms.forEach((room) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(11);
      pdf.text(`${room.name} (${room.type})`, 20, yPosition);
      yPosition += 5;

      pdf.setFontSize(10);
      pdf.text(`Dimensions: ${room.width.toFixed(1)}m x ${room.height.toFixed(1)}m`, 25, yPosition);
      yPosition += 5;
    });
  }

  // Scores section
  if (scores) {
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(14);
    pdf.text('Layout Scores', 20, yPosition);
    yPosition += 10;

    Object.entries(scores).forEach(([key, value]) => {
      pdf.setFontSize(10);
      pdf.text(`${key}: ${value}%`, 25, yPosition);
      yPosition += 5;
    });
  }

  return new Promise((resolve) => {
    pdf.save(projectName);
    resolve(new Blob([pdf.output('blob')], { type: 'application/pdf' }));
  });
}
