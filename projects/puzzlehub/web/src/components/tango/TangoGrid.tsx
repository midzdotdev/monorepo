import { Grid, type GridPosition, eqGridPosition } from '@/lib/grid'
import type { TangoConstraint, TangoValue } from '@/lib/tango/types'
import { cn } from '@/lib/utils'
import { Moon, SquareEqual, SquareX, Sun } from 'lucide-react'

export function TangoGrid(props: {
  grid: Grid<TangoValue>
  constraints: TangoConstraint[]
  lockedCells: GridPosition[]
  onCellClick: (position: GridPosition) => void
  onConstraintClick?: (constraint: TangoConstraint) => void
  cellHasViolations: (position: GridPosition) => boolean
  constraintStartCell?: GridPosition | undefined
  hintCell?: GridPosition | undefined
  className?: string
}) {
  return (
    <div
      className={cn('grid gap-2 aspect-square', props.className)}
      style={{
        gridTemplateRows: `repeat(${props.grid.length}, 1fr)`,
        gridTemplateColumns: `repeat(${props.grid[0].length}, 1fr)`,
      }}
    >
      {props.constraints.map((constraint) => (
        <div
          key={`${constraint.direction}-${constraint.row}-${constraint.col}`}
          style={{
            gridRow:
              constraint.direction === 'col'
                ? `${constraint.row + 1} / span 2`
                : constraint.row + 1,
            gridColumn:
              constraint.direction === 'row'
                ? `${constraint.col + 1} / span 2`
                : constraint.col + 1,
            zIndex: 10,
          }}
          className="relative grid pointer-events-none place-content-center @container-[size]"
        >
          <div
            className={cn(
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[min(40cqh,40cqw)] aspect-square text-primary transition',
              props.onConstraintClick &&
                'pointer-events-auto hover:text-primary/80'
            )}
          >
            {constraint.type === 'equal' && (
              <SquareEqual
                fill="hsl(var(--background))"
                className="cursor-pointer z-10"
                onClick={() => props.onConstraintClick?.(constraint)}
                size="100%"
              />
            )}
            {constraint.type === 'opposite' && (
              <SquareX
                fill="hsl(var(--background))"
                className="cursor-pointer z-10"
                onClick={() => props.onConstraintClick?.(constraint)}
                size="100%"
              />
            )}
          </div>
        </div>
      ))}

      {Grid.flatMap(props.grid, (cell, position) => {
        const isLocked = props.lockedCells.some((x) =>
          eqGridPosition(x, position)
        )

        const hasViolation = props.cellHasViolations(position)

        const isConstraintStartCell = props.constraintStartCell
          ? eqGridPosition(props.constraintStartCell, position)
          : false

        const isHintCell = props.hintCell
          ? eqGridPosition(props.hintCell, position)
          : false

        return (
          <button
            type="button"
            key={`${position.row}-${position.col}`}
            style={{
              gridRow: position.row + 1,
              gridColumn: position.col + 1,
            }}
            className={cn(
              'aspect-square border-2 box-content rounded-lg flex items-center justify-center hover:bg-accent/20 cursor-pointer transition-colors',
              cell === 0 ? 'border-border' : '',
              cell === 1 &&
                !hasViolation &&
                'border-yellow-400 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/15',
              cell === 2 &&
                !hasViolation &&
                'border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-500/15',
              hasViolation &&
                'border-destructive text-destructive hover:bg-destructive/10',
              isLocked && 'pointer-events-none border-border',
              isConstraintStartCell && 'ring-2 ring-green-500',
              isHintCell && 'ring-2 ring-blue-500 animate-pulse'
            )}
            onClick={() => props.onCellClick(position)}
            disabled={isLocked}
          >
            {cell === 1 && <Sun fill="currentColor" size="60%" />}
            {cell === 2 && <Moon fill="currentColor" size="60%" />}
          </button>
        )
      })}
    </div>
  )
}
