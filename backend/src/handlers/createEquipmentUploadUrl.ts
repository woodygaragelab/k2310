import { APIGatewayProxyHandler } from 'aws-lambda'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'

const s3 = new S3Client({})
const BUCKET = process.env.ATTACHMENT_BUCKET!

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

export const handler: APIGatewayProxyHandler = async (event) => {
  let contentType: string
  try {
    const body = JSON.parse(event.body ?? '{}')
    contentType = String(body.contentType || 'application/octet-stream')
  } catch {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid body' }) }
  }

  try {
    const key = `equipment/${randomUUID()}`
    const uploadUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType }),
      { expiresIn: 300 },
    )
    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ uploadUrl, key }) }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Internal server error' }) }
  }
}
