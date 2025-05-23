import type { Grid, GridPosition } from '@/lib/grid'
import type { TangoConstraint, TangoValue } from '../types'

import { first } from '@/lib/std/iterable'
import { uniquePuzzles } from '../__tests__/fixtures/puzzles/unique'
import { isTangoGridSolved } from '../check-completion'
import { formatPuzzle } from '../format'
import { solveTangoBruteForce } from '../solve/brute-force'
import { applyHint } from '../solve/hints'
import { getBalancedLinesHint } from './balanced-lines'
import { getConsecutiveCellsHint } from './consecutive'
import { getConstraintsHint } from './constraint-based'
import { getFallbackHint } from './fallback'
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
        const solution = first(solveTangoBruteForce(workingGrid, constraints))

        if (!solution) {
          throw new Error('Expected solution to be available for puzzle')
        }

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
