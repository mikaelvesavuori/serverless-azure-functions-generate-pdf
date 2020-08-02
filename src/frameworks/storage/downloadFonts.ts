import { streamToBuffer } from '../filesystem/streamToBuffer';
import { Font } from '../../domain/Font/Font';
import { FontLoaded } from '../../domain/Font/FontLoaded';

/**
 * @description Get a list of fonts from Blob Storage
 * @param {ContainerClient} containerClient - Container client from Azure Blob Storage library
 * @param {Font[]} fontList - List of fonts to get
 * @exports
 * @async
 * @function
 */
export async function downloadFonts(containerClient: any, fontList: Font[]) {
  let fonts: FontLoaded[] = [];

  for (let font of fontList) {
    const blockBlobClient = containerClient.getBlockBlobClient(font.path);
    const blockBlobResponse = await blockBlobClient.download(0);
    const buffer = await streamToBuffer(blockBlobResponse.readableStreamBody, '');

    // Return according to FontLoaded
    fonts.push({
      name: font.name,
      bytes: buffer
    });
  }

  return fonts;
}
