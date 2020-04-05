import { getClient as getMagentoClient, queryCategories } from './lib/magento'
import mapToFolders from './lib/helpers/map-folder'
import flatten from './lib/helpers/flatten-magento-categories'
import filterOutTagCategories from './lib/helpers/category-filter'
import { syncSingleCategory } from './lib/category'
import {
  createFolderStructure,
  createTopics,
  getCrystallizeTopics
} from './lib/crystallize'

async function importCatalogue (mageCrystIdmap, topicCategories) {
  const topics = await getCrystallizeTopics()
  for (const category of mageCrystIdmap) {
    await syncSingleCategory(
      category.magentoFolderId,
      category.crystallizeFolderId,
      topicCategories,
      topics
    )
  }
  return Promise.resolve()
}

async function main (magentoTopicCategories, injections = {}) {
  const {
    getClient = getMagentoClient,
    getCategories = queryCategories,
    filterCategories = filterOutTagCategories,
    mapToCrystallizeFolders = mapToFolders,
    createCrystallizeFolderStructure = createFolderStructure,
    createCrystallizeTopics = createTopics,
    importCrystallizeCatalogue = importCatalogue
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

    console.log('Importing Catalogue')
    return importCrystallizeCatalogue(mageCrystIdmap, flatten(categories))
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}

export { main }
