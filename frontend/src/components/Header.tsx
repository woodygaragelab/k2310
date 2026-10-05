import './Header.css'

export type View = 'calendar' | 'equipment' | 'food' | 'guide'

interface HeaderProps {
  current: View
  onChange: (view: View) => void
}

const MENU_ITEMS: { key: View; label: string }[] = [
  { key: 'calendar', label: 'カレンダー' },
  { key: 'equipment', label: '備品' },
  { key: 'food', label: '食材' },
  { key: 'guide', label: 'ガイド' },
]

export function Header({ current, onChange }: HeaderProps) {
  return (
    <header className="app-header">
      <nav className="app-header-nav">
        {MENU_ITEMS.map(item => (
          <button
            key={item.key}
            className={`app-header-link ${current === item.key ? 'active' : ''}`}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
