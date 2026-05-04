/**
 * ローカル開発用サーバー (DynamoDB Local 不要のインメモリ実装)
 * 起動: npm run dev
 */
import * as http from 'http'

const PORT = 3001

interface Reservation {
  id: string
  startDate: string
  endDate: string
  name: string
}

const store: Record<string, Reservation> = {}
let nextId = 1

function json(res: http.ServerResponse, status: number, body: unknown) {
  const data = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  })
  res.end(data)
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url!, `http://localhost:${PORT}`)

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    })
    res.end()
    return
  }

  // GET /reservations?month=YYYY-MM
  if (req.method === 'GET' && url.pathname === '/reservations') {
    const month = url.searchParams.get('month')
    if (!month) return json(res, 400, { error: 'month required' })
    const [year, m] = month.split('-').map(Number)
    const monthStart = `${month}-01`
    const lastDay = new Date(year, m, 0).getDate()
    const monthEnd = `${month}-${String(lastDay).padStart(2, '0')}`
    const result = Object.values(store).filter(
      r => r.startDate <= monthEnd && r.endDate >= monthStart
    )
    return json(res, 200, result)
  }

  // POST /reservations
  if (req.method === 'POST' && url.pathname === '/reservations') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        const { startDate, endDate, name } = JSON.parse(body)
        if (!startDate || !endDate || !name) {
          return json(res, 400, { error: 'startDate, endDate, name required' })
        }
        const id = String(nextId++)
        const reservation: Reservation = { id, startDate, endDate, name }
        store[id] = reservation
        json(res, 201, reservation)
      } catch {
        json(res, 400, { error: 'Invalid body' })
      }
    })
    return
  }

  const idMatch = url.pathname.match(/^\/reservations\/(.+)$/)

  // PUT /reservations/:id
  if (req.method === 'PUT' && idMatch) {
    const id = idMatch[1]
    if (!store[id]) return json(res, 404, { error: 'Not found' })
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        const { startDate, endDate, name } = JSON.parse(body)
        if (!startDate || !endDate || !name) {
          return json(res, 400, { error: 'startDate, endDate, name required' })
        }
        store[id] = { id, startDate, endDate, name }
        json(res, 200, store[id])
      } catch {
        json(res, 400, { error: 'Invalid body' })
      }
    })
    return
  }

  // DELETE /reservations/:id
  if (req.method === 'DELETE' && idMatch) {
    const id = idMatch[1]
    if (!store[id]) return json(res, 404, { error: 'Not found' })
    delete store[id]
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*' })
    res.end()
    return
  }

  json(res, 404, { error: 'Not found' })
})

server.listen(PORT, () => {
  console.log(`[K2310 Local API] http://localhost:${PORT}`)
  console.log('Routes:')
  console.log('  GET    /reservations?month=YYYY-MM')
  console.log('  POST   /reservations')
  console.log('  PUT    /reservations/:id')
  console.log('  DELETE /reservations/:id')
})
