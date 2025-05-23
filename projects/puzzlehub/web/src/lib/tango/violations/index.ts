import type { Grid, GridPosition } from '@/lib/grid'
import type { TangoConstraint, TangoValue } from '../types'

import { checkGridLinesBalance } from './balanced-lines'
import { checkGridConsecutiveCells } from './consecutive-cells'
import { checkGridConstraints } from './constraints'

export interface TangoViolation {
  cells: GridPosition[]
  reason: string
}

export function* listViolations(
  grid: Grid<TangoValue>,
  constraints: TangoConstraint[]
): Iterable<TangoViolation> {
  yield* checkGridConsecutiveCells(grid)

  yield* checkGridConstraints(grid, constraints)

  yield* checkGridLinesBalance(grid)
}
