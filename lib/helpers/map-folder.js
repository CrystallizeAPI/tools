import {
  CRYSTALLIZE_FOLDER_SHAPE_ID,
  CRYSTALLIZE_TENANT_ID,
  CRYSTALLIZE_ROOT_ITEM_ID,
  CRYSTALLIZE_LANGUAGE_CODE
} from '../config.js'

const fieldMatch = cat => {
  return {
    magentoId: cat.magentoId,
    tenantId: CRYSTALLIZE_TENANT_ID,
    shapeId: CRYSTALLIZE_FOLDER_SHAPE_ID,
    language: CRYSTALLIZE_LANGUAGE_CODE,
    is_active: cat.is_active,
    externalReference: `${cat.magentoId}`,
    name: cat.name,
    tree: {
      parentId: CRYSTALLIZE_ROOT_ITEM_ID,
      position: cat.position
    }
  }
}

const mapCategory = cat => {
  if (cat.children && cat.children.length > 0) {
    return {
      ...fieldMatch(cat),
      children: cat.children.map(mapCategory)
    }
  } else {
    return fieldMatch(cat)
  }
}

export default categories => categories.map(mapCategory)
