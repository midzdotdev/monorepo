import { Grid } from '@/lib/Grid'
import { TangoValue } from './types'
import { Moon, SquareEqual, SquareX, Sun } from 'lucide-react'

export const makeEmptyGrid = (size: number): Grid<TangoValue> => {
  return Grid.filled(size, 0)
}

const valueToSymbol = {
  0: 'empty',
  1: '{sun}',
  2: '{moon}',
}

export const symbol = (value: TangoValue) => valueToSymbol[value]

export const formatText = (text: string) => {
  const parts = text.split(/({sun}|{moon}|{equal}|{opposite})/g)

  return (
    <>
      {parts.map((part, i) => {
        switch (part) {
          case '{sun}':
            return (
              <Sun
                key={i}
                className="inline text-yellow-500 align-text-top"
                fill="currentColor"
                size="1.25em"
              />
            )
          case '{moon}':
            return (
              <Moon
                key={i}
                className="inline text-blue-500 align-text-top"
                fill="currentColor"
                size="1.25em"
              />
            )
          case '{equal}':
            return (
              <SquareEqual
                key={i}
                className="inline text-gray-500 align-text-top"
                size="1.25em"
                fill="white"
              />
            )
          case '{opposite}':
            return (
              <SquareX
                key={i}
                className="inline text-gray-500 align-text-top"
                size="1.25em"
                fill="white"
              />
            )
          default:
            return part
        }
      })}
    </>
  )
}
