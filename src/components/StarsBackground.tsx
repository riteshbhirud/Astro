'use client'

import { useEffect, useState } from 'react'

interface Star {
  id: number
  left: number
  top: number
  size: number
  animationDelay: number
}

export default function StarsBackground() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    const generatedStars: Star[] = []
    for (let i = 0; i < 100; i++) {
      generatedStars.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 1,
        animationDelay: Math.random() * 3,
      })
    }
    setStars(generatedStars)
  }, [])

  return (
    <div className="stars-bg">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.animationDelay}s`,
          }}
        />
      ))}
    </div>
  )
}
