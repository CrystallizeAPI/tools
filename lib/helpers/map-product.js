import {
  CRYSTALLIZE_PRODUCT_SHAPE_ID,
  CRYSTALLIZE_TENANT_ID,
  CRYSTALLIZE_DEFAULT_VAT_ID,
  CRYSTALLIZE_LANGUAGE_CODE
} from '../config'
import { uploadImageToCrystallize } from '../crystallize'
import fromHTML from '../crystallize/helpers/content-transformer/fromHTML'

export function handleBodyParagraph (obj) {
  if (!obj.type) {
    return {
      type: 'paragraph',
      children: [obj]
    }
  }
  return obj
}

export const getParagraphsFromHtml = valuesObject => {
  const paragraphs = []

  try {
    const parsed = fromHTML(valuesObject)
    const p = parsed
    let currentParagraph
    if (!p) {
      return null
    }
    for (const prop of p) {
      if (prop.type && prop.type.startsWith('heading')) {
        currentParagraph = {
          title: { text: toText(prop) },
          body: { json: [] }
        }
        paragraphs.push(currentParagraph)
      } else {
        const bodyParagraph = handleBodyParagraph(prop)
        if (currentParagraph) {
          currentParagraph.body.json.push(bodyParagraph)
        } else {
          currentParagraph = {
            title: { text: null },
            body: { json: [bodyParagraph] }
          }
          paragraphs.push(currentParagraph)
        }
      }
    }
  } catch (error) {
    return Promise.reject(error)
  }

  return paragraphs
}

function generatePropertiesTable (cuddliness, fabric) {
  const properties = []
  if (cuddliness) {
    properties.push({
      key: 'cuddliness',
      value: cuddliness
    })
  }
  if (fabric) {
    properties.push({
      key: 'fabric',
      value: fabric
    })
  }
  return properties
}
const matchComponents = magentoCustomAttributes => {
  const components = []
  //   for (const attribute of magentoCustomAttributes) {}

  const shortDescriptionAttribute = magentoCustomAttributes.find(
    at => at.attribute_code === 'short_description'
  )
  const descriptionAttribute = magentoCustomAttributes.find(
    at => at.attribute_code === 'description'
  )
  const cuddlinessAttribute = magentoCustomAttributes.find(
    at => at.attribute_code === 'cuddliness'
  )
  const fabricAttribute = magentoCustomAttributes.find(
    at => at.attribute_code === 'fabric'
  )
  if (shortDescriptionAttribute) {
    const generatedParagraphs = getParagraphsFromHtml(
      shortDescriptionAttribute.value
    )

    components.push({
      componentId: 'summary',
      richText: {
        json: generatedParagraphs[0].body.json
      }
    })
  }
  if (descriptionAttribute) {
    const generatedParagraphs = getParagraphsFromHtml(
      descriptionAttribute.value
    )

    components.push({
      componentId: 'description',
      paragraphCollection: {
        paragraphs: generatedParagraphs
      }
    })
  }

  if (cuddlinessAttribute || fabricAttribute) {
    const generatedProperties = generatePropertiesTable(
      cuddlinessAttribute ? cuddlinessAttribute.value : null,
      fabricAttribute ? fabricAttribute.value : null
    )

    components.push({
      componentId: 'properties',
      propertiesTable: {
        sections: {
          title: 'Cuddly Properties',
          properties: generatedProperties
        }
      }
    })
  }

  return components
}

const matchColorCode = {
  '2': 'Green',
  '4': 'Blue',
  '3': 'Red'
}

export const handleVariantAttributes = magentoCustomAttributes => {
  const colorAttribute = magentoCustomAttributes.find(
    at => at.attribute_code === 'refinement_color'
  )
  if (colorAttribute)
    return [
      {
        attribute: 'Color',
        value: matchColorCode[colorAttribute.value] || ''
      }
    ]
}

export const handleVariantImages = async images => {
  const variantImages = []
  for (const image of images) {
    const result = await uploadImageToCrystallize(image)
    variantImages.push(result)
  }
  return variantImages
}

const between = (min, max) => Math.floor(Math.random() * (max - min) + min)

