//import * as fs from 'fs';

/**
 * @description Stream content to disk
 * @param {ReadableStream} readableStream - Stream data
 * @param {string} localPath - Path to where stream should go on disk
 * @exports
 * @async
 * @function
 */
export async function streamToBuffer(readableStream: any, localPath: string) {
  return new Promise((resolve, reject) => {
    let buffer = Buffer.from([]);

    readableStream.on('data', (data: any) => {
      buffer = Buffer.concat([buffer, data], buffer.length + data.length);
    });

    readableStream.on('end', () => {
      //fs.writeFileSync(localPath, buffer);
      resolve(buffer);
    });

    readableStream.on('error', reject);
  });
}
