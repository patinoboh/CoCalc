"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { User } from "@supabase/supabase-js"

type Player = {
  id: string
  name: string
}

type Upgrade = {
  id: string
  title: string
  category: string
  end_time: string
  player_id?: string
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
  const [user, setUser] = useState<User | null>(null)

  const [players, setPlayers] = useState<Player[]>([])
  const [upgrades, setUpgrades] = useState<Upgrade[]>([])
  const [now, setNow] = useState(Date.now())

  const [email, setEmail] = useState("")
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("building")
  const [hours, setHours] = useState(24)

  // ----------------------------
  // AUTH INIT
  // ----------------------------
  useEffect(() => {
    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => {
      subscription.unsubscribe()
      clearInterval(interval)
    }
  }, [])

  // ----------------------------
  // LOAD DATA WHEN USER EXISTS
  // ----------------------------
  useEffect(() => {
    if (user) {
      fetchPlayers()
      fetchUpgrades()
    }
  }, [user])

  // ----------------------------
  // AUTH HELPERS
  // ----------------------------
  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    setUser(user)
  }

  async function signIn() {
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    })

    alert("Check your email for login link")
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  // ----------------------------
  // DATA FETCH
  // ----------------------------
  async function fetchPlayers() {
    const { data, error } = await supabase
      .from("players")
      .select("*")

    if (error) {
      console.error(error)
      return
    }

    setPlayers(data || [])
  }

  async function fetchUpgrades() {
    const { data, error } = await supabase
      .from("upgrades")
      .select("*")
      .eq("status", "active")
      .not("player_id", "is", null)
      .order("end_time", { ascending: true })

    if (error) {
      console.error(error)
      return
    }

    setUpgrades(data || [])
  }

  // ----------------------------
  // ADD UPGRADE
  // ----------------------------
  async function addUpgrade() {
    if (!user) return
    if (!title.trim()) return

    const nowDate = new Date()
    const end = new Date(nowDate.getTime() + hours * 60 * 60 * 1000)

    const defaultPlayer = players[0]

    const { error } = await supabase.from("upgrades").insert({
      user_id: user.id,
      player_id: defaultPlayer?.id,

      title,
      category,

      start_time: nowDate.toISOString(),
      end_time: end.toISOString(),

      status: "active",
    })

    if (error) {
      console.error(error)
      return
    }

    setTitle("")
    setHours(24)

    fetchUpgrades()
  }

  // ----------------------------
  // LOGIN SCREEN
  // ----------------------------
  if (!user) {
    return (
      <main style={{ padding: 24, maxWidth: 400, margin: "0 auto" }}>
        <h1>Login</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 16,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={signIn}
          style={{
            marginTop: 12,
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Send Magic Link PATINO JE BOSSS
        </button>
      </main>
    )
  }

  // ----------------------------
  // MAIN APP
  // ----------------------------
  return (
    <main style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>CoC Upgrade Tracker</h1>
        <button onClick={signOut}>Logout</button>
      </div>

      {/* ADD UPGRADE */}
      <div style={{ marginTop: 24, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        <h2>Add Upgrade</h2>

        <input
          placeholder="Upgrade title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc", width: "100%" }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ marginTop: 10, padding: 10, borderRadius: 8 }}
        >
          <option value="building">Building</option>
          <option value="hero">Hero</option>
          <option value="lab">Laboratory</option>
          <option value="pet">Pet</option>
        </select>

        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          style={{ marginTop: 10, padding: 10, borderRadius: 8, width: "100%" }}
        />

        <button
          onClick={addUpgrade}
          style={{
            marginTop: 10,
            padding: 12,
            borderRadius: 8,
            border: "none",
            fontWeight: 600,
          }}
        >
          Add Upgrade
        </button>
      </div>

      {/* LIST */}
      <div style={{ marginTop: 32 }}>
        {upgrades.length === 0 && (
          <p style={{ opacity: 0.6 }}>No upgrades yet</p>
        )}

        {upgrades.map((u) => {
          const remaining = new Date(u.end_time).getTime() - now

          return (
            <div
              key={u.id}
              style={{
                border: "1px solid #ddd",
                padding: 14,
                borderRadius: 12,
                marginTop: 10,
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