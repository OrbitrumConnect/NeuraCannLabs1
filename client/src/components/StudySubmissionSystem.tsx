import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { StudySubmission } from '@shared/schema';

interface StudySubmissionSystemProps {
  userId: string;
}

export default function StudySubmissionSystem({ userId }: StudySubmissionSystemProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'edit' | 'submissions'>('create');
  const [inputMode, setInputMode] = useState<'text' | 'voice' | 'file'>('text');
  const [studyTitle, setStudyTitle] = useState('');
  const [studyContent, setStudyContent] = useState('');
  const [editingSubmission, setEditingSubmission] = useState<StudySubmission | null>(null);
  const [aiAnalysisCorrection, setAiAnalysisCorrection] = useState('');
  const [contentCorrection, setContentCorrection] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  // NOA ESPERANÇA Integration States
  const [noaGenerating, setNoaGenerating] = useState(false);
  const [studyKeywords, setStudyKeywords] = useState('');
  const [studyType, setStudyType] = useState('observacional');
  const [showNoaHelper, setShowNoaHelper] = useState(true);
  const [draftIdea, setDraftIdea] = useState('');
  const [improvementType, setImprovementType] = useState<'expand' | 'improve' | 'structure' | 'general'>('general');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's study submissions
  const { data: submissions, isLoading } = useQuery<StudySubmission[]>({
    queryKey: ['/api/study-submissions', userId],
    queryFn: async () => {
      const response = await fetch(`/api/study-submissions?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch submissions');
      return response.json();
    },
  });

  // Create new study submission
  const createSubmissionMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      originalContent: string;
      submissionType: string;
      userId: string;
    }) => {
      const response = await fetch('/api/study-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create submission');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Estudo Criado",
        description: "Seu estudo foi salvo como rascunho. Você pode editá-lo antes de submeter.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/study-submissions'] });
      setStudyTitle('');
      setStudyContent('');
      setActiveTab('submissions');
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao criar o estudo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Update study submission with corrections
  const updateSubmissionMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<StudySubmission> }) => {
      const response = await fetch(`/api/study-submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update submission');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Correções Salvas",
        description: "As correções foram aplicadas ao estudo.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/study-submissions'] });
      setEditingSubmission(null);
      setAiAnalysisCorrection('');
      setContentCorrection('');
    },
  });

  // Submit study for professional review
  const submitForReviewMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/study-submissions/${id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to submit for review');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Estudo Submetido",
        description: "Seu estudo foi enviado para análise profissional. Você pode acompanhar o status no seu perfil.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/study-submissions'] });
    },
  });

  // NOA ESPERANÇA: Generate complete study
  const generateStudyMutation = useMutation({
    mutationFn: async (data: {
      topic: string;
      keywords?: string;
      studyType?: string;
      maxWords?: number;
      userId: string;
    }) => {
      const response = await fetch('/api/generate-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to generate study');
      return response.json();
    },
    onSuccess: (data) => {
      setStudyTitle(data.study.title);
      setStudyContent(data.study.content);
      toast({
        title: "🧠 NOA ESPERANÇA",
        description: `Estudo sobre "${data.study.topic}" gerado com ${data.study.wordCount} palavras baseado em ${data.dataIntegration.sourcesFound} fontes da plataforma!`,
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Erro na Geração",
        description: "NOA não conseguiu gerar o estudo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // NOA ESPERANÇA: Improve drafts and suggestions
  const improveDraftMutation = useMutation({
    mutationFn: async (data: {
      idea?: string;
      currentContent?: string;
      improvementType: string;
      userId: string;
    }) => {
      const response = await fetch('/api/study-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to improve draft');
      return response.json();
    },
    onSuccess: (data) => {
      setStudyContent(data.draft.improvedContent);
      toast({
        title: "🧠 NOA ESPERANÇA",
        description: `Rascunho melhorado com ${data.draft.wordCount} palavras!`,
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Erro na Melhoria",
        description: "NOA não conseguiu melhorar o rascunho. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleCreateStudy = () => {
    if (!studyTitle.trim() || !studyContent.trim()) {
      toast({
        title: "Campos Obrigatórios",
        description: "Por favor, preencha o título e conteúdo do estudo.",
        variant: "destructive",
      });
      return;
    }

    createSubmissionMutation.mutate({
      title: studyTitle,
      originalContent: studyContent,
      submissionType: inputMode,
      userId,
    });
  };

  const handleSaveCorrections = () => {
    if (!editingSubmission) return;

    updateSubmissionMutation.mutate({
      id: editingSubmission.id,
      updates: {
        editedContent: contentCorrection || editingSubmission.originalContent,
        correctedAnalysis: aiAnalysisCorrection || editingSubmission.aiAnalysis || undefined,
      },
    });
  };

  // NOA ESPERANÇA Functions
  const handleGenerateStudyWithNoa = () => {
    if (!studyTitle.trim()) {
      toast({
        title: "Título Obrigatório",
        description: "Digite um título/tópico para NOA gerar o estudo.",
        variant: "destructive",
      });
      return;
    }

    setNoaGenerating(true);
    generateStudyMutation.mutate({
      topic: studyTitle,
      keywords: studyKeywords,
      studyType,
      maxWords: 300,
      userId,
    });
    
    // Reset generating state after mutation
    setTimeout(() => setNoaGenerating(false), 5000);
  };

  const handleImproveDraftWithNoa = () => {
    if (!studyContent.trim() && !draftIdea.trim()) {
      toast({
        title: "Conteúdo Necessário",
        description: "Digite uma ideia ou conteúdo para NOA melhorar.",
        variant: "destructive",
      });
      return;
    }

    improveDraftMutation.mutate({
      idea: draftIdea,
      currentContent: studyContent,
      improvementType,
      userId,
    });
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        // Here you would normally send to speech-to-text service
        // For now, we'll simulate the transcription
        setStudyContent("Transcrição da gravação de voz seria processada aqui...");
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Erro de Gravação",
        description: "Não foi possível acessar o microfone.",
        variant: "destructive",
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      draft: "secondary",
      submitted: "default",
      under_review: "outline",
      approved: "default",
      rejected: "destructive",
    };

    const labels: { [key: string]: string } = {
      draft: "Rascunho",
      submitted: "Submetido",
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
    <div className="container mx-auto px-3 py-6 sm:px-4 sm:py-8 pt-12 sm:pt-14">
      <div className="flex items-center mb-3 sm:mb-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
          <i className="fas fa-brain text-white text-lg sm:text-2xl" />
        </div>
        <div>
          <h1 className="text-base sm:text-2xl font-bold text-white">Meu Estudo - NEUROCANN LAB</h1>
          <p className="text-xs sm:text-sm text-gray-400">Espaço onde o prescritor cria, acompanha e publica estudos científicos</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6 sm:mb-8">
        <Button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 rounded-lg transition-colors h-10 text-sm ${
            activeTab === 'create' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          data-testid="button-create-study"
        >
          <i className="fas fa-plus mr-2" />
          Criar Estudo
        </Button>
        <Button
          onClick={() => setActiveTab('edit')}
          className={`px-4 py-2 rounded-lg transition-colors h-10 text-sm ${
            activeTab === 'edit' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          data-testid="button-edit-corrections"
        >
          <i className="fas fa-edit mr-2" />
          Editar & Corrigir IA
        </Button>
        <Button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 rounded-lg transition-colors h-10 text-sm ${
            activeTab === 'submissions' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          data-testid="button-my-submissions"
        >
          <i className="fas fa-list mr-2" />
          Estudos & Status ({submissions?.length || 0})
        </Button>
      </div>

      {/* Create Study Tab */}
      {activeTab === 'create' && (
        <div className="space-y-6">
          {/* Input Mode Selection */}
          <Card className="bg-gray-800/50 border border-green-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base">Como deseja criar seu estudo?</CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => setInputMode('text')}
                  className={`p-4 h-auto flex flex-col items-center transition-all ${
                    inputMode === 'text' 
                      ? 'bg-green-600/30 border border-green-500' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                  data-testid="button-input-text"
                >
                  <i className="fas fa-keyboard text-2xl mb-2" />
                  <span>Digitação</span>
                  <span className="text-xs text-gray-400 mt-1">Escrever manualmente</span>
                </Button>

                <Button
                  onClick={() => setInputMode('voice')}
                  className={`p-4 h-auto flex flex-col items-center transition-all ${
                    inputMode === 'voice' 
                      ? 'bg-green-600/30 border border-green-500' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                  data-testid="button-input-voice"
                >
                  <i className="fas fa-microphone text-2xl mb-2" />
                  <span>Por Voz</span>
                  <span className="text-xs text-gray-400 mt-1">Falar e transcrever</span>
                </Button>

                <Button
                  onClick={() => setInputMode('file')}
                  className={`p-4 h-auto flex flex-col items-center transition-all ${
                    inputMode === 'file' 
                      ? 'bg-green-600/30 border border-green-500' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                  data-testid="button-input-file"
                >
                  <i className="fas fa-file-upload text-2xl mb-2" />
                  <span>Upload</span>
                  <span className="text-xs text-gray-400 mt-1">PDF, DOC, TXT</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* NOA ESPERANÇA Study Generator */}
          {showNoaHelper && (
            <Card className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-emerald-400 text-lg flex items-center">
                  <i className="fas fa-brain mr-3 text-emerald-400" />
                  🧠 NOA ESPERANÇA - Assistente de Estudos Científicos
                </CardTitle>
                <p className="text-gray-300 text-sm">
                  A NOA pode gerar estudos completos ou melhorar seus rascunhos usando dados da plataforma (máximo 300 palavras)
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick Study Generation */}
                <div className="border border-emerald-500/20 rounded-lg p-4 bg-emerald-900/10">
                  <h4 className="text-emerald-300 font-medium mb-3 flex items-center">
                    <i className="fas fa-magic mr-2" />
                    Geração Completa de Estudo
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Tópico do Estudo</label>
                      <Input
                        value={studyTitle}
                        onChange={(e) => setStudyTitle(e.target.value)}
                        placeholder="Ex: CBD em epilepsia refratária"
                        className="bg-gray-800 border-gray-600 text-white"
                        data-testid="input-noa-topic"
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

          {/* Study Creation Form */}
          <Card className="bg-gray-800/50 border border-green-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base flex items-center">
                <i className="fas fa-edit mr-2" />
                Criação Manual de Estudo
              </CardTitle>
              <p className="text-gray-400 text-sm">Ou crie seu estudo de forma tradicional</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título do Estudo
                </label>
                <Input
                  value={studyTitle}
                  onChange={(e) => setStudyTitle(e.target.value)}
                  placeholder="Ex: Eficácia do CBD em Síndrome de Down - Estudo Observacional"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  data-testid="input-study-title"
                />
              </div>

              {inputMode === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Conteúdo do Estudo
                  </label>
                  <Textarea
                    value={studyContent}
                    onChange={(e) => setStudyContent(e.target.value)}
                    placeholder="Descreva sua metodologia, resultados, conclusões..."
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 min-h-32"
                    data-testid="textarea-study-content"
                  />
                </div>
              )}

              {inputMode === 'voice' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gravação de Voz
                  </label>
                  <div className="flex items-center space-x-4">
                    {!isRecording ? (
                      <Button
                        onClick={startVoiceRecording}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
                        data-testid="button-start-recording"
                      >
                        <i className="fas fa-microphone mr-2" />
                        Iniciar Gravação
                      </Button>
                    ) : (
                      <Button
                        onClick={stopVoiceRecording}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 animate-pulse"
                        data-testid="button-stop-recording"
                      >
                        <i className="fas fa-stop mr-2" />
                        Parar Gravação
                      </Button>
                    )}
                  </div>
                  {studyContent && (
                    <Textarea
                      value={studyContent}
                      onChange={(e) => setStudyContent(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white mt-4 min-h-24"
                      placeholder="Transcrição aparecerá aqui..."
                      data-testid="textarea-voice-transcription"
                    />
                  )}
                </div>
              )}

              {inputMode === 'file' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload de Arquivo
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                    data-testid="input-file-upload"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-700 hover:bg-gray-600 text-white w-full py-4"
                    data-testid="button-select-file"
                  >
                    <i className="fas fa-upload mr-2" />
                    Selecionar Arquivo (PDF, DOC, TXT)
                  </Button>
                </div>
              )}

              <Button
                onClick={handleCreateStudy}
                disabled={createSubmissionMutation.isPending}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                data-testid="button-create-study-submit"
              >
                {createSubmissionMutation.isPending ? (
                  <i className="fas fa-spinner fa-spin mr-2" />
                ) : (
                  <i className="fas fa-brain mr-2" />
                )}
                Gerar Estudo com IA + PMIDs
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit & Correct AI Tab */}
      {activeTab === 'edit' && (
        <div className="space-y-6">
          <Card className="bg-gray-800/50 border border-green-500/20">
            <CardHeader>
              <CardTitle className="text-white">Editar e Corrigir Análise da IA</CardTitle>
              <p className="text-gray-400">
                Selecione um estudo para editar informações incorretas identificadas pela IA
              </p>
            </CardHeader>
            <CardContent>
              {editingSubmission ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {editingSubmission.title}
                    </h3>
                    {getStatusBadge(editingSubmission.status || 'draft')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Corrigir Conteúdo Original
                    </label>
                    <Textarea
                      value={contentCorrection || editingSubmission.originalContent}
                      onChange={(e) => setContentCorrection(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white min-h-32"
                      placeholder="Faça as correções necessárias no conteúdo..."
                      data-testid="textarea-content-correction"
                    />
                  </div>

                  {editingSubmission.aiAnalysis && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Corrigir Análise da IA (Opcional)
                      </label>
                      <Textarea
                        value={aiAnalysisCorrection || editingSubmission.aiAnalysis}
                        onChange={(e) => setAiAnalysisCorrection(e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white min-h-24"
                        placeholder="Corrija informações incorretas da análise da IA..."
                        data-testid="textarea-ai-correction"
                      />
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <Button
                      onClick={handleSaveCorrections}
                      disabled={updateSubmissionMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      data-testid="button-save-corrections"
                    >
                      {updateSubmissionMutation.isPending ? (
                        <i className="fas fa-spinner fa-spin mr-2" />
                      ) : (
                        <i className="fas fa-save mr-2" />
                      )}
                      Salvar Correções
                    </Button>
                    <Button
                      onClick={() => setEditingSubmission(null)}
                      className="bg-gray-600 hover:bg-gray-700 text-white"
                      data-testid="button-cancel-edit"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">
                    Selecione um estudo da aba "Meus Estudos" para começar a edição
                  </p>
                  <Button
                    onClick={() => setActiveTab('submissions')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    data-testid="button-go-to-submissions"
                  >
                    Ver Meus Estudos
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* My Submissions Tab */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          {isLoading ? (
            <Card className="bg-gray-800/50 border border-green-500/20">
              <CardContent className="p-6 text-center">
                <i className="fas fa-spinner fa-spin text-2xl text-green-400 mb-4" />
                <p className="text-gray-400">Carregando seus estudos...</p>
              </CardContent>
            </Card>
          ) : submissions?.length ? (
            submissions.map((submission: StudySubmission) => (
              <Card key={submission.id} className="bg-gray-800/50 border border-green-500/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-lg mb-2">
                        {submission.title}
                      </CardTitle>
                      {getStatusBadge(submission.status || 'draft')}
                    </div>
                    <div className="flex space-x-2">
                      {submission.status === 'draft' && (
                        <>
                          <Button
                            onClick={() => {
                              setEditingSubmission(submission);
                              setActiveTab('edit');
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                            data-testid={`button-edit-${submission.id}`}
                          >
                            <i className="fas fa-edit mr-1" />
                            Editar
                          </Button>
                          <Button
                            onClick={() => submitForReviewMutation.mutate(submission.id)}
                            disabled={submitForReviewMutation.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white text-sm"
                            data-testid={`button-submit-${submission.id}`}
                          >
                            <i className="fas fa-paper-plane mr-1" />
                            Submeter para Análise
                          </Button>
                        </>
                      )}
                      {submission.status === 'approved' && (
                        <Button
                          onClick={() => window.location.href = '/dashboard?tab=forum'}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                          data-testid={`button-send-to-forum-${submission.id}`}
                        >
                          <i className="fas fa-comments mr-1" />
                          Enviar para Fórum
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Tipo de Submissão:</p>
                      <Badge variant="outline">
                        {submission.submissionType === 'text' ? 'Texto' :
                         submission.submissionType === 'voice' ? 'Voz' : 'Arquivo'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Conteúdo:</p>
                      <p className="text-white text-sm bg-gray-900/50 p-3 rounded border-l-4 border-green-500">
                        {submission.originalContent.slice(0, 200)}
                        {submission.originalContent.length > 200 ? '...' : ''}
                      </p>
                    </div>
                    {submission.aiAnalysis && (
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Análise da IA:</p>
                        <div className="text-white text-xs bg-blue-900/20 p-3 rounded border-l-4 border-blue-500 max-h-32 overflow-y-auto">
                          <pre className="whitespace-pre-wrap font-sans">{submission.aiAnalysis.slice(0, 300)}...</pre>
                        </div>
                      </div>
                    )}
                    {submission.reviewerNotes && (
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Notas do Revisor:</p>
                        <p className="text-white text-sm bg-yellow-900/20 p-3 rounded border-l-4 border-yellow-500">
                          {submission.reviewerNotes}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Criado: {new Date(submission.createdAt!).toLocaleDateString('pt-BR')}</span>
                      {submission.submittedAt && (
                        <span>Submetido: {new Date(submission.submittedAt).toLocaleDateString('pt-BR')}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-800/50 border border-green-500/20">
              <CardContent className="p-6 text-center">
                <i className="fas fa-file-alt text-4xl text-gray-600 mb-4" />
                <p className="text-gray-400 mb-4">Nenhum estudo encontrado</p>
                <Button
                  onClick={() => setActiveTab('create')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  data-testid="button-create-first-study"
                >
                  Criar Primeiro Estudo
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}