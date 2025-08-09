import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  category: string;
  replies: number;
  views: number;
  lastActivity: string;
  tags: string[];
  isPinned: boolean;
  isHot: boolean;
}

export default function ForumDashboard() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  const categories = [
    { id: "all", name: "Todas as Discussões", count: 24 },
    { id: "research", name: "Pesquisa Científica", count: 8 },
    { id: "clinical", name: "Casos Clínicos", count: 6 },
    { id: "dosing", name: "Protocolos & Dosagem", count: 5 },
    { id: "safety", name: "Segurança & Interações", count: 3 },
    { id: "regulatory", name: "Regulamentação", count: 2 },
  ];

  const forumPosts: ForumPost[] = [
    {
      id: "post-1",
      title: "Protocolo CBD para epilepsia refratária - Experiências clínicas",
      content: "Gostaria de discutir protocolos de CBD para epilepsia refratária em pacientes pediátricos. Tenho observado boa resposta com 20mg/kg/dia dividido em 2 doses, mas alguns colegas relatam melhor resposta com 3 doses diárias...",
      author: "Dr. Marina Santos",
      authorRole: "Neurologista Pediátrica",
      category: "clinical",
      replies: 12,
      views: 156,
      lastActivity: "2 horas atrás",
      tags: ["CBD", "Epilepsia", "Pediátrico"],
      isPinned: true,
      isHot: true,
    },
    {
      id: "post-2",
      title: "Interação CBD-Varfarina: Protocolos de monitoramento",
      content: "Após o alerta da Health Canada sobre interação CBD-varfarina, implementei protocolo rigoroso de monitoramento INR. Compartilho a experiência com 15 pacientes...",
      author: "Dr. Carlos Medeiros",
      authorRole: "Cardiologista",
      category: "safety",
      replies: 8,
      views: 89,
      lastActivity: "4 horas atrás",
      tags: ["CBD", "Varfarina", "Segurança", "INR"],
      isPinned: false,
      isHot: true,
    },
    {
      id: "post-3",
      title: "Nova RDC ANVISA 660/2022 - Mudanças na prescrição",
      content: "A nova resolução simplifica muito o processo de prescrição para epilepsia refratária e dor oncológica. Quais são as experiências dos colegas com o novo protocolo?",
      author: "Dra. Ana Paula Lima",
      authorRole: "Oncologista",
      category: "regulatory",
      replies: 15,
      views: 203,
      lastActivity: "1 dia atrás",
      tags: ["ANVISA", "RDC", "Prescrição"],
      isPinned: true,
      isHot: false,
    },
    {
      id: "post-4",
      title: "THC:CBD 1:1 para espasticidade em esclerose múltipla",
      content: "Resultados promissores com spray THC:CBD para espasticidade. Protocolo de titulação que tenho usado com 25 pacientes nos últimos 6 meses...",
      author: "Dr. Roberto Silva",
      authorRole: "Neurologista",
      category: "clinical",
      replies: 6,
      views: 78,
      lastActivity: "2 dias atrás",
      tags: ["THC", "CBD", "Esclerose múltipla"],
      isPinned: false,
      isHot: false,
    },
    {
      id: "post-5",
      title: "Meta-análise: Cannabis para dor neuropática crônica",
      content: "Discussão sobre os resultados da nova meta-análise publicada mostrando NNT=5.6 para cannabis medicinal em dor neuropática...",
      author: "Dr. Felipe Costa",
      authorRole: "Algologista",
      category: "research",
      replies: 9,
      views: 124,
      lastActivity: "3 dias atrás",
      tags: ["Meta-análise", "Dor neuropática", "Evidências"],
      isPinned: false,
      isHot: false,
    },
  ];

  const filteredPosts = activeCategory === "all" 
    ? forumPosts 
    : forumPosts.filter(post => post.category === activeCategory);

  const getCategoryBadge = (category: string) => {
    const badges = {
      research: { color: "bg-blue-500", text: "Pesquisa" },
      clinical: { color: "bg-green-500", text: "Clínico" },
      dosing: { color: "bg-purple-500", text: "Dosagem" },
      safety: { color: "bg-red-500", text: "Segurança" },
      regulatory: { color: "bg-yellow-500", text: "Regulação" },
    };
    const badge = badges[category as keyof typeof badges];
    return badge ? (
      <Badge className={`${badge.color} text-white text-xs`}>
        {badge.text}
      </Badge>
    ) : null;
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold neon-text mb-2">
                💬 Fórum de Discussão Científica
              </h1>
              <p className="text-gray-400">
                Espaço colaborativo para médicos discutirem cannabis medicinal
              </p>
            </div>
            <Button 
              onClick={() => setShowNewPost(true)}
              className="bg-neon-cyan text-cyber-dark hover:bg-cyan-400"
              data-testid="button-new-post"
            >
              <i className="fas fa-plus mr-2" />
              Nova Discussão
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  activeCategory === category.id
                    ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                    : "border-gray-600 hover:border-neon-cyan/50 hover:text-neon-cyan"
                }`}
                data-testid={`category-${category.id}`}
              >
                {category.name}
                <span className="ml-2 bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* New Post Modal */}
        {showNewPost && (
          <Card className="mb-6 bg-cyber-gray border-neon-cyan/30">
            <CardHeader>
              <CardTitle className="text-neon-cyan">Nova Discussão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Título da discussão..."
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="bg-cyber-dark border-gray-600 text-gray-100"
                data-testid="input-post-title"
              />
              <Textarea
                placeholder="Descreva sua questão ou experiência clínica..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={4}
                className="bg-cyber-dark border-gray-600 text-gray-100"
                data-testid="textarea-post-content"
              />
              <div className="flex gap-3">
                <Button 
                  className="bg-neon-cyan text-cyber-dark hover:bg-cyan-400"
                  data-testid="button-publish-post"
                >
                  Publicar Discussão
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewPost(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  data-testid="button-cancel-post"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Forum Posts */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card 
              key={post.id} 
              className={`bg-cyber-gray border-gray-600 hover:border-neon-cyan/50 transition-all cursor-pointer ${
                post.isPinned ? "border-yellow-500/50" : ""
              }`}
              data-testid={`post-${post.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {post.isPinned && (
                        <i className="fas fa-thumbtack text-yellow-500" />
                      )}
                      {post.isHot && (
                        <i className="fas fa-fire text-orange-500" />
                      )}
                      <h3 className="text-lg font-semibold text-gray-100 hover:text-neon-cyan transition-colors">
                        {post.title}
                      </h3>
                      {getCategoryBadge(post.category)}
                    </div>
                    
                    <p className="text-gray-300 mb-3 line-clamp-2">
                      {post.content}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>
                        <i className="fas fa-user-md mr-1" />
                        {post.author} - {post.authorRole}
                      </span>
                      <span>
                        <i className="fas fa-comments mr-1" />
                        {post.replies} respostas
                      </span>
                      <span>
                        <i className="fas fa-eye mr-1" />
                        {post.views} visualizações
                      </span>
                      <span>
                        <i className="fas fa-clock mr-1" />
                        {post.lastActivity}
                      </span>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      {post.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="text-xs border-gray-600 text-gray-400"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-cyber-gray border-gray-600">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-neon-cyan">24</div>
              <div className="text-sm text-gray-400">Discussões Ativas</div>
            </CardContent>
          </Card>
          <Card className="bg-cyber-gray border-gray-600">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">156</div>
              <div className="text-sm text-gray-400">Médicos Participando</div>
            </CardContent>
          </Card>
          <Card className="bg-cyber-gray border-gray-600">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-500">89</div>
              <div className="text-sm text-gray-400">Respostas Hoje</div>
            </CardContent>
          </Card>
          <Card className="bg-cyber-gray border-gray-600">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500">12</div>
              <div className="text-sm text-gray-400">Tópicos em Alta</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}