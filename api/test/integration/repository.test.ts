import { path, prop } from 'ramda'
import { CriteriaNotFound } from '../../src/domain/error'
import { Application, Criteria } from '../../src/domain/type'
import { findApplicationById, saveApplication, updateApplicationCriteria } from '../../src/repository'
import { store as memoryStore } from '../../src/store/memory'

describe('repository', () => {
  const fooApplication: Application = {
    name: 'FooApp',
    features: [
      {
        name: 'bar',
        criterias: [
          {
            name: 'country',
            values: ['AU']
          },
          {
            name: 'language',
            values: ['EN']
          }
        ]
      }
    ]
  }

  test('updates a single criteria', async () => {
    const application: Application = await saveApplication(memoryStore, fooApplication)
    const applicationId: string = prop('id', application) as string
    const criteriaId: string = path(['features', '0', 'criterias', '0', 'id'], application) as string

    await updateApplicationCriteria(memoryStore, {
      applicationId,
      criteriaId,
      data: {
        name: 'foobar',
        values: ['AU', 'US']
      }
    })

    const applicationAfterUpdate: Application = await findApplicationById(memoryStore, applicationId)
    const criteria: Criteria = path(['features', '0', 'criterias', '0'], applicationAfterUpdate) as Criteria

    expect(criteria).toEqual({
      id: criteriaId,
      name: 'foobar',
      values: ['AU', 'US']
    })
  })
})
