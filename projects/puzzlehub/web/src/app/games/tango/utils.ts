import { Grid } from '@/lib/Grid'
import { TangoValue } from './types'

export const makeEmptyGrid = (size: number): Grid<TangoValue> => {
  return Grid.filled(size, 0)
}

const valueToSymbol = {
  0: 'empty',
  1: '{sun}',
  2: '{moon}',
}

export const symbol = (value: TangoValue) => valueToSymbol[value]
