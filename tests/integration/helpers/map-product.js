import * as mapper from '../../../lib/helpers/map-product'
import {
  dummyProduct,
  dummyMagentoCategories,
  dummyCrystallizeTopics,
  dummyProducts
} from './dummy-data'

describe('Product map', () => {
  it('maps fields correctly', () => {
    const result = mapper.fieldMatch(dummyProduct, 'random', [], [], {})

    expect(result)
      .to.be.an('object')
      .and.to.have.all.keys(
        'name',
        'tenantId',
        'shapeId',
        'vatTypeId',
        'components',
        'language',
        'variants',
        'topicIds',
        'externalReference',
        'tree'
      )

    expect(result.components).to.be.an('array')
    expect(result.components[0])
    expect(result.variants).to.be.an('array')
    expect(result.tree).to.have.all.keys('parentId', 'position')
  })

  it('associates correct topics based on product Magento categories', () => {
    const dummyProductCategories = ['402', '504', '405']

    const result = mapper.matchProductTopics(
      dummyProductCategories,
      dummyMagentoCategories,
      dummyCrystallizeTopics
    )

    expect(result)
      .to.be.an('array')
      .and.to.include.members([
        '5e6f7612e749b9001cee6568',
        '5e6f7612e749b9001cee6570',
        '5e6f7612e749b9001cee656b'
      ])
  })

  it('handles categories that are not topics, by not adding them ', () => {
    const dummyProductCategories = ['5']

    const result = mapper.matchProductTopics(
      dummyProductCategories,
      dummyMagentoCategories,
      dummyCrystallizeTopics
    )

    expect(result).to.be.a('null')
  })

  it('associates products with similar SKU as product´s variants ', () => {
    const result = mapper.associateVariants(dummyProducts)

    expect(result[0].variants).and.have.deep.members([
      { sku: 'DUMMY_01', price: 2 },
      { sku: 'DUMMY_02', price: 3 },
      { sku: 'DUMMY_03', price: 4 }
    ])
  })

  it('does not add variants as seperate products', () => {
    const result = mapper.associateVariants(dummyProducts)

    expect(result)
      .to.be.an('array')
      .and.to.have.length(2)
  })

  it.skip('adds single SKUs containing `_` as seperate products', () => {})

  it('verifies that position is non-negative', () => {
    const result = mapper.fieldMatch(
      { ...dummyProduct, position: -5 },
      'test',
      [],
      []
    )

    expect(result.tree.position).equals(1)
  })
})
