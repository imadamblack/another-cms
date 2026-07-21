'use client'

import { useEffect } from 'react'
import scrollDepth from '@/utils/scrollDepth'
import fbEvent from '@/services/fbEvents'

export default function ScrollDepthTracker() {
  useEffect(() => {
    return scrollDepth({
      values: [25, 50, 75, 100],
      callback: (value) => fbEvent(`Scroll Depth: ${value}`),
    })
  }, [])

  return null
}
