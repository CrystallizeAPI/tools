import { main } from '../../main'
import sinon from 'sinon'

describe('main', () => {
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

    await main([], {
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
})
