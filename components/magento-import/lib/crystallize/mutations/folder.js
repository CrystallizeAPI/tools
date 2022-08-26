export default `
  mutation createFolder(
    $tenantId: ID!
    $shapeId: ID!
    $name: String!
    $tree: TreeNodeInput
    $externalReference: String
    $language: String!
  ) {
    folder {
      create(
        language: $language
        input: {
          tenantId: $tenantId
          shapeId: $shapeId
          name: $name
          tree: $tree
          externalReference: $externalReference
        }
      ) {
        id
      }
    }
  }
`
