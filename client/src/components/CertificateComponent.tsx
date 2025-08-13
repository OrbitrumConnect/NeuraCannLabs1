import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Download, Share2, Calendar, User, CheckCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import type { Certificate } from "@shared/schema";

interface CertificateComponentProps {
  certificate: Certificate & { 
    courseTitle?: string;
    completionPercentage?: number; 
    verificationHash?: string;
  };
  userName: string;
  userEmail?: string;
  onDownload?: (certificateId: string) => void;
  onShare?: (certificateId: string) => void;
}

export default function CertificateComponent({
  certificate,
  userName,
  userEmail,
  onDownload,
  onShare
}: CertificateComponentProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Mutation para gerar certificado PDF
  const generatePdfMutation = useMutation({
    mutationFn: async (certificateId: string) => {
      const response = await fetch(`/api/education/certificate/${certificateId}/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro ao gerar certificado');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `certificado_${(certificate.courseTitle || 'curso').replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    },
    onMutate: () => setIsGenerating(true),
    onSettled: () => setIsGenerating(false),
    onSuccess: () => {
      onDownload?.(certificate.id);
    }
  });

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return 'Data não disponível';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getCompletionBadge = (percentage: number) => {
    if (percentage >= 95) return { variant: 'default' as const, text: 'Excelente', color: 'bg-green-600' };
    if (percentage >= 85) return { variant: 'secondary' as const, text: 'Muito Bom', color: 'bg-blue-600' };
    if (percentage >= 75) return { variant: 'outline' as const, text: 'Bom', color: 'bg-yellow-600' };
    return { variant: 'destructive' as const, text: 'Satisfatório', color: 'bg-gray-600' };
  };

  const badge = getCompletionBadge(certificate.completionPercentage || certificate.finalScore);

  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-emerald-600 transition-colors duration-300">
      <CardHeader className="relative">
        {/* Selo de certificado */}
        <div className="absolute top-4 right-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
            <Award className="w-6 h-6 text-yellow-900" />
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          
          <div className="flex-1">
            <CardTitle className="text-lg text-white mb-1">
              {certificate.courseTitle || `Curso ${certificate.courseId}`}
            </CardTitle>
            <CardDescription className="text-slate-400">
              Certificado de Conclusão • NeuroCann Academy
            </CardDescription>
            <div className="flex items-center gap-2 mt-2">
              <Badge {...badge}>
                {badge.text}
              </Badge>
              <Badge variant="outline" className="text-emerald-400 border-emerald-500">
                {certificate.completionPercentage || certificate.finalScore}%
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Informações do certificado */}
        <div className="bg-slate-800 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400">Aluno:</span>
              <span className="text-white font-medium">{userName}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400">Conclusão:</span>
              <span className="text-white font-medium">
                {formatDate(certificate.issuedAt)}
              </span>
            </div>
          </div>

          {/* Certificado ID */}
          <div className="pt-2 border-t border-slate-700">
            <div className="text-xs text-slate-500">
              ID do Certificado: {certificate.id.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Prévia visual do certificado */}
        <div className="relative bg-gradient-to-br from-emerald-50 to-white rounded-lg p-6 text-center border-4 border-emerald-600">
          {/* Decoração */}
          <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-emerald-600"></div>
          <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-emerald-600"></div>
          <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-emerald-600"></div>
          <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-emerald-600"></div>

          {/* Conteúdo do certificado */}
          <div className="space-y-3">
            <div className="text-emerald-800 font-bold text-lg">
              CERTIFICADO DE CONCLUSÃO
            </div>
            
            <div className="text-gray-700 text-sm">
              Certificamos que
            </div>
            
            <div className="text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-1">
              {userName}
            </div>
            
            <div className="text-gray-700 text-sm">
              concluiu com sucesso o curso
            </div>
            
            <div className="text-lg font-semibold text-emerald-800">
              {certificate.courseTitle || `Curso ${certificate.courseId}`}
            </div>
            
            <div className="text-gray-600 text-xs mt-4">
              {formatDate(certificate.issuedAt)} • NeuroCann Academy
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-2 justify-center">
          <Button
            onClick={() => generatePdfMutation.mutate(certificate.id)}
            disabled={isGenerating}
            className="bg-emerald-600 hover:bg-emerald-700"
            data-testid="button-download-certificate"
          >
            <Download className="w-4 h-4 mr-2" />
            {isGenerating ? 'Gerando...' : 'Baixar PDF'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => onShare?.(certificate.id)}
            className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
            data-testid="button-share-certificate"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
        </div>

        {/* Detalhes técnicos */}
        <div className="text-xs text-slate-500 text-center pt-2 border-t border-slate-700">
          <div>Certificado verificável • Hash: {certificate.verificationHash?.slice(0, 16) || certificate.certificateNumber}</div>
          <div className="mt-1">Válido internacionalmente • ISO 9001:2015</div>
        </div>
      </CardContent>
    </Card>
  );
}