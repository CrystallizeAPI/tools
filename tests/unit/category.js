import sinon from 'sinon'
import {
  syncSingleCategory,
  groupProductAndVariantsSKUs
} from '../../lib/category'

describe('crystallize', () => {
  const dummyProducts = [
    { sku: 'DUMMY_01', price: 2 },
    { sku: 'DUMMY' },
    { sku: 'NEW_03', price: 4 },
    { sku: 'DUMMY_02', price: 3 },
    { sku: 'DUMMY_03', price: 4 },
    { sku: 'NEW' }
  ]
  it('groups matching SKUs of products & variants', () => {
    const result = groupProductAndVariantsSKUs(dummyProducts)

    expect(result)
      .to.be.an('array')
      .and.to.have.length(2)
    expect(result[0])
      .to.be.an('array')
      .and.to.have.members(['DUMMY', 'DUMMY_01', 'DUMMY_02', 'DUMMY_03'])
  })

  describe('syncs Single Category', async () => {
    const createProduct = sinon.fake.resolves()
    const getCategoryProducts = sinon.fake.resolves()
    const groupSKUs = sinon.fake.returns([''])

    await syncSingleCategory(null, null, null, null, {
      createProduct,
      getCategoryProducts,
      client: null,
      groupSKUs
    })

    sinon.assert.calledOnce(createProduct)
    sinon.assert.calledOnce(getCategoryProducts)
    sinon.assert.calledOnce(groupSKUs)
  })
})
