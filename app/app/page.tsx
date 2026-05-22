export default function Home() {
  const upgrades = [
    { name: "Barbarian King 91 → 92", remaining: "2d 4h" },
    { name: "Laboratory Electro Dragon", remaining: "10h" },
  ]

  return (
    <main style={{ padding: 20 }}>
      <h1>CoC Upgrades</h1>

      <ul>
        {upgrades.map((u, i) => (
          <li key={i}>
            <b>{u.name}</b> — {u.remaining}
          </li>
        ))}
      </ul>
    </main>
  )
}
