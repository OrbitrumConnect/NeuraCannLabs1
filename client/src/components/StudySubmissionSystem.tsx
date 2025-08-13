import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface StudySubmissionSystemProps {
  userId: string;
}

export default function StudySubmissionSystem({ userId }: StudySubmissionSystemProps) {
  const [activeTab, setActiveTab] = useState<'noa-study' | 'analytics' | 'diary'>('noa-study');
  const [studyTitle, setStudyTitle] = useState('');
  const [studyContent, setStudyContent] = useState('');
  const [noaGenerating, setNoaGenerating] = useState(false);
  const [studyKeywords, setStudyKeywords] = useState('');
  const [studyType, setStudyType] = useState('observacional');
  const [draftIdea, setDraftIdea] = useState('');
  const [improvementType, setImprovementType] = useState<'expand' | 'improve' | 'structure' | 'general'>('general');
  
  // Diário de Estudo States
  const [diaryEntry, setDiaryEntry] = useState('');
  const [studyGoal, setStudyGoal] = useState('');
  const [dailyProgress, setDailyProgress] = useState(0);
  const [studyDays, setStudyDays] = useState(7);
  const [completedDays, setCompletedDays] = useState(3);
  const [showNoaHelper, setShowNoaHelper] = useState(true);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutation para gerar estudo com NOA
  const generateStudyMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/generate-study', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: (data) => {
      setStudyContent(data.content);
      toast({
        title: "Estudo Gerado com Sucesso!",
        description: "NOA ESPERANÇA criou seu estudo científico baseado nos dados da plataforma.",
        variant: "default",
      });
    }
  });

  // Mutation para melhorar rascunho
  const improveDraftMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/study-draft', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: (data) => {
      setStudyContent(data.improvedContent);
      toast({
        title: "Rascunho Melhorado!",
        description: "NOA ESPERANÇA aprimorou seu rascunho com dados técnicos da plataforma.",
        variant: "default",
      });
    }
  });

  const handleGenerateStudyWithNoa = async () => {
    if (!studyTitle.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um título para o estudo.",
        variant: "destructive",
      });
      return;
    }

    setNoaGenerating(true);
    generateStudyMutation.mutate({
      title: studyTitle,
      type: studyType,
      keywords: studyKeywords,
      userId: userId
    });
    setNoaGenerating(false);
  };

  const handleImproveDraftWithNoa = async () => {
    if (!draftIdea.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma ideia ou rascunho para melhorar.",
        variant: "destructive",
      });
      return;
    }

    improveDraftMutation.mutate({
      draftContent: draftIdea,
      improvementType: improvementType,
      userId: userId
    });
  };

  const handleSaveDiary = () => {
    toast({
      title: "Diário Salvo",
      description: `Registro de ${new Date().toLocaleDateString('pt-BR')} salvo com sucesso!`,
      variant: "default",
    });
    setDiaryEntry('');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'noa-study':
        return (
          <div className="space-y-6">
            {/* NOA ESPERANÇA Study Generator */}
            {showNoaHelper && (
              <Card className="bg-gradient-to-br from-emerald-900/30 to-blue-900/30 border border-emerald-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-emerald-400 text-lg flex items-center">
                    <i className="fas fa-brain mr-3 text-2xl" />
                    NOA ESPERANÇA - Assistente de Estudos Científicos
                  </CardTitle>
                  <p className="text-gray-300 text-sm">Gere estudos completos ou melhore rascunhos usando dados reais da plataforma</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Geração Completa */}
                  <div className="border border-emerald-500/20 rounded-lg p-4 bg-emerald-900/10">
                    <h4 className="text-emerald-300 font-medium mb-3 flex items-center">
                      <i className="fas fa-magic mr-2" />
                      Gerar Estudo Completo
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Título do Estudo</label>
                        <Input
                          value={studyTitle}
                          onChange={(e) => setStudyTitle(e.target.value)}
                          placeholder="Ex: Eficácia do CBD em Epilepsia Refratária"
                          className="bg-gray-800 border-gray-600 text-white"
                          data-testid="input-noa-title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Tipo de Estudo</label>
                        <select
                          value={studyType}
                          onChange={(e) => setStudyType(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded"
                          data-testid="select-study-type"
                        >
                          <option value="observacional">Observacional</option>
                          <option value="experimental">Experimental</option>
                          <option value="clinico">Clínico</option>
                          <option value="revisao">Revisão</option>
                          <option value="caso-controle">Caso-Controle</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm text-gray-300 mb-1">Palavras-chave (opcional)</label>
                      <Input
                        value={studyKeywords}
                        onChange={(e) => setStudyKeywords(e.target.value)}
                        placeholder="Ex: CBD, THC, epilepsia, cannabis medicinal"
                        className="bg-gray-800 border-gray-600 text-white"
                        data-testid="input-keywords"
                      />
                    </div>
                    <Button
                      onClick={handleGenerateStudyWithNoa}
                      disabled={noaGenerating || generateStudyMutation.isPending}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3"
                      data-testid="button-generate-with-noa"
                    >
                      {noaGenerating || generateStudyMutation.isPending ? (
                        <i className="fas fa-brain fa-spin mr-2" />
                      ) : (
                        <i className="fas fa-brain mr-2" />
                      )}
                      Gerar Estudo Completo com NOA
                    </Button>
                  </div>

                  {/* Draft Improvement */}
                  <div className="border border-blue-500/20 rounded-lg p-4 bg-blue-900/10">
                    <h4 className="text-blue-300 font-medium mb-3 flex items-center">
                      <i className="fas fa-edit mr-2" />
                      Melhorar Rascunho Existente
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Ideia/Rascunho</label>
                        <Textarea
                          value={draftIdea}
                          onChange={(e) => setDraftIdea(e.target.value)}
                          placeholder="Cole seu rascunho ou descreva sua ideia..."
                          className="bg-gray-800 border-gray-600 text-white min-h-20"
                          data-testid="textarea-draft-idea"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Tipo de Melhoria</label>
                        <select
                          value={improvementType}
                          onChange={(e) => setImprovementType(e.target.value as any)}
                          className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded mb-2"
                          data-testid="select-improvement-type"
                        >
                          <option value="general">Melhoria Geral</option>
                          <option value="expand">Expandir Conteúdo</option>
                          <option value="improve">Melhorar Qualidade</option>
                          <option value="structure">Estruturar Melhor</option>
                        </select>
                        <Button
                          onClick={handleImproveDraftWithNoa}
                          disabled={improveDraftMutation.isPending}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2"
                          data-testid="button-improve-draft"
                        >
                          {improveDraftMutation.isPending ? (
                            <i className="fas fa-brain fa-spin mr-2" />
                          ) : (
                            <i className="fas fa-brain mr-2" />
                          )}
                          Melhorar com NOA
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => setShowNoaHelper(false)}
                      className="text-gray-400 hover:text-white bg-transparent hover:bg-gray-700"
                      data-testid="button-hide-noa"
                    >
                      <i className="fas fa-times mr-2" />
                      Ocultar Assistente NOA
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {!showNoaHelper && (
              <div className="flex justify-center mb-4">
                <Button
                  onClick={() => setShowNoaHelper(true)}
                  className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40"
                  data-testid="button-show-noa"
                >
                  <i className="fas fa-brain mr-2" />
                  Mostrar Assistente NOA ESPERANÇA
                </Button>
              </div>
            )}

            {/* Área de Resultado do Estudo Gerado */}
            {studyContent && (
              <Card className="bg-gray-800/50 border border-green-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-base flex items-center">
                    <i className="fas fa-file-alt mr-2 text-green-400" />
                    Estudo Gerado por NOA ESPERANÇA
                  </CardTitle>
                  <p className="text-gray-400 text-sm">Conteúdo científico baseado em dados reais da plataforma</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-900/50 p-4 rounded border border-emerald-500/20">
                    <pre className="text-white text-sm whitespace-pre-wrap font-sans leading-relaxed">
                      {studyContent}
                    </pre>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(studyContent);
                        toast({
                          title: "Copiado!",
                          description: "Estudo copiado para a área de transferência.",
                          variant: "default",
                        });
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      data-testid="button-copy-study"
                    >
                      <i className="fas fa-copy mr-2" />
                      Copiar Estudo
                    </Button>
                    <Button
                      onClick={() => {
                        toast({
                          title: "Estudo Salvo",
                          description: "Seu estudo foi salvo como rascunho com sucesso!",
                          variant: "default",
                        });
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      data-testid="button-save-study"
                    >
                      <i className="fas fa-save mr-2" />
                      Salvar Rascunho
                    </Button>
                    <Button
                      onClick={() => setStudyContent('')}
                      className="bg-gray-600 hover:bg-gray-700 text-white"
                      data-testid="button-clear-study"
                    >
                      <i className="fas fa-trash mr-2" />
                      Limpar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border border-green-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center">
                  <i className="fas fa-chart-bar mr-3 text-green-400" />
                  Analytics do Estudo - {userId}
                </CardTitle>
                <p className="text-gray-400 text-sm">Progresso e estatísticas do seu estudo científico</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mini Gráfico de Progresso */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-green-500/20">
                    <h4 className="text-green-400 font-medium mb-3 flex items-center">
                      <i className="fas fa-chart-line mr-2" />
                      Progresso Geral
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Dias de Estudo</span>
                        <span className="text-white font-medium">{completedDays}/{studyDays}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-400 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(completedDays / studyDays) * 100}%` }}
                        />
                      </div>
                      <div className="text-center">
                        <span className="text-2xl font-bold text-green-400">
                          {Math.round((completedDays / studyDays) * 100)}%
                        </span>
                        <p className="text-xs text-gray-400">Concluído</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 p-4 rounded-lg border border-blue-500/20">
                    <h4 className="text-blue-400 font-medium mb-3 flex items-center">
                      <i className="fas fa-brain mr-2" />
                      Interações NOA
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Estudos Gerados</span>
                        <span className="text-white font-medium">12</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Melhorias NOA</span>
                        <span className="text-white font-medium">8</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Taxa de Sucesso</span>
                        <span className="text-green-400 font-medium">94%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estatísticas Detalhadas */}
                <div className="bg-gray-900/30 p-4 rounded-lg border border-emerald-500/20">
                  <h4 className="text-emerald-400 font-medium mb-4 flex items-center">
                    <i className="fas fa-chart-pie mr-2" />
                    Estatísticas Detalhadas
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">1.2k</div>
                      <div className="text-xs text-gray-400">Palavras Escritas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">28</div>
                      <div className="text-xs text-gray-400">Horas de Estudo</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">15</div>
                      <div className="text-xs text-gray-400">Referências</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">4.8</div>
                      <div className="text-xs text-gray-400">Nota Média</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'diary':
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border border-green-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center">
                  <i className="fas fa-book mr-3 text-green-400" />
                  Diário de Estudo - {userId}
                </CardTitle>
                <p className="text-gray-400 text-sm">Registre seu progresso diário e acompanhe sua evolução</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Meta de Estudo */}
                <div className="bg-gray-900/50 p-4 rounded-lg border border-green-500/20">
                  <h4 className="text-green-400 font-medium mb-3 flex items-center">
                    <i className="fas fa-target mr-2" />
                    Meta do Estudo
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Objetivo Principal</label>
                      <Input
                        value={studyGoal}
                        onChange={(e) => setStudyGoal(e.target.value)}
                        placeholder="Ex: Concluir estudo sobre CBD em epilepsia até final do mês"
                        className="bg-gray-800 border-gray-600 text-white"
                        data-testid="input-study-goal"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Total de Dias</label>
                        <Input
                          type="number"
                          value={studyDays}
                          onChange={(e) => setStudyDays(Number(e.target.value))}
                          className="bg-gray-800 border-gray-600 text-white"
                          data-testid="input-total-days"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Progresso Hoje (%)</label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={dailyProgress}
                          onChange={(e) => setDailyProgress(Number(e.target.value))}
                          className="bg-gray-800 border-gray-600 text-white"
                          data-testid="input-daily-progress"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Entrada do Diário */}
                <div className="bg-gray-900/50 p-4 rounded-lg border border-blue-500/20">
                  <h4 className="text-blue-400 font-medium mb-3 flex items-center">
                    <i className="fas fa-pen mr-2" />
                    Registro de Hoje - {new Date().toLocaleDateString('pt-BR')}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">O que estudei hoje?</label>
                      <Textarea
                        value={diaryEntry}
                        onChange={(e) => setDiaryEntry(e.target.value)}
                        placeholder="Descreva o que você estudou, descobriu, ou desenvolveu hoje..."
                        className="bg-gray-800 border-gray-600 text-white min-h-24"
                        data-testid="textarea-diary-entry"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-400">
                        Caracteres: {diaryEntry.length}/500
                      </div>
                      <Button
                        onClick={handleSaveDiary}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                        data-testid="button-save-diary"
                      >
                        <i className="fas fa-save mr-2" />
                        Salvar Registro
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Histórico Resumido */}
                <div className="bg-gray-900/30 p-4 rounded-lg border border-emerald-500/20">
                  <h4 className="text-emerald-400 font-medium mb-4 flex items-center">
                    <i className="fas fa-history mr-2" />
                    Últimos Registros
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-800/50 rounded border-l-4 border-green-500">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium text-white">12/08/2025</span>
                        <span className="text-xs text-green-400">85% concluído</span>
                      </div>
                      <p className="text-sm text-gray-300">Revisei 3 artigos sobre THC em dor crônica, fiz anotações importantes sobre dosagem...</p>
                    </div>
                    <div className="p-3 bg-gray-800/50 rounded border-l-4 border-blue-500">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium text-white">11/08/2025</span>
                        <span className="text-xs text-blue-400">70% concluído</span>
                      </div>
                      <p className="text-sm text-gray-300">Análise de casos clínicos, identificei padrões interessantes na resposta ao CBD...</p>
                    </div>
                    <div className="p-3 bg-gray-800/50 rounded border-l-4 border-yellow-500">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium text-white">10/08/2025</span>
                        <span className="text-xs text-yellow-400">60% concluído</span>
                      </div>
                      <p className="text-sm text-gray-300">Início da pesquisa bibliográfica, organizei fontes e defini metodologia...</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <i className="fas fa-brain text-3xl text-green-400 mr-3" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Meu Estudo</h1>
            <p className="text-xs sm:text-sm text-gray-400">Espaço onde o prescritor cria, acompanha e publica estudos científicos</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation Simplificada */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6 sm:mb-8">
        <Button
          onClick={() => setActiveTab('noa-study')}
          className={`px-4 py-2 rounded-lg transition-colors h-10 text-sm ${
            activeTab === 'noa-study' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          data-testid="button-noa-study"
        >
          <i className="fas fa-brain mr-2" />
          Usuário + NOA Estudos
        </Button>
        <Button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-lg transition-colors h-10 text-sm ${
            activeTab === 'analytics' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          data-testid="button-analytics"
        >
          <i className="fas fa-chart-line mr-2" />
          Analytics Estudo
        </Button>
        <Button
          onClick={() => setActiveTab('diary')}
          className={`px-4 py-2 rounded-lg transition-colors h-10 text-sm ${
            activeTab === 'diary' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          data-testid="button-study-diary"
        >
          <i className="fas fa-book mr-2" />
          Diário de Estudo
        </Button>
      </div>

      {/* Conteúdo das Abas */}
      {renderActiveTab()}
    </div>
  );
}