import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb'

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const TABLE = process.env.EQUIPMENT_TABLE_NAME!

const VALID_STATUSES = ['使用可能', '貸出中', '修理中', '廃棄予定']

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
    await client.send(new UpdateCommand({
      TableName: TABLE,
      Key: { id },
      UpdateExpression:
        'SET #n = :n, category = :c, quantity = :q, #l = :l, #s = :s, notes = :notes' +
        (attachment ? ', attachment = :a' : ' REMOVE attachment'),
      ExpressionAttributeNames: { '#n': 'name', '#l': 'location', '#s': 'status' },
      ExpressionAttributeValues: {
        ':n': name, ':c': category, ':q': quantity, ':l': location, ':s': status, ':notes': notes,
        ...(attachment && { ':a': attachment }),
      },
      ConditionExpression: 'attribute_exists(id)',
    }))

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ id, name, category, quantity, location, status, notes, attachment }),
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
