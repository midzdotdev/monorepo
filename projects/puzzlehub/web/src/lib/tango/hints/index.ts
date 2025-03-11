import { Grid, GridPosition } from '@/lib/grid'
import { TangoValue, TangoConstraint } from '../types'

import { getConstraintsHint } from './constraint-based'
import { getBalancedLinesHint } from './balanced-lines'
import { getConsecutiveCellsHint } from './consecutive'
import { uniquePuzzles } from '../__tests__/fixtures/puzzles/unique'
import { applyHint } from '../solve/hints'
import { isTangoGridSolved } from '../check-completion'
import { formatPuzzle } from '../format'
import { getFallbackHint } from './fallback'
import { first } from '@/lib/std/iterable'
import { solveTangoBruteForce } from '../solve/brute-force'
import { getIncorrectCellHint } from './incorrect-cell'

export interface TangoHint {
  position: GridPosition
  value: TangoValue
  reason: string
}

export const getHint = (
  grid: Grid<TangoValue>,
  constraints: TangoConstraint[],
  solution: Grid<TangoValue>
): TangoHint => {
  const incorrectCellHint = getIncorrectCellHint(grid, solution)

  if (incorrectCellHint) {
    return incorrectCellHint
  }

  const logicalHint =
    getConstraintsHint(grid, constraints) ??
    getBalancedLinesHint(grid) ??
    getConsecutiveCellsHint(grid)

  if (logicalHint) {
    return logicalHint
  }

  return getFallbackHint(grid, solution)
}

if (import.meta.vitest) {
  const { it } = import.meta.vitest

  it.each(uniquePuzzles)(
    'should always have hints available for solvable puzzles',
    ({ grid, constraints }) => {
      let workingGrid = grid

      while (!isTangoGridSolved(workingGrid, constraints)) {
        const solution = first(solveTangoBruteForce(workingGrid, constraints))!
        const hint = getHint(workingGrid, constraints, solution)

        if (!hint) {
          throw new Error(
            `Expected hint to be available for puzzle\n${formatPuzzle(workingGrid, constraints)}`
          )
        }

        workingGrid = applyHint(workingGrid, hint)
      }
    }
  )
}
