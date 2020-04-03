import download from 'download'
import slug from 'slug'
import fileType from 'file-type'
import publishProduct from './publish-product'
import apiCrystallizeCall from './api-call'
import { queryProduct } from '../../magento'

import config from '../../config'

import uploadFile from './upload-file'
import apiCall from './api-call'

function getUrlSafeFileName (fileName) {
  let options = {
    replacement: '-', // replace spaces with replacement
    symbols: true, // replace unicode symbols or not
    remove: null, // (optional) regex to remove characters
    lower: false, // result in lower case
    charmap: slug.charmap, // replace special characters
    multicharmap: slug.multicharmap // replace multi-characters
  }

  return slug(fileName, options)
}

const mimeArray = {
  'image/jpeg': '.jpeg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'image/bmp': '.bmp',
  'image/webp': '.webp'
}

export default async function storeProductImages (sku) {
  try {
    const {
      data: {
        products: [product]
      }
    } = await apiCrystallizeCall(`{
    products: items (
        tenantId: "${config.CRYSTALLIZE_TENANT_ID}"
        language: "en"
        externalReferences: ["${sku}"]
    ) {
      id
      ... on Product {
        variants {
          name
          sku
          price
          stock
          attributes {
            attribute
            value
          }
          externalReference
          isDefault
        }
      }
    }
  }
`)
    // Get all the variants from Magento
    const magentoVariants = await Promise.all(
      product.variants
        .map(v => v.externalReference)
        .reduce((arr, el) => {
          if (!arr.some(s => s === el)) {
            arr.push(el)
          }
          return arr
        }, [])
        .map(queryProduct)
    )

    async function handleVariant (variant) {
      // Download the images
      const images = await Promise.all(
        variant.media_gallery_entries.map(async ({ id, file }) => {
          const urlSafeFilename = getUrlSafeFileName(
            `${id}-${variant.name}-${variant.sku}`
          )

          const fileBuffer = await download(file)
          const contentType = await fileType.fromBuffer(fileBuffer)

          const completeFilename = `${urlSafeFilename}${mimeArray[
            contentType.mime
          ] || '.jpeg'}`

          return {
            id,
            filename: completeFilename,
            contentType: contentType.mime,
            fileBuffer
          }
        })
      )

      const uploads = await Promise.all(
        images.filter(i => !i.contentType.startsWith('video')).map(uploadFile)
      )
      // Set the key for the image
      product.variants
        .filter(v => v.externalReference === variant.sku)
        .forEach(cv => {
          cv.images = uploads.map(({ key, contentType, id }) => ({
            key,
            mimeType: contentType,
            meta: [
              {
                key: 'magento-media-id',
                value: id.toString()
              }
            ]
          }))
        })
    }

    await Promise.all(magentoVariants.map(handleVariant))
    // Associcate the uploads with the variants
    await apiCall(
      `mutation updateProductVariantImages (
      $id: ID!
      $language: String!
      $variants: [UpdateProductVariantInput!]!
      ) {
    product {
      update(
        id: $id
        language: $language
        input: {
          variants: $variants
        }
      ) {
        id
      }
    }
  }`,
      {
        id: product.id,
        language: config.CRYSTALLIZE_LANGUAGE_CODE,
        variants: product.variants
      }
    )
    console.log('Publishing product', product.id)
    await publishProduct({
      id: product.id,
      language: config.CRYSTALLIZE_LANGUAGE_CODE
    })
    Promise.resolve()
  } catch (error) {
    console.log(JSON.stringify(error, null, 3))
    Promise.reject(error)
  }
}
