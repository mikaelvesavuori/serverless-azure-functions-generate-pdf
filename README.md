# Generate a PDF with Azure Functions

Sometimes you might need to generate a PDF. And me being me, I'd like 100% of those times for PDF generation to be through a serverless function. This repo should help you set up a Node-based serverless function (Azure Functions) which runs [pdf-lib](https://github.com/Hopding/pdf-lib) and stores your custom fonts and your created documents on Azure Blob Storage. A time-scoped, secure URL is posted back when the PDF has been generated.

Why `pdf-lib` and not `[insert any other library]?`. Well, because some of the big ones just don't work other than through anecdotal Stack Overflow evidence. Having spent many, many more hours than I wish I'd ever spent getting them working, I turned to `pdf-lib` because it accepts Webpack, our overall stack, and has a good API. Pedigree and years of service mean nothing if your library won't build (or breaks) with modern tools. Keep that in mind, kids!

To do this you'll need to:

1. Deploy some storage to contain your custom fonts (Roboto included for demo purposes)
2. Upload custom fonts
3. Configure your function to use your new `STORAGE_ACCOUNT_KEY` and `AZURE_STORAGE_CONNECTION_STRING`
4. Deploy the function

**Stack**

- [Serverless Framework](https://www.serverless.com)
- [Azure Functions](https://azure.microsoft.com/en-us/services/functions/) + [Azure Storage](https://azure.microsoft.com/en-us/services/storage/) (for storing the functions, fonts and documents)
- [Webpack](https://webpack.js.org) for bundling and optimizing
- [Babel](https://babeljs.io) for transpiling files
- [Typescript](https://www.typescriptlang.org) so we can write better code

## Prerequisites

- Azure account
- Logged in to Azure through environment
- High enough credentials to create new function and storage resources
- Serverless Framework installed on your system

## Install

Install dependencies with `npm install` or `yarn add`.

## Configuration

Located at `src/config.ts`.

You will need to provide `STORAGE_ACCOUNT_KEY` and `AZURE_STORAGE_CONNECTION_STRING` for your Azure Storage.

## Log in to Azure

1. `az account clear`
2. `az login`

Then set credentials as per instructions at [https://github.com/serverless/serverless-azure-functions#advanced-authentication](https://github.com/serverless/serverless-azure-functions#advanced-authentication).

## Development

Run `sls offline`. After a bit of building files and doing its magic, you get a prompt looking like:

```
Http Functions:

generatePdf: [POST] http://localhost:7071/generatePdf
```

Hit that URL and you're ready! It doesn't do auto-reloads though.

**NOTE!**
_Your Node version will need to be 12_ (or whatever version is used on Azure). One way of handling multiple Node versions is with [`nvm`](https://github.com/nvm-sh/nvm). If you are set on using it, these instructions should get you up and ready for development:

1. `nvm install 12`, to install Node 12
2. `nvm use 12`, to use Node 12
3. When you are done, run `nvm unload` but this will also eject the environment variables so `nvm` will be an unknown command from that point on (just run the commands again from `~/.zshrc` or where ever those got put in the first place)

## Requests and examples

### Generate PDF

The only available endpoint. All three fields (`user`, `presentation`, `email`) are mandatory. Change these and add/remove as you need.

#### Query

You can generate a single PDF at a time.

```
/POST http://localhost:7071/generatePdf

{
  "user": "Some User",
  "presentation": "Made a ton of GitHub repos",
  "email": "1337brogrammer@winning.com"
}
```

#### Response

```
https://azuregeneratepdfdemo.blob.core.windows.net/azuregeneratepdfstorage/documents/59f7b2dd-5ca7-4afb-929a-81e69f7179e5.pdf?sv=2019-12-12&st=2020-07-16T22%3A11%3A39Z&se=2020-07-16T22%3A31%3A39Z&sr=b&sp=racwd&sig=RVgjpCx9PzB1sMY9eMCPp91uuhvmMZ5PmSL%2FKqqSgbU%3D
```

## Deploy storage

Run `npm run deploy:storage` or `yarn deploy:storage`.

**Always check the values/exports in shell scripts before running them!**

## Upload fonts

Run `npm run upload:fonts` or `yarn run deploy:fonts`. This will upload the `fonts/` folder to the new storage.

## Deploy function

Run `npm run deploy` or `yarn deploy` or `sls deploy`.

**Make sure you've put your STORAGE_ACCOUNT_KEY and AZURE_STORAGE_CONNECTION_STRING in src/config.ts!**

## Remove

Run `npm run teardown` or `yarn run teardown`. This command does the following:

- Runs `sls remove` to remove the function stack.
- Runs `sh ./scripts/teardown.sh` to remove the storage for fonts and documents.

### Arkit code structure map

![Arkit code structure map](arkit.svg)

## References

- [https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-nodejs](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-nodejs)

## Warnings, problems, troubleshooting...

- It's not uncommon to get a 400 error (`Error creating APIM Property`) when deploying with `sls deploy`. Just wait a few seconds and try again, and it should normally work on the second attempt.
- You cannot set currently (July 2020) set timeout, memory size, or OS type for functions through `serverless.yml`.
- There is supposedly support to configure `apim` (API Management) in `serverless.yml` but somehow you will start getting deployment errors (`-> Function App not ready. Retry 0 of 30...` and continuing) if you mess about with that stuff. To the best of my abilities, I think I've located the error to be on the `backends` section. Maybe it's not mapping correctly? Following a slightly modified version of the config in the [Serverless Framework provider reference](https://www.serverless.com/framework/docs/providers/azure/guide/serverless.yml/) does not work, at least.
- Serverless Framework and Azure together seem to have—at best—a fragile friendship. Expect that deployments stop working every now and then. Resolution is unclear; removing and redeploying (while a useless option that cannot be done safely in production) does not always seem to work either. Moving the region (also unsafe) seems to work better, but only ever do that _during_ development and not after.
