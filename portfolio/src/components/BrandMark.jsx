import React from 'react'
import { LOGO_HEIGHT, LOGO_SRC, LOGO_WIDTH } from '../site'

export default function BrandMark({ className = 'brand-mark', size = 220 }) {
  const height = Math.round(size * (LOGO_HEIGHT / LOGO_WIDTH))
  return (
    <img
      src={LOGO_SRC}
      alt="EntangleIT"
      width={size}
      height={height}
      className={className}
      decoding="async"
    />
  )
}
