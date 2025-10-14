import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function mergeFieldsIntoPDF(pdfUrl, fields) {
  try {
    // Fetch the original PDF
    const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
    
    // Get the default font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Group fields by page
    const fieldsByPage = fields.reduce((acc, field) => {
      if (!acc[field.page]) acc[field.page] = [];
      acc[field.page].push(field);
      return acc;
    }, {});
    
    // Process each page
    const pages = pdfDoc.getPages();
    Object.keys(fieldsByPage).forEach(pageNum => {
      const pageIndex = parseInt(pageNum) - 1;
      if (pageIndex >= 0 && pageIndex < pages.length) {
        const page = pages[pageIndex];
        const pageFields = fieldsByPage[pageNum];
        
        pageFields.forEach(field => {
          if (field.type === 'signature' && field.signatureData) {
            // Handle signature as image
            addSignatureToPage(page, field.signatureData, field.x, field.y, field.width, field.height);
          } else if (field.value) {
            // Handle text fields
            page.drawText(field.value, {
              x: field.x + 2,
              y: page.getHeight() - field.y - field.height + 2,
              size: 10,
              font: font,
              color: rgb(0, 0, 0),
            });
          }
        });
      }
    });
    
    // Return the modified PDF as bytes without encryption
    return await pdfDoc.save({ useObjectStreams: false });
  } catch (error) {
    console.error('Error merging PDF:', error);
    throw error;
  }
}

async function addSignatureToPage(page, signatureDataUrl, x, y, width, height) {
  try {
    // Convert data URL to image
    const response = await fetch(signatureDataUrl);
    const imageBytes = await response.arrayBuffer();
    
    // Embed the image
    const image = await page.doc.embedPng(imageBytes);
    
    // Draw the image
    page.drawImage(image, {
      x: x,
      y: page.getHeight() - y - height,
      width: width,
      height: height,
    });
  } catch (error) {
    console.error('Error adding signature:', error);
  }
}

export function downloadPDF(pdfBytes, filename = 'signed-document.pdf') {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
