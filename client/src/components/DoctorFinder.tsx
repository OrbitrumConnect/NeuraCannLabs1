import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  experience: string;
  rating: number;
  availability: string;
  price: string;
}

const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Carlos Silva",
    specialty: "Cannabis Medicinal",
    location: "São Paulo, SP",
    experience: "5+ anos",
    rating: 4.8,
    availability: "Disponível hoje",
    price: "R$ 250"
  },
  {
    id: "2", 
    name: "Dra. Maria Santos",
    specialty: "Neurologia - Cannabis",
    location: "Rio de Janeiro, RJ",
    experience: "3 anos",
    rating: 4.6,
    availability: "Próxima semana",
    price: "R$ 300"
  },
  {
    id: "3",
    name: "Dr. João Oliveira",
    specialty: "Medicina da Dor",
    location: "Brasília, DF",
    experience: "7 anos",
    rating: 4.9,
    availability: "Disponível hoje",
    price: "R$ 280"
  }
];

interface DoctorFinderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DoctorFinder({ open, onOpenChange }: DoctorFinderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const filteredDoctors = mockDoctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.location.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(doctor =>
    !selectedSpecialty || doctor.specialty.includes(selectedSpecialty)
  );

  const handleContactDoctor = (doctor: Doctor) => {
    // Simular contato com médico
    alert(`Solicitação de consulta enviada para ${doctor.name}!\n\nVocê receberá uma resposta em até 24 horas no seu email.`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl text-white flex items-center">
            <i className="fas fa-user-md text-emerald-400 mr-3" />
            Encontrar Especialista em Cannabis Medicinal
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Encontre profissionais qualificados especializados em cannabis medicinal na sua região
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Buscar</label>
              <Input
                type="text"
                placeholder="Nome, especialidade ou localização..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                data-testid="doctor-search-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Especialidade</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full bg-gray-800 border-gray-600 text-white rounded px-3 py-2"
                data-testid="specialty-filter-select"
              >
                <option value="">Todas as especialidades</option>
                <option value="Cannabis">Cannabis Medicinal</option>
                <option value="Neurologia">Neurologia</option>
                <option value="Dor">Medicina da Dor</option>
                <option value="Psiquiatria">Psiquiatria</option>
                <option value="Oncologia">Oncologia</option>
              </select>
            </div>
          </div>

          {/* Doctor List */}
          <div className="space-y-4">
            {filteredDoctors.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <i className="fas fa-search text-4xl mb-4" />
                <p>Nenhum especialista encontrado com os critérios selecionados.</p>
              </div>
            ) : (
              filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="bg-gray-800/50 border-gray-600 hover:border-emerald-600 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                            <i className="fas fa-user-md text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{doctor.name}</h3>
                            <p className="text-emerald-400">{doctor.specialty}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center text-gray-300">
                            <i className="fas fa-map-marker-alt text-blue-400 mr-2" />
                            <span className="text-sm">{doctor.location}</span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <i className="fas fa-clock text-purple-400 mr-2" />
                            <span className="text-sm">{doctor.experience}</span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <i className="fas fa-star text-yellow-400 mr-2" />
                            <span className="text-sm">{doctor.rating}/5.0</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <span className={`px-2 py-1 rounded text-xs ${
                            doctor.availability === 'Disponível hoje' 
                              ? 'bg-green-900/30 text-green-400' 
                              : 'bg-orange-900/30 text-orange-400'
                          }`}>
                            {doctor.availability}
                          </span>
                          <span className="text-gray-400">Consulta: {doctor.price}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 md:ml-4">
                        <Button
                          onClick={() => handleContactDoctor(doctor)}
                          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500"
                          data-testid={`contact-doctor-${doctor.id}`}
                        >
                          <i className="fas fa-calendar-plus mr-2" />
                          Solicitar Consulta
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Information */}
          <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-600">
            <h4 className="text-blue-400 font-medium mb-2">
              <i className="fas fa-info-circle mr-2" />
              Como funciona?
            </h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Selecione um especialista baseado na sua necessidade</li>
              <li>• Clique em "Solicitar Consulta" para enviar sua solicitação</li>
              <li>• O médico receberá sua solicitação e entrará em contato</li>
              <li>• Você será notificado sobre disponibilidade e próximos passos</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}