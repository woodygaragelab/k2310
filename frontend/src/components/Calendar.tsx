import { useState } from 'react'
import { NameModal } from './NameModal'
import { useCalendarEntries } from '../hooks/useCalendarEntries'
import './Calendar.css'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function Calendar() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const { entries, loading, error, saveEntry } = useCalendarEntries(year, month)

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

  const handleCellClick = (day: number) => {
    setSelectedDate(toDateStr(year, month, day))
  }

  const handleSave = async (names: string[]) => {
    if (!selectedDate) return
    await saveEntry(selectedDate, names)
  }

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
          const names = entries[dateStr] ?? []
          const isToday = dateStr === todayStr
          const weekday = (firstDay + day - 1) % 7

          return (
            <div
              key={day}
              className={[
                'cell',
                isToday ? 'today' : '',
                weekday === 0 ? 'sun' : weekday === 6 ? 'sat' : '',
                names.length > 0 ? 'has-names' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => handleCellClick(day)}
            >
              <span className="day-number">{day}</span>
              {names.length > 0 && (
                <ul className="name-chips">
                  {names.slice(0, 3).map((name, i) => (
                    <li key={i} className="name-chip">{name}</li>
                  ))}
                  {names.length > 3 && (
                    <li className="name-chip more">+{names.length - 3}</li>
                  )}
                </ul>
              )}
            </div>
          )
        })}
      </div>

      {selectedDate && (
        <NameModal
          date={selectedDate}
          initialNames={entries[selectedDate] ?? []}
          onSave={handleSave}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  )
}
