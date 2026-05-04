import { useState } from 'react'
import { ReservationModal } from './ReservationModal'
import { useReservations } from '../hooks/useReservations'
import { reservationColor } from '../utils/color'
import type { Reservation } from '../types'
import './Calendar.css'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

type ModalState =
  | { type: 'new'; date: string }
  | { type: 'edit'; reservation: Reservation }

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function Calendar() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [modalState, setModalState] = useState<ModalState | null>(null)

  const { reservations, loading, error, addReservation, editReservation, removeReservation } = useReservations(year, month)

  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
  }

  const todayStr = toDateStr(today.getFullYear(), today.getMonth() + 1, today.getDate())

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const getReservationsForDate = (dateStr: string) =>
    reservations
      .filter(r => r.startDate <= dateStr && dateStr <= r.endDate)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))

  return (
    <div className="calendar-wrapper">
      <header className="calendar-header">
        <button className="nav-btn" onClick={prevMonth}>‹</button>
        <h1 className="calendar-title">{year}年 {month}月</h1>
        <button className="nav-btn" onClick={nextMonth}>›</button>
      </header>

      {error && <div className="calendar-error">{error}</div>}
      {loading && <div className="calendar-loading">読み込み中...</div>}

      <div className="calendar-grid">
        {WEEKDAYS.map(d => (
          <div key={d} className={`weekday-header ${d === '日' ? 'sun' : d === '土' ? 'sat' : ''}`}>
            {d}
          </div>
        ))}

        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="cell empty" />
          }
          const dateStr = toDateStr(year, month, day)
          const dayReservations = getReservationsForDate(dateStr)
          const isToday = dateStr === todayStr
          const weekday = (firstDay + day - 1) % 7

          return (
            <div
              key={day}
              className={[
                'cell',
                isToday ? 'today' : '',
                weekday === 0 ? 'sun' : weekday === 6 ? 'sat' : '',
                dayReservations.length > 0 ? 'has-names' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => setModalState({ type: 'new', date: dateStr })}
            >
              <span className="day-number">{day}</span>
              {dayReservations.length > 0 && (
                <ul className="name-chips">
                  {dayReservations.slice(0, 3).map(r => (
                    <li key={r.id} className="name-chip" style={{ background: reservationColor(r.id) }}>
                      <span
                        className="chip-name"
                        onClick={e => { e.stopPropagation(); setModalState({ type: 'edit', reservation: r }) }}
                      >{r.name}</span>
                      <button
                        className="chip-delete"
                        onClick={e => { e.stopPropagation(); removeReservation(r.id) }}
                      >×</button>
                    </li>
                  ))}
                  {dayReservations.length > 3 && (
                    <li className="name-chip more">+{dayReservations.length - 3}</li>
                  )}
                </ul>
              )}
            </div>
          )
        })}
      </div>

      {modalState?.type === 'new' && (
        <ReservationModal
          defaultDate={modalState.date}
          onSave={addReservation}
          onClose={() => setModalState(null)}
        />
      )}
      {modalState?.type === 'edit' && (
        <ReservationModal
          defaultDate={modalState.reservation.startDate}
          reservation={modalState.reservation}
          onSave={(s, e, n) => editReservation(modalState.reservation.id, s, e, n)}
          onDelete={() => removeReservation(modalState.reservation.id)}
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  )
}
