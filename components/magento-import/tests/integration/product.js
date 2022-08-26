import { groupProductAndVariantsSKUs } from '../../lib/product'
import { dummyProducts } from './helpers/dummy-data'

describe('crystallize', () => {
  it('groups matching SKUs of products & variants', () => {
    const result = groupProductAndVariantsSKUs(dummyProducts)
    expect(result)
      .to.be.an('array')
      .and.to.have.length(2)
    expect(result[0])
      .to.be.an('array')
      .and.to.have.members(['DUMMY', 'DUMMY-01', 'DUMMY-02', 'DUMMY-03'])
  })
})
