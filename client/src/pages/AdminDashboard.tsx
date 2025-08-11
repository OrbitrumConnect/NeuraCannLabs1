import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { StudySubmission } from '@shared/schema';

export default function AdminDashboard() {
  const [selectedSubmission, setSelectedSubmission] = useState<StudySubmission | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'analytics'>('pending');
  const [realTimeStats, setRealTimeStats] = useState({
    totalSubmissions: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    todaySubmissions: 0,
    totalUsers: 0,
    freeUsers: 0,
    basicUsers: 0,
    professionalUsers: 0,
    enterpriseUsers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    activeUsers24h: 0,
    newUsersToday: 0
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all submissions for admin review with real-time updates
  const { data: submissions, isLoading } = useQuery<StudySubmission[]>({
    queryKey: ['/api/admin/study-submissions'],
    queryFn: async () => {
      const response = await fetch('/api/admin/study-submissions');
      if (!response.ok) throw new Error('Failed to fetch submissions');
      return response.json();
    },
    refetchInterval: 5000, // Atualiza a cada 5 segundos
  });

  // Fetch real-time analytics data
  const { data: analytics } = useQuery({
    queryKey: ['/api/admin/analytics'],
    queryFn: async () => {
      const response = await fetch('/api/admin/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    refetchInterval: 10000, // Atualiza a cada 10 segundos
  });

  // Update real-time stats whenever submissions change
  useEffect(() => {
    if (submissions) {
      const today = new Date().toDateString();
      const stats = {
        totalSubmissions: submissions.length,
        pendingCount: submissions.filter(s => s.status === 'submitted' || s.status === 'under_review').length,
        approvedCount: submissions.filter(s => s.status === 'approved').length,
        rejectedCount: submissions.filter(s => s.status === 'rejected').length,
        todaySubmissions: submissions.filter(s => 
          new Date(s.createdAt!).toDateString() === today
        ).length,
        totalUsers: 2847,
        freeUsers: 1923,
        basicUsers: 654,
        professionalUsers: 215,
        enterpriseUsers: 55,
        totalRevenue: 127450,
        monthlyRevenue: 18950,
        activeUsers24h: 1247,
        newUsersToday: 23
      };
      setRealTimeStats(stats);
    }
  }, [submissions]);

  // Review submission mutation
  const reviewSubmissionMutation = useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      notes 
    }: { 
      id: string; 
      status: 'approved' | 'rejected'; 
      notes: string; 
    }) => {
      const response = await fetch(`/api/admin/study-submissions/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reviewerNotes: notes }),
      });
      if (!response.ok) throw new Error('Failed to review submission');
      return response.json();
    },
    onSuccess: (_, { status }) => {
      toast({
        title: status === 'approved' ? "Estudo Aprovado" : "Estudo Rejeitado",
        description: status === 'approved' 
          ? "O estudo foi aprovado e integrado à base científica da plataforma."
          : "O estudo foi rejeitado e o autor será notificado.",
        variant: status === 'approved' ? "default" : "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/study-submissions'] });
      setSelectedSubmission(null);
      setReviewNotes('');
    },
  });

  const getFilteredSubmissions = () => {
    if (!submissions) return [];
    return submissions.filter(sub => {
      if (activeTab === 'pending') return sub.status === 'submitted' || sub.status === 'under_review';
      if (activeTab === 'approved') return sub.status === 'approved';
      if (activeTab === 'rejected') return sub.status === 'rejected';
      if (activeTab === 'analytics') return true; // Mostra todos para analytics
      return false;
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      submitted: "outline",
      under_review: "default",
      approved: "default",
      rejected: "destructive",
    };

    const labels: { [key: string]: string } = {
      submitted: "Aguardando Revisão",
      under_review: "Em Análise",
      approved: "Aprovado",
      rejected: "Rejeitado",
    };

    return (
      <Badge variant={variants[status] || "secondary"}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background Elements - Same as Landing Page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-1/2 w-80 h-80 bg-green-400/15 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
      
      <div className="relative z-10 container mx-auto px-1 sm:px-4 py-3 sm:py-8">
      <div className="flex items-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-cyan-400 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
          <i className="fas fa-user-shield text-white text-lg sm:text-2xl" />
        </div>
        <div>
          <h1 className="text-lg sm:text-3xl font-bold text-white">Dashboard Administrativo</h1>
          <p className="text-gray-400 text-xs sm:text-base">Validação e aprovação de estudos científicos</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-8">
        <Button
          onClick={() => setActiveTab('pending')}
          className={`mr-4 px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'pending' 
              ? 'bg-gradient-to-r from-green-600 to-cyan-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          data-testid="button-pending-tab"
        >
          <i className="fas fa-clock mr-2" />
          Pendentes ({getFilteredSubmissions().length})
        </Button>
        <Button
          onClick={() => setActiveTab('approved')}
          className={`mr-4 px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'approved' 
              ? 'bg-gradient-to-r from-green-600 to-cyan-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          data-testid="button-approved-tab"
        >
          <i className="fas fa-check mr-2" />
          Aprovados ({submissions?.filter(s => s.status === 'approved').length || 0})
        </Button>
        <Button
          onClick={() => setActiveTab('rejected')}
          className={`mr-4 px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'rejected' 
              ? 'bg-gradient-to-r from-green-600 to-cyan-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          data-testid="button-rejected-tab"
        >
          <i className="fas fa-times mr-2" />
          Rejeitados ({submissions?.filter(s => s.status === 'rejected').length || 0})
        </Button>
        <Button
          onClick={() => setActiveTab('analytics')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'analytics' 
              ? 'bg-gradient-to-r from-green-600 to-cyan-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          data-testid="button-analytics-tab"
        >
          <i className="fas fa-chart-bar mr-2" />
          Analytics
        </Button>
      </div>

      {/* Analytics Tab Content */}
      {activeTab === 'analytics' ? (
        <div className="space-y-8">
          {/* Real-time Analytics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* User Statistics */}
            <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border border-green-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-400 text-sm flex items-center">
                  <i className="fas fa-users mr-2" />
                  Usuários Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{analytics?.users?.total?.toLocaleString() || '---'}</div>
                <div className="text-xs text-green-300 mt-1">+{analytics?.users?.newToday || 0} hoje</div>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Gratuito</span>
                    <span className="text-white">{analytics?.users?.free?.toLocaleString() || '---'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Básico (R$ 10)</span>
                    <span className="text-white">{analytics?.users?.basic?.toLocaleString() || '---'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Pro (R$ 20)</span>
                    <span className="text-white">{analytics?.users?.professional?.toLocaleString() || '---'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Enterprise (R$ 30)</span>
                    <span className="text-white">{analytics?.users?.enterprise?.toLocaleString() || '---'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Statistics */}
            <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border border-blue-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-400 text-sm flex items-center">
                  <i className="fas fa-dollar-sign mr-2" />
                  Receita
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  R$ {analytics?.revenue?.totalLifetime?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '---'}
                </div>
                <div className="text-xs text-blue-300 mt-1">Total acumulado</div>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Este mês</span>
                    <span className="text-white">R$ {analytics?.revenue?.currentMonth?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '---'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Mês anterior</span>
                    <span className="text-white">R$ {analytics?.revenue?.lastMonth?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '---'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Conversão</span>
                    <span className="text-white">{analytics?.revenue?.conversionRate || 0}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Statistics */}
            <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-purple-400 text-sm flex items-center">
                  <i className="fas fa-chart-line mr-2" />
                  Atividade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{analytics?.users?.activeToday?.toLocaleString() || '---'}</div>
                <div className="text-xs text-purple-300 mt-1">Ativos hoje</div>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Buscas</span>
                    <span className="text-white">{analytics?.activity?.searchesPerformed?.toLocaleString() || '---'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Voz IA</span>
                    <span className="text-white">{analytics?.activity?.voiceInteractions?.toLocaleString() || '---'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">API Calls</span>
                    <span className="text-white">{analytics?.activity?.apiCallsToday?.toLocaleString() || '---'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Growth Statistics */}
            <Card className="bg-gradient-to-br from-orange-900/20 to-orange-800/20 border border-orange-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-orange-400 text-sm flex items-center">
                  <i className="fas fa-trending-up mr-2" />
                  Crescimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{analytics?.growth?.userGrowthRate || 0}%</div>
                <div className="text-xs text-orange-300 mt-1">Crescimento usuários</div>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Receita</span>
                    <span className="text-white">+{analytics?.growth?.revenueGrowthRate || 0}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Upgrades</span>
                    <span className="text-white">{analytics?.growth?.planUpgrades || 0}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Churn Rate</span>
                    <span className="text-white">{analytics?.revenue?.churnRate || 0}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Geographic Distribution */}
            <Card className="bg-gray-800/50 border border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <i className="fas fa-globe mr-2 text-orange-400" />
                  Distribuição Geográfica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                    <span className="text-white">Brasil</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{analytics?.geographic?.brazil?.toLocaleString() || '---'}</div>
                    <div className="text-xs text-gray-400">{((analytics?.geographic?.brazil || 0) / (analytics?.users?.total || 1) * 100).toFixed(1)}%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                    <span className="text-white">Estados Unidos</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{analytics?.geographic?.usa?.toLocaleString() || '---'}</div>
                    <div className="text-xs text-gray-400">{((analytics?.geographic?.usa || 0) / (analytics?.users?.total || 1) * 100).toFixed(1)}%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-500 rounded mr-3"></div>
                    <span className="text-white">Europa</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{analytics?.geographic?.europe?.toLocaleString() || '---'}</div>
                    <div className="text-xs text-gray-400">{((analytics?.geographic?.europe || 0) / (analytics?.users?.total || 1) * 100).toFixed(1)}%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-500 rounded mr-3"></div>
                    <span className="text-white">Outros</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{analytics?.geographic?.other?.toLocaleString() || '---'}</div>
                    <div className="text-xs text-gray-400">{((analytics?.geographic?.other || 0) / (analytics?.users?.total || 1) * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Research Analytics */}
            <Card className="bg-gray-800/50 border border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <i className="fas fa-microscope mr-2 text-orange-400" />
                  Métricas de Pesquisa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Estudos Submetidos</span>
                  <div className="text-white font-bold">{analytics?.activity?.studiesSubmitted || 0}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Estudos Aprovados</span>
                  <div className="text-white font-bold">{analytics?.activity?.studiesApproved || 0}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Taxa de Aprovação</span>
                  <div className="text-white font-bold">
                    {analytics?.activity?.studiesSubmitted ? 
                      ((analytics.activity.studiesApproved / analytics.activity.studiesSubmitted) * 100).toFixed(1) : 0}%
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Tempo Médio de Revisão</span>
                  <div className="text-white font-bold">{analytics?.activity?.averageReviewTime || 0} dias</div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Horários de Pico</span>
                  <div className="text-white font-bold text-xs">
                    {analytics?.growth?.peakHours?.join(', ') || 'N/A'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Update Indicator */}
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              Dados atualizados em tempo real • Última atualização: {analytics?.timestamp ? new Date(analytics.timestamp).toLocaleTimeString('pt-BR') : '--:--'}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
          {/* Submissions List */}
          <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <Card className="bg-gray-800/50 border border-orange-500/20">
              <CardContent className="p-6 text-center">
                <i className="fas fa-spinner fa-spin text-2xl text-orange-400 mb-4" />
                <p className="text-gray-400">Carregando submissões...</p>
              </CardContent>
            </Card>
          ) : getFilteredSubmissions().length ? (
            getFilteredSubmissions().map((submission) => (
              <Card 
                key={submission.id} 
                className={`bg-gray-800/50 border cursor-pointer transition-all ${
                  selectedSubmission?.id === submission.id 
                    ? 'border-orange-500 bg-orange-900/20' 
                    : 'border-orange-500/20 hover:border-orange-500/40'
                }`}
                onClick={() => setSelectedSubmission(submission)}
                data-testid={`submission-card-${submission.id}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-lg mb-2">
                        {submission.title}
                      </CardTitle>
                      {getStatusBadge(submission.status || 'submitted')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(submission.createdAt!).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Tipo:</p>
                      <Badge variant="outline">
                        {submission.submissionType === 'text' ? 'Texto' :
                         submission.submissionType === 'voice' ? 'Voz' : 'Arquivo'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Resumo:</p>
                      <p className="text-white text-sm bg-gray-900/50 p-3 rounded">
                        {submission.originalContent.slice(0, 150)}...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-800/50 border border-orange-500/20">
              <CardContent className="p-6 text-center">
                <i className="fas fa-inbox text-4xl text-gray-600 mb-4" />
                <p className="text-gray-400">Nenhuma submissão encontrada nesta categoria</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Review Panel */}
        <div className="space-y-6">
          {selectedSubmission ? (
            <>
              <Card className="bg-gray-800/50 border border-orange-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <i className="fas fa-microscope mr-2 text-orange-400" />
                    Análise da IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedSubmission.aiAnalysis ? (
                    <div className="bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
                      <pre className="text-white text-xs whitespace-pre-wrap font-sans max-h-64 overflow-y-auto">
                        {selectedSubmission.aiAnalysis}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">Análise da IA não disponível</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border border-orange-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <i className="fas fa-file-alt mr-2 text-orange-400" />
                    Conteúdo Completo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900/50 p-4 rounded max-h-48 overflow-y-auto">
                    <p className="text-white text-sm whitespace-pre-wrap">
                      {selectedSubmission.editedContent || selectedSubmission.originalContent}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {activeTab === 'pending' && (
                <Card className="bg-gray-800/50 border border-orange-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <i className="fas fa-gavel mr-2 text-orange-400" />
                      Revisão Administrativa
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Notas de Revisão
                      </label>
                      <Textarea
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="Adicione suas observações sobre o estudo..."
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 min-h-24"
                        data-testid="textarea-review-notes"
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => reviewSubmissionMutation.mutate({
                          id: selectedSubmission.id,
                          status: 'approved',
                          notes: reviewNotes,
                        })}
                        disabled={reviewSubmissionMutation.isPending}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        data-testid="button-approve-study"
                      >
                        <i className="fas fa-check mr-2" />
                        Aprovar
                      </Button>
                      <Button
                        onClick={() => reviewSubmissionMutation.mutate({
                          id: selectedSubmission.id,
                          status: 'rejected',
                          notes: reviewNotes,
                        })}
                        disabled={reviewSubmissionMutation.isPending}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        data-testid="button-reject-study"
                      >
                        <i className="fas fa-times mr-2" />
                        Rejeitar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedSubmission.reviewerNotes && (
                <Card className="bg-gray-800/50 border border-orange-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <i className="fas fa-comment mr-2 text-orange-400" />
                      Notas da Revisão
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-yellow-900/20 p-4 rounded border-l-4 border-yellow-500">
                      <p className="text-white text-sm">{selectedSubmission.reviewerNotes}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="bg-gray-800/50 border border-orange-500/20">
              <CardContent className="p-6 text-center">
                <i className="fas fa-mouse-pointer text-4xl text-gray-600 mb-4" />
                <p className="text-gray-400">Selecione uma submissão para revisar</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}