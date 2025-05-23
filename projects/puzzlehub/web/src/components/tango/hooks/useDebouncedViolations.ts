import { usePrevious } from '@/hooks/usePrevious'
import type { TangoViolation } from '@/lib/tango/violations'
import { useDebounce } from '@uidotdev/usehooks'

const VIOLATIONS_DEBOUNCE_MS = 1000

export const useDebouncedViolations = (
  violations: TangoViolation[]
): TangoViolation[] => {
  const debouncedViolations = useDebounce(violations, VIOLATIONS_DEBOUNCE_MS)

  const previousViolations = usePrevious(
    violations,
    (a, b) => a !== null && a.length === b.length
  )

  if (!previousViolations) return violations

  const hasSatisfiedViolation = violations.length < previousViolations.length

  return hasSatisfiedViolation ? violations : debouncedViolations
}
