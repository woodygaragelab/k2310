import type { Reservation, EquipmentItem, EquipmentAttachment } from '../types'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

export async function fetchMonthReservations(year: number, month: number): Promise<Reservation[]> {
  const monthStr = `${year}-${String(month).padStart(2, '0')}`
  const res = await fetch(`${API_BASE}/reservations?month=${monthStr}`)
  if (!res.ok) throw new Error(`Failed to fetch reservations: ${res.status}`)
  return res.json()
}

export async function createReservation(startDate: string, endDate: string, name: string, memo: string, isCancelled: boolean, isProvisional: boolean, color: string): Promise<Reservation> {
  const res = await fetch(`${API_BASE}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDate, endDate, name, memo, isCancelled, isProvisional, color }),
  })
  if (!res.ok) throw new Error(`Failed to create reservation: ${res.status}`)
  return res.json()
}

export async function updateReservation(id: string, startDate: string, endDate: string, name: string, memo: string, isCancelled: boolean, isProvisional: boolean, color: string): Promise<Reservation> {
  const res = await fetch(`${API_BASE}/reservations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDate, endDate, name, memo, isCancelled, isProvisional, color }),
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

export async function fetchEquipment(): Promise<EquipmentItem[]> {
  const res = await fetch(`${API_BASE}/equipment`)
  if (!res.ok) throw new Error(`Failed to fetch equipment: ${res.status}`)
  return res.json()
}

export async function createEquipment(item: Omit<EquipmentItem, 'id'>): Promise<EquipmentItem> {
  const res = await fetch(`${API_BASE}/equipment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  })
  if (!res.ok) throw new Error(`Failed to create equipment: ${res.status}`)
  return res.json()
}

export async function updateEquipment(id: string, item: Omit<EquipmentItem, 'id'>): Promise<EquipmentItem> {
  const res = await fetch(`${API_BASE}/equipment/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  })
  if (!res.ok) throw new Error(`Failed to update equipment: ${res.status}`)
  return res.json()
}

export function equipmentAttachmentUrl(id: string): string {
  return `${API_BASE}/equipment/${id}/attachment`
}

export async function uploadEquipmentAttachment(file: File): Promise<EquipmentAttachment> {
  const contentType = file.type || 'application/octet-stream'
  const res = await fetch(`${API_BASE}/equipment/upload-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contentType }),
  })
  if (!res.ok) throw new Error(`Failed to get upload url: ${res.status}`)
  const { uploadUrl, key } = await res.json()

  const put = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': contentType }, body: file })
  if (!put.ok) throw new Error(`Failed to upload file: ${put.status}`)
  return { key, name: file.name }
}

export async function deleteEquipment(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/equipment/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Failed to delete equipment: ${res.status}`)
  }
}
