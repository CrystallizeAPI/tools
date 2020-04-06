import {
  getClient as getMagentoClient,
  queryProductsInfo as getProductsInfo
} from './magento'
import { storeProductImages, createProducts } from './crystallize'
import mapToProducts from './helpers/map-product'
import { performance } from 'perf_hooks'

export const syncProduct = async (
  SKUarray,
  crystallizeFolderId,
  topicCategories,
  topics,
  injections = {}
) => {
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
      topics
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
