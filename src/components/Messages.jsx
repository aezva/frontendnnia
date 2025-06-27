import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Send, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";

const Messages = () => {
  const { client } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!client) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('client_id', client.id)
        .order('timestamp', { ascending: true });

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        setMessages(data);
      }
      setLoading(false);
    };
    fetchMessages();
  }, [client, toast]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!client) return;

    const channel = supabase
      .channel(`public:messages:client_id=eq.${client.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `client_id=eq.${client.id}` }, (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [client]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    // 1. Guardar mensaje del usuario en Supabase
    const { error: userError } = await supabase
      .from('messages')
      .insert({
        client_id: client.id,
        sender: 'user',
        text: newMessage,
        source: 'web',
      });
    
    if (userError) {
      toast({ title: 'Error', description: userError.message, variant: 'destructive' });
      return;
    }

    // 2. Enviar mensaje al backend para obtener respuesta de NNIA
    try {
      const response = await fetch('/api/nnia/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client.id,
          message: newMessage,
          source: 'web',
        }),
      });
      const data = await response.json();
      if (data.nnia) {
        // 3. Guardar respuesta de NNIA en Supabase
        await supabase.from('messages').insert({
          client_id: client.id,
          sender: 'assistant',
          text: data.nnia,
          source: 'nnia',
        });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Error al obtener respuesta de NNIA', variant: 'destructive' });
    }
    setNewMessage('');
  };

  return (
    <>
      <Helmet>
        <title>Mensajes - Asistente IA</title>
      </Helmet>
      <div className="h-full flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Mensajes</h1>
        <Card className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-[calc(100vh-12rem)] bg-card/50">
          <div className="col-span-1 border-r border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar conversaciones..." className="pl-9" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 text-center text-muted-foreground text-sm">
              <p>Lista de conversaciones (próximamente)</p>
            </div>
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col">
            <div className="p-4 border-b border-border flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://i.pravatar.cc/150?u=visitor" />
                <AvatarFallback>V</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">Visitante Web</p>
                <p className="text-sm text-green-400">En línea</p>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {loading ? (
                <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} p-3 rounded-lg max-w-xs`}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
               <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border mt-auto">
              <div className="relative">
                <Input
                  placeholder="Escribe un mensaje..."
                  className="pr-12"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Messages;