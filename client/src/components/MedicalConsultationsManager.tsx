import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, FileText, Plus, Download, Eye, Stethoscope, User, Clock, Pill } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Configurar moment para português
moment.locale('pt-br');
const localizer = momentLocalizer(moment);

interface MedicalConsultation {
  id: string;
  doctorId: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  patientWeight?: string;
  consultationDate: string;
  symptoms: string;
  diagnosis?: string;
  treatment?: string;
  medication?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  notes?: string;
  followUpDate?: string;
  consultationStatus?: string;
  aiAnalysis?: string;
  pdfGenerated?: number;
  createdAt: string;
}

interface PDFData {
  consultationId: string;
  doctor: {
    name: string;
    crm: string;
    specialty: string;
  };
  patient: {
    name: string;
    age?: number;
    gender?: string;
    weight?: string;
  };
  consultation: {
    date: string;
    symptoms: string;
    diagnosis?: string;
    treatment?: string;
    medication?: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    notes?: string;
    followUpDate?: string;
    aiAnalysis?: string;
  };
  clinic: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  generated: string;
}

export function MedicalConsultationsManager() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<MedicalConsultation | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState({
    patientName: "",
    patientAge: "",
    patientGender: "",
    patientWeight: "",
    symptoms: "",
    diagnosis: "",
    treatment: "",
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    notes: "",
    followUpDate: "",
  });

  // Buscar consultas médicas
  const { data: consultations = [], isLoading } = useQuery<MedicalConsultation[]>({
    queryKey: ["/api/medical-consultations"],
  });

  // Criar nova consulta
  const createConsultationMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/medical-consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          doctorId: "user-1", // ID do médico logado
          patientAge: data.patientAge ? parseInt(data.patientAge) : undefined,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medical-consultations"] });
      setShowCreateDialog(false);
      setFormData({
        patientName: "",
        patientAge: "",
        patientGender: "",
        patientWeight: "",
        symptoms: "",
        diagnosis: "",
        treatment: "",
        medication: "",
        dosage: "",
        frequency: "",
        duration: "",
        notes: "",
        followUpDate: "",
      });
      toast({
        title: "Consulta criada",
        description: "Nova consulta médica criada com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao criar consulta médica",
        variant: "destructive",
      });
    },
  });

  // Gerar PDF
  const generatePDFMutation = useMutation({
    mutationFn: async (consultationId: string) => {
      return await apiRequest(`/api/medical-consultations/${consultationId}/generate-pdf`, {
        method: "POST",
      });
    },
    onSuccess: (data: { pdfData: PDFData }) => {
      generatePDFFile(data.pdfData);
      queryClient.invalidateQueries({ queryKey: ["/api/medical-consultations"] });
      toast({
        title: "PDF gerado",
        description: "Relatório médico gerado com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao gerar PDF",
        variant: "destructive",
      });
    },
  });

  // Gerar arquivo PDF
  const generatePDFFile = (pdfData: PDFData) => {
    const pdf = new jsPDF();
    
    // Cabeçalho
    pdf.setFontSize(20);
    pdf.text(pdfData.clinic.name, 20, 20);
    pdf.setFontSize(12);
    pdf.text(`${pdfData.clinic.address} | ${pdfData.clinic.phone} | ${pdfData.clinic.email}`, 20, 30);
    
    // Linha divisória
    pdf.line(20, 35, 190, 35);
    
    // Título
    pdf.setFontSize(16);
    pdf.text("RELATÓRIO DE CONSULTA MÉDICA", 20, 50);
    
    // Dados do médico
    pdf.setFontSize(12);
    pdf.text(`Médico: ${pdfData.doctor.name}`, 20, 65);
    pdf.text(`CRM: ${pdfData.doctor.crm}`, 20, 75);
    pdf.text(`Especialidade: ${pdfData.doctor.specialty}`, 20, 85);
    
    // Dados do paciente
    pdf.text(`Paciente: ${pdfData.patient.name}`, 20, 100);
    if (pdfData.patient.age) pdf.text(`Idade: ${pdfData.patient.age} anos`, 20, 110);
    if (pdfData.patient.gender) pdf.text(`Sexo: ${pdfData.patient.gender}`, 20, 120);
    if (pdfData.patient.weight) pdf.text(`Peso: ${pdfData.patient.weight}`, 20, 130);
    
    // Data da consulta
    const consultationDate = new Date(pdfData.consultation.date).toLocaleDateString('pt-BR');
    pdf.text(`Data da Consulta: ${consultationDate}`, 20, 145);
    
    // Sintomas
    pdf.text("SINTOMAS:", 20, 160);
    pdf.setFontSize(10);
    const symptomsLines = pdf.splitTextToSize(pdfData.consultation.symptoms, 170);
    pdf.text(symptomsLines, 20, 170);
    
    let yPosition = 170 + (symptomsLines.length * 5) + 10;
    
    // Diagnóstico
    if (pdfData.consultation.diagnosis) {
      pdf.setFontSize(12);
      pdf.text("DIAGNÓSTICO:", 20, yPosition);
      pdf.setFontSize(10);
      const diagnosisLines = pdf.splitTextToSize(pdfData.consultation.diagnosis, 170);
      pdf.text(diagnosisLines, 20, yPosition + 10);
      yPosition += 10 + (diagnosisLines.length * 5) + 10;
    }
    
    // Tratamento
    if (pdfData.consultation.treatment) {
      pdf.setFontSize(12);
      pdf.text("TRATAMENTO:", 20, yPosition);
      pdf.setFontSize(10);
      const treatmentLines = pdf.splitTextToSize(pdfData.consultation.treatment, 170);
      pdf.text(treatmentLines, 20, yPosition + 10);
      yPosition += 10 + (treatmentLines.length * 5) + 10;
    }
    
    // Medicação
    if (pdfData.consultation.medication) {
      pdf.setFontSize(12);
      pdf.text("MEDICAÇÃO:", 20, yPosition);
      pdf.setFontSize(10);
      pdf.text(`Medicamento: ${pdfData.consultation.medication}`, 20, yPosition + 10);
      if (pdfData.consultation.dosage) pdf.text(`Dosagem: ${pdfData.consultation.dosage}`, 20, yPosition + 20);
      if (pdfData.consultation.frequency) pdf.text(`Frequência: ${pdfData.consultation.frequency}`, 20, yPosition + 30);
      if (pdfData.consultation.duration) pdf.text(`Duração: ${pdfData.consultation.duration}`, 20, yPosition + 40);
      yPosition += 50;
    }
    
    // Análise IA
    if (pdfData.consultation.aiAnalysis) {
      pdf.setFontSize(12);
      pdf.text("ANÁLISE DR. CANNABIS IA:", 20, yPosition);
      pdf.setFontSize(10);
      const analysisLines = pdf.splitTextToSize(pdfData.consultation.aiAnalysis, 170);
      pdf.text(analysisLines, 20, yPosition + 10);
      yPosition += 10 + (analysisLines.length * 5) + 10;
    }
    
    // Rodapé
    pdf.setFontSize(8);
    pdf.text(`Relatório gerado em: ${new Date(pdfData.generated).toLocaleString('pt-BR')}`, 20, 280);
    pdf.text("Este documento foi gerado pelo sistema NeuroCann Lab", 20, 285);
    
    // Salvar PDF
    const fileName = `consulta_${pdfData.patient.name.replace(/\s+/g, '_')}_${consultationDate.replace(/\//g, '-')}.pdf`;
    pdf.save(fileName);
  };

  // Preparar eventos para o calendário
  const calendarEvents = consultations.map(consultation => ({
    id: consultation.id,
    title: `${consultation.patientName} - ${consultation.symptoms.substring(0, 30)}...`,
    start: new Date(consultation.consultationDate),
    end: new Date(new Date(consultation.consultationDate).getTime() + 60 * 60 * 1000), // 1 hora
    resource: consultation,
  }));

  const handleSelectEvent = (event: any) => {
    setSelectedConsultation(event.resource);
    setShowDetailsDialog(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.patientName || !formData.symptoms) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome do paciente e sintomas são obrigatórios",
        variant: "destructive",
      });
      return;
    }
    createConsultationMutation.mutate(formData);
  };

  return (
    <div className="space-y-6" data-testid="medical-consultations-manager">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-green-400">Consultas Médicas</h2>
          <p className="text-gray-400">Gerencie consultas e gere relatórios em PDF</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-consultation" className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Consulta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-green-400">Nova Consulta Médica</DialogTitle>
              <DialogDescription className="text-gray-400">
                Preencha os dados da consulta médica
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dados do Paciente */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-400">Dados do Paciente</h3>
                
                <div>
                  <Label htmlFor="patientName">Nome do Paciente *</Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) => handleInputChange("patientName", e.target.value)}
                    className="bg-gray-800 border-gray-600"
                    data-testid="input-patient-name"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="patientAge">Idade</Label>
                    <Input
                      id="patientAge"
                      type="number"
                      value={formData.patientAge}
                      onChange={(e) => handleInputChange("patientAge", e.target.value)}
                      className="bg-gray-800 border-gray-600"
                      data-testid="input-patient-age"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="patientGender">Sexo</Label>
                    <Select value={formData.patientGender} onValueChange={(value) => handleInputChange("patientGender", value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-600" data-testid="select-patient-gender">
                        <SelectValue placeholder="Sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="patientWeight">Peso</Label>
                    <Input
                      id="patientWeight"
                      value={formData.patientWeight}
                      onChange={(e) => handleInputChange("patientWeight", e.target.value)}
                      placeholder="Ex: 70kg"
                      className="bg-gray-800 border-gray-600"
                      data-testid="input-patient-weight"
                    />
                  </div>
                </div>
              </div>
              
              {/* Dados Clínicos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-400">Dados Clínicos</h3>
                
                <div>
                  <Label htmlFor="symptoms">Sintomas *</Label>
                  <Textarea
                    id="symptoms"
                    value={formData.symptoms}
                    onChange={(e) => handleInputChange("symptoms", e.target.value)}
                    className="bg-gray-800 border-gray-600"
                    rows={3}
                    data-testid="textarea-symptoms"
                  />
                </div>
                
                <div>
                  <Label htmlFor="diagnosis">Diagnóstico</Label>
                  <Textarea
                    id="diagnosis"
                    value={formData.diagnosis}
                    onChange={(e) => handleInputChange("diagnosis", e.target.value)}
                    className="bg-gray-800 border-gray-600"
                    rows={2}
                    data-testid="textarea-diagnosis"
                  />
                </div>
                
                <div>
                  <Label htmlFor="treatment">Tratamento</Label>
                  <Textarea
                    id="treatment"
                    value={formData.treatment}
                    onChange={(e) => handleInputChange("treatment", e.target.value)}
                    className="bg-gray-800 border-gray-600"
                    rows={2}
                    data-testid="textarea-treatment"
                  />
                </div>
              </div>
              
              {/* Medicação */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-semibold text-green-400">Prescrição</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="medication">Medicação</Label>
                    <Input
                      id="medication"
                      value={formData.medication}
                      onChange={(e) => handleInputChange("medication", e.target.value)}
                      placeholder="Ex: CBD Oil"
                      className="bg-gray-800 border-gray-600"
                      data-testid="input-medication"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dosage">Dosagem</Label>
                    <Input
                      id="dosage"
                      value={formData.dosage}
                      onChange={(e) => handleInputChange("dosage", e.target.value)}
                      placeholder="Ex: 25mg"
                      className="bg-gray-800 border-gray-600"
                      data-testid="input-dosage"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="frequency">Frequência</Label>
                    <Input
                      id="frequency"
                      value={formData.frequency}
                      onChange={(e) => handleInputChange("frequency", e.target.value)}
                      placeholder="Ex: 2x ao dia"
                      className="bg-gray-800 border-gray-600"
                      data-testid="input-frequency"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="duration">Duração</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                      placeholder="Ex: 30 dias"
                      className="bg-gray-800 border-gray-600"
                      data-testid="input-duration"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="bg-gray-800 border-gray-600"
                    rows={3}
                    data-testid="textarea-notes"
                  />
                </div>
                
                <div>
                  <Label htmlFor="followUpDate">Data de Retorno</Label>
                  <Input
                    id="followUpDate"
                    type="datetime-local"
                    value={formData.followUpDate}
                    onChange={(e) => handleInputChange("followUpDate", e.target.value)}
                    className="bg-gray-800 border-gray-600"
                    data-testid="input-follow-up-date"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} data-testid="button-cancel">
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createConsultationMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
                data-testid="button-save-consultation"
              >
                {createConsultationMutation.isPending ? "Salvando..." : "Salvar Consulta"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Total de Consultas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{consultations.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Este Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {consultations.filter(c => 
                new Date(c.consultationDate).getMonth() === new Date().getMonth()
              ).length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">PDFs Gerados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {consultations.filter(c => c.pdfGenerated === 1).length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              {consultations.filter(c => c.consultationStatus === 'active').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendário */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-green-400">Calendário de Consultas</CardTitle>
          <CardDescription className="text-gray-400">
            Visualize e gerencie suas consultas médicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ height: '500px' }} className="bg-white rounded-lg p-4" data-testid="calendar-container">
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              onSelectEvent={handleSelectEvent}
              views={['month', 'week', 'day', 'agenda']}
              messages={{
                next: "Próximo",
                previous: "Anterior",
                today: "Hoje",
                month: "Mês",
                week: "Semana",
                day: "Dia",
                agenda: "Agenda",
                date: "Data",
                time: "Hora",
                event: "Evento",
                allDay: "Dia todo",
                noEventsInRange: "Não há consultas neste período",
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Detalhes da Consulta */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
          {selectedConsultation && (
            <>
              <DialogHeader>
                <DialogTitle className="text-green-400 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" />
                  Consulta Médica - {selectedConsultation.patientName}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  {new Date(selectedConsultation.consultationDate).toLocaleString('pt-BR')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dados do Paciente */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Dados do Paciente
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nome:</strong> {selectedConsultation.patientName}</p>
                    {selectedConsultation.patientAge && <p><strong>Idade:</strong> {selectedConsultation.patientAge} anos</p>}
                    {selectedConsultation.patientGender && <p><strong>Sexo:</strong> {selectedConsultation.patientGender}</p>}
                    {selectedConsultation.patientWeight && <p><strong>Peso:</strong> {selectedConsultation.patientWeight}</p>}
                  </div>
                </div>
                
                {/* Dados Clínicos */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Dados Clínicos
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Sintomas:</strong>
                      <p className="text-gray-300 mt-1">{selectedConsultation.symptoms}</p>
                    </div>
                    {selectedConsultation.diagnosis && (
                      <div>
                        <strong>Diagnóstico:</strong>
                        <p className="text-gray-300 mt-1">{selectedConsultation.diagnosis}</p>
                      </div>
                    )}
                    {selectedConsultation.treatment && (
                      <div>
                        <strong>Tratamento:</strong>
                        <p className="text-gray-300 mt-1">{selectedConsultation.treatment}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Prescrição */}
                {selectedConsultation.medication && (
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                      <Pill className="w-4 h-4" />
                      Prescrição
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <strong>Medicação:</strong>
                        <p className="text-gray-300">{selectedConsultation.medication}</p>
                      </div>
                      {selectedConsultation.dosage && (
                        <div>
                          <strong>Dosagem:</strong>
                          <p className="text-gray-300">{selectedConsultation.dosage}</p>
                        </div>
                      )}
                      {selectedConsultation.frequency && (
                        <div>
                          <strong>Frequência:</strong>
                          <p className="text-gray-300">{selectedConsultation.frequency}</p>
                        </div>
                      )}
                      {selectedConsultation.duration && (
                        <div>
                          <strong>Duração:</strong>
                          <p className="text-gray-300">{selectedConsultation.duration}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Análise IA */}
                {selectedConsultation.aiAnalysis && (
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-semibold text-green-400">Análise Dr. Cannabis IA</h3>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-300 whitespace-pre-wrap">{selectedConsultation.aiAnalysis}</p>
                    </div>
                  </div>
                )}
                
                {/* Observações */}
                {selectedConsultation.notes && (
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-semibold text-green-400">Observações</h3>
                    <p className="text-sm text-gray-300">{selectedConsultation.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsDialog(false)}
                  data-testid="button-close-details"
                >
                  Fechar
                </Button>
                <Button
                  onClick={() => generatePDFMutation.mutate(selectedConsultation.id)}
                  disabled={generatePDFMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                  data-testid="button-generate-pdf"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {generatePDFMutation.isPending ? "Gerando..." : "Gerar PDF"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}