import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type Alert } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

export default function AlertsDashboard() {
  const queryClient = useQueryClient();
  const { data: alerts, isLoading, error } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (alertId: string) => {
      await apiRequest("PATCH", `/api/alerts/${alertId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
          <span className="ml-4 text-neon-cyan">Carregando alertas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-400">
          <i className="fas fa-exclamation-triangle text-4xl mb-4" />
          <p>Erro ao carregar alertas. Tente novamente.</p>
        </div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "regulatório": return "text-red-400 bg-red-500/20";
      case "científico": return "text-emerald-400 bg-emerald-500/20";
      case "segurança": return "text-amber-400 bg-amber-500/20";
      case "inovação": return "text-blue-400 bg-blue-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "regulatório": return "fas fa-gavel";
      case "científico": return "fas fa-microscope";
      case "segurança": return "fas fa-exclamation-triangle";
      case "inovação": return "fas fa-lightbulb";
      default: return "fas fa-bell";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toUpperCase()) {
      case "URGENTE": return "bg-red-500/20 text-red-400";
      case "NOVO": return "bg-emerald-500/20 text-emerald-400";
      case "NORMAL": return "bg-blue-500/20 text-blue-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getBorderColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "regulatório": return "border-red-500/30";
      case "científico": return "border-emerald-500/30";
      case "segurança": return "border-amber-500/30";
      case "inovação": return "border-blue-500/30";
      default: return "border-gray-500/30";
    }
  };

  const unreadAlerts = alerts?.filter(alert => alert.isRead === 0) || [];
  const alertsByType = alerts?.reduce((acc, alert) => {
    acc[alert.type] = (acc[alert.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const handleMarkAsRead = (alertId: string) => {
    markAsReadMutation.mutate(alertId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center mr-4 animate-pulse-glow">
          <i className="fas fa-bell text-white text-2xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold neon-text">Alertas e Notificações</h1>
          <p className="text-gray-400">Novidades regulatórias e científicas</p>
        </div>
      </div>

      {/* Alert Categories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="data-card rounded-xl p-4 text-center holographic-border">
          <CardContent className="p-0">
            <i className="fas fa-gavel text-2xl text-red-400 mb-2" />
            <h3 className="font-semibold text-white">Regulatórios</h3>
            <span className="text-2xl font-bold text-red-400">{alertsByType["Regulatório"] || 0}</span>
          </CardContent>
        </Card>
        <Card className="data-card rounded-xl p-4 text-center holographic-border">
          <CardContent className="p-0">
            <i className="fas fa-microscope text-2xl text-emerald-400 mb-2" />
            <h3 className="font-semibold text-white">Científicos</h3>
            <span className="text-2xl font-bold text-emerald-400">{alertsByType["Científico"] || 0}</span>
          </CardContent>
        </Card>
        <Card className="data-card rounded-xl p-4 text-center holographic-border">
          <CardContent className="p-0">
            <i className="fas fa-exclamation-triangle text-2xl text-amber-400 mb-2" />
            <h3 className="font-semibold text-white">Segurança</h3>
            <span className="text-2xl font-bold text-amber-400">{alertsByType["Segurança"] || 0}</span>
          </CardContent>
        </Card>
        <Card className="data-card rounded-xl p-4 text-center holographic-border">
          <CardContent className="p-0">
            <i className="fas fa-lightbulb text-2xl text-blue-400 mb-2" />
            <h3 className="font-semibold text-white">Inovações</h3>
            <span className="text-2xl font-bold text-blue-400">{alertsByType["Inovação"] || 0}</span>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      {!alerts || alerts.length === 0 ? (
        <Card className="data-card rounded-xl p-8 text-center">
          <CardContent>
            <i className="fas fa-bell text-4xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Nenhum alerta encontrado</h3>
            <p className="text-gray-400">Novos alertas aparecerão aqui quando disponíveis.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {alerts.map((alert) => (
              <Card 
                key={alert.id} 
                className={`data-card rounded-xl holographic-border ${getBorderColor(alert.type)} ${
                  alert.isRead === 0 ? "ring-1 ring-neon-cyan/30" : ""
                }`}
                data-testid={`alert-card-${alert.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className={`w-12 h-12 ${getTypeColor(alert.type)} rounded-lg flex items-center justify-center mr-4 flex-shrink-0`}>
                      <i className={getTypeIcon(alert.type)} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{alert.message}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(alert.priority)}`}>
                            {alert.priority}
                          </span>
                          {alert.isRead === 0 && (
                            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
                          )}
                        </div>
                      </div>
                      {alert.description && (
                        <p className="text-gray-400 text-sm mb-3">{alert.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{alert.date}</span>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-sm text-neon-cyan hover:text-cyan-300 transition-colors"
                            data-testid={`read-more-${alert.id}`}
                          >
                            Ler mais
                          </Button>
                          {alert.isRead === 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(alert.id)}
                              className="text-sm text-gray-400 hover:text-white transition-colors"
                              disabled={markAsReadMutation.isPending}
                              data-testid={`mark-read-${alert.id}`}
                            >
                              {markAsReadMutation.isPending ? "Marcando..." : "Marcar como lido"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Alert Settings */}
          <Card className="data-card rounded-xl holographic-border">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Configurações de Alertas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-white mb-4">Tipos de Notificação</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        defaultChecked 
                        className="mr-3 rounded bg-cyber-light border-neon-cyan/30"
                        data-testid="notification-regulatory"
                      />
                      <span className="text-gray-300">Mudanças regulatórias</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        defaultChecked 
                        className="mr-3 rounded bg-cyber-light border-neon-cyan/30"
                        data-testid="notification-scientific"
                      />
                      <span className="text-gray-300">Novos estudos científicos</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-3 rounded bg-cyber-light border-neon-cyan/30"
                        data-testid="notification-safety"
                      />
                      <span className="text-gray-300">Alertas de segurança</span>
                    </label>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-4">Frequência</h3>
                  <select 
                    className="w-full bg-cyber-light border border-neon-cyan/30 rounded-lg px-4 py-2 text-white"
                    data-testid="notification-frequency"
                  >
                    <option value="immediate">Imediato</option>
                    <option value="daily">Diário</option>
                    <option value="weekly">Semanal</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
