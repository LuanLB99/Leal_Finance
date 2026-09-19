import { useEffect, useRef, useState } from 'react'
import { PERIOD_LABEL_PLURAL, PERIOD_LABEL_QUANTIFIER, PERIOD_LABEL_SINGULAR } from '../../lib/periodLabels'
import type { Period } from '../../types'

const MIN_PERIODS_AHEAD = 3
const MAX_PERIODS_AHEAD = 12

interface Props {
  period: Period
  periodsAhead: number
  onPeriodChange: (period: Period) => void
  onPeriodsAheadChange: (periodsAhead: number) => void
  /** No desktop o tipo de período já tem seus próprios botões visíveis; aqui só ajustamos a quantidade. */
  showPeriodOptions?: boolean
  triggerLabel?: string
}

export default function ProjectionEditMenu({
  period,
  periodsAhead,
  onPeriodChange,
  onPeriodsAheadChange,
  showPeriodOptions = true,
  triggerLabel = 'editar ▾',
}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function clampAndSet(value: number) {
    onPeriodsAheadChange(Math.min(MAX_PERIODS_AHEAD, Math.max(MIN_PERIODS_AHEAD, value)))
  }

  return (
    <div className="projection-edit" ref={ref}>
      <button type="button" className="projection-edit-trigger" onClick={() => setOpen((v) => !v)}>
        {triggerLabel}
      </button>

      {open && (
        <div className="projection-edit-menu">
          {showPeriodOptions && (
            <div className="projection-edit-section">
              <span className="projection-edit-label">Agrupar por</span>
              <div className="type-toggle">
                {(Object.keys(PERIOD_LABEL_SINGULAR) as Period[]).map((p) => (
                  <button key={p} type="button" className={p === period ? 'active' : ''} onClick={() => onPeriodChange(p)}>
                    {PERIOD_LABEL_SINGULAR[p]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="projection-edit-section">
            <span className="projection-edit-label">
              {PERIOD_LABEL_QUANTIFIER[period]} {PERIOD_LABEL_PLURAL[period]} à frente
            </span>
            <div className="projection-stepper">
              <button type="button" onClick={() => clampAndSet(periodsAhead - 1)} disabled={periodsAhead <= MIN_PERIODS_AHEAD}>
                −
              </button>
              <span>{periodsAhead}</span>
              <button type="button" onClick={() => clampAndSet(periodsAhead + 1)} disabled={periodsAhead >= MAX_PERIODS_AHEAD}>
                +
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
