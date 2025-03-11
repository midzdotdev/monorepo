import { TangoValue } from '../types'

export type LineCellValue<TValue extends TangoValue = TangoValue> = {
  cellIndex: number
  value: TValue
}
