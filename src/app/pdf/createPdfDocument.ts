import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

import { Document } from '../../domain/Document/Document';
import { Template } from '../../domain/Document/Template';
import { FontLoaded } from '../../domain/Font/FontLoaded';

/**
 * @description Use pdf-lib to create a PDF document
 * @param {object} template - Template data for generating document
 * @param {Document} document - Document data that was passed in through request
 * @param {FontLoaded[]} fonts - Array of fonts
 * @exports
 * @async
 * @function
 */
export async function createPdfDocument(
  template: Template,
  document: Document,
  fonts: FontLoaded[]
) {
  if (!template || !document || !fonts)
    throw new Error('Missing template and/or document and/or fonts!');

  // Setup
  const { fontSizes, colors, pageSize, pageOrientation } = template;
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
