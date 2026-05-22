"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function AddUpgradeForm({
  players,
  onCreated,
}: any) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("building")
  const [villageType, setVillageType] = useState("home")
  const [hours, setHours] = useState(1)
  const [playerId, setPlayerId] = useState("")

  const [loading, setLoading] = useState(false)

  async function add() {
    if (!title.trim()) return
    if (!players?.length) return

    setLoading(true)

    const now = new Date()
    const end = new Date(now.getTime() + hours * 3600 * 1000)

    const { data, error } = await supabase.from("upgrades").insert({
      title,
      category,
      village_type: villageType,
      player_id: playerId || players[0].id,
      start_time: now.toISOString(),
      end_time: end.toISOString(),
      status: "active",
    }).select()

    setLoading(false)

    if (error) {
      console.error("Insert error:", error)
      alert("Failed to add upgrade (check console)")
      return
    }

    console.log("Inserted:", data)

    setTitle("")
    setHours(1)

    onCreated?.()
  }

  return (
    <div style={{ marginBottom: 30 }}>
      <h3>Add Upgrade</h3>

      <input
        placeholder="title (e.g. Archer Queen)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div style={{ marginTop: 8 }}>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="building">building</option>
          <option value="hero">hero</option>
          <option value="lab">lab</option>
          <option value="pet">pet</option>
        </select>

        <select
          value={villageType}
          onChange={(e) => setVillageType(e.target.value)}
        >
          <option value="home">home</option>
          <option value="builder">builder</option>
        </select>
      </div>

      <div style={{ marginTop: 8 }}>
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          placeholder="hours"
        />
      </div>

      <div style={{ marginTop: 8 }}>
        <select value={playerId} onChange={(e) => setPlayerId(e.target.value)}>
          <option value="">default player</option>
          {players.map((p: any) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={add}
        disabled={loading}
        style={{ marginTop: 10 }}
      >
        {loading ? "Adding..." : "Add Upgrade"}
      </button>
    </div>
  )
}