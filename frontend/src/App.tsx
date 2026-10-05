import { useState } from 'react'
import { Header } from './components/Header'
import type { View } from './components/Header'
import { Calendar } from './components/Calendar'
import { Equipment } from './components/Equipment'
import './App.css'

function App() {
  const [view, setView] = useState<View>('calendar')

  return (
    <div className="app">
      <Header current={view} onChange={setView} />
      {view === 'calendar' && <Calendar />}
      {view === 'equipment' && <Equipment key="equipment" category="備品" />}
      {view === 'food' && <Equipment key="food" category="食材" />}
      {view === 'guide' && <Equipment key="guide" category="ガイド" />}
    </div>
  )
}

export default App
