# Reference: https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-cli

export RG_NAME=azuregeneratepdfdemo-rg
export STORAGE_ACCOUNT_NAME=azuregeneratepdfdemo
export CONTAINER_NAME=azuregeneratepdfstorage
export LOCATION=westeurope

# Create resource group to contain any infra
az group create \
  --name $RG_NAME \
  --location $LOCATION

# Create storage account
az storage account create \
  --name $STORAGE_ACCOUNT_NAME \
  --resource-group $RG_NAME \
  --location $LOCATION \
  --sku Standard_ZRS \
  --encryption-services blob

# Create the actual storage container/unit inside the account
# If this fails, it may be because RBAC role assignments haven't propagated yet (c.f https://github.com/MicrosoftDocs/azure-docs/issues/53299)
# Emergency solution is to remove "auth-mode"
az storage container create \
  --account-name $STORAGE_ACCOUNT_NAME \
  --name $CONTAINER_NAME
  #--auth-mode login

# Get connection string to storage
az storage account show-connection-string \
  --name $STORAGE_ACCOUNT_NAME