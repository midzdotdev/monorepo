import { Grid, GridPosition, GridDirection } from '@/lib/Grid'
import { TangoValue, TangoConstraint, TangoConstraintType } from '../types'
import { getConstraintHint } from './constraint-based'
import { getLineBalanceHint } from './line-balance'
import { getConsecutiveCellsHint } from './consecutive'

export interface TangoHint {
  position: GridPosition
  value: TangoValue
  reason: string
}

export const getHint = (
  grid: Grid<TangoValue>,
  constraints: TangoConstraint[]
): TangoHint | null => {
  return (
    getConstraintHint(grid, constraints) ??
    getLineBalanceHint(grid, constraints) ??
    getConsecutiveCellsHint(grid) ??
    null
  )
}
