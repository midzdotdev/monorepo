export function* entries<T>(iterable: Iterable<T>): Iterable<[number, T]> {
  let i = 0

  for (const x of iterable) {
    yield [i, x]
    i++
  }
}
