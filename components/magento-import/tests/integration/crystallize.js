import sinon from 'sinon'
import * as crystallize from '../../lib/crystallize'
import {
  dummyFolders,
  dummyTopics,
  dummyMagentoCrystallizeArrayId
} from './helpers/dummy-data'

describe('crystallize utilities', () => {
  it('merges all last level folders fetched AFTER creation', async () => {
    const generateSubfolders = sinon.fake.resolves(
      dummyMagentoCrystallizeArrayId
    )
    const result = await crystallize.createFolderStructure(dummyFolders, {
      generateSubfolders
    })

    expect(result)
      .to.be.an('array')
      .and.have.length(12)
  })

  it('returns all subfolderStructure the last level folders', async () => {
    const createCrystalFolder = sinon.fake.resolves({
      data: { folder: { create: { id: 'test' } } }
    })
    const publishFolder = sinon.fake.resolves()

    const result = await crystallize.createSubFolderStructure(
      { id: 4, children: dummyFolders },
      { createCrystalFolder, publishFolder }
    )

    expect(result)
      .to.be.an('array')
      .and.have.length(6)
  })

  it('creates all subtopics successfully', () => {
    const result = crystallize.createSubTopics(dummyTopics)

    expect(result)
      .to.be.an('array')
      .and.to.have.length(3)
    expect(result[0]).to.deep.equal({
      name: 'first',
      children: [
        {
          name: 'first_1'
        },
        {
          name: 'first_2'
        },
        {
          name: 'first_3'
        }
      ]
    })
  })

  it('fetches and flattens all Crystallize topics in an array', async () => {
    const fetchTopics = sinon.fake.resolves({
      data: {
        topics: [
          {
            id: '5e8ac587109ecc001ffc0408',
            name: 'Toys',
            parent: null,
            descendants: [
              {
                id: '5e8ac587109ecc001ffc040a',
                name: 'Girls'
              },
              { id: '5e8ac587109ecc001ffc0409', name: 'Boys' }
            ]
          }
        ]
      }
    })

    const result = await crystallize.getCrystallizeTopics({ fetchTopics })

    expect(result)
      .to.be.an('array')
      .and.to.have.length(3)
  })
})
