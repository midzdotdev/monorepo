import { Grid } from '@/lib/grid'
import { TangoHint } from '../hints'
import { TangoValue } from '../types'

export const applyHint = (grid: Grid<TangoValue>, hint: TangoHint) => {
  return Grid.setCell(grid, hint.position, hint.value)
}
