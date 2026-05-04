import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb'

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

  try {
    await client.send(new DeleteCommand({
      TableName: TABLE,
      Key: { id },
    }))

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ id }),
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[deleteReservation]', message)
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: message }),
    }
  }
}
