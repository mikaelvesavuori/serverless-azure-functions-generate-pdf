export CONTAINER_NAME=azuregeneratepdfstorage
export STORAGE_ACCOUNT_NAME=azuregeneratepdfdemo
export FONTS_PATH="./fonts/"
export STORAGE_KEY=long-key #Example: 7ALGFeO6VzajZ12UB0CqjJNlJCPp7CX4vhE4jU4Kpj7HiugG1TvpPryen1CagmY6KXP5abAbHtEKshjn5nF59w==

# Get your storage key first, then put in the above variable
az storage account keys list --account-name $STORAGE_ACCOUNT_NAME

# Upload fonts to storage
az storage blob upload-batch \
  --destination $CONTAINER_NAME \
  --source $FONTS_PATH \
  --account-name $STORAGE_ACCOUNT_NAME \
  --account-key $STORAGE_KEY
