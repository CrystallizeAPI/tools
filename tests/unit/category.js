import sinon from 'sinon'
import {
  syncSingleCategory,
  groupProductAndVariantsSKUs
} from '../../lib/category'

describe('crystallize', () => {
  const dummyProducts = [
    { sku: 'DUMMY-01', price: 2 },
    { sku: 'DUMMY' },
    { sku: 'NEW-03', price: 4 },
    { sku: 'DUMMY-02', price: 3 },
    { sku: 'DUMMY-03', price: 4 },
    { sku: 'NEW' }
  ]
  it('groups matching SKUs of products & variants', () => {
    const result = groupProductAndVariantsSKUs(dummyProducts)
    expect(result)
      .to.be.an('array')
      .and.to.have.length(2)
    expect(result[0])
      .to.be.an('array')
      .and.to.have.members(['DUMMY', 'DUMMY-01', 'DUMMY-02', 'DUMMY-03'])
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
