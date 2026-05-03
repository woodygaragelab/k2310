export interface CalendarEntry {
  date: string   // YYYY-MM-DD
  names: string[]
}

export interface ApiResponse<T> {
  data: T
  error?: string
}
