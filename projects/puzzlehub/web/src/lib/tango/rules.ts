import type { TangoValue } from './types'

export const nonEmptyValues: TangoValue.NonEmpty[] = [1, 2]

const valueToSymbol = {
  0: 'empty',
  1: '{sun}',
  2: '{moon}',
} as const

export const symbol = <T extends TangoValue>(value: T) => valueToSymbol[value]

export const MAX_CONSECUTIVE = 2

export const TANGO_RULES = {
  filled: `Fill the grid so that each cell contains either ${symbol(1)} or ${symbol(2)}.`,
  consecutiveCells: `No more than ${MAX_CONSECUTIVE} ${symbol(1)} or ${symbol(2)} may be next to each other, either vertically or horizontally.`,
  lineBalance: `Each row and column must have the same number of ${symbol(1)} and ${symbol(2)}.`,
  equalConstraint: 'Cells with {equal} between them must be the same.',
  oppositeConstraint: 'Cells with {opposite} between them must be different.',
} as const
