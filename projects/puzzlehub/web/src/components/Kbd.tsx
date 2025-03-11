import React from 'react'

export function Kbd({ children }: React.PropsWithChildren) {
  return (
    <kbd className="rounded-md bg-muted px-1 py-0.5 font-mono text-sm font-medium text-muted-foreground">
      {children}
    </kbd>
  )
}
