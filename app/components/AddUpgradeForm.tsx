"use client"

import { supabase } from "@/lib/supabaseClient"

export default function TopBar({
  user,
  players,
  mergeView,
  setMergeView,
  selectedPlayer,
  setSelectedPlayer,
}: any) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
      <button onClick={() => supabase.auth.signOut()}>
        Logout
      </button>

      <button onClick={() => setMergeView(!mergeView)}>
        {mergeView ? "Merge ON" : "Separated"}
      </button>

      <select
        value={selectedPlayer}
        onChange={(e) => setSelectedPlayer(e.target.value)}
      >
        <option value="">All players</option>
        {players.map((p: any) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  )
}