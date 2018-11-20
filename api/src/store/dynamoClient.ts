import { config as AWSConfig, DynamoDB } from 'aws-sdk'
import { path } from 'ramda'

interface Config {
  endpoint: string
  region: string
}

interface Put {
  document: any
  table: string
  client?: Partial<DynamoDB.DocumentClient>,
}

// TODO: Grab the endpoint and region from env vars or a config file
const defaultConfig: Config = {
  endpoint: 'http://127.0.0.1:8000',
  region: 'local'
}

// TODO: Remove this call from here due to the hard control and the side-effects
AWSConfig.update(defaultConfig)

class DynamoClientError extends Error {
  constructor(message?: string) {
    super(message)
  }
}

const put = async ({
  document,
  table,
  client = new DynamoDB.DocumentClient()
}: Put): Promise<object | DynamoClientError> => {
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
): Promise<{ status: string } | DynamoClientError> => {
  try {
    const result: DynamoDB.CreateTableOutput = await client.createTable!(schema).promise()
    const defaultTableStatus: string = 'CREATING'

    return {
      status: path(['TableDescription', 'TableStatus'], result) || defaultTableStatus
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
