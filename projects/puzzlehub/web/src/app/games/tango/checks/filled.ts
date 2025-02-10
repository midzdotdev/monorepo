import { Grid } from '@/lib/Grid'
import { TangoValue } from '../types'

export const isGridFilled = (grid: Grid<TangoValue>): boolean => {
  return grid.every((row) => row.every((cell) => cell !== 0))
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  it('returns false for an empty grid', () => {
    const grid: Grid<TangoValue> = Grid.filled(2, 0)

    expect(isGridFilled(grid)).toBe(false)
  })

  it('returns false for a partially filled grid', () => {
    const grid: Grid<TangoValue> = [
      [1, 0],
      [1, 2],
    ]

    expect(isGridFilled(grid)).toBe(false)
  })

  it('returns true for a filled grid', () => {
    const grid: Grid<TangoValue> = Grid.filled(2, 1)

    expect(isGridFilled(grid)).toBe(true)
  })
}
