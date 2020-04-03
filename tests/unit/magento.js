import sinon from 'sinon'
import * as m from '../../lib/magento'

describe('magento ', () => {
  it('gets the API client', () => {
    const apiClient = sinon.fake()
    m.getClient({ apiClient })

    sinon.assert.calledOnce(apiClient)
  })

  it('fetches product info for all products', async () => {
    const getProduct = sinon.fake.returns({})
    await m.queryProductsInfo(['1', '2', '3'], { getProduct })
    sinon.assert.calledThrice(getProduct)
  })
})
