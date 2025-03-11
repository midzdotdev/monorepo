import { getLineCellPosition } from '@/lib/grid'

export const linePositions = (
  direction: 'row' | 'col',
  lineIndex: number,
  fromCell: number,
  toCell: number
) =>
  Array.from({ length: 1 + toCell - fromCell }, (_, i) =>
    getLineCellPosition({ direction, lineIndex }, fromCell + i)
  )
