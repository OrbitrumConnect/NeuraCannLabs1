import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import TextToSpeech from '@/components/TextToSpeech';

interface StudyUpload {
  id: string;
  title: string;
  content: string;
  uploadType: 'voice' | 'text' | 'file';
  analysis?: string;
  comparison?: string;
  createdAt: string;
  status: 'processing' | 'analyzed' | 'error';
}

export default function MyStudyDashboard() {
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [inputMode, setInputMode] = useState<'text' | 'voice' | 'file'>('text');
  const [studyTitle, setStudyTitle] = useState('');
  const [studyContent, setStudyContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for studies history
  const { data: studies } = useQuery({
    queryKey: ['/api/my-studies'],
    queryFn: async () => {
      // Simulated API call - replace with real endpoint
      return [
        {
          id: 'study-1',
          title: 'Eficácia do CBD em Epilepsia Pediátrica - Análise Comparativa',
          content: 'Estudo observacional com 50 pacientes pediátricos...',
          uploadType: 'text' as const,
          analysis: 'Baseado na análise cruzada com nossa base de dados científicos, encontrei 3 estudos diretamente relacionados:\n\n**Devinsky et al. (2017) - NEJM**: Estudo clínico fase III com Epidiolex mostrando redução de 36% nas convulsões em síndrome de Dravet.\n\n**Comparação com seu estudo**: Sua amostra de 50 pacientes é consistente com estudos similares. Protocolos de dosagem (2-5mg/kg/dia) alinham com evidências publicadas.\n\n**Gaps identificados**: Falta análise de biomarcadores específicos presentes em estudos mais recentes (2023-2024).',
          comparison: 'Convergência: 85% com literatura existente\nDivergência: Metodologia de follow-up mais extensa\nInovação: Integração de dados genômicos',
          createdAt: '2024-08-09',
          status: 'analyzed' as const
        },
        {
          id: 'study-2', 
          title: 'Upload de Arquivo: Meta-análise THC vs Placebo',
          content: 'Arquivo PDF processado...',
          uploadType: 'file' as const,
          analysis: 'Processamento concluído. Estudo analisado contra 12 publicações relacionadas na base PubMed.',
          status: 'analyzed' as const,
          createdAt: '2024-08-08'
        }
      ] as StudyUpload[];
    }
  });

  const createStudyMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; type: string; file?: File }) => {
      // If file upload, handle multipart upload
      if (data.file) {
        // Simulate file upload processing for now
        return {
          id: `study-${Date.now()}`,
          title: data.title,
          content: `Arquivo processado: ${data.file.name}`,
          uploadType: 'file',
          analysis: 'Arquivo analisado com sucesso. Comparação com base de dados em andamento...',
          status: 'analyzed',
          createdAt: new Date().toISOString()
        };
      }
      
      // Simulate text/voice analysis for now
      return {
        id: `study-${Date.now()}`,
        title: data.title,
        content: data.content,
        uploadType: data.type,
        analysis: 'Análise concluída. Estudo comparado com base científica da plataforma...',
        status: 'analyzed',
        createdAt: new Date().toISOString()
      };
    },
    onSuccess: () => {
      toast({ title: 'Estudo criado e analisado com sucesso!' });
      queryClient.invalidateQueries({ queryKey: ['/api/my-studies'] });
      setStudyTitle('');
      setStudyContent('');
      setActiveTab('history');
    },
    onError: () => {
      toast({ title: 'Erro ao processar estudo', variant: 'destructive' });
    }
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        // Convert to text using Web Speech API or send to backend
        convertAudioToText(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      toast({ title: 'Erro ao acessar microfone', variant: 'destructive' });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const convertAudioToText = async (audioBlob: Blob) => {
    // Simulated conversion - replace with real speech-to-text API
    setStudyContent('Transcrição do áudio: [Conteúdo transcrito do estudo sobre cannabis medicinal...]');
    toast({ title: 'Áudio transcrito com sucesso!' });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({ title: 'Arquivo muito grande (máximo 10MB)', variant: 'destructive' });
        return;
      }

      // Simulate progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setStudyContent(`Arquivo carregado: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
        }
      }, 200);
    }
  };

  const handleSubmit = () => {
    if (!studyTitle.trim() || !studyContent.trim()) {
      toast({ title: 'Título e conteúdo são obrigatórios', variant: 'destructive' });
      return;
    }

    const file = fileInputRef.current?.files?.[0];
    createStudyMutation.mutate({
      title: studyTitle,
      content: studyContent,
      type: inputMode,
      file: file || undefined
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center mr-4">
          <i className="fas fa-brain text-white text-2xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Meu Estudo</h1>
          <p className="text-gray-400">Crie e analise estudos com IA especializada</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-8">
        <Button
          onClick={() => setActiveTab('create')}
          className={`mr-4 px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'create' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <i className="fas fa-plus mr-2" />
          Criar Estudo
        </Button>
        <Button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'history' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <i className="fas fa-history mr-2" />
          Histórico ({studies?.length || 0})
        </Button>
      </div>

      {activeTab === 'create' && (
        <div className="space-y-6">
          {/* Input Mode Selection */}
          <Card className="data-card rounded-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg">Como deseja criar seu estudo?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => setInputMode('text')}
                  className={`p-4 h-auto flex flex-col items-center transition-all ${
                    inputMode === 'text' 
                      ? 'bg-purple-600/30 border border-purple-500' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <i className="fas fa-keyboard text-2xl mb-2" />
                  <span>Digitação</span>
                  <span className="text-xs text-gray-400 mt-1">Escrever manualmente</span>
                </Button>

                <Button
                  onClick={() => setInputMode('voice')}
                  className={`p-4 h-auto flex flex-col items-center transition-all ${
                    inputMode === 'voice' 
                      ? 'bg-purple-600/30 border border-purple-500' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <i className="fas fa-microphone text-2xl mb-2" />
                  <span>Por Voz</span>
                  <span className="text-xs text-gray-400 mt-1">Falar e transcrever</span>
                </Button>

                <Button
                  onClick={() => setInputMode('file')}
                  className={`p-4 h-auto flex flex-col items-center transition-all ${
                    inputMode === 'file' 
                      ? 'bg-purple-600/30 border border-purple-500' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <i className="fas fa-file-upload text-2xl mb-2" />
                  <span>Upload</span>
                  <span className="text-xs text-gray-400 mt-1">PDF, DOC, TXT</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Study Creation Form */}
          <Card className="data-card rounded-xl">
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título do Estudo
                </label>
                <Input
                  value={studyTitle}
                  onChange={(e) => setStudyTitle(e.target.value)}
                  placeholder="Ex: Eficácia do CBD em tratamento de ansiedade"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
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
                        onClick={startRecording}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
                      >
                        <i className="fas fa-microphone mr-2" />
                        Iniciar Gravação
                      </Button>
                    ) : (
                      <Button
                        onClick={stopRecording}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 animate-pulse"
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
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 mb-4"
                  >
                    <i className="fas fa-upload mr-2" />
                    Escolher Arquivo
                  </Button>
                  
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                  
                  {studyContent && (
                    <div className="p-4 bg-gray-800 rounded border border-gray-600">
                      <p className="text-gray-300 text-sm">{studyContent}</p>
                    </div>
                  )}
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={createStudyMutation.isPending || !studyTitle.trim() || !studyContent.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3"
              >
                {createStudyMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2" />
                    Analisando com IA...
                  </>
                ) : (
                  <>
                    <i className="fas fa-brain mr-2" />
                    Criar e Analisar Estudo
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          {!studies || studies.length === 0 ? (
            <Card className="data-card rounded-xl p-8 text-center">
              <CardContent>
                <i className="fas fa-brain text-4xl text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Nenhum estudo encontrado</h3>
                <p className="text-gray-400">Comece criando seu primeiro estudo científico.</p>
              </CardContent>
            </Card>
          ) : (
            studies.map((study) => (
              <Card key={study.id} className="data-card rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">{study.title}</h3>
                        <Badge className={`px-2 py-1 text-xs ${
                          study.uploadType === 'voice' ? 'bg-red-500/20 text-red-400' :
                          study.uploadType === 'file' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          <i className={`mr-1 ${
                            study.uploadType === 'voice' ? 'fas fa-microphone' :
                            study.uploadType === 'file' ? 'fas fa-file' :
                            'fas fa-keyboard'
                          }`} />
                          {study.uploadType === 'voice' ? 'Voz' : 
                           study.uploadType === 'file' ? 'Arquivo' : 'Texto'}
                        </Badge>
                        <Badge className={`px-2 py-1 text-xs ${
                          study.status === 'analyzed' ? 'bg-green-500/20 text-green-400' :
                          study.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {study.status === 'analyzed' ? 'Analisado' :
                           study.status === 'processing' ? 'Processando' : 'Erro'}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{study.createdAt}</p>
                    </div>
                  </div>

                  {study.analysis && (
                    <div className="mb-4 p-4 bg-gray-800/30 rounded">
                      <h4 className="text-sm font-semibold text-purple-300 mb-2">
                        <i className="fas fa-brain mr-2" />
                        Análise da IA
                      </h4>
                      <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                        {study.analysis}
                      </div>
                    </div>
                  )}

                  {study.comparison && (
                    <div className="mb-4 p-4 bg-blue-900/20 rounded border border-blue-500/30">
                      <h4 className="text-sm font-semibold text-blue-300 mb-2">
                        <i className="fas fa-chart-bar mr-2" />
                        Comparação com Literatura
                      </h4>
                      <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                        {study.comparison}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600/30">
                        <i className="fas fa-download mr-2" />
                        Exportar
                      </Button>
                      <Button size="sm" className="bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30">
                        <i className="fas fa-share mr-2" />
                        Compartilhar
                      </Button>
                    </div>
                    
                    {study.analysis && (
                      <TextToSpeech 
                        text={`Análise do estudo ${study.title}. ${study.analysis}`}
                        className="text-xs"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}