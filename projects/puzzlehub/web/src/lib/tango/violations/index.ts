import { Grid, GridPosition } from '@/lib/grid'
import { TangoValue, TangoConstraint } from '../types'

import { checkGridConstraints } from './constraints'
import { checkGridLinesBalance } from './balanced-lines'
import { checkGridConsecutiveCells } from './consecutive-cells'

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
