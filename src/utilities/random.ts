export function between(from: number, to: number): number {
  const max = Math.max(from, to)
  const min = Math.min(from, to)
  const diff = max - min
  const rando = Math.random()

  return min + Math.round(diff * rando)
}