export default `
  query getTopics(
    $tenantId: ID!
    $language: String!
  ) {
    topics(tenantId: $tenantId, language: $language) {
        id
        name
        parent{
          name
        }
        descendants{
        id
        name
        parent{
          name
        }
        }
    }
  }
`
