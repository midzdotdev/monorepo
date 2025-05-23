import type { Grid } from '@/lib/grid'
import type { TangoConstraint, TangoValue } from './types'
import { listViolations } from './violations'

export const isTangoGridFilled = (grid: Grid<TangoValue>): boolean => {
  return grid.every((row) => row.every((cell) => cell !== 0))
}

export const isTangoGridSolved = (
  grid: Grid<TangoValue>,
  constraints: TangoConstraint[]
): boolean => {
  if (!isTangoGridFilled(grid)) {
    return false
  }

  for (const violation of listViolations(grid, constraints)) {
    return false
  }

  return true
}
