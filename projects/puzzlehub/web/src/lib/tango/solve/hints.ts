import { Grid } from '@/lib/grid'
import type { TangoHint } from '../hints'
import type { TangoValue } from '../types'

export const applyHint = (grid: Grid<TangoValue>, hint: TangoHint) => {
  return Grid.setCell(grid, hint.position, hint.value)
}
