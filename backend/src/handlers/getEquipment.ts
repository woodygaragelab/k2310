import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const TABLE = process.env.EQUIPMENT_TABLE_NAME!

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const result = await client.send(new ScanCommand({ TableName: TABLE }))

    const items = (result.Items ?? []).map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      location: item.location,
      status: item.status,
      notes: item.notes ?? '',
    }))

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(items),
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
