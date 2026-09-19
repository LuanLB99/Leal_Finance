import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, type PieLabelRenderProps } from 'recharts'
import { formatCurrency } from '../../lib/format'
import type { CategoryTotal } from '../../hooks/useDashboardMetrics'

interface Props {
  data: CategoryTotal[]
  height?: number
  compact?: boolean
}

const RADIAN = Math.PI / 180
const MINOR_SLICE_THRESHOLD = 0.05 // categorias com menos de 5% do total viram "Outros"
const OTHERS_COLOR = '#9CA3AF'

function groupMinorSlices(data: CategoryTotal[]): CategoryTotal[] {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  if (!total) return data

  const major = data.filter((d) => d.value / total >= MINOR_SLICE_THRESHOLD)
  const minor = data.filter((d) => d.value / total < MINOR_SLICE_THRESHOLD)
  if (minor.length <= 1) return data

  const othersValue = minor.reduce((sum, d) => sum + d.value, 0)
  return [...major, { categoryId: 'outros', name: 'Outros', color: OTHERS_COLOR, value: othersValue }]
}

export default function CategoryPieChart({ data, height = 220, compact = false }: Props) {
  const slices = groupMinorSlices(data)
  const total = slices.reduce((sum, d) => sum + d.value, 0)
  const fontSize = compact ? 10 : 11
  const outerRadius = height * (compact ? 0.24 : 0.28)
  const innerRadius = height * (compact ? 0.13 : 0.16)
  const labelOffset = compact ? 10 : 16

  function renderLabel(props: PieLabelRenderProps) {
    const cx = Number(props.cx) || 0
    const cy = Number(props.cy) || 0
    const midAngle = props.midAngle ?? 0
    const value = Number(props.value) || 0
    const name = String(props.name ?? '')
    const percent = total ? Math.round((value / total) * 100) : 0
    const radius = outerRadius + labelOffset
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    return (
      <text
        x={x}
        y={y}
        fill="#6b7280"
        fontSize={fontSize}
        fontWeight={600}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {name} · {percent}%
      </text>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <Pie
          data={slices}
          dataKey="value"
          nameKey="name"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          label={renderLabel}
          labelLine={{ stroke: '#D1D5DB' }}
        >
          {slices.map((entry) => (
            <Cell key={entry.categoryId} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => formatCurrency(Number(v))} />
      </PieChart>
    </ResponsiveContainer>
  )
}
