"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { User } from "@supabase/supabase-js"

import TopBar from "./components/TopBar"
import AddUpgradeForm from "./components/AddUpgradeForm"
import UpgradeTable from "./components/UpgradeTable"

type Player = {
  id: string
  name: string
  coc_tag?: string
}

type Upgrade = {
  id: string
  title: string
  category: string
  end_time: string
  player_id: string
  village_type: string
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)

  const [players, setPlayers] = useState<Player[]>([])
  const [upgrades, setUpgrades] = useState<Upgrade[]>([])

  const [mergeView, setMergeView] = useState(true)
  const [selectedPlayer, setSelectedPlayer] = useState<string>("")

  const [now, setNow] = useState(Date.now())

  // ---------------- AUTH ----------------
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })

    const t = setInterval(() => setNow(Date.now()), 1000)

    return () => {
      sub.subscription.unsubscribe()
      clearInterval(t)
    }
  }, [])

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    if (!user) return
    fetchPlayers()
    fetchUpgrades()
  }, [user])

  async function fetchPlayers() {
    const { data } = await supabase.from("players").select("*")
    setPlayers(data || [])
  }

  async function fetchUpgrades() {
    const { data } = await supabase
      .from("upgrades")
      .select("*")
      .eq("status", "active")
      .order("end_time", { ascending: true })

    setUpgrades(data || [])
  }

  // ---------------- ACTIONS ----------------
  async function finishUpgrade(id: string) {
    await supabase.from("upgrades").update({
      status: "done",
    }).eq("id", id)

    fetchUpgrades()
  }

  async function deleteUpgrade(id: string) {
    await supabase.from("upgrades").delete().eq("id", id)
    fetchUpgrades()
  }

  if (!user) return <div style={{ padding: 20 }}>Loading login...</div>

  return (
    <main style={{ padding: 20, maxWidth: 1000, margin: "0 auto", border: "2px solid #000" }}>
      <TopBar
        user={user}
        players={players}
        mergeView={mergeView}
        setMergeView={setMergeView}
        selectedPlayer={selectedPlayer}
        setSelectedPlayer={setSelectedPlayer}
      />

      <AddUpgradeForm
        players={players}
        onCreated={fetchUpgrades}
      />

      <h2>HOME VILLAGE</h2>
      <UpgradeTable
        upgrades={upgrades}
        now={now}
        villageType="home"
        mergeView={mergeView}
        selectedPlayer={selectedPlayer}
        players={players}
        onFinish={finishUpgrade}
        onDelete={deleteUpgrade}
      />

      <h2 style={{ marginTop: 40 }}>BUILDER BASE</h2>
      <UpgradeTable
        upgrades={upgrades}
        now={now}
        villageType="builder"
        mergeView={mergeView}
        selectedPlayer={selectedPlayer}
        players={players}
        onFinish={finishUpgrade}
        onDelete={deleteUpgrade}
      />
    </main>
  )
}