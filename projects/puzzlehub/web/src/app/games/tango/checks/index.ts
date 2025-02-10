import { eqPosition, Grid, GridPosition } from '@/lib/Grid'
import { TangoValue, TangoConstraint, TangoMove } from '../types'
import { isGridFilled } from './filled'
import { getGridConstraintViolations } from './constraints'
import { checkGridLinesBalance } from './line-balance'
import {
  checkCellConsecutiveCells,
  checkGridConsecutiveCells,
} from './consecutive-cells'

export const isCellValid = (
  grid: Grid<TangoValue>,
  constraints: TangoConstraint[],
  position: GridPosition
): boolean => {
  if (checkCellConsecutiveCells(grid, position)) {
    return false
  }

  for (const violation of getGridConstraintViolations(grid, constraints)) {
    if (violation.some((x) => eqPosition(x, position))) {
      return false
    }
  }

  for (const violation of checkGridLinesBalance(grid)) {
    if (violation.some((x) => eqPosition(x, position))) {
      return false
    }
  }

  return true
}

function* getAllViolations(
  grid: Grid<TangoValue>,
  constraints: TangoConstraint[]
): Iterable<GridPosition[]> {
  for (const violation of checkGridConsecutiveCells(grid)) {
    yield violation
  }

  for (const violation of getGridConstraintViolations(grid, constraints)) {
    yield violation
  }

  for (const violation of checkGridLinesBalance(grid)) {
    yield violation
  }
}

export const checkGridPlayProgress = (
  grid: Grid<TangoValue>,
  constraints: TangoConstraint[]
): {
  isCompleted: boolean
  cellViolations: GridPosition[]
} => {
  const cellViolations = [...getAllViolations(grid, constraints)].flat()

  const isFilled = isGridFilled(grid)

  const isCompleted = isFilled && cellViolations.length === 0

  return {
    isCompleted,
    cellViolations,
  }
}

export const isValidMove = (
  grid: Grid<TangoValue>,
  constraints: TangoConstraint[],
  move: TangoMove
): boolean => {
  const clonedGrid = Grid.clone(grid)

  Grid.setCell(clonedGrid, move.position, move.value)

  return isCellValid(clonedGrid, constraints, move.position)
}
