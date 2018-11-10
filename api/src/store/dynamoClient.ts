import { DynamoDB } from 'aws-sdk'
import { path } from 'ramda'

class DynamoClientError extends Error {
  constructor(message?: string) {
    super(message)
  }
}

const put = async (
  { document, table }: { [key: string]: any, table: string },
  client: Partial<DynamoDB.DocumentClient> = new DynamoDB.DocumentClient()
): Promise<object> => {
  try {
    const input: DynamoDB.PutItemInput = {
      Item: document,
      TableName: table
    }

    return await client.put!(input).promise()
  } catch (err) {
    throw new DynamoClientError(err.message)
  }
}

const createTable = async (
  schema: DynamoDB.CreateTableInput,
  client: Partial<DynamoDB> = new DynamoDB()
): Promise<{ status: string }> => {
  try {
    const result: DynamoDB.CreateTableOutput = await client.createTable!(schema).promise()

    return {
      status: path(['TableDescription', 'TableStatus'], result) || 'CREATING'
    }
  } catch (err) {
    throw new DynamoClientError(err.message)
  }
}

export {
  createTable,
  DynamoClientError,
  put
}
