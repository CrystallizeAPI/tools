import createCrystallizeProduct from './helpers/store-product'
import createCrystallizeFolder from './helpers/create-folder'
import createCrystallizeTopic from './helpers/create-topic'
import fetchCrystallizeCatalogue from './helpers/get-catalogue'
import removeCrystallizeFolder from './helpers/del-folder'
import fetchCrystallizeTopics from './helpers/get-topics'
import publishCrystallizeFolder from './helpers/publish-folder'
import publishProduct from './helpers/publish-product'

import {
  CRYSTALLIZE_LANGUAGE_CODE,
  CRYSTALLIZE_TENANT_ID,
  PUBLISH_INACTIVE_CATEGORIES
} from '../config'

export { default as storeProductImages } from './helpers/store-product-images'

export async function createSubFolderStructure (folder, injections = {}) {
  const {
    createCrystalFolder = createCrystallizeFolder,
    publishFolder = publishCrystallizeFolder
  } = injections

  let lowestLevelFolders = []

  if (folder.children && folder.children.length > 0) {
    const { data } = await createCrystalFolder(folder)
    const { id } = data.folder.create

    if (folder.is_active || PUBLISH_INACTIVE_CATEGORIES) {
      await publishFolder({
        id: id,
        language: CRYSTALLIZE_LANGUAGE_CODE
      })
    }
    for (const child of folder.children) {
      child.tree.parentId = id
      const result = await createSubFolderStructure(child, injections)
      // add if lowest level folder
      lowestLevelFolders = lowestLevelFolders.concat(result)
    }
  } else {
    const { data } = await createCrystalFolder(folder)
    const { id } = data.folder.create
    if (folder.is_active && PUBLISH_INACTIVE_CATEGORIES) {
      await publishFolder({
        id: id,
        language: CRYSTALLIZE_LANGUAGE_CODE
      })
    }
    return Promise.resolve([
      {
        magentoFolderId: folder.magentoId,
        crystallizeFolderId: id
      }
    ])
  }
  return Promise.resolve(lowestLevelFolders)
}

export async function createFolderStructure (folders, injections = {}) {
  const { generateSubfolders = createSubFolderStructure } = injections
  let foldersToBePopulated = []

  for (const folder of folders) {
    const result = await generateSubfolders(folder, injections)
    foldersToBePopulated = foldersToBePopulated.concat(result)
  }

  return Promise.resolve(foldersToBePopulated)
}

export async function createProducts (products, injections = {}) {
  const { generateProduct = createCrystallizeProduct } = injections

  for (const product of products) {
    try {
      const res = await generateProduct(product)

      if (
        res.errors &&
        res.errors[0] &&
        res.errors[0].extensions &&
        res.errors[0].extensions.code !== 'PRODUCT_VARIANT_SKU_IN_USE'
      ) {
        const { id } = res.data.product.create
        // Sync here in case product has no images?
        await publishProduct({ id: id, language: CRYSTALLIZE_LANGUAGE_CODE })
      } else {
        console.log('Existing Variant')
        // Your sync Logic here
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
  return Promise.resolve()
}

export async function clearCatalogue () {
  try {
    const { data } = await fetchCrystallizeCatalogue()

    for (const folder of data.treeNode.children) {
      await removeCrystallizeFolder(folder.itemId)
    }
    return { success: true }
  } catch ({ stack }) {
    return { success: false, error: stack }
  }
}

export async function uploadImageToCrystallize (imageObj) {
  try {
    const imageFile = await downloadImage(imageObj)
    await generatePresignedRequest(imageObj)
    return uploadToCrystallize
  } catch ({ stack }) {
    return Promise.reject(stack)
  }
}

export function createSubTopics (subCategories) {
  const subTopicArray = []

  for (const c of subCategories) {
    if (c.children_data && c.children_data.length > 0) {
      const result = createSubTopics(c.children_data)

      result.length > 0
        ? subTopicArray.push({ name: c.name, children: result })
        : subTopicArray.push({ name: c.name })
    } else {
      subTopicArray.push({ name: c.name })
    }
  }
  return subTopicArray
}

export async function createTopics (categories, injections = {}) {
  const { generateSubTopics = createSubTopics } = injections

  for (const c of categories) {
    // TODO: hack to not get the following as topics in kids
    const topics = generateSubTopics(c.children_data)

    const crystallizeTopic = {
      name: c.name,
      children: topics || null,
      language: CRYSTALLIZE_LANGUAGE_CODE,
      tenantId: CRYSTALLIZE_TENANT_ID
    }

    await createCrystallizeTopic(crystallizeTopic)
  }
}

async function flattenTopics (topics) {
  return topics.reduce((acc, cur) => {
    if (cur.descendants && cur.descendants.length > 0) {
      acc = acc.concat(flattenTopics(cur.descendants))
      acc.push({ id: cur.id, name: cur.name })
    } else {
      acc.push({ id: cur.id, name: cur.name })
    }
    return acc
  }, [])
}

export async function getCrystallizeTopics () {
  const { data } = await fetchCrystallizeTopics()
  return Promise.resolve(flattenTopics(data.topics))
}
