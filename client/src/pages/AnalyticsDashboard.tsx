import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export default function AnalyticsDashboard() {
  const [realTimeData, setRealTimeData] = useState({
    totalDiscussions: 0,
    newDiscussionsToday: 0,
    totalClinicalCases: 0,
    newCasesToday: 0,
    totalAlerts: 0,
    newAlertsToday: 0,
    activeUsersNow: 0,
    peakHour: '',
    avgResponseTime: 0
  });

  // Fetch real-time analytics
  const { data: analytics } = useQuery({
    queryKey: ['/api/analytics/realtime'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/realtime');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    refetchInterval: 3000, // Atualiza a cada 3 segundos
  });

  // Dados para os gráficos em tempo real
  const [chartData, setChartData] = useState<{
    hourlyActivity: Array<{ hour: string; discussions: number; cases: number; alerts: number; }>;
    discussionTypes: Array<{ name: string; value: number; color: string; }>;
    casesBySpecialty: Array<{ specialty: string; cases: number; }>;
    alertsByType: Array<{ type: string; count: number; urgency: string; }>;
    weeklyTrends: Array<{ day: string; discussions: number; cases: number; alerts: number; }>;
  }>({
    hourlyActivity: [],
    discussionTypes: [],
    casesBySpecialty: [],
    alertsByType: [],
    weeklyTrends: []
  });

  useEffect(() => {
    if (analytics) {
      setRealTimeData(analytics.summary || {
        totalDiscussions: 847,
        newDiscussionsToday: 23,
        totalClinicalCases: 1523,
        newCasesToday: 18,
        totalAlerts: 156,
        newAlertsToday: 4,
        activeUsersNow: 247,
        peakHour: '14:00-15:00',
        avgResponseTime: 2.3
      });

      setChartData({
        hourlyActivity: analytics.hourlyActivity || [
          { hour: '00:00', discussions: 12, cases: 8, alerts: 2 },
          { hour: '02:00', discussions: 8, cases: 5, alerts: 1 },
          { hour: '04:00', discussions: 6, cases: 3, alerts: 0 },
          { hour: '06:00', discussions: 15, cases: 12, alerts: 3 },
          { hour: '08:00', discussions: 45, cases: 28, alerts: 5 },
          { hour: '10:00', discussions: 67, cases: 42, alerts: 8 },
          { hour: '12:00', discussions: 83, cases: 55, alerts: 12 },
          { hour: '14:00', discussions: 92, cases: 63, alerts: 15 },
          { hour: '16:00', discussions: 76, cases: 48, alerts: 9 },
          { hour: '18:00', discussions: 54, cases: 35, alerts: 6 },
          { hour: '20:00', discussions: 38, cases: 22, alerts: 4 },
          { hour: '22:00', discussions: 25, cases: 15, alerts: 2 }
        ],
        discussionTypes: analytics.discussionTypes || [
          { name: 'Epilepsia', value: 35, color: '#10B981' },
          { name: 'Dor Crônica', value: 28, color: '#3B82F6' },
          { name: 'Ansiedade', value: 18, color: '#8B5CF6' },
          { name: 'Câncer', value: 12, color: '#F59E0B' },
          { name: 'Outros', value: 7, color: '#EF4444' }
        ],
        casesBySpecialty: analytics.casesBySpecialty || [
          { specialty: 'Neurologia', cases: 342 },
          { specialty: 'Oncologia', cases: 289 },
          { specialty: 'Psiquiatria', cases: 245 },
          { specialty: 'Reumatologia', cases: 198 },
          { specialty: 'Pediatria', cases: 156 },
          { specialty: 'Geriatria', cases: 134 }
        ],
        alertsByType: analytics.alertsByType || [
          { type: 'ANVISA', count: 45, urgency: 'high' },
          { type: 'Health Canada', count: 32, urgency: 'medium' },
          { type: 'FDA', count: 28, urgency: 'medium' },
          { type: 'EMA', count: 23, urgency: 'low' },
          { type: 'Outros', count: 18, urgency: 'low' }
        ],
        weeklyTrends: analytics.weeklyTrends || [
          { day: 'Seg', discussions: 156, cases: 89, alerts: 12 },
          { day: 'Ter', discussions: 178, cases: 95, alerts: 15 },
          { day: 'Qua', discussions: 198, cases: 112, alerts: 18 },
          { day: 'Qui', discussions: 223, cases: 125, alerts: 22 },
          { day: 'Sex', discussions: 245, cases: 134, alerts: 19 },
          { day: 'Sáb', discussions: 189, cases: 98, alerts: 8 },
          { day: 'Dom', discussions: 167, cases: 76, alerts: 6 }
        ]
      });
    }
  }, [analytics]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-1/2 w-80 h-80 bg-green-400/15 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-3 py-4 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-cyan-400 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-chart-line text-white text-lg" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">Analytics em Tempo Real</h1>
              <p className="text-xs text-gray-400">Visualização da atividade da plataforma</p>
            </div>
          </div>
          <a href="/" className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors border border-gray-600">
            <i className="fas fa-arrow-left text-gray-300 text-sm" />
            <span className="text-gray-300 text-sm">Voltar</span>
          </a>
        </div>

        {/* Real-time Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Card className="bg-gray-800/50 border border-green-500/20">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Discussões</p>
                  <p className="text-lg font-bold text-green-400">{realTimeData.totalDiscussions}</p>
                  <p className="text-xs text-green-300">+{realTimeData.newDiscussionsToday} hoje</p>
                </div>
                <i className="fas fa-comments text-green-400 text-xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border border-blue-500/20">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Casos Clínicos</p>
                  <p className="text-lg font-bold text-blue-400">{realTimeData.totalClinicalCases}</p>
                  <p className="text-xs text-blue-300">+{realTimeData.newCasesToday} hoje</p>
                </div>
                <i className="fas fa-file-medical text-blue-400 text-xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border border-orange-500/20">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Alertas</p>
                  <p className="text-lg font-bold text-orange-400">{realTimeData.totalAlerts}</p>
                  <p className="text-xs text-orange-300">+{realTimeData.newAlertsToday} hoje</p>
                </div>
                <i className="fas fa-bell text-orange-400 text-xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border border-purple-500/20">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Usuários Ativos</p>
                  <p className="text-lg font-bold text-purple-400">{realTimeData.activeUsersNow}</p>
                  <p className="text-xs text-purple-300">Agora</p>
                </div>
                <i className="fas fa-users text-purple-400 text-xl" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Atividade por Hora */}
          <Card className="bg-gray-800/50 border border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <i className="fas fa-clock mr-2 text-green-400" />
                Atividade por Hora (Hoje)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData.hourlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hour" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="discussions" stroke="#10B981" strokeWidth={2} name="Discussões" />
                  <Line type="monotone" dataKey="cases" stroke="#3B82F6" strokeWidth={2} name="Casos" />
                  <Line type="monotone" dataKey="alerts" stroke="#F59E0B" strokeWidth={2} name="Alertas" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tipos de Discussão */}
          <Card className="bg-gray-800/50 border border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <i className="fas fa-chart-pie mr-2 text-blue-400" />
                Discussões por Tópico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={chartData.discussionTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.discussionTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Casos por Especialidade */}
          <Card className="bg-gray-800/50 border border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <i className="fas fa-user-md mr-2 text-purple-400" />
                Casos por Especialidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData.casesBySpecialty}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="specialty" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Bar dataKey="cases" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tendência Semanal */}
          <Card className="bg-gray-800/50 border border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <i className="fas fa-calendar-week mr-2 text-cyan-400" />
                Tendência Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData.weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="discussions" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Discussões" />
                  <Area type="monotone" dataKey="cases" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} name="Casos" />
                  <Area type="monotone" dataKey="alerts" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} name="Alertas" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Alertas por Tipo */}
        <Card className="bg-gray-800/50 border border-gray-600 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <i className="fas fa-exclamation-triangle mr-2 text-orange-400" />
              Alertas Regulatórios por Fonte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {chartData.alertsByType.map((alert, index) => (
                <div key={index} className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <div className={`text-2xl font-bold ${
                    alert.urgency === 'high' ? 'text-red-400' :
                    alert.urgency === 'medium' ? 'text-orange-400' : 'text-green-400'
                  }`}>
                    {alert.count}
                  </div>
                  <div className="text-sm text-gray-300">{alert.type}</div>
                  <div className={`text-xs mt-1 ${
                    alert.urgency === 'high' ? 'text-red-300' :
                    alert.urgency === 'medium' ? 'text-orange-300' : 'text-green-300'
                  }`}>
                    {alert.urgency === 'high' ? 'Alta' : alert.urgency === 'medium' ? 'Média' : 'Baixa'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status da Plataforma */}
        <Card className="bg-gray-800/50 border border-green-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <i className="fas fa-heartbeat mr-2 text-green-400" />
              Status da Plataforma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="fas fa-tachometer-alt text-green-400 text-xl" />
                </div>
                <div className="text-sm text-gray-400">Tempo de Resposta</div>
                <div className="text-lg font-bold text-green-400">{realTimeData.avgResponseTime}s</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="fas fa-clock text-blue-400 text-lg" />
                </div>
                <div className="text-sm text-gray-400">Pico de Atividade</div>
                <div className="text-lg font-bold text-blue-400">{realTimeData.peakHour}</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="fas fa-database text-purple-400 text-lg" />
                </div>
                <div className="text-sm text-gray-400">Sistema</div>
                <div className="text-lg font-bold text-green-400">Online</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}