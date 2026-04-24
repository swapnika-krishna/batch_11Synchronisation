import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { motion } from 'motion/react';
import { TrendingUp, Zap, Shield, Users } from 'lucide-react';

const performanceData = [
  { name: 'Mutex', throughput: 95, waitTime: 10, overhead: 5, fairness: 70 },
  { name: 'Peterson', throughput: 98, waitTime: 8, overhead: 2, fairness: 95 },
  { name: 'Semaphore', throughput: 90, waitTime: 15, overhead: 8, fairness: 75 },
  { name: 'Prod-Cons', throughput: 85, waitTime: 20, overhead: 12, fairness: 80 },
  { name: 'Dining', throughput: 70, waitTime: 35, overhead: 25, fairness: 60 },
  { name: 'Readers-Writers', throughput: 88, waitTime: 18, overhead: 15, fairness: 85 },
];

const radarData = [
  { subject: 'Throughput', Mutex: 95, Peterson: 98, Semaphore: 90, fullMark: 100 },
  { subject: 'Wait Time (Inv)', Mutex: 90, Peterson: 92, Semaphore: 85, fullMark: 100 },
  { subject: 'Overhead (Inv)', Mutex: 95, Peterson: 98, Semaphore: 92, fullMark: 100 },
  { subject: 'Fairness', Mutex: 70, Peterson: 95, Semaphore: 75, fullMark: 100 },
  { subject: 'Scalability', Mutex: 85, Peterson: 40, Semaphore: 95, fullMark: 100 },
];

export function Analytics() {
  return (
    <div className="space-y-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Highest Throughput", value: "Peterson's", icon: Zap, color: "text-yellow-500" },
          { label: "Best Scalability", value: "Semaphore", icon: Users, color: "text-blue-500" },
          { label: "Lowest Overhead", value: "Mutex", icon: TrendingUp, color: "text-green-500" },
          { label: "Most Secure", value: "Monitor", icon: Shield, color: "text-purple-500" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border p-6 rounded-2xl shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Throughput vs Wait Time */}
        <div className="bg-card border border-border p-8 rounded-3xl shadow-sm">
          <h3 className="text-xl font-bold mb-8">Performance Metrics Comparison</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }}
                  cursor={{ fill: 'var(--accent)', opacity: 0.4 }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar name="Throughput" dataKey="throughput" fill="#FBC3C1" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar name="Wait Time" dataKey="waitTime" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart for Multi-dimensional Comparison */}
        <div className="bg-card border border-border p-8 rounded-3xl shadow-sm">
          <h3 className="text-xl font-bold mb-8">Algorithm Characteristics</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="currentColor" opacity={0.1} />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Mutex" dataKey="Mutex" stroke="#FBC3C1" fill="#FBC3C1" fillOpacity={0.5} />
                <Radar name="Peterson" dataKey="Peterson" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                <Radar name="Semaphore" dataKey="Semaphore" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Overhead Trend */}
        <div className="bg-card border border-border p-8 rounded-3xl shadow-sm lg:col-span-2">
          <h3 className="text-xl font-bold mb-8">Complexity & Overhead Analysis</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="overhead" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6, fill: "#8b5cf6" }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="fairness" stroke="#FBC3C1" strokeWidth={3} dot={{ r: 6, fill: "#FBC3C1" }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 p-6 bg-secondary/50 rounded-2xl border border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-bold text-foreground">Analysis:</span> Peterson's algorithm shows the lowest overhead but suffers from poor scalability as it is limited to two processes. Semaphores provide the best balance for multi-process systems, while Mutexes are ideal for simple mutual exclusion with minimal resource consumption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
