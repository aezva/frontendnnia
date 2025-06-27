import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

const CHAT_SESSION_KEY = 'nnia_chat_messages';

const ChatAssistant = ({ userName }) => {
  const { client } = useAuth();
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem(CHAT_SESSION_KEY);
    return saved ? JSON.parse(saved) : [{
      id: 1,
      sender: 'assistant',
      text: `¡Buenas tardes, ${userName}! 👋\n\nPregunta o encuentra lo que quieras desde tu espacio de trabajo...`,
    }];
  });
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    sessionStorage.setItem(CHAT_SESSION_KEY, JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    const userMsg = { id: Date.now(), sender: 'user', text: newMessage };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/nnia/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client?.id,
          message: newMessage,
          source: 'client-panel',
          threadId,
        }),
      });
      const data = await res.json();
      if (data.nnia) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: 'assistant', text: data.nnia },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: 'assistant', text: 'No se recibió respuesta de NNIA.' },
        ]);
      }
      if (data.threadId) setThreadId(data.threadId);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 2, sender: 'assistant', text: 'Ocurrió un error al conectar con NNIA.' },
      ]);
    } finally {
      setLoading(false);
      setNewMessage('');
    }
  };

  // Limpia el chat al cerrar sesión
  useEffect(() => {
    if (!client) {
      sessionStorage.removeItem(CHAT_SESSION_KEY);
      setMessages([{
        id: 1,
        sender: 'assistant',
        text: `¡Buenas tardes, ${userName}! 👋\n\nPregunta o encuentra lo que quieras desde tu espacio de trabajo...`,
      }]);
    }
  }, [client, userName]);

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/logo-assistant.png" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl font-semibold">Asistente IA</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-[350px] md:h-[400px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={
                `rounded-2xl px-5 py-3 max-w-[80%] md:max-w-[65%] break-words shadow-sm ` +
                (msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-muted text-foreground rounded-bl-md')
              }>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground rounded-2xl px-5 py-3 max-w-[80%] md:max-w-[65%] shadow-sm opacity-70">
                NNIA está escribiendo...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
          <Input
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
            autoComplete="off"
          />
          <Button type="submit" size="icon" className="h-10 w-10">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatAssistant; 