import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const s3 = new S3Client({})
const TABLE = process.env.EQUIPMENT_TABLE_NAME!
const BUCKET = process.env.ATTACHMENT_BUCKET!

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

// 添付ファイルへの短命な署名付きURLにリダイレクトする（<a href> で直接開ける）
export const handler: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters?.id
  if (!id) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'id is required' }) }
  }

  try {
    const { Item } = await client.send(new GetCommand({ TableName: TABLE, Key: { id } }))
    const attachment = Item?.attachment as { key: string; name: string } | undefined
    if (!attachment) {
      return { statusCode: 404, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Not found' }) }
    }

    const url = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: attachment.key,
        ResponseContentDisposition: `inline; filename*=UTF-8''${encodeURIComponent(attachment.name)}`,
      }),
      { expiresIn: 300 },
    )
    return { statusCode: 302, headers: { ...CORS_HEADERS, Location: url }, body: '' }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Internal server error' }) }
  }
}
