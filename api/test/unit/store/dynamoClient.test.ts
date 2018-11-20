import { AWSError, DynamoDB } from 'aws-sdk'
import {
  createTable,
  DynamoClientError,
  put
} from '../../../src/store/dynamoClient'

describe('dynamoClient', () => {
  describe('put', () => {
    const buildFakeClient = (mock: jest.Mock): Partial<DynamoDB.DocumentClient> => {
      return {
        put: jest.fn(() => {
          return {
            promise: mock
          }
        })
      }
    }

    test('adapts internal options to aws client interface', async () => {
      const client = buildFakeClient(
        jest.fn().mockResolvedValue({} as DynamoDB.PutItemOutput)
      )
      const document = { data: 'to persist' }
      const table = 'dummyTableName'
      const expectedPutItemInput = {
        Item: { data: 'to persist' },
        TableName: 'dummyTableName'
      }

      await put({ document, table, client })

      expect(client.put).toHaveBeenCalledWith(expectedPutItemInput)
    })

    test('throws a DynamoClientError with the same message from AWSError', () => {
      const client = buildFakeClient(
        jest.fn().mockRejectedValue(new Error('Internal error') as AWSError)
      )
      const document = { data: 'to persist' }
      const table = 'dummyTableName'
      const expectedError = new DynamoClientError('Internal error')

      expect(put({ document, table, client }))
        .rejects
        .toEqual(expectedError)
    })
  })

  describe('createTable', () => {
    const buildFakeClient = (mock?: jest.Mock): Partial<DynamoDB> => {
      const fakeTableDescription: DynamoDB.TableDescription = {
        TableStatus: 'CREATING'
      }

      return {
        createTable: jest.fn(() => {
          return {
            promise: mock || jest.fn().mockResolvedValue(fakeTableDescription)
          }
        })
      }
    }

    const dummySchema: DynamoDB.CreateTableInput = {
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'S'
        }
      ],
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH'
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 99,
        WriteCapacityUnits: 99
      },
      TableName: 'dummyTableName'
    }

    test('delegates table schema to aws client', async () => {
      const fakeClient = buildFakeClient()

      await createTable(dummySchema, fakeClient)

      expect(fakeClient.createTable).toHaveBeenCalledWith(dummySchema)
    })

    test('resolves with the operation status', async () => {
      const fakeClient = buildFakeClient()

      const result = await createTable(dummySchema, fakeClient)

      expect(result).toEqual({ status: 'CREATING' })
    })

    test('throws a DynamoClientError with the same message from AWSError', () => {
      const fakeClient = buildFakeClient(
        jest.fn().mockRejectedValue(new Error('Internal error') as AWSError)
      )
      const expectedError = new DynamoClientError('Internal error')

      expect(createTable(dummySchema, fakeClient))
        .rejects
        .toEqual(expectedError)
    })
  })
})
