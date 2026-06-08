import { Line, LineChart, ResponsiveContainer } from 'recharts'

interface MiniSparklineProps {
  data: number[]
  positive: boolean
}

export function MiniSparkline({ data, positive }: MiniSparklineProps) {
  if (data.length < 2) return null

  const chartData = data.map((v, i) => ({ i, v }))

  return (
    <div className="h-8 w-16 shrink-0" style={{ minWidth: 64, minHeight: 32 }}>
      <ResponsiveContainer width={64} height={32}>
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={positive ? '#34d399' : '#f87171'}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
