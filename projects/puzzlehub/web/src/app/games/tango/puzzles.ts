import { TangoPuzzle } from './types'

export const PUZZLES: TangoPuzzle[] = [
  {
    id: 1,
    name: 'Tango 1',
    grid: [
      [2, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 2],
      [0, 0, 0, 0, 2, 1],
      [0, 0, 0, 0, 0, 1],
    ],
    constraints: [
      {
        row: 1,
        col: 2,
        direction: 'row',
        type: 'opposite',
      },
      {
        row: 1,
        col: 3,
        direction: 'row',
        type: 'opposite',
      },
      {
        row: 1,
        col: 4,
        direction: 'row',
        type: 'equal',
      },
      {
        row: 4,
        col: 0,
        direction: 'row',
        type: 'opposite',
      },
      {
        row: 4,
        col: 1,
        direction: 'row',
        type: 'opposite',
      },
      {
        row: 4,
        col: 2,
        direction: 'row',
        type: 'opposite',
      },
    ],
  },
]
