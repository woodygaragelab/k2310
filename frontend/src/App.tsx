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
      {view === 'calendar' ? <Calendar /> : <Equipment />}
    </div>
  )
}

export default App
