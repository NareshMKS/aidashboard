import { useQuery } from '@tanstack/react-query'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { BarChart3 } from 'lucide-react'
import { fetchCryptoPrice } from '@/api/crypto'
import { GlassCard } from '@/components/GlassCard'
import { useTasks } from '@/hooks/useTasks'

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']

export function AnalyticsSection() {
  const { tasks, stats } = useTasks()

  const cryptoQuery = useQuery({
    queryKey: ['crypto-analytics'],
    queryFn: () => fetchCryptoPrice(['bitcoin', 'ethereum', 'solana', 'cardano']),
    staleTime: 5 * 60 * 1000,
  })

  const taskPieData = [
    { name: 'Completed', value: stats.completed },
    { name: 'Pending', value: stats.pending },
  ].filter((d) => d.value > 0)

  const weeklyData = buildWeeklyCompletionData(tasks)

  const marketTrendData =
    cryptoQuery.data?.map((coin) => ({
      name: coin.symbol,
      price: coin.price,
      change: coin.change24h,
    })) ?? []

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold">Analytics</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <GlassCard title="Productivity Rate" gradient>
          <div className="flex items-center gap-4">
            <div className="relative h-32 w-32 shrink-0" style={{ minWidth: 128, minHeight: 128 }}>
              <ResponsiveContainer width={128} height={128}>
                <PieChart>
                  <Pie
                    data={taskPieData.length ? taskPieData : [{ name: 'No tasks', value: 1 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {(taskPieData.length ? taskPieData : [{ name: 'No tasks', value: 1 }]).map(
                      (_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ),
                    )}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{stats.completionRate}%</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Total:</span>{' '}
                <span className="font-semibold">{stats.total}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Completed:</span>{' '}
                <span className="font-semibold text-emerald-400">{stats.completed}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Pending:</span>{' '}
                <span className="font-semibold text-amber-400">{stats.pending}</span>
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Task Activity (7 days)" gradient>
          <div className="h-40 w-full" style={{ minHeight: 160 }}>
            <ResponsiveContainer width="100%" height={160} minWidth={0}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(222 47% 9%)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="created" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Created" />
                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Market Trends (24h)" gradient>
          <div className="h-40 w-full" style={{ minHeight: 160 }}>
            {marketTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={160} minWidth={0}>
                <LineChart data={marketTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(222 47% 9%)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Loading market data...
              </p>
            )}
          </div>
        </GlassCard>
      </div>
    </section>
  )
}

function buildWeeklyCompletionData(tasks: { createdAt: string; completedAt?: string }[]) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const result = days.map((day) => ({ day, created: 0, completed: 0 }))

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  for (const task of tasks) {
    const created = new Date(task.createdAt)
    if (created >= weekAgo) {
      result[created.getDay()].created++
    }
    if (task.completedAt) {
      const completed = new Date(task.completedAt)
      if (completed >= weekAgo) {
        result[completed.getDay()].completed++
      }
    }
  }

  return result
}
