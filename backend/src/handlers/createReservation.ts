import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { randomUUID } from 'crypto'

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const TABLE = process.env.TABLE_NAME!

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

export const handler: APIGatewayProxyHandler = async (event) => {
  let startDate: string, endDate: string, name: string, memo: string
  try {
    const body = JSON.parse(event.body ?? '{}')
    if (!body.startDate || !body.endDate || !body.name) throw new Error()
    startDate = body.startDate
    endDate = body.endDate
    name = String(body.name).trim()
    memo = String(body.memo ?? '').trim()
    if (!name) throw new Error()
  } catch {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'startDate, endDate, name required' }),
    }
  }

  try {
    const id = randomUUID()
    await client.send(new PutCommand({
      TableName: TABLE,
      Item: { id, startDate, endDate, name, memo },
    }))

    return {
      statusCode: 201,
      headers: CORS_HEADERS,
      body: JSON.stringify({ id, startDate, endDate, name, memo }),
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Internal server error' }),
    }
  }
}
