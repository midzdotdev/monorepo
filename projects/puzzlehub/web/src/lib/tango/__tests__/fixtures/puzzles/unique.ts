import type { Grid } from '@/lib/grid'
import type { TangoPuzzle, TangoValue } from '@/lib/tango/types'

interface UniquePuzzleFixture extends TangoPuzzle {
  solution: Grid<TangoValue>
}

export const uniquePuzzles: UniquePuzzleFixture[] = [
  // {
  //   grid: [
  //     [2, 0, 0, 0, 0, 0],
  //     [1, 1, 0, 0, 0, 0],
  //     [1, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 2],
  //     [0, 0, 0, 0, 2, 1],
  //     [0, 0, 0, 0, 0, 1],
  //   ],
  //   constraints: [
  //     {
  //       row: 1,
  //       col: 2,
  //       direction: 'row',
  //       type: 'opposite',
  //     },
  //     {
  //       row: 1,
  //       col: 3,
  //       direction: 'row',
  //       type: 'opposite',
  //     },
  //     {
  //       row: 1,
  //       col: 4,
  //       direction: 'row',
  //       type: 'equal',
  //     },
  //     {
  //       row: 4,
  //       col: 0,
  //       direction: 'row',
  //       type: 'opposite',
  //     },
  //     {
  //       row: 4,
  //       col: 1,
  //       direction: 'row',
  //       type: 'opposite',
  //     },
  //     {
  //       row: 4,
  //       col: 2,
  //       direction: 'row',
  //       type: 'opposite',
  //     },
  //   ],
  // },
  // {
  //   grid: [
  //     [1, 0, 0, 0, 0, 1],
  //     [0, 1, 0, 0, 1, 0],
  //     [0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 0],
  //     [0, 2, 0, 0, 1, 0],
  //     [2, 0, 0, 0, 0, 1],
  //   ],
  //   constraints: [
  //     {
  //       row: 1,
  //       col: 2,
  //       direction: 'col',
  //       type: 'opposite',
  //     },
  //     {
  //       row: 1,
  //       col: 3,
  //       direction: 'col',
  //       type: 'equal',
  //     },
  //     {
  //       row: 2,
  //       col: 0,
  //       direction: 'col',
  //       type: 'equal',
  //     },
  //     {
  //       row: 2,
  //       col: 5,
  //       direction: 'col',
  //       type: 'opposite',
  //     },
  //     {
  //       row: 3,
  //       col: 2,
  //       direction: 'col',
  //       type: 'opposite',
  //     },
  //     {
  //       row: 3,
  //       col: 3,
  //       direction: 'col',
  //       type: 'equal',
  //     },
  //   ],
  // },
  {
    grid: [
      [0, 0, 2, 2, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ],
    constraints: [
      {
        row: 0,
        col: 0,
        direction: 'col',
        type: 'opposite',
      },
      {
        row: 0,
        col: 1,
        direction: 'col',
        type: 'opposite',
      },
      {
        row: 0,
        col: 4,
        direction: 'col',
        type: 'equal',
      },
      {
        row: 0,
        col: 5,
        direction: 'col',
        type: 'opposite',
      },
      {
        row: 1,
        col: 2,
        direction: 'col',
        type: 'opposite',
      },
      {
        row: 1,
        col: 3,
        direction: 'col',
        type: 'opposite',
      },
      {
        row: 2,
        col: 0,
        direction: 'row',
        type: 'equal',
      },
      {
        row: 2,
        col: 4,
        direction: 'row',
        type: 'equal',
      },
      {
        row: 3,
        col: 0,
        direction: 'row',
        type: 'equal',
      },
      {
        row: 3,
        col: 2,
        direction: 'col',
        type: 'opposite',
      },
      {
        row: 3,
        col: 3,
        direction: 'col',
        type: 'opposite',
      },
      {
        row: 3,
        col: 4,
        direction: 'row',
        type: 'equal',
      },
      {
        row: 4,
        col: 0,
        direction: 'col',
        type: 'equal',
      },
      {
        row: 4,
        col: 1,
        direction: 'col',
        type: 'equal',
      },
      {
        row: 4,
        col: 4,
        direction: 'col',
        type: 'opposite',
      },
      {
        row: 4,
        col: 5,
        direction: 'col',
        type: 'equal',
      },
      {
        row: 5,
        col: 2,
        direction: 'row',
        type: 'equal',
      },
    ],
    solution: [
      [1, 1, 2, 2, 1, 2],
      [2, 2, 1, 2, 1, 1],
      [1, 1, 2, 1, 2, 2],
      [1, 1, 2, 1, 2, 2],
      [2, 2, 1, 2, 1, 1],
      [2, 2, 1, 1, 2, 1],
    ],
  },
]
