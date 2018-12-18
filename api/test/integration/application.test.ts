import { OK } from 'http-status'
import { app } from '../../src/app'
import { Application } from '../../src/domain/type'
import { saveApplication } from '../../src/repository'
import { graphqlRequest } from './setup'

const expectApplicationNotFound = ({ status, body }) => {
  expect(status).toEqual(OK)
  expect(body.errors).toHaveLength(1)
  expect(body.errors[0]).toMatchObject({
    message: `Could not resolve to an Application with ID 'you-will-never-find-me'.`
  })
}

describe('application', () => {
  const applicationPayload = {
    features: [
      {
        criterias: [{ name: 'country', values: ['AU'] }],
        name: 'foo'
      }
    ],
    name: 'FooApp'
  }

  describe('query application', () => {
    const buildFindApplicationQuery = (id: string): string => `
      query application {
        application(id: "${id}") {
          id,
          name,
          features {
            name,
            criterias {
              name,
              values
            }
          }
        }
      }
    `
    test('returns the full application', async () => {
      const application: Application = await saveApplication({
        ...applicationPayload,
        name: 'BarApp'
      })
      const payload = {
        query: buildFindApplicationQuery(application.id)
      }

      const { body, status } = await graphqlRequest(app).send(payload)

      expect(status).toEqual(OK)
      expect(body).toEqual({ data: { application } })
    })

    test('returns application not found error', async () => {
      const payload = {
        query: buildFindApplicationQuery('you-will-never-find-me')
      }

      const { body, status } = await graphqlRequest(app).send(payload)

      expectApplicationNotFound({ body, status })
    })
  })

  describe('mutation createApplication', () => {
    test('creates a new application', async () => {
      const expectId = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g
      const payload = {
        query: `
          mutation createApplication {
            createApplication(input: {
              name: "gday, mate!",
              features: [
                {
                  name: "isKangarooEnable",
                  criterias: [
                    {
                      name: "country",
                      values: ["AU"]
                    }
                  ]
                }
              ]
            }) {
              id,
              name,
              features {
                name,
                criterias {
                  name,
                  values
                }
              }
            }
          }
        `
      }

      const { body, status } = await graphqlRequest(app).send(payload)

      expect(status).toEqual(OK)
      expect(body).toMatchObject({
        data: {
          createApplication: {
            id: expect.stringMatching(expectId),
            name: 'gday, mate!',
            features: [
              {
                name: 'isKangarooEnable',
                criterias: [{ name: 'country', values: ['AU'] }]
              }
            ]
          }
        }
      })
    })
  })

  describe('mutation updateApplication', () => {
    const buildUpdateApplicationMutation = (id: string): string => `
      mutation updateApplication {
        updateApplication(id: "${id}", input: {
          name: "I WAS UPDATED",
          features: [
            {
              name: "foo",
              criterias: [
                {
                  name: "country",
                  values: ["AU"]
                }
              ]
            }
          ]
        }) {
          id,
          name,
          features {
            name,
            criterias {
              name,
              values
            }
          }
        }
      }
    `

    test('updates the whole application', async () => {
      const application: Application = await saveApplication({
        ...applicationPayload,
        name: 'UpdateMe'
      })
      const payload = {
        query: buildUpdateApplicationMutation(application.id)
      }

      const { body, status } = await graphqlRequest(app).send(payload)

      expect(status).toEqual(OK)
      expect(body).toMatchObject({
        data: {
          updateApplication: {
            id: application.id,
            name: 'I WAS UPDATED',
            features: [
              {
                name: 'foo',
                criterias: [{ name: 'country', values: ['AU'] }]
              }
            ]
          }
        }
      })
    })

    test('returns application not found error', async () => {
      const payload = {
        query: buildUpdateApplicationMutation('you-will-never-find-me')
      }

      const { body, status } = await graphqlRequest(app).send(payload)

      expectApplicationNotFound({ body, status })
    })
  })

  describe('mutation deleteApplication', () => {
    const buildDeleteApplicationMutation = (id: string): string => `
      mutation deleteApplication {
        deleteApplication(id: "${id}")
      }
    `

    test('deletes an existing application', async () => {
      const application: Application = await saveApplication({
        ...applicationPayload,
        name: 'DeleteMe'
      })
      const payload = {
        query: buildDeleteApplicationMutation(application.id)
      }

      const { body, status } = await graphqlRequest(app).send(payload)

      expect(status).toEqual(OK)
      expect(body).toEqual({ data: { deleteApplication: true } })
    })

    test('returns application not found error', async () => {
      const payload = {
        query: buildDeleteApplicationMutation('you-will-never-find-me')
      }

      const { body, status } = await graphqlRequest(app).send(payload)

      expectApplicationNotFound({ body, status })
    })
  })
})
