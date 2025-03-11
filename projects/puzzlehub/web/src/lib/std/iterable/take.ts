export function take<T>(iterable: Iterable<T>, n: number): T[] {
  const result: T[] = []
  for (const value of iterable) {
    result.push(value)
    if (result.length >= n) break
  }
  return result
}
