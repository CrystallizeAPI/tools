import {
  getClient as getMagentoClient,
  queryCategories,
  queryProduct
} from './lib/magento'
import mapToFolders from './lib/helpers/map-folder'
import mapToProducts from './lib/helpers/map-product'
import flatten from './lib/helpers/flatten-magento-categories'
import filterOutTagCategories from './lib/helpers/category-filter'
import createCrystallizeShape from './lib/crystallize/helpers/create-shape'
import { syncSingleCategory } from './lib/category'
import {
  createFolderStructure,
  createTopics,
  createProducts,
  storeProductImages,
  getCrystallizeTopics
} from './lib/crystallize'
import { CRYSTALLIZE_ROOT_ITEM_ID } from './lib/config'
async function importCatalogue (
  mageCrystIdmap,
  topicCategories,
  crystallizeShapeId
) {
  const topics = await getCrystallizeTopics()

  for (const category of mageCrystIdmap) {
    await syncSingleCategory(
      category.magentoFolderId,
      category.crystallizeFolderId,
      topicCategories,
      topics,
      crystallizeShapeId
    )
  }
  return Promise.resolve()
}

export async function catalogueImport (
  magentoTopicCategories = [],
  injections = {}
) {
  const {
    getClient = getMagentoClient,
    getCategories = queryCategories,
    filterCategories = filterOutTagCategories,
    mapToCrystallizeFolders = mapToFolders,
    createCrystallizeFolderStructure = createFolderStructure,
    createCrystallizeTopics = createTopics,
    importCrystallizeCatalogue = importCatalogue,
    createCrystallizeGenericShape = createCrystallizeShape
  } = injections

  try {
    const client = getClient()

    console.log('Getting categories')
    const categories = await getCategories(client)
    const filteredCategories = filterCategories(
      categories,
      magentoTopicCategories
    )
    console.log('Mapping to Crystallize')
    const crystallizeFolders = mapToCrystallizeFolders(filteredCategories)

    console.log('Creating Folder Structure')
    const mageCrystIdmap = await createCrystallizeFolderStructure(
      crystallizeFolders
    )

    console.log('Creating Topics')
    const topicCategories = categories.filter(c =>
      magentoTopicCategories.includes(c.name)
    )
    await createCrystallizeTopics(topicCategories)

    console.log('Create Crystallize generic Shape')
    const { data } = await createCrystallizeGenericShape()

    console.log('Importing Catalogue')
    return importCrystallizeCatalogue(
      mageCrystIdmap,
      flatten(categories),
      data.shape.create.id
    )
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}

export async function singleProductImport (
  skus,
  magentoTopicCategories = [],
  injections = {}
) {
  const {
    createCrystallizeGenericShape = createCrystallizeShape,
    queryMagentoProduct = queryProduct,
    mapToCrystallizeProducts = mapToProducts,
    createCrystallizeProducts = createProducts,
    storeCrystallizeProductImages = storeProductImages
  } = injections

  if (!skus) {
    return Promise.reject('SKU String or Array required')
  }
  if (typeof skus !== 'object') skus = [skus]

  try {
    console.log('Create Crystallize generic Shape')
    const { data } = await createCrystallizeGenericShape()
    // Fetch Product information from Magento
    const magentoProducts = []
    for (const sku of skus) {
      const magentoProduct = await queryMagentoProduct(sku)
      magentoProducts.push(magentoProduct)
    }
    const crystallizeProducts = await mapToCrystallizeProducts(
      magentoProducts,
      CRYSTALLIZE_ROOT_ITEM_ID,
      magentoTopicCategories,
      [],
      data.shape.create.id
    )

    console.log('Generating Category Products')
    await createCrystallizeProducts(crystallizeProducts)

    console.log('\t\t\tUploading Images')
    for (const sku of skus) {
      await storeCrystallizeProductImages(sku)
    }
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}
