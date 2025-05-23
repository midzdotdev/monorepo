import type { Grid } from '@/lib/grid'
import { take } from '@/lib/std/iterable'
import type { TangoConstraint, TangoValue } from '../types'
import { solveTangoBruteForce } from './brute-force'

export type SolveResult =
  | {
      kind: 'impossible'
    }
  | {
      kind: 'unique'
      solution: Grid<TangoValue>
    }
  | {
      kind: 'multiple'
      solutions: Grid<TangoValue>[]
    }

export const solve = (
  grid: Grid<TangoValue>,
  constraints: TangoConstraint[]
): SolveResult => {
  const solutions = take(solveTangoBruteForce(grid, constraints), 2)

  if (solutions.length === 0) {
    return {
      kind: 'impossible',
    }
  }

  if (solutions.length > 1) {
    return {
      kind: 'multiple',
      solutions,
    }
  }

  return {
    kind: 'unique',
    solution: solutions[0],
  }
}
