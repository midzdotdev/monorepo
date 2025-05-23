'use client'

import { TangoGrid } from '@/components/tango/TangoGrid'
import { Button } from '@/components/ui/button'
import { Grid, type GridPosition, eqGridPosition } from '@/lib/grid'
import { type SolveResult, solve } from '@/lib/tango/solve'
import type { TangoConstraint, TangoValue } from '@/lib/tango/types'
import { listViolations } from '@/lib/tango/violations'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  CheckCircle2,
  CircleDashed,
  Delete,
  Moon,
  SquareEqual,
  SquareX,
  Sun,
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

export const runtime = 'edge'

export default function TangoDesigner() {
  const [grid, setGrid] = useState<Grid<TangoValue>>(Grid.filled(6, 0))
  const [constraints, setConstraints] = useState<TangoConstraint[]>([])

  const [mode, setMode] = useState<
    'sun' | 'moon' | 'equal' | 'opposite' | 'delete'
  >('sun')

  const [constraintStartCell, setConstraintStartCell] = useState<GridPosition>()

  const violations = useMemo(
    () => [...listViolations(grid, constraints)],
    [grid, constraints]
  )

  const solveResult = useMemo(
    () => solve(grid, constraints),
    [grid, constraints]
  )

  const checkCellViolations = useCallback(
    (pos: GridPosition) =>
      violations.some((v) => v.cells.some((c) => eqGridPosition(c, pos))),
    [violations]
  )

  const onCellClick = useCallback(
    (position: GridPosition) => {
      switch (mode) {
        case 'delete': {
          setGrid(Grid.setCell(grid, position, 0))

          return
        }

        case 'sun':
        case 'moon': {
          const valueToSet: TangoValue = mode === 'sun' ? 1 : 2

          setGrid(Grid.setCell(grid, position, valueToSet))

          return
        }

        case 'equal':
        case 'opposite': {
          // The first click defines the start cell

          if (!constraintStartCell) {
            setConstraintStartCell(position)

            return
          }

          // The second click defines the end cell

          const isAdjacent =
            (position.row === constraintStartCell.row &&
              Math.abs(position.col - constraintStartCell.col) === 1) ||
            (position.col === constraintStartCell.col &&
              Math.abs(position.row - constraintStartCell.row) === 1)

          // Ignore non-adjacent clicks
          if (!isAdjacent) {
            setConstraintStartCell(undefined)
            return
          }

          const direction =
            position.row === constraintStartCell.row ? 'row' : 'col'

          const constraint: TangoConstraint = {
            row: Math.min(position.row, constraintStartCell.row),
            col: Math.min(position.col, constraintStartCell.col),
            direction,
            type: mode === 'equal' ? 'equal' : 'opposite',
          }

          setConstraints([...constraints, constraint])

          setConstraintStartCell(undefined)

          return
        }
      }
    },
    [mode, constraintStartCell, grid, constraints]
  )

  const onConstraintClick = useCallback(
    (constraint: TangoConstraint) => {
      if (mode !== 'delete') {
        return
      }

      setConstraints(constraints.filter((c) => !eqGridPosition(c, constraint)))
    },
    [constraints, mode]
  )

  return (
    <div className="flex flex-col items-stretch gap-6 p-4 w-full max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-center">Tango Designer</h1>

      <div className="flex gap-4 items-stretch flex-wrap justify-between content-center">
        <DesignStatusIndicator
          solvability={solveResult.kind}
          className="flex-1 min-w-fit"
        />

        <Button
          disabled={violations.length > 0 || solveResult.kind !== 'unique'}
          className="flex-1"
          variant="cta"
        >
          Publish
        </Button>
      </div>

      <div className="flex flex-col w-full gap-4">
        <div className="grid w-full justify-stretch grid-flow-col-dense border rounded-lg overflow-hidden">
          {(
            [
              {
                id: 'sun',
                title: 'Place sun',
                icon: Sun,
              },
              {
                id: 'moon',
                title: 'Place moon',
                icon: Moon,
              },
              {
                id: 'equal',
                title: 'Add equal constraint',
                icon: SquareEqual,
              },
              {
                id: 'opposite',
                title: 'Add opposite constraint',
                icon: SquareX,
              },
              {
                id: 'delete',
                title: 'Delete cell',
                icon: Delete,
              },
            ] as const
          ).map(({ id, title, icon: IconNode }) => (
            <Button
              key={id}
              variant={id === mode ? 'default' : 'ghost'}
              onClick={() => setMode(id)}
              title={title}
              className="p-0 flex-1"
            >
              <IconNode />
            </Button>
          ))}
        </div>

        <div className="flex justify-center">
          <TangoGrid
            className="w-full"
            grid={grid}
            constraints={constraints}
            lockedCells={[]}
            onCellClick={onCellClick}
            onConstraintClick={onConstraintClick}
            cellHasViolations={checkCellViolations}
            constraintStartCell={constraintStartCell}
          />
        </div>
      </div>

      <div className="flex gap-4 justify-stretch">
        <Button
          onClick={() => setGrid(Grid.filled(6, 0))}
          variant="outline"
          className="flex-1"
        >
          Clear Cells
        </Button>
        <Button
          onClick={() => setConstraints([])}
          variant="outline"
          className="flex-1"
        >
          Clear Constraints
        </Button>
      </div>
    </div>
  )
}

const statusIndicatorVariants = {
  impossible: {
    text: 'No solution',
    className: 'bg-red-500/15 text-red-500',
    icon: AlertCircle,
  },
  unique: {
    text: 'Solution is unique',
    className: 'bg-green-500/15 text-green-500',
    icon: CheckCircle2,
  },
  multiple: {
    text: 'Solution not unique',
    className: 'bg-yellow-500/15 text-yellow-500',
    icon: CircleDashed,
  },
}

const DesignStatusIndicator = (props: {
  solvability: SolveResult['kind']
  className?: string
}) => {
  const variant = statusIndicatorVariants[props.solvability]

  return (
    <div
      className={cn(
        'flex justify-center items-center gap-2 px-3 py-1 rounded-md',
        variant.className,
        props.className
      )}
    >
      <variant.icon size="100%" className="w-4 flex-none" />
      <span className="font-medium min-w-fit">{variant.text}</span>
    </div>
  )
}
