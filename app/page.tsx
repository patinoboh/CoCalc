"use client"

import { useEffect, useState } from "react"

type Upgrade = {
  id: string
  title: string
  endTime: number
  category: "hero" | "building" | "lab" | "pet"
}

function formatTime(ms: number) {
  if (ms <= 0) return "Done"

  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  return `${days}d ${hours}h ${minutes}m`
}

export default function Home() {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const upgrades: Upgrade[] = [
    {
      id: "1",
      title: "Barbarian King 91 → 92",
      category: "hero",
      endTime: Date.now() + 1000 * 60 * 60 * 26,
    },
    {
      id: "2",
      title: "Laboratory Electro Dragon",
      category: "lab",
      endTime: Date.now() + 1000 * 60 * 60 * 5,
    },
    {
      id: "3",
      title: "Archer Tower",
      category: "building",
      endTime: Date.now() + 1000 * 60 * 60 * 72,
    },
  ]

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>
        CoC Upgrade Tracker
      </h1>

      <p style={{ opacity: 0.6, marginBottom: 20 }}>
        Active upgrades
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {upgrades.map((u) => {
          const remaining = u.endTime - now

          return (
            <div
              key={u.id}
              style={{
                padding: 12,
                border: "1px solid #ddd",
                borderRadius: 8,
              }}
            >
              <div style={{ fontWeight: 600 }}>{u.title}</div>

              <div style={{ fontSize: 14, opacity: 0.7 }}>
                {u.category} • {formatTime(remaining)}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}