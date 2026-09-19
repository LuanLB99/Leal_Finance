import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { formatCurrency } from '../../lib/format'
import type { CategoryTotal } from '../../hooks/useDashboardMetrics'

interface Props {
  data: CategoryTotal[]
  height?: number
  showLegend?: boolean
}

export default function CategoryPieChart({ data, height = 220, showLegend = false }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={height * 0.22} outerRadius={height * 0.36}>
          {data.map((entry) => (
            <Cell key={entry.categoryId} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => formatCurrency(Number(v))} />
        {showLegend && <Legend />}
      </PieChart>
    </ResponsiveContainer>
  )
}
