import Magento2Api from 'magento-api-rest'
import {
  MAGENTO_CONSUMER_KEY,
  MAGENTO_CONSUMER_SECRET,
  MAGENTO_ACCESS_TOKEN,
  MAGENTO_TOKEN_SECRET,
  MAGENTO_API_URL
} from '../config'

let client

export function clientSingleton () {
  if (!client) {
    client = new Magento2Api({
      url: MAGENTO_API_URL,
      consumerKey: MAGENTO_CONSUMER_KEY,
      consumerSecret: MAGENTO_CONSUMER_SECRET,
      accessToken: MAGENTO_ACCESS_TOKEN,
      tokenSecret: MAGENTO_TOKEN_SECRET
    })
  }

  return client
}

export function getClient (injections = {}) {
  const { apiClient = clientSingleton } = injections

  return apiClient()
}

export async function queryCategories (
  magentoClient,
  categoryId,
  injections = {}
) {
  const { mangClient = magentoClient } = injections

  const { data } = await mangClient.get(`categories`)

  return Promise.resolve(data.children_data)
}

export async function queryCategoryProducts (
  categoryId,
  magentoClient,
  injections = {}
) {
  const { mangClient = magentoClient } = injections

  const { data } = await mangClient.get(`categories/${categoryId}/products`)

  return Promise.resolve(data)
}

export async function queryProduct (productSku, injections = {}) {
  const { mangClient = getClient() } = injections

  const { data } = await mangClient.get(`products/${productSku}`)

  return Promise.resolve(data)
}

export async function queryProductsInfo (productSKUs, injections = {}) {
  const { getProduct = queryProduct } = injections
  const completeProductsInfo = []

  for (const sku of productSKUs) {
    const data = await getProduct(sku, injections)
    completeProductsInfo.push({ ...data, position: 1 }) //product.position
  }
  return Promise.resolve(completeProductsInfo)
}
