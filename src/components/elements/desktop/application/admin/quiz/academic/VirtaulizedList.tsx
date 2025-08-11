"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

interface VirtualizedListOptimizedProps {
  numberOfItems: number
  itemHeight?: number
  overscan?: number
  className?: string
  renderRow: (index: number) => React.ReactNode
}

export function VirtualizedListOptimized({
  numberOfItems,
  itemHeight = 80,
  overscan = 10,
  className,
  renderRow,
}: VirtualizedListOptimizedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(400)

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight)
      }
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  const startIndex = useMemo(() => Math.max(0, Math.floor(scrollTop / itemHeight) - overscan), [scrollTop, itemHeight, overscan])

  const renderedNodesCount = useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 2 * overscan
    return Math.min(numberOfItems - startIndex, visibleCount)
  }, [containerHeight, itemHeight, overscan, numberOfItems, startIndex])

  const rows = useMemo(() => {
    const items: React.ReactNode[] = []
    for (let i = 0; i < renderedNodesCount; i += 1) {
      const index = i + startIndex
      items.push(
        <div key={index} style={{ height: `${itemHeight}px` }}>
          {renderRow(index)}
        </div>,
      )
    }
    return items
  }, [renderedNodesCount, startIndex, itemHeight, renderRow])

  return (
    <div ref={containerRef} className={className} onScroll={onScroll} style={{ overflowY: "auto" }}>
      <div style={{ height: numberOfItems * itemHeight }}>
        <div style={{ transform: `translateY(${startIndex * itemHeight}px)` }}>{rows}</div>
      </div>
    </div>
  )
}
