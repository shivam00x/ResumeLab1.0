
export const generatePdf = async (element: HTMLElement, fileName: string = 'resume'): Promise<void> => {
  const html2canvas = (window as any).html2canvas;
  const jspdf = (window as any).jspdf;

  if (!html2canvas || !jspdf) {
    const errorMsg = "PDF generation libraries (jspdf or html2canvas) not loaded. This may be due to a network issue or an ad-blocker.";
    console.error(errorMsg, {
        html2canvas_found: !!html2canvas,
        jspdf_found: !!jspdf
    });
    throw new Error(errorMsg);
  }

  // Find the actual resume content element which has the fixed page size styling
  const resumeContent = element.querySelector('#resume-preview') as HTMLElement;
  if (!resumeContent) {
    throw new Error("Could not find the resume content element (#resume-preview) to generate the PDF.");
  }

  // Store original styles to restore them later
  const originalHeight = resumeContent.style.height;
  const originalOverflow = resumeContent.style.overflow;

  try {
    // Temporarily change styling to allow the element to expand to its full content height
    resumeContent.style.height = 'auto';
    resumeContent.style.overflow = 'visible';

    const jsPDF = jspdf.jsPDF;
    if (typeof jsPDF !== 'function') {
      throw new Error("The jsPDF constructor could not be found. The library may have loaded incorrectly.");
    }
    
    // 1. Generate a single, tall canvas of the entire resume content
    const canvas = await html2canvas(resumeContent, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      // Use the full scroll height to capture all content
      windowWidth: resumeContent.scrollWidth,
      windowHeight: resumeContent.scrollHeight,
    });

    // 2. Initialize jsPDF with A4 page dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // 3. Calculate dimensions for slicing the tall canvas into A4 pages
    const pdfWidth = pdf.internal.pageSize.getWidth(); // A4 width in mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // A4 height in mm
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Calculate the aspect ratio to fit the canvas width to the PDF page width
    const ratio = canvasWidth / pdfWidth;
    
    // Calculate the height of one A4 page in the canvas's pixel space
    const pageHeightInCanvasPixels = pdfHeight * ratio;
    
    let position = 0;
    let pageCount = 0;

    // 4. Loop through the tall canvas, slicing it into page-sized chunks
    while (position < canvasHeight) {
      pageCount++;
      if (pageCount > 1) {
        pdf.addPage();
      }
      
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvasWidth;
      
      // The height of the slice is either a full page or the remaining part
      const sliceHeight = Math.min(pageHeightInCanvasPixels, canvasHeight - position);
      pageCanvas.height = sliceHeight;

      const pageCtx = pageCanvas.getContext('2d');
      if (pageCtx) {
        // Draw the slice from the master canvas onto the page-specific canvas
        pageCtx.drawImage(
          canvas,
          0,
          position, // Start slicing from the current y-position
          canvasWidth,
          sliceHeight,
          0,
          0,
          canvasWidth,
          sliceHeight
        );

        // Calculate the height of the image on the PDF page, maintaining aspect ratio
        const slicePdfHeight = (sliceHeight / canvasWidth) * pdfWidth;
        pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, slicePdfHeight);
      }
      
      position += pageHeightInCanvasPixels;
    }

    pdf.save(`${fileName.replace(/\s/g, '_')}_Resume.pdf`);

  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  } finally {
    // 5. Restore the original styles to the preview element
    resumeContent.style.height = originalHeight;
    resumeContent.style.overflow = originalOverflow;
  }
};
