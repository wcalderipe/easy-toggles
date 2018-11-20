import * as nock from 'nock'
import { put } from '../../../src/store/dynamoClient'

describe('dynamoClient', () => {
  test('makes a request to the config endpoint', async () => {
    // TODO: Get the default endpoint dynamicaly instead of a hard-code value
    const mockServer = nock('http://127.0.0.1:8000')
      .post('/')
      .reply(200)

    const document = {
      data: 'persist me, please!',
      id: new Date().toISOString()
    }
    const table = 'dummyTable'

    await put({ document, table })

    mockServer.done()
  })
})
