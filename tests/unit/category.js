import sinon from 'sinon'
import { syncSingleCategory } from '../../lib/category'

describe('crystallize', () => {
  describe('syncs Single Category', async () => {
    const createProduct = sinon.fake.resolves()
    const getCategoryProducts = sinon.fake.resolves()
    const groupSKUs = sinon.fake.returns([''])

    await syncSingleCategory(null, null, null, null, null, {
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
