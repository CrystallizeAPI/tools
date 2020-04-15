import {
  getClient as getMagentoClient,
  queryProductsInfo as getProductsInfo
} from './magento'
import { storeProductImages, createProducts } from './crystallize'
import mapToProducts, { associateVariants } from './helpers/map-product'
import { performance } from 'perf_hooks'

export function groupProductAndVariantsSKUs (products) {
  const associatedProducts = associateVariants(products)

  return associatedProducts.map(p => p.variants.map(v => v.sku).concat(p.sku))
}

export async function syncProduct (
  SKUarray,
  crystallizeFolderId,
  topicCategories,
  topics,
  shapeId,
  injections = {}
) {
  const start = performance.now()

  const {
    storeCrystallizeProductImages = storeProductImages,
    client = getMagentoClient()
  } = injections
  try {
    // retrieve product info
    const magentoProductsInfo = await getProductsInfo(SKUarray, {
      mangClient: client
    })
    // map to Crystallize data
    const crystallizeProducts = await mapToProducts(
      magentoProductsInfo,
      crystallizeFolderId,
      topicCategories,
      topics,
      shapeId
    )

    // generate Crystallize Products in Catalogue
    console.log('Generating Products')
    await createProducts(crystallizeProducts)

    console.log('Uploading Images')
    // fire Image upload
    for (const p of crystallizeProducts) {
      await storeCrystallizeProductImages(p.externalReference)
    }

    const finish = ((performance.now() - start) / 1000).toFixed(2)
    return Promise.resolve({
      success: true,
      executionTime: finish
    })
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}
