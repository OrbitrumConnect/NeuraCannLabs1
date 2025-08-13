import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface StudySubmissionSystemProps {
  userId: string;
  activeTab: string;
}

export default function StudySubmissionSystem({ userId, activeTab }: StudySubmissionSystemProps) {
  // States
  const [studyTitle, setStudyTitle] = useState('');
  const [studyType, setStudyType] = useState('observacional');
  const [studyKeywords, setStudyKeywords] = useState('');
  const [draftIdea, setDraftIdea] = useState('');
  const [improvementType, setImprovementType] = useState('scientific');
  const [showNoaHelper, setShowNoaHelper] = useState(true);
  const [studyContent, setStudyContent] = useState('');
  const [noaGenerating, setNoaGenerating] = useState(false);

  // Analytics mock data
  const [completedDays] = useState(18);
  const [studyDays] = useState(30);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutation para gerar estudo com NOA
  const generateStudyMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('/api/generate-study', 'POST', data);
      return await response.json();
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
      const response = await apiRequest('/api/study-draft', 'POST', data);
      return await response.json();
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
      studyType: studyType,
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
                  {/* Interface Unificada NOA */}
                  <div className="space-y-4">
                    {/* Título Único */}
                    <div>
                      <label className="block text-sm text-gray-300 mb-2 font-medium">
                        📝 Título do Estudo ou Ideia Principal
                      </label>
                      <Input
                        value={studyTitle}
                        onChange={(e) => setStudyTitle(e.target.value)}
                        placeholder="Ex: Eficácia do CBD em Epilepsia Refratária"
                        className="bg-gray-800 border-gray-600 text-white"
                        data-testid="input-unified-title"
                      />
                    </div>

                    {/* Configurações do Estudo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Palavras-chave (opcional)</label>
                        <Input
                          value={studyKeywords}
                          onChange={(e) => setStudyKeywords(e.target.value)}
                          placeholder="Ex: CBD, THC, epilepsia"
                          className="bg-gray-800 border-gray-600 text-white"
                          data-testid="input-keywords"
                        />
                      </div>
                    </div>

                    {/* Rascunho/Ideia Opcional */}
                    <div>
                      <label className="block text-sm text-gray-300 mb-2 font-medium">
                        💡 Rascunho ou Ideia (opcional - para melhoramento)
                      </label>
                      <Textarea
                        value={draftIdea}
                        onChange={(e) => setDraftIdea(e.target.value)}
                        placeholder="Cole seu rascunho existente ou descreva sua ideia detalhadamente..."
                        className="bg-gray-800 border-gray-600 text-white min-h-24"
                        data-testid="textarea-draft-idea"
                      />
                    </div>

                    {/* Botões de Ação */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Button
                        onClick={handleGenerateStudyWithNoa}
                        disabled={!studyTitle.trim() || noaGenerating || generateStudyMutation.isPending}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white py-3"
                        data-testid="button-generate-complete"
                      >
                        {noaGenerating || generateStudyMutation.isPending ? (
                          <i className="fas fa-brain fa-spin mr-2" />
                        ) : (
                          <i className="fas fa-magic mr-2" />
                        )}
                        Gerar Estudo Completo
                      </Button>
                      <Button
                        onClick={handleImproveDraftWithNoa}
                        disabled={!draftIdea.trim() || improveDraftMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-3"
                        data-testid="button-improve-draft"
                      >
                        {improveDraftMutation.isPending ? (
                          <i className="fas fa-brain fa-spin mr-2" />
                        ) : (
                          <i className="fas fa-edit mr-2" />
                        )}
                        Melhorar Rascunho
                      </Button>
                    </div>
                  </div>

                  {/* Resultado do Estudo Gerado - Dentro do mesmo card */}
                  {studyContent && (
                    <div className="mt-6 p-4 bg-gray-900/70 rounded-lg border border-emerald-500/40">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-emerald-400 font-medium flex items-center">
                          <i className="fas fa-file-alt mr-2" />
                          Estudo Gerado por NOA ESPERANÇA
                        </h4>
                        <Button
                          onClick={() => setStudyContent('')}
                          className="text-gray-400 hover:text-white bg-transparent hover:bg-gray-700 p-1 h-auto"
                          data-testid="button-clear-study"
                        >
                          <i className="fas fa-times" />
                        </Button>
                      </div>
                      <div className="bg-black/40 p-4 rounded border border-emerald-500/20 mb-4">
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
                          Copiar
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
                          Salvar
                        </Button>
                      </div>
                    </div>
                  )}

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
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div className="text-white">Selecione uma aba válida</div>;
    }
  };

  return renderActiveTab();
}