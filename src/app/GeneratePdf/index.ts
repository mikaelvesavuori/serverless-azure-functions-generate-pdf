import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';

import { DocumentInterface } from '../../domain/Document/DocumentInterface';

import { createPdfDocument } from '../../domain/pdf/createPdfDocument';
import { downloadFonts } from '../../infra/storage/downloadFonts';
import { uploadBlobToStorage } from '../../infra/storage/uploadBlobToStorage';
import { generateSasUrl } from '../../infra/storage/generateSasUrl';

import { template } from '../../domain/pdf/template';
import { config } from '../../domain/config/config';
const { CONTAINER_NAME, AZURE_STORAGE_CONNECTION_STRING, FONT_FILES, STORAGE_DOCS_FOLDER } = config;

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

/**
 * @description The function orchestration/composition to generate a PDF document
 * @param {Object} document - A valid Document object
 * @param {string} document.name - The user's name
 * @param {string} document.presentation - The user presentation
 * @param {string} document.email - User's contact email address
 * @exports
 */
export async function generatePdf(document: DocumentInterface) {
  let fonts: any = null;

  // Attempt to download all fonts from remote storage to local disk
  try {
    fonts = await downloadFonts(containerClient, FONT_FILES);
  } catch (error) {
    console.error(error);
  }

  let pdf: any = null;

  // Attempt to create the PDF document
  try {
    pdf = await createPdfDocument(template, document, fonts);
  } catch (error) {
    throw new Error(error);
  }

  const blobName = `${STORAGE_DOCS_FOLDER}/${uuidv4()}.pdf`;

  // Attempt to upload PDF to Azure Storage
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await uploadBlobToStorage(blockBlobClient, pdf);
  } catch (error) {
    console.error(error);
  }

  let url = null;

  // Attempt to create public short-lived SAS (Shared Access Signature) for file
  try {
    url = generateSasUrl(blobName);
  } catch (error) {
    console.error(error);
  }

  return url;
}
