import { Context, HttpRequest } from '@azure/functions';

import { generatePdf } from '../app/GeneratePdf/index';

const generatePdfMethodError = 'You must use the "POST" method to call this endpoint!';
const generatePdfQueryError =
  'You need to pass in "user", "presentation", and "email" properties as body content!';

/**
 * @description The handler for the "generatePdf" function
 * @param {Object} context - Context object
 * @param {Object} req - Incoming HTTP request
 */
export async function handler(context: Context, req: HttpRequest): Promise<void> {
  if (req.method !== 'POST') {
    context.res = {
      status: 400,
      body: generatePdfMethodError
    };
    return;
  }

  if (!context.req.body) {
    context.res = {
      status: 400,
      body: generatePdfQueryError
    };
    return;
  }

  if (!context.req.body.user || !context.req.body.presentation || !context.req.body.email) {
    context.res = {
      status: 400,
      body: generatePdfQueryError
    };
    return;
  }

  // Clean up so we have a valid document outline
  const document = {
    user: context.req.body.user,
    presentation: context.req.body.presentation,
    email: context.req.body.email
  };

  // Start generating the PDF; end up with a URL that's public (SAS) for a short period of time to access the file
  const pdfSasUrl = await generatePdf(document);

  context.res = {
    body: pdfSasUrl
  };
}
