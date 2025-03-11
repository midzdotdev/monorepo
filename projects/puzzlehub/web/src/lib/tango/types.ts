import { Grid, GridLineDirection, GridPosition } from '@/lib/grid'

export type TangoValue = 0 | 1 | 2

export namespace TangoValue {
  export type Empty = 0

  export type NonEmpty = 1 | 2

  export const isEmpty = (value: TangoValue): value is Empty => value === 0
  export const isNonEmpty = (value: TangoValue): value is NonEmpty =>
    value === 1 || value === 2

  export namespace NonEmpty {
    export const flip = (value: NonEmpty): NonEmpty => (value === 1 ? 2 : 1)
  }
}

export type TangoConstraintType = 'equal' | 'opposite'

export interface TangoConstraint extends GridPosition {
  direction: GridLineDirection
  type: TangoConstraintType
}

export interface TangoPuzzle {
  grid: Grid<TangoValue>
  constraints: TangoConstraint[]
}

export interface TangoMove {
  position: GridPosition
  value: TangoValue
}
