import {Injectable} from '@angular/core';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() {
  }

  async generatePDF(formValue: any): Promise<jsPDF> {
    const doc = new jsPDF();

    // Convert header image to base64
    const headerBase64 = await this.convertImageToBase64('cibus-icon.png');

    // Add header image
    const imgWidth = 10;
    const imgHeight = 10;
    const imgX = 10;
    const imgY = 10;

    doc.addImage(headerBase64, 'PNG', imgX, imgY, imgWidth, imgHeight);

    // Add text next to image
    doc.setFontSize(16);
    doc.text('Generated Invoice Angular', imgX + imgWidth + 10, imgY + imgHeight / 1.5);

    // Start invoice details below header
    let y = imgY + imgHeight + 15;
    doc.setFontSize(12);
    doc.text(`Full Name: ${formValue.personalDetails.fullName}`, 10, y); y += 10;
    doc.text(`Email: ${formValue.personalDetails.email}`, 10, y); y += 10;
    doc.text(`Phone: ${formValue.personalDetails.phone}`, 10, y); y += 10;

    doc.text(`Invoice Number: ${formValue.invoiceDetails.invoiceNumber}`, 10, y); y += 10;
    doc.text(`Amount: ${formValue.invoiceDetails.amount}`, 10, y); y += 10;
    doc.text(`Invoice Date: ${formValue.invoiceDetails.invoiceDate}`, 10, y); y += 15;

    // Add signature
    if (formValue.signature) {
      const sigWidth = 150;
      const imgProps = doc.getImageProperties(formValue.signature);
      const sigHeight = (imgProps.height * sigWidth) / imgProps.width;
      doc.text('Signature:', 10, y);
      doc.addImage(formValue.signature, 'PNG', 10, y + 5, sigWidth, sigHeight);
    }

    return doc;
  }


  convertImageToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // allow cross-origin if needed
      img.src = url;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };

      img.onerror = (err) => reject(err);
    });
  }

  convertToBlob(generatedPdf: jsPDF | null): Blob | null {
    if (!generatedPdf) return null;
    return generatedPdf.output('blob');
  }
}
