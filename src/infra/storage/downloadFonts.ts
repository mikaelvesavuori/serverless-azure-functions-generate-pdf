//import { downloadBlobFromStorage } from './downloadBlobFromStorage';
import { streamToBuffer } from '../filesystem/streamToBuffer';
import { FontInterface } from '../../domain/Font/FontInterface';
import { FontLoadedInterface } from '../../domain/Font/FontLoadedInterface';

/**
 * @description Get a list of fonts from Blob Storage
 * @param {ContainerClient} containerClient - Container client from Azure Blob Storage library
 * @param {FontInterface[]} fontList - List of fonts to get
 * @exports
 * @async
 * @function
 */
export async function downloadFonts(containerClient: any, fontList: FontInterface[]) {
  let fonts: FontLoadedInterface[] = [];

  for (let font of fontList) {
    const blockBlobClient = containerClient.getBlockBlobClient(font.path);
    const blockBlobResponse = await blockBlobClient.download(0);
    const buffer = await streamToBuffer(blockBlobResponse.readableStreamBody, '');

    // Return according to FontLoadedInterface
    fonts.push({
      name: font.name,
      bytes: buffer
    });
  }

  return fonts;
}
