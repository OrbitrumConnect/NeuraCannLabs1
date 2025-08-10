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
    todaySubmissions: 0
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
        ).length
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
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex items-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
          <i className="fas fa-user-shield text-white text-lg sm:text-2xl" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard Administrativo</h1>
          <p className="text-gray-400 text-sm sm:text-base">Validação e aprovação de estudos científicos</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-8">
        <Button
          onClick={() => setActiveTab('pending')}
          className={`mr-4 px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'pending' 
              ? 'bg-orange-600 text-white' 
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
              ? 'bg-orange-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          data-testid="button-approved-tab"
        >
          <i className="fas fa-check mr-2" />
          Aprovados ({submissions?.filter(s => s.status === 'approved').length || 0})
        </Button>
        <Button
          onClick={() => setActiveTab('rejected')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'rejected' 
              ? 'bg-orange-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          data-testid="button-rejected-tab"
        >
          <i className="fas fa-times mr-2" />
          Rejeitados ({submissions?.filter(s => s.status === 'rejected').length || 0})
        </Button>
      </div>

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
      </div>
    </div>
  );
}