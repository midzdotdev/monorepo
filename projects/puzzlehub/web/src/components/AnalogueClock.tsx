export const AnimatedClock = (
  props: {
    seconds: number
  } & React.ComponentProps<'svg'>
) => {
  const seconds = props.seconds % 60
  const minutes = Math.floor(seconds / 60)

  const longHandAngle = (seconds / 60) * Math.PI * 2
  const shortHandAngle = (minutes / 60) * Math.PI * 2

  return (
    <svg
      width={24}
      height={24}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10"></circle>

      <line
        x1="12"
        y1="12"
        x2={12 + Math.sin(longHandAngle) * 6}
        y2={12 - Math.cos(longHandAngle) * 6}
      />

      <line
        x1="12"
        y1="12"
        x2={12 + Math.sin(shortHandAngle) * 4}
        y2={12 - Math.cos(shortHandAngle) * 4}
      />
    </svg>
  )
}
