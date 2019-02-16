import { OK } from 'http-status'
import { app } from '../../../src/app'
import { Application } from '../../../src/domain/type'
import { saveApplication } from '../../../src/repository'
import { store as memoryStore } from '../../../src/store/memory'
import { graphqlRequest } from '../setup'
import { expectErrorResponse } from './helper'

describe('query', () => {
  const applicationPayload = {
    features: [
      {
        criterias: [{ name: 'country', values: ['AU'] }],
        name: 'foo'
      }
    ],
    name: 'FooApp'
  }

  describe('application', () => {
    const buildFindApplicationQuery = (id: string | undefined): string => `
      query application {
        application(id: "${id}") {
          id,
          name,
          features {
            id,
            name,
            criterias {
              id,
              name,
              values
            }
          }
        }
      }
    `
    test('returns the full application', async () => {
      const application: Application = await saveApplication(memoryStore, {
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
      const expectedMessage: string = 'APPLICATION_NOT_FOUND'

      const { body, status } = await graphqlRequest(app).send(payload)

      expectErrorResponse({ body, status, expectedMessage })
    })
  })

  describe('toggle', () => {
    const buildToggleQuery = (applicationId: string | undefined): string => `
      query evaluate {
        toggle(
          applicationId: "${applicationId}"
          context: [{ name: "country", value: "AU" }]
        ) {
          name
          isActive
        }
      }
    `

    test('evaluates toggles for the given context input', async () => {
      const { id }: Application = await saveApplication(memoryStore, {
        ...applicationPayload,
        name: 'BarApp'
      })
      const payload = {
        query: buildToggleQuery(id)
      }

      const { body, status } = await graphqlRequest(app).send(payload)

      expect(status).toEqual(OK)
      expect(body).toEqual({ data: { toggle: [{ name: 'foo', isActive: true }] } })
    })

    test('returns application not found error', async () => {
      const payload = {
        query: buildToggleQuery('you-will-never-find-me')
      }
      const expectedMessage: string = 'APPLICATION_NOT_FOUND'

      const { body, status } = await graphqlRequest(app).send(payload)

      expectErrorResponse({ body, status, expectedMessage })
    })
  })
})
