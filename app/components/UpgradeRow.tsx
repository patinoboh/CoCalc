export default function UpgradeRow({
  upgrade,
  now,
  player,
  onFinish,
  onDelete,
}: any) {
  const remaining = new Date(upgrade.end_time).getTime() - now

  return (
    <div style={{ border: "1px solid #000", marginBottom: 8, padding: 10, borderRadius: 6 }}>
      <b>{upgrade.title}</b> ({player?.name || "unknown"})

      <div>
        {upgrade.category} • {Math.max(0, Math.floor(remaining / 1000))}s left
      </div>

      <button onClick={() => onFinish(upgrade.id)}>Finish</button>
      <button onClick={() => onDelete(upgrade.id)}>Delete</button>
    </div>
  )
}