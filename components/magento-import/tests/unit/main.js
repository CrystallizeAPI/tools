import { catalogueImport, singleProductImport } from '../../main'
import sinon from 'sinon'

describe('Import functions', () => {
  it('Syncs the Catalogue', async () => {
    const getClient = sinon.fake.returns()
    const getCategories = sinon.fake.resolves([''])
    const filterCategories = sinon.fake.returns()
    const mapToCrystallizeFolders = sinon.fake.returns()
    const createCrystallizeFolderStructure = sinon.fake.resolves()
    const createCrystallizeTopics = sinon.fake.resolves()
    const importCrystallizeCatalogue = sinon.fake.resolves()
    const createCrystallizeGenericShape = sinon.fake.resolves({
      data: {
        shape: {
          create: {
            id: 'test'
          }
        }
      }
    })

    await catalogueImport([], {
      getClient,
      getCategories,
      filterCategories,
      mapToCrystallizeFolders,
      createCrystallizeFolderStructure,
      createCrystallizeTopics,
      importCrystallizeCatalogue,
      createCrystallizeGenericShape
    })
    sinon.assert.calledOnce(getClient)
    sinon.assert.calledOnce(getCategories)
    sinon.assert.calledOnce(filterCategories)
    sinon.assert.calledOnce(mapToCrystallizeFolders)
    sinon.assert.calledOnce(createCrystallizeFolderStructure)
    sinon.assert.calledOnce(createCrystallizeTopics)
    sinon.assert.calledOnce(importCrystallizeCatalogue)
    sinon.assert.calledOnce(createCrystallizeGenericShape)
  })

  it('Syncs a single product', async () => {
    const queryMagentoProduct = sinon.fake.resolves([''])
    const mapToCrystallizeProducts = sinon.fake.resolves([''])
    const createCrystallizeProducts = sinon.fake.resolves([''])
    const storeCrystallizeProductImages = sinon.fake.resolves([''])
    const createCrystallizeGenericShape = sinon.fake.resolves({
      data: {
        shape: {
          create: {
            id: 'test'
          }
        }
      }
    })

    await singleProductImport(['Test'], [], {
      createCrystallizeGenericShape,
      queryMagentoProduct,
      mapToCrystallizeProducts,
      createCrystallizeProducts,
      storeCrystallizeProductImages
    })

    sinon.assert.calledOnce(createCrystallizeGenericShape)
    sinon.assert.calledOnce(queryMagentoProduct)
    sinon.assert.calledOnce(mapToCrystallizeProducts)
    sinon.assert.calledOnce(createCrystallizeProducts)
    sinon.assert.calledOnce(storeCrystallizeProductImages)
  })
})
