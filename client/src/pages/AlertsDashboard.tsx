import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Alert } from '@shared/schema';

// Priority colors for alerts
const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'alta': case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'média': case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'baixa': case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const getTypeColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'regulatório': case 'regulatory': return 'bg-orange-500/20 text-orange-400';
    case 'segurança': case 'safety': return 'bg-red-500/20 text-red-400';
    case 'inovação': case 'innovation': return 'bg-blue-500/20 text-blue-400';
    default: return 'bg-purple-500/20 text-purple-400';
  }
};

const getTypeIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'regulatório': case 'regulatory': return 'fas fa-gavel';
    case 'segurança': case 'safety': return 'fas fa-shield-alt';
    case 'inovação': case 'innovation': return 'fas fa-lightbulb';
    default: return 'fas fa-bell';
  }
};

export default function AlertsDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  
  const { data: alerts, isLoading } = useQuery({
    queryKey: ['/api/alerts'],
  });

  const filteredAlerts = (alerts as Alert[])?.filter((alert: Alert) => {
    const matchesSearch = !searchTerm || 
      alert.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !selectedPriority || alert.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  }) || [];

  const alertStats = {
    total: (alerts as Alert[])?.length || 0,
    alta: (alerts as Alert[])?.filter((a: Alert) => a.priority === 'Alta').length || 0,
    media: (alerts as Alert[])?.filter((a: Alert) => a.priority === 'Média').length || 0,
    baixa: (alerts as Alert[])?.filter((a: Alert) => a.priority === 'Baixa').length || 0,
    regulatory: (alerts as Alert[])?.filter((a: Alert) => a.type === 'Regulatório').length || 0,
    safety: (alerts as Alert[])?.filter((a: Alert) => a.type === 'Segurança').length || 0,
    innovation: (alerts as Alert[])?.filter((a: Alert) => a.type === 'Inovação').length || 0
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-1 sm:px-4 py-3 sm:py-8">
      <div className="flex items-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
          <i className="fas fa-exclamation-triangle text-white text-lg sm:text-2xl" />
        </div>
        <div>
          <h1 className="text-lg sm:text-3xl font-bold text-white">Alertas e Notificações</h1>
          <p className="text-gray-400 text-xs sm:text-base">Novidades regulatórias e científicas</p>
        </div>
      </div>

      {/* Stats Cards - Mobile Optimized */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
        <Card className="data-card rounded-xl text-center">
          <CardContent className="p-2 sm:p-4">
            <div className="text-lg sm:text-2xl font-bold text-orange-400">{alertStats.regulatory}</div>
            <div className="text-xs sm:text-sm text-gray-400">Regulatórios</div>
          </CardContent>
        </Card>
        <Card className="data-card rounded-xl text-center">
          <CardContent className="p-2 sm:p-4">
            <div className="text-lg sm:text-2xl font-bold text-red-400">{alertStats.safety}</div>
            <div className="text-xs sm:text-sm text-gray-400">Segurança</div>
          </CardContent>
        </Card>
        <Card className="data-card rounded-xl text-center">
          <CardContent className="p-2 sm:p-4">
            <div className="text-lg sm:text-2xl font-bold text-blue-400">{alertStats.innovation}</div>
            <div className="text-xs sm:text-sm text-gray-400">Inovações</div>
          </CardContent>
        </Card>
        <Card className="data-card rounded-xl text-center">
          <CardContent className="p-2 sm:p-4">
            <div className="text-lg sm:text-2xl font-bold text-green-400">{alertStats.alta}</div>
            <div className="text-xs sm:text-sm text-gray-400">Alta Prioridade</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters - Mobile Optimized */}
      <Card className="data-card rounded-xl mb-6 sm:mb-8">
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar alertas, tipos, mensagens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-cyber-light border-gray-600 pl-12 text-white placeholder-gray-400 focus:border-orange-500"
                  data-testid="search-alerts-input"
                />
                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400" />
              </div>
            </div>
            <select 
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 sm:px-4 py-2 bg-cyber-light border border-gray-600 rounded text-white focus:border-orange-500 text-sm sm:text-base"
              data-testid="priority-filter"
            >
              <option value="">Todas Prioridades</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <Card className="data-card rounded-xl p-8 text-center">
          <CardContent>
            <i className="fas fa-bell text-4xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Nenhum alerta encontrado</h3>
            <p className="text-gray-400">Tente ajustar os termos de busca ou filtros.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert: Alert) => (
            <Card 
              key={alert.id} 
              className="data-card rounded-xl hover:border-orange-400/50 transition-all"
              data-testid={`alert-card-${alert.id}`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start mb-3">
                      <div className={`w-12 h-12 ${getTypeColor(alert.type)} rounded-lg flex items-center justify-center mr-4 flex-shrink-0`}>
                        <i className={`${getTypeIcon(alert.type)} text-xl`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`px-2 py-1 text-xs ${getPriorityColor(alert.priority)}`}>
                            {alert.priority}
                          </Badge>
                          <Badge className={`px-2 py-1 text-xs ${getTypeColor(alert.type)}`}>
                            {alert.type}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{alert.message}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col lg:items-end">
                    <span className="text-sm text-gray-400 mb-2">
                      {alert.createdAt ? new Date(alert.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'}
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30 text-xs"
                        data-testid={`mark-read-${alert.id}`}
                      >
                        Marcar como lido
                      </Button>
                      <Button 
                        size="sm"
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 text-xs"
                        data-testid={`view-details-${alert.id}`}
                      >
                        Ver mais
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}