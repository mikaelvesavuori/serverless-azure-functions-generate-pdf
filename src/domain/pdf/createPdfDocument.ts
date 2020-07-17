import { promises as fs } from 'fs';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

import { DocumentInterface } from '../Document/DocumentInterface';
import { FontLoadedInterface } from '../Font/FontLoadedInterface';
import { template } from '../pdf/template';
const { fontSizes, colors, pageSize, pageOrientation } = template;

/**
 * @description Use pdf-lib to create a PDF document
 * @param {object} template - Template data for generating document
 * @param {DocumentInterface} document - Document data that was passed in through request
 * @param {FontLoadedInterface[]} fonts - Array of fonts
 * @exports
 * @async
 * @function
 */
export async function createPdfDocument(
  docDefinition: object,
  document: DocumentInterface,
  fonts: FontLoadedInterface[]
) {
  // Setup
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // Use your custom fonts
  const robotoRegular = await pdfDoc.embedFont(fonts[0].bytes);
  const robotoMedium = await pdfDoc.embedFont(fonts[1].bytes);
  const robotoMediumItalic = await pdfDoc.embedFont(fonts[2].bytes);
  const robotoItalic = await pdfDoc.embedFont(fonts[3].bytes);

  // Or just use standard fonts...
  //const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  // START: Format your page
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  page.drawText(`${document.user}`, {
    x: 50,
    y: height - 4 * fontSizes.heading,
    size: fontSizes.heading,
    font: robotoMedium,
    color: colors.black
  });

  page.drawText(`${document.email}`, {
    x: 50,
    y: height - 6 * fontSizes.leading,
    size: fontSizes.leading,
    font: robotoMediumItalic,
    color: colors.black
  });

  page.drawText(`${document.presentation}`, {
    x: 50,
    y: height - 12 * fontSizes.paragraph,
    size: fontSizes.paragraph,
    font: robotoRegular,
    color: colors.black
  });

  page.drawText('Created with serverless-azure-functions-generate-pdf', {
    x: 50,
    y: height - 24 * fontSizes.subtext,
    size: fontSizes.subtext,
    font: robotoItalic,
    color: colors.blue
  });
  // END: Send complete page

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
