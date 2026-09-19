import { useEffect, useRef, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { formatCurrency } from '../../lib/format'
import CategoryPieChart from './CategoryPieChart'
import OccurrenceList from '../OccurrenceList'
import type { CategoryTotal } from '../../hooks/useDashboardMetrics'
import type { Category, Occurrence, Period } from '../../types'

const PERIOD_LABELS: Record<Period, string> = { week: 'Semana', month: 'Mês', year: 'Ano' }
const SLIDE_COUNT = 3
const SWIPE_THRESHOLD_PX = 40

interface Props {
  period: Period
  onPeriodChange: (period: Period) => void
  balance: number
  byCategory: CategoryTotal[]
  upcoming: Occurrence[]
  categoryMap: Map<string, Category>
}

export default function HeroCard({ period, onPeriodChange, balance, byCategory, upcoming, categoryMap }: Props) {
  const [slide, setSlide] = useState(0)
  const [kebabOpen, setKebabOpen] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!kebabOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) setKebabOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [kebabOpen])

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > SWIPE_THRESHOLD_PX) {
      setSlide((s) => (dx < 0 ? (s + 1) % SLIDE_COUNT : (s + SLIDE_COUNT - 1) % SLIDE_COUNT))
    }
    touchStartX.current = null
  }

  return (
    <div className="hero-card" ref={cardRef} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <button className="hero-kebab" type="button" onClick={() => setKebabOpen((v) => !v)} title="Mudar período">
        <MoreVertical size={18} />
      </button>

      {kebabOpen && (
        <div className="hero-kebab-menu">
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
            <button
              key={p}
              type="button"
              className={p === period ? 'active' : ''}
              onClick={() => {
                onPeriodChange(p)
                setKebabOpen(false)
              }}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      )}

      {slide === 0 && (
        <div className="hero-slide">
          <p className="hero-eyebrow">Saldo · {PERIOD_LABELS[period].toLowerCase()}</p>
          <p className={`hero-value ${balance >= 0 ? 'positive' : 'negative'}`}>{formatCurrency(balance)}</p>
        </div>
      )}

      {slide === 1 && (
        <div className="hero-slide hero-slide-chart">
          <p className="hero-eyebrow">Gastos por categoria</p>
          {byCategory.length === 0 ? (
            <p className="empty-state">Nenhum gasto neste período.</p>
          ) : (
            <CategoryPieChart data={byCategory} height={140} compact />
          )}
        </div>
      )}

      {slide === 2 && (
        <div className="hero-slide">
          <p className="hero-eyebrow">Agendados / futuros</p>
          <OccurrenceList items={upcoming} categoryMap={categoryMap} emptyMessage="Nada agendado." limit={3} compact />
        </div>
      )}

      <div className="hero-dots">
        {Array.from({ length: SLIDE_COUNT }, (_, i) => (
          <button
            key={i}
            type="button"
            className={i === slide ? 'active' : ''}
            onClick={() => setSlide(i)}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
