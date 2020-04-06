import { syncProduct } from './product.js'
import { getClient as getMagentoClient, queryCategoryProducts } from './magento'

// Apply logic to associate products and variants

export function groupProductAndVariantsSKUs (products) {
  const productsNoVariants = products.filter(p => !p.sku.includes('-'))
  const allVariants = products.filter(p => p.sku.includes('-'))
  const doneVariants = []
  return productsNoVariants.map(p => {
    const variants = allVariants
      .filter(v => v.sku.includes(`${p.sku}-`) && !doneVariants.includes(v.sku))
      .map(v => v.sku)
    variants.forEach(v => doneVariants.push(v.sku))

    return variants.concat([p.sku])
  })
}

export async function syncSingleCategory (
  magentoFolderId,
  crystallizeFolderId,
  topicCategories,
  topics,
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
    await createProduct(SKUgroup, crystallizeFolderId, topicCategories, topics)
  }
  return Promise.resolve()
}
