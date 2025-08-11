import { useState, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  lastActivity: number;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('neurocann-conversations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConversations(parsed.conversations || []);
        if (parsed.currentId) {
          const current = parsed.conversations?.find((c: Conversation) => c.id === parsed.currentId);
          setCurrentConversation(current || null);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    }
  }, []);

  // Save to localStorage whenever conversations change
  useEffect(() => {
    localStorage.setItem('neurocann-conversations', JSON.stringify({
      conversations,
      currentId: currentConversation?.id || null
    }));
  }, [conversations, currentConversation]);

  const createNewConversation = (firstMessage?: string): Conversation => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: firstMessage ? 
        (firstMessage.length > 30 ? firstMessage.substring(0, 30) + '...' : firstMessage) :
        `Nova Conversa ${conversations.length + 1}`,
      messages: [],
      createdAt: Date.now(),
      lastActivity: Date.now()
    };

    setConversations(prev => [newConv, ...prev]);
    setCurrentConversation(newConv);
    return newConv;
  };

  const addMessage = (message: Message, conversationId?: string) => {
    const targetId = conversationId || currentConversation?.id;
    if (!targetId) {
      // Create new conversation if none exists
      const newConv = createNewConversation(message.role === 'user' ? message.content : undefined);
      setConversations(prev => 
        prev.map(c => 
          c.id === newConv.id 
            ? { ...c, messages: [message], lastActivity: Date.now() }
            : c
        )
      );
      return;
    }

    setConversations(prev =>
      prev.map(conv =>
        conv.id === targetId
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastActivity: Date.now(),
              title: conv.messages.length === 0 && message.role === 'user' 
                ? (message.content.length > 30 ? message.content.substring(0, 30) + '...' : message.content)
                : conv.title
            }
          : conv
      )
    );

    // Update current conversation if it's the target
    if (currentConversation?.id === targetId) {
      setCurrentConversation(prev => 
        prev ? {
          ...prev,
          messages: [...prev.messages, message],
          lastActivity: Date.now()
        } : null
      );
    }
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversation?.id === id) {
      setCurrentConversation(null);
    }
  };

  const selectConversation = (conversation: Conversation | null) => {
    setCurrentConversation(conversation);
  };

  const mergeConversations = (ids: string[]) => {
    const toMerge = conversations.filter(c => ids.includes(c.id));
    if (toMerge.length < 2) return;

    // Create merged conversation
    const allMessages = toMerge
      .flatMap(c => c.messages.map(m => ({ ...m, sourceConv: c.title })))
      .sort((a, b) => a.timestamp - b.timestamp);

    const mergedTitle = `Mesclagem: ${toMerge.map(c => c.title).join(' + ')}`;
    
    const merged: Conversation = {
      id: `merged-${Date.now()}`,
      title: mergedTitle.length > 50 ? mergedTitle.substring(0, 50) + '...' : mergedTitle,
      messages: allMessages,
      createdAt: Date.now(),
      lastActivity: Date.now()
    };

    // Remove original conversations and add merged
    setConversations(prev => [
      merged,
      ...prev.filter(c => !ids.includes(c.id))
    ]);
    
    setCurrentConversation(merged);
  };

  const createDocument = (conversationIds: string[]) => {
    const sourceConversations = conversations.filter(c => conversationIds.includes(c.id));
    
    let document = `# Documento Gerado - ${new Date().toLocaleDateString('pt-BR')}\n\n`;
    
    sourceConversations.forEach(conv => {
      document += `## ${conv.title}\n`;
      document += `*Criado em: ${new Date(conv.createdAt).toLocaleDateString('pt-BR')}*\n\n`;
      
      conv.messages.forEach(msg => {
        const sender = msg.role === 'user' ? '👤 **Usuário**' : '🤖 **Dr. Cannabis IA**';
        document += `${sender}:\n${msg.content}\n\n---\n\n`;
      });
      
      document += '\n';
    });

    // Create a new conversation with the document
    const docConv: Conversation = {
      id: `doc-${Date.now()}`,
      title: `📄 Documento ${new Date().toLocaleDateString('pt-BR')}`,
      messages: [
        {
          role: 'assistant',
          content: document,
          timestamp: Date.now()
        }
      ],
      createdAt: Date.now(),
      lastActivity: Date.now()
    };

    setConversations(prev => [docConv, ...prev]);
    setCurrentConversation(docConv);
  };

  return {
    conversations,
    currentConversation,
    createNewConversation,
    addMessage,
    deleteConversation,
    selectConversation,
    mergeConversations,
    createDocument,
    clearCurrentConversation: () => setCurrentConversation(null)
  };
}