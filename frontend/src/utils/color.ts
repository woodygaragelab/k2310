// Golden angle (137.508°) distribution gives maximum perceptual separation
// between consecutive IDs while still working well for UUID-style IDs.
export function reservationColor(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = hash * 31 + id.charCodeAt(i)
  }
  const hue = (Math.abs(hash) * 137.508) % 360
  return `hsl(${Math.round(hue)}, 68%, 40%)`
}
