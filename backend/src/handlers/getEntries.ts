import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const TABLE = process.env.TABLE_NAME!

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const month = event.queryStringParameters?.month

  try {
    if (month) {
      // month=YYYY-MM: Query items where date starts with the month prefix
      const result = await client.send(new ScanCommand({
        TableName: TABLE,
        FilterExpression: 'begins_with(#d, :month)',
        ExpressionAttributeNames: { '#d': 'date' },
        ExpressionAttributeValues: { ':month': month },
      }))

      const entries = (result.Items ?? []).map(item => ({
        date: item.date,
        names: item.names ?? [],
      }))

      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify(entries),
      }
    }

    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'month query parameter is required' }),
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
