import { useEffect, useState } from 'react'

function WaitingIconAnimated() {
  const [secondHandEndPoint, setSecondHandEndPoint] = useState({
    x2: 0.67,
    y2: 0.25,
  })
  const [minuteHandEndPoint, setMinuteHandEndPoint] = useState({
    x2: 0.67,
    y2: 0.33,
  })

  useEffect(() => {
    const updateHands = () => {
      const time = new Date()

      const seconds = time.getSeconds() + time.getMilliseconds() / 1000

      const secondAngle = 50 * seconds * (Math.PI / 180)
      const secondLength = 7 / 24
      const secondX2 = 0.5 + secondLength * Math.sin(secondAngle)
      const secondY2 = 0.5 - secondLength * Math.cos(secondAngle)

      const minuteAngle = 15 * ((seconds + 15) % 60) * (Math.PI / 180)
      const minuteLength = 5 / 24
      const minuteX2 = 0.5 + minuteLength * Math.sin(minuteAngle)
      const minuteY2 = 0.5 - minuteLength * Math.cos(minuteAngle)

      setSecondHandEndPoint({ x2: secondX2, y2: secondY2 })
      setMinuteHandEndPoint({ x2: minuteX2, y2: minuteY2 })
    }

    updateHands()
    const intervalId = setInterval(updateHands, 50)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1em 1em' width='1em' height='1em'>
      <circle cx='0.5em' cy='0.5em' r='0.42em' stroke='#006BD6' strokeWidth='0.08em' fill='none' />
      <line
        x1='0.5em'
        y1='0.5em'
        x2={`${minuteHandEndPoint.x2}em`}
        y2={`${minuteHandEndPoint.y2}em`}
        stroke='#006BD6'
        strokeWidth='0.08em'
        strokeLinecap='round'
      />
      <line
        x1='0.5em'
        y1='0.5em'
        x2={`${secondHandEndPoint.x2}em`}
        y2={`${secondHandEndPoint.y2}em`}
        stroke='#006BD6'
        strokeWidth='0.08em'
        strokeLinecap='round'
      />
    </svg>
  )
}

export default WaitingIconAnimated
