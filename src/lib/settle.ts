export type Transfer = { from: string; to: string; amount_cents: number }

// Given a map of memberId -> net balance in cents (positive means they should receive),
// produce a minimal set of transfers to settle all balances.
export function minimalCashFlow(nets: Record<string, number>): Transfer[] {
  const creditors: { id: string; amt: number }[] = []
  const debtors: { id: string; amt: number }[] = []
  for (const [id, v] of Object.entries(nets)) {
    if (Math.abs(v) <= 0) continue
    if (v > 0) creditors.push({ id, amt: v })
    else debtors.push({ id, amt: -v }) // store positive debt
  }
  creditors.sort((a, b) => b.amt - a.amt)
  debtors.sort((a, b) => b.amt - a.amt)
  const res: Transfer[] = []
  let ci = 0, di = 0
  while (ci < creditors.length && di < debtors.length) {
    const c = creditors[ci]
    const d = debtors[di]
    const amount = Math.min(c.amt, d.amt)
    if (amount > 0) {
      res.push({ from: d.id, to: c.id, amount_cents: Math.round(amount) })
      c.amt -= amount
      d.amt -= amount
    }
    if (c.amt <= 0.5) ci++
    if (d.amt <= 0.5) di++
  }
  return res
}

