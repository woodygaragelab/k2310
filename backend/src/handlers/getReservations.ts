import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const TABLE = process.env.TABLE_NAME!

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const month = event.queryStringParameters?.month
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'month query parameter is required (YYYY-MM)' }),
    }
  }

  const [year, m] = month.split('-').map(Number)
  const monthStart = `${month}-01`
  const lastDay = new Date(year, m, 0).getDate()
  const monthEnd = `${month}-${String(lastDay).padStart(2, '0')}`

  try {
    const result = await client.send(new ScanCommand({
      TableName: TABLE,
      FilterExpression: 'startDate <= :monthEnd AND endDate >= :monthStart',
      ExpressionAttributeValues: { ':monthStart': monthStart, ':monthEnd': monthEnd },
    }))

    const reservations = (result.Items ?? []).map(item => ({
      id: item.id,
      startDate: item.startDate,
      endDate: item.endDate,
      name: item.name,
    }))

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(reservations),
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
