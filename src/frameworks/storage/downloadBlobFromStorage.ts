import { streamToBuffer } from '../filesystem/streamToBuffer';

/**
 * @description Download from Blob Storage
 * @param {BlockBlobClient} blockBlobClient - Block blob client from Azure Blob Storage library
 * @param {string} localPath - Path where local file should be streamed to
 * @exports
 * @async
 * @function
 */
export async function downloadBlobFromStorage(blockBlobClient: any, localPath: string) {
  if (!blockBlobClient || !localPath) throw new Error('Missing block blob client or localPath!');
  const blockBlobResponse = await blockBlobClient.download(0);
  return await streamToBuffer(blockBlobResponse.readableStreamBody, localPath);
}
