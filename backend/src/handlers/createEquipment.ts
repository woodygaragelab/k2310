import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { randomUUID } from 'crypto'

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const TABLE = process.env.EQUIPMENT_TABLE_NAME!

const VALID_STATUSES = ['使用可能', '貸出中', '修理中', '廃棄予定']

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

export const handler: APIGatewayProxyHandler = async (event) => {
  let name: string, category: string, quantity: number, location: string, status: string, notes: string
  let attachment: { key: string; name: string } | undefined
  try {
    const body = JSON.parse(event.body ?? '{}')
    name = String(body.name ?? '').trim()
    category = String(body.category ?? '').trim()
    quantity = Number(body.quantity)
    location = String(body.location ?? '').trim()
    status = String(body.status ?? '')
    notes = String(body.notes ?? '').trim()
    if (body.attachment) {
      const key = String(body.attachment.key ?? '')
      const fileName = String(body.attachment.name ?? '').trim()
      if (!key.startsWith('equipment/') || !fileName) throw new Error()
      attachment = { key, name: fileName }
    }
    if (!name || !Number.isFinite(quantity) || quantity < 0 || !VALID_STATUSES.includes(status)) throw new Error()
  } catch {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'name, category, quantity, location, status are required' }),
    }
  }

  try {
    const id = randomUUID()
    await client.send(new PutCommand({
      TableName: TABLE,
      Item: { id, name, category, quantity, location, status, notes, ...(attachment && { attachment }) },
    }))

    return {
      statusCode: 201,
      headers: CORS_HEADERS,
      body: JSON.stringify({ id, name, category, quantity, location, status, notes, attachment }),
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
