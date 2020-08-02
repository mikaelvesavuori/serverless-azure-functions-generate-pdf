import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';

import { createPdfDocument } from '../../app/pdf/createPdfDocument';
import { downloadFonts } from '../../frameworks/storage/downloadFonts';
import { uploadBlobToStorage } from '../../frameworks/storage/uploadBlobToStorage';
import { generateSasUrl } from '../../frameworks/storage/generateSasUrl';

import { Document } from '../../domain/Document/Document';
import { template } from '../../app/pdf/template';
import { config } from '../../config';
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
export async function generatePdfUseCase(document: Document) {
  if (!document) throw new Error('No document!');

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
    url = generateSasUrl(blobName, config);
  } catch (error) {
    console.error(error);
  }

  return url;
}
