import { app } from '../../src/app'
import { Application } from '../../src/domain/type'
import { saveApplication } from '../../src/repository'
import { graphqlRequest } from './setup'

describe('graphql', () => {
  describe('query application', () => {
    const payload = {
      features: [
        {
          criteria: {
            country: ['AU']
          },
          name: 'foo'
        }
      ],
      name: 'FooApp'
    }

    test('returns the full application', async () => {
      const application: Application = await saveApplication({ ...payload, name: 'BarApp' })
      const query = {
        query: `
        {
          application(id: "${application.id}") {
            id,
            name,
            features {
              name
              criteria
            }
          }
        }
      `
      }

      const { body } = await graphqlRequest(app)
        .send({ query })

      expect(body).toEqual({ data: { application } })
    })
  })
})
