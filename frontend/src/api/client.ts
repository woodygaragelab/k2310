import type { Reservation } from '../types'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

export async function fetchMonthReservations(year: number, month: number): Promise<Reservation[]> {
  const monthStr = `${year}-${String(month).padStart(2, '0')}`
  const res = await fetch(`${API_BASE}/reservations?month=${monthStr}`)
  if (!res.ok) throw new Error(`Failed to fetch reservations: ${res.status}`)
  return res.json()
}

export async function createReservation(startDate: string, endDate: string, name: string, memo: string): Promise<Reservation> {
  const res = await fetch(`${API_BASE}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDate, endDate, name, memo }),
  })
  if (!res.ok) throw new Error(`Failed to create reservation: ${res.status}`)
  return res.json()
}

export async function updateReservation(id: string, startDate: string, endDate: string, name: string, memo: string): Promise<Reservation> {
  const res = await fetch(`${API_BASE}/reservations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDate, endDate, name, memo }),
  })
  if (!res.ok) throw new Error(`Failed to update reservation: ${res.status}`)
  return res.json()
}

export async function deleteReservation(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/reservations/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Failed to delete reservation: ${res.status}`)
  }
}
