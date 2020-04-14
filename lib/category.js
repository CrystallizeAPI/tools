import { syncProduct, groupProductAndVariantsSKUs } from './product.js'
import { getClient as getMagentoClient, queryCategoryProducts } from './magento'

export async function syncSingleCategory (
  magentoFolderId,
  crystallizeFolderId,
  topicCategories,
  topics,
  crystallizeShapeId,
  injections = {}
) {
  const {
    client = getMagentoClient(),
    groupSKUs = groupProductAndVariantsSKUs,
    createProduct = syncProduct,
    getCategoryProducts = queryCategoryProducts
  } = injections

  const magentoProducts = await getCategoryProducts(magentoFolderId, client)

  const associatedSKUs = groupSKUs(magentoProducts)

  for (const SKUgroup of associatedSKUs) {
    await createProduct(
      SKUgroup,
      crystallizeFolderId,
      topicCategories,
      topics,
      crystallizeShapeId
    )
  }
  return Promise.resolve()
}
