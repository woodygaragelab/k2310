import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb'

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const TABLE = process.env.TABLE_NAME!

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters?.id
  if (!id) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'id is required' }),
    }
  }

  let startDate: string, endDate: string, name: string
  try {
    const body = JSON.parse(event.body ?? '{}')
    if (!body.startDate || !body.endDate || !body.name) throw new Error()
    startDate = body.startDate
    endDate = body.endDate
    name = String(body.name).trim()
    if (!name) throw new Error()
  } catch {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'startDate, endDate, name required' }),
    }
  }

  try {
    await client.send(new UpdateCommand({
      TableName: TABLE,
      Key: { id },
      UpdateExpression: 'SET startDate = :s, endDate = :e, #n = :n',
      ExpressionAttributeNames: { '#n': 'name' },
      ExpressionAttributeValues: { ':s': startDate, ':e': endDate, ':n': name },
      ConditionExpression: 'attribute_exists(id)',
    }))

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ id, startDate, endDate, name }),
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ConditionalCheckFailedException') {
      return {
        statusCode: 404,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Not found' }),
      }
    }
    console.error(err)
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Internal server error' }),
    }
  }
}
