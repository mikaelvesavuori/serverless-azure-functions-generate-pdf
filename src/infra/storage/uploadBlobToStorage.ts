/**
 * @description Upload file to Blob Storage
 * @param {BlockBlobClient} blockBlobClient - Block blob client from Azure Blob Storage library
 * @param {Buffer} file - File data
 * @exports
 * @async
 * @function
 */
export async function uploadBlobToStorage(blockBlobClient: any, file: any) {
  return await blockBlobClient.upload(file, file.length);
}
