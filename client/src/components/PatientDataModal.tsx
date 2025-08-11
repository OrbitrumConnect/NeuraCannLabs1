import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PatientDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'evolution' | 'analysis' | 'reports';
}

export function PatientDataModal({ isOpen, onClose, mode }: PatientDataModalProps) {
  const [formData, setFormData] = useState({
    patientCode: '',
    condition: '',
    cannabinoid: '',
    dosage: '',
    administration: '',
    symptomBefore: 5,
    symptomAfter: 5,
    sideEffects: '',
    duration: '',
    outcome: '',
    notes: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addPatientMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/patient-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Dados do paciente registrados com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/patient-data'] });
      onClose();
      setFormData({
        patientCode: '',
        condition: '',
        cannabinoid: '',
        dosage: '',
        administration: '',
        symptomBefore: 5,
        symptomAfter: 5,
        sideEffects: '',
        duration: '',
        outcome: '',
        notes: ''
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao registrar dados. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPatientMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  const getModalContent = () => {
    switch (mode) {
      case 'add':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white mb-2 block">Código do Paciente (Anônimo)</Label>
                <Input
                  value={formData.patientCode}
                  onChange={(e) => handleInputChange('patientCode', e.target.value)}
                  placeholder="Ex: PAC-001, CBD-123"
                  className="bg-gray-700 border-gray-500 text-white"
                  required
                  data-testid="patient-code-input"
                />
              </div>
              
              <div>
                <Label className="text-white mb-2 block">Condição Médica</Label>
                <select
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  className="w-full bg-gray-700 border-gray-500 text-white rounded px-3 py-2"
                  required
                  data-testid="condition-select"
                >
                  <option value="">Selecione...</option>
                  <option value="epilepsia">Epilepsia</option>
                  <option value="dor_cronica">Dor Crônica</option>
                  <option value="ansiedade">Ansiedade</option>
                  <option value="depressao">Depressão</option>
                  <option value="cancer">Câncer</option>
                  <option value="esclerose_multipla">Esclerose Múltipla</option>
                  <option value="parkinson">Parkinson</option>
                  <option value="fibromialgia">Fibromialgia</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div>
                <Label className="text-white mb-2 block">Canabinoide Utilizado</Label>
                <select
                  value={formData.cannabinoid}
                  onChange={(e) => handleInputChange('cannabinoid', e.target.value)}
                  className="w-full bg-gray-700 border-gray-500 text-white rounded px-3 py-2"
                  required
                  data-testid="cannabinoid-select"
                >
                  <option value="">Selecione...</option>
                  <option value="cbd">CBD (Cannabidiol)</option>
                  <option value="thc">THC (Tetrahidrocanabinol)</option>
                  <option value="cbd_thc">CBD + THC</option>
                  <option value="cbg">CBG (Canabiguerol)</option>
                  <option value="cbn">CBN (Canabinol)</option>
                  <option value="full_spectrum">Full Spectrum</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div>
                <Label className="text-white mb-2 block">Dosagem</Label>
                <Input
                  value={formData.dosage}
                  onChange={(e) => handleInputChange('dosage', e.target.value)}
                  placeholder="Ex: 25mg 2x/dia, 0.5ml sublingual"
                  className="bg-gray-700 border-gray-500 text-white"
                  data-testid="dosage-input"
                />
              </div>

              <div>
                <Label className="text-white mb-2 block">Via de Administração</Label>
                <select
                  value={formData.administration}
                  onChange={(e) => handleInputChange('administration', e.target.value)}
                  className="w-full bg-gray-700 border-gray-500 text-white rounded px-3 py-2"
                  data-testid="administration-select"
                >
                  <option value="">Selecione...</option>
                  <option value="sublingual">Sublingual</option>
                  <option value="oral">Oral</option>
                  <option value="inalatoria">Inalatória</option>
                  <option value="topica">Tópica</option>
                  <option value="retal">Retal</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div>
                <Label className="text-white mb-2 block">Duração do Tratamento</Label>
                <Input
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="Ex: 3 meses, 6 semanas"
                  className="bg-gray-700 border-gray-500 text-white"
                  data-testid="duration-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white mb-2 block">Sintoma ANTES (1-10)</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.symptomBefore}
                  onChange={(e) => handleInputChange('symptomBefore', parseInt(e.target.value))}
                  className="bg-gray-700 border-gray-500 text-white"
                  required
                  data-testid="symptom-before-input"
                />
              </div>

              <div>
                <Label className="text-white mb-2 block">Sintoma DEPOIS (1-10)</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.symptomAfter}
                  onChange={(e) => handleInputChange('symptomAfter', parseInt(e.target.value))}
                  className="bg-gray-700 border-gray-500 text-white"
                  data-testid="symptom-after-input"
                />
              </div>
            </div>

            <div>
              <Label className="text-white mb-2 block">Resultado Geral</Label>
              <select
                value={formData.outcome}
                onChange={(e) => handleInputChange('outcome', e.target.value)}
                className="w-full bg-gray-700 border-gray-500 text-white rounded px-3 py-2"
                data-testid="outcome-select"
              >
                <option value="">Selecione...</option>
                <option value="melhora_significativa">Melhora Significativa</option>
                <option value="melhora_moderada">Melhora Moderada</option>
                <option value="melhora_leve">Melhora Leve</option>
                <option value="sem_alteracao">Sem Alteração</option>
                <option value="piora">Piora</option>
              </select>
            </div>

            <div>
              <Label className="text-white mb-2 block">Efeitos Colaterais</Label>
              <Input
                value={formData.sideEffects}
                onChange={(e) => handleInputChange('sideEffects', e.target.value)}
                placeholder="Ex: sonolência leve, boca seca"
                className="bg-gray-700 border-gray-500 text-white"
                data-testid="side-effects-input"
              />
            </div>

            <div>
              <Label className="text-white mb-2 block">Observações Adicionais</Label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Observações importantes sobre o caso..."
                className="w-full bg-gray-700 border-gray-500 text-white rounded px-3 py-2 h-20"
                data-testid="notes-textarea"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-gray-500 text-gray-300"
                data-testid="cancel-button"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700"
                disabled={addPatientMutation.isPending}
                data-testid="save-patient-data-button"
              >
                {addPatientMutation.isPending ? 'Salvando...' : 'Salvar Dados'}
              </Button>
            </div>
          </form>
        );

      case 'evolution':
        return (
          <div className="text-center py-8">
            <i className="fas fa-chart-line text-4xl text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Acompanhamento de Evolução</h3>
            <p className="text-gray-400 mb-6">
              Registre a evolução semanal dos pacientes para análise temporal
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Em desenvolvimento
            </Button>
          </div>
        );

      case 'analysis':
        return (
          <div className="text-center py-8">
            <i className="fas fa-brain text-4xl text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Análise por IA</h3>
            <p className="text-gray-400 mb-6">
              A IA detecta padrões automaticamente nos dados coletados
            </p>
            <div className="bg-purple-900/20 p-4 rounded-lg mb-6">
              <h4 className="text-purple-400 font-medium mb-2">Exemplos de padrões detectados:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• CBD isolado: 68% melhora em dor crônica</li>
                <li>• THC+CBD: 73% eficácia em epilepsia refratária</li>
                <li>• Via sublingual: início de ação 15-30 min</li>
              </ul>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Executar Análise
            </Button>
          </div>
        );

      case 'reports':
        return (
          <div className="text-center py-8">
            <i className="fas fa-file-medical text-4xl text-orange-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Relatórios Anonimizados</h3>
            <p className="text-gray-400 mb-6">
              Gere relatórios científicos com dados totalmente anonimizados
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-2">📊 Relatório Estatístico</h4>
                <p className="text-sm text-gray-400">Análise quantitativa dos tratamentos</p>
              </div>
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-2">📝 Artigo Científico</h4>
                <p className="text-sm text-gray-400">Template para publicação</p>
              </div>
            </div>
            <Button className="bg-orange-600 hover:bg-orange-700">
              Gerar Relatório
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'add': return 'Registrar Novo Caso';
      case 'evolution': return 'Acompanhar Evolução';
      case 'analysis': return 'Análise por IA';
      case 'reports': return 'Relatórios Científicos';
      default: return 'Potência de Dados';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-800 border-gray-600 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <i className="fas fa-database text-green-400 text-xl mr-3" />
              <h2 className="text-xl font-semibold text-white">{getModalTitle()}</h2>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
              data-testid="close-modal-button"
            >
              <i className="fas fa-times" />
            </Button>
          </div>
          
          {getModalContent()}
        </CardContent>
      </Card>
    </div>
  );
}