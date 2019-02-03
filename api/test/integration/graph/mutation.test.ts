import { OK } from 'http-status'
import { path } from 'ramda'
import { app } from '../../../src/app'
import { Application } from '../../../src/domain/type'
import { saveApplication } from '../../../src/repository'
import { store as memoryStore } from '../../../src/store/memory'
import { graphqlRequest } from '../setup'
import { expectApplicationNotFound } from './helper'

describe('mutation', () => {
  const applicationPayload = {
    features: [
      {
        criterias: [{ name: 'country', values: ['AU'] }],
        name: 'foo'
      }
    ],
    name: 'FooApp'
  }

  describe('createApplication', () => {
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

  describe('updateApplication', () => {
    const buildUpdateApplicationMutation = (id: string | undefined): string => `
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
      const application: Application = await saveApplication(memoryStore, {
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

  describe('deleteApplication', () => {
    const buildDeleteApplicationMutation = (id: string | undefined): string => `
      mutation deleteApplication {
        deleteApplication(id: "${id}")
      }
    `

    test('deletes an existing application', async () => {
      const application: Application = await saveApplication(memoryStore, {
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

  describe('updateApplicationCriteria', () => {
    const buildUpdateApplicationCriteriaMutation = ({
      applicationId,
      criteriaId
    }: {
      applicationId: string | undefined
      criteriaId: string | undefined
    }): string => `
      mutation updateCriteria {
        updateApplicationCriteria(
          input: {
            applicationId: "${applicationId}"
            criteriaId: "${criteriaId}"
            name: "bar"
            values: ["bar"]
          }
        ) {
          id
          name
          values
        }
      }
    `

    test('updates a single criteria', async () => {
      const application: Application = await saveApplication(memoryStore, applicationPayload)
      const applicationId: string = path(['id'], application) as string
      const criteriaId: string = path(['features', '0', 'criterias', '0', 'id'], application) as string

      const payload = {
        query: buildUpdateApplicationCriteriaMutation({ applicationId, criteriaId })
      }

      const { body, status } = await graphqlRequest(app).send(payload)

      expect(status).toEqual(OK)
      expect(body).toMatchObject({
        data: {
          updateApplicationCriteria: {
            id: criteriaId,
            name: 'bar',
            values: ['bar']
          }
        }
      })
    })
  })
})
