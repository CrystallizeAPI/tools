import flatten from '../../../lib/helpers/flatten-magento-categories.js'

describe('Flatten', () => {
  const dummy = [
    {
      id: 1,
      children_data: [
        {
          id: 11,
          children_data: [
            {
              id: 111,
              children_data: []
            },
            {
              id: 112,
              children_data: []
            },
            {
              id: 113,
              children_data: []
            }
          ]
        },
        {
          id: 12,
          children_data: [
            {
              id: 121,
              children_data: []
            },
            {
              id: 122,
              children_data: []
            },
            {
              id: 123,
              children_data: []
            }
          ]
        }
      ]
    },
    {
      id: 2,
      children_data: [
        {
          id: 21,
          children_data: [
            {
              id: 211,
              children_data: []
            },
            {
              id: 212,
              children_data: []
            },
            {
              id: 213,
              children_data: []
            }
          ]
        },
        {
          id: 22,
          children_data: [
            {
              id: 221,
              children_data: []
            },
            {
              id: 222,
              children_data: []
            },
            {
              id: 223,
              children_data: []
            }
          ]
        }
      ]
    }
  ]

  it('flattens categories', () => {
    expect(flatten(dummy))
      .to.be.an('array')
      .and.to.have.length(18)
  })
})
