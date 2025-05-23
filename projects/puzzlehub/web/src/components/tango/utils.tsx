import { Moon, SquareEqual, SquareX, Sun } from 'lucide-react'

const templates: Record<string, React.ReactNode> = {
  '{sun}': (
    <Sun
      className="inline text-yellow-500 align-text-top"
      fill="currentColor"
      size="1.25em"
    />
  ),
  '{moon}': (
    <Moon
      className="inline text-blue-500 align-text-top"
      fill="currentColor"
      size="1.25em"
    />
  ),
  '{equal}': (
    <SquareEqual
      className="inline text-gray-500 align-text-top"
      size="1.25em"
      fill="white"
    />
  ),
  '{opposite}': (
    <SquareX
      className="inline text-gray-500 align-text-top"
      size="1.25em"
      fill="white"
    />
  ),
}

export const formatText = (text: string) => {
  const parts = text.split(/({sun}|{moon}|{equal}|{opposite})/g)

  return <>{parts.map((part) => templates[part] ?? part)}</>
}
