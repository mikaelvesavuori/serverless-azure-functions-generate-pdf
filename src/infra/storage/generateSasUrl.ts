import {
  BlobSASPermissions,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters
} from '@azure/storage-blob';

import { config } from '../../domain/config/config';
const { CONTAINER_NAME, STORAGE_ACCOUNT_NAME, STORAGE_ACCOUNT_KEY, SAS_TTL_MINUTES } = config;

export function generateSasUrl(blobName: string) {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    STORAGE_ACCOUNT_NAME,
    STORAGE_ACCOUNT_KEY
  );
  const permissions = BlobSASPermissions.parse('racwd');
  const startDate = new Date();
  const expiryDate = new Date(startDate);

  expiryDate.setMinutes(startDate.getMinutes() + SAS_TTL_MINUTES);
  startDate.setMinutes(startDate.getMinutes() - SAS_TTL_MINUTES);

  const params = generateBlobSASQueryParameters(
    {
      containerName: CONTAINER_NAME,
      blobName,
      permissions: (permissions.toString() as unknown) as BlobSASPermissions,
      startsOn: startDate,
      expiresOn: expiryDate
    },
    sharedKeyCredential
  );

  const SAS_STRING = params.toString();

  return `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${CONTAINER_NAME}/${blobName}?${SAS_STRING}`;
}
