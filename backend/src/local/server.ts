/**
 * ローカル開発用サーバー (DynamoDB Local 不要のインメモリ実装)
 * 起動: npm run dev
 */
import * as http from 'http'

const PORT = 3001
const store: Record<string, string[]> = {}

function json(res: http.ServerResponse, status: number, body: unknown) {
  const data = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,PUT,DELETE,OPTIONS',
  })
  res.end(data)
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url!, `http://localhost:${PORT}`)

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,PUT,DELETE,OPTIONS',
    })
    res.end()
    return
  }

  // GET /entries?month=YYYY-MM
  if (req.method === 'GET' && url.pathname === '/entries') {
    const month = url.searchParams.get('month')
    if (!month) return json(res, 400, { error: 'month required' })
    const result = Object.entries(store)
      .filter(([date]) => date.startsWith(month))
      .map(([date, names]) => ({ date, names }))
    return json(res, 200, result)
  }

  // PUT /entries/:date
  const putMatch = url.pathname.match(/^\/entries\/(\d{4}-\d{2}-\d{2})$/)
  if (req.method === 'PUT' && putMatch) {
    const date = putMatch[1]
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        const { names } = JSON.parse(body)
        store[date] = names
        json(res, 200, { date, names })
      } catch {
        json(res, 400, { error: 'Invalid body' })
      }
    })
    return
  }

  // DELETE /entries/:date
  const delMatch = url.pathname.match(/^\/entries\/(\d{4}-\d{2}-\d{2})$/)
  if (req.method === 'DELETE' && delMatch) {
    const date = delMatch[1]
    delete store[date]
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*' })
    res.end()
    return
  }

  json(res, 404, { error: 'Not found' })
})

server.listen(PORT, () => {
  console.log(`[K2310 Local API] http://localhost:${PORT}`)
  console.log('Routes:')
  console.log('  GET    /entries?month=YYYY-MM')
  console.log('  PUT    /entries/:date')
  console.log('  DELETE /entries/:date')
})
