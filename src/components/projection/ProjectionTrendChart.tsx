import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { formatCurrency } from '../../lib/format'
import type { ProjectionPoint } from '../../lib/projection'

interface Props {
  points: ProjectionPoint[]
  height?: number
}

export default function ProjectionTrendChart({ points, height = 90 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
        <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#8A8A82' }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(v) => formatCurrency(Number(v))} labelStyle={{ fontWeight: 600 }} />
        <Line
          type="monotone"
          dataKey="cumulativeBalance"
          stroke="#0F766E"
          strokeWidth={3}
          dot={{ r: 3, fill: '#0F766E', strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