const matchVariants = p => {
  let productVariants
  if (p.variants && p.variants.length > 0) {
    productVariants = p.variants.map((v, i) => {
      return {
        name: v.name,
        sku: v.sku,
        price: v.price || 10 * between(6, 12) - 0.1, //v.price && Number.isFinite(v.price) ? v.price : 0,
        isDefault: i === 0,
        stock: v.stock || 10 * between(30, 50),
        attributes: handleVariantAttributes(v.custom_attributes),
        externalReference: v.sku
        // images: await handleVariantImages(v.media_gallery_entries)
      }
    })
  } else {
    productVariants = [
      {
        name: p.name,
        sku: p.sku,
        price: p.price || 10 * between(6, 12) - 0.1,
        isDefault: true,
        stock: p.stock || 10 * between(30, 50),
        attributes: handleVariantAttributes(p.custom_attributes),
        externalReference: p.sku
        // images: handleVariantImages(p.media_gallery_entries)
      }
    ]
  }

  return productVariants
}

// TODO: topics are only associate to Magento Categories via name... Must change to check if Parent is the same.
// Currently if Sale is under Kids and top Level, it will attach Kids sale and not top level
export const associateTopicToCategoryViaId = (
  id,
  topicCategories,
  crystallizeTopics
) => {
  const productCategoryFromId = topicCategories.find(c => c.id === id)

  return productCategoryFromId
    ? crystallizeTopics.find(topic => topic.name === productCategoryFromId.name)
    : null
}

export const matchProductTopics = (
  productCategories,
  topicCategories,
  crystallizeTopics
) => {
  const productCrystalizeTopics = []

  for (const id of productCategories) {
    const result = associateTopicToCategoryViaId(
      typeof id === 'string' ? parseInt(id) : id,
      topicCategories,
      crystallizeTopics
    )

    if (result) {
      productCrystalizeTopics.push(result.id)
    }
  }
  return productCrystalizeTopics.length > 0 ? productCrystalizeTopics : null
}

// TODO: media_gallery_entries image mapping, weightt, status(1 enable, 2 disable?)

// TODO: STOCK & POSITION
export const fieldMatch = (product, folderId, topicCategories, topics) => {
  return {
    name: product.name,
    tenantId: CRYSTALLIZE_TENANT_ID,
    shapeId: CRYSTALLIZE_PRODUCT_SHAPE_ID,
    vatTypeId: CRYSTALLIZE_DEFAULT_VAT_ID,
    components: matchComponents(product.custom_attributes),
    language: CRYSTALLIZE_LANGUAGE_CODE,
    variants: matchVariants(product),
    externalReference: product.sku,
    // TODO: get categories from all variants, not only top level product
    topicIds: matchProductTopics(
      getProductAndVariantCategories(product),
      topicCategories,
      topics
    ),
    tree: {
      parentId: folderId,
      position: product.position && product.position > 0 ? product.position : 1
    }
  }
}

export const getProductAndVariantCategories = product => {
  let topicCategories = []

  for (const v of product.variants) {
    v.extension_attributes.category_links.forEach(c => {
      const cat =
        typeof c.category_id === 'string'
          ? parseInt(c.category_id)
          : c.category_id
      if (!topicCategories.find(t => t === cat)) topicCategories.push(cat)
    })
  }

  product.extension_attributes.category_links.forEach(c => {
    const cat =
      typeof c.category_id === 'string'
        ? parseInt(c.category_id)
        : c.category_id
    if (!topicCategories.find(t => t === cat)) topicCategories.push(cat)
  })

  return topicCategories
}

// Apply logic to associate products and variants

export const associateVariants = products => {
  const productsNoVariants = products.filter(p => !p.sku.includes('-'))
  const allVariants = products.filter(p => p.sku.includes('-'))
  const doneVariants = []
  return productsNoVariants.map(p => {
    const variants = allVariants.filter(
      v => v.sku.includes(`${p.sku}-`) && !doneVariants.includes(v.sku)
    )
    variants.forEach(v => doneVariants.push(v.sku))

    return { ...p, variants }
  })
}

export default (products, folderId, topicCategories, topics) =>
  associateVariants(products).map(p =>
    fieldMatch(p, folderId, topicCategories, topics)
  )
