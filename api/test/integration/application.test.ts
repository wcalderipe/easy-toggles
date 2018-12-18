import { OK } from 'http-status'
import { app } from '../../src/app'
import { Application } from '../../src/domain/type'
import { saveApplication } from '../../src/repository'
import { graphqlRequest } from './setup'

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
    test('returns the full application', async () => {
      const application: Application = await saveApplication({
        ...applicationPayload,
        name: 'BarApp'
      })
      const payload = {
        query: `
          query application {
            application(id: "${application.id}") {
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
      expect(body).toEqual({ data: { application } })
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
    test('updates the whole application', async () => {
      const application: Application = await saveApplication({
        ...applicationPayload,
        name: 'UpdateMe'
      })
      const payload = {
        query: `
          mutation updateApplication {
            updateApplication(id: "${application.id}", input: {
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
  })

  describe('mutation deleteApplication', () => {
    test('deletes an existing application', async () => {
      const application: Application = await saveApplication({
        ...applicationPayload,
        name: 'DeleteMe'
      })
      const payload = {
        query: `
          mutation deleteApplication {
            deleteApplication(id: "${application.id}")
          }
        `
      }

      const { body, status } = await graphqlRequest(app).send(payload)

      expect(status).toEqual(OK)
      expect(body).toEqual({ data: { deleteApplication: true } })
    })
  })
})
