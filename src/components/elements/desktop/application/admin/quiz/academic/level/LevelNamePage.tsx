"use client"
import React from 'react'
import { useLevelName } from '@/lib/hooks/params/useLevelName'
function LevelNamePage() {
  const levelName = useLevelName()
  return (
    <div>
        <h1>Level Name Page</h1>
        <p>{levelName}</p>
    </div>
  )
}

export default LevelNamePage

