// ChatProvider.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { ChatContext } from './ChatContext';

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hola, soy ChatGPT. ¿En qué puedo ayudarte?' }
  ]);

  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  useEffect(() => {
    try {
      const savedConvs = localStorage.getItem('conversations');
      if (savedConvs) {
        const parsed = JSON.parse(savedConvs);
        if (Array.isArray(parsed)) setConversations(parsed);
      }
    } catch (err) {
      console.warn('No se pudo parsear conversations desde localStorage:', err);
    }

    try {
      const savedMsgs = localStorage.getItem('messages');
      if (savedMsgs) {
        const parsedMsgs = JSON.parse(savedMsgs);
        if (Array.isArray(parsedMsgs)) setMessages(parsedMsgs);
      }
    } catch (err) {
      console.warn('No se pudo parsear messages desde localStorage:', err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('messages', JSON.stringify(messages));
    } catch (err) {
      console.warn('No se pudo guardar messages en localStorage:', err);
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem('conversations', JSON.stringify(conversations));
    } catch (err) {
      console.warn('No se pudo guardar conversations en localStorage:', err);
    }
  }, [conversations]);

  const messagesEqual = (a = [], b = []) => {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return false;
    }
  };

  const saveConversation = () => {
    const userMessages = messages.filter(m => m.type === 'user');
    if (!userMessages.length) return null;

    if (currentConversationId) {
      const existing = conversations.find(c => c.id === currentConversationId);
      if (existing && messagesEqual(existing.messages, messages)) {
        return null;
      }
    }

    const firstUserText = userMessages[0].text.trim();
    const title = firstUserText
      ? (firstUserText.slice(0, 60) + (firstUserText.length > 60 ? '...' : ''))
      : `Chat ${new Date().toLocaleString()}`;

    const conv = {
      id: Date.now(),
      title,
      createdAt: new Date().toISOString(),
      messages
    };

    setConversations(prev => [conv, ...prev]);
    return conv;
  };

  const handleNewChat = useCallback(() => {
    saveConversation();
    setMessages([{ type: 'bot', text: 'Hola, soy ChatGPT. ¿En qué puedo ayudarte?' }]);
    setCurrentConversationId(null);
  }, [messages, currentConversationId]);

  const loadConversation = useCallback((id) => {
    const conv = conversations.find(c => c.id === id);
    if (!conv) return;
    setMessages(conv.messages);
    setCurrentConversationId(id);
    setConversations(prev => [conv, ...prev.filter(c => c.id !== id)]);
  }, [conversations]);

  const deleteConversation = useCallback((id) => {
    if (!window.confirm('¿Borrar esta conversación? Esta acción no se puede deshacer.')) return;
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversationId === id) {
      setMessages([{ type: 'bot', text: 'Hola, soy ChatGPT. ¿En qué puedo ayudarte?' }]);
      setCurrentConversationId(null);
    }
  }, [currentConversationId]);

  return (
    <ChatContext.Provider value={{
      messages,
      setMessages,
      conversations,
      handleNewChat,
      loadConversation,
      deleteConversation,
      currentConversationId,
      setCurrentConversationId
    }}>
      {children}
    </ChatContext.Provider>
  );
};