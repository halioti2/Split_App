import { describe, it, expect } from 'vitest'
import { minimalCashFlow } from './settle'

describe('minimalCashFlow', () => {
  it('equal split simple', () => {
    // A paid 3000, B and C owe 1500 each
    const nets = { A: 3000 - 0, B: -1500, C: -1500 }
    const t = minimalCashFlow(nets)
    expect(t).toEqual([
      { from: 'B', to: 'A', amount_cents: 1500 },
      { from: 'C', to: 'A', amount_cents: 1500 },
    ])
  })

  it('subset participation', () => {
    const nets = { A: 2000, B: -2000, C: 0 }
    const t = minimalCashFlow(nets)
    expect(t).toEqual([{ from: 'B', to: 'A', amount_cents: 2000 }])
  })

  it('multiple creditors/debtors', () => {
    const nets = { A: 500, B: 1500, C: -700, D: -1300 }
    const t = minimalCashFlow(nets)
    // one possible minimal solution
    expect(t).toEqual([
      { from: 'D', to: 'B', amount_cents: 1300 },
      { from: 'C', to: 'B', amount_cents: 200 },
      { from: 'C', to: 'A', amount_cents: 500 },
    ])
  })
})

