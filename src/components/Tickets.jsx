import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket, PlusCircle, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

const Tickets = () => {
  const { client } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!client) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('client_id', client.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        setTickets(data);
      }
      setLoading(false);
    };
    fetchTickets();
  }, [client, toast]);

  const handleNotImplemented = () => {
    toast({
      title: "🚧 ¡Función en construcción!",
      description: "Esta característica aún no está implementada, ¡pero puedes solicitarla en tu próximo prompt! 🚀",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'closed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      <Helmet>
        <title>Tickets - Asistente IA</title>
      </Helmet>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tickets de Soporte</h1>
            <p className="text-muted-foreground">Gestiona las incidencias de tus clientes.</p>
          </div>
          <Button onClick={handleNotImplemented}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Ticket
          </Button>
        </div>

        <Card className="bg-card/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-4 font-medium">Ticket ID</th>
                    <th className="p-4 font-medium">Asunto</th>
                    <th className="p-4 font-medium">Estado</th>
                    <th className="p-4 font-medium">Creación</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></td></tr>
                  ) : tickets.length === 0 ? (
                    <tr><td colSpan="4" className="text-center p-8 text-muted-foreground">No tienes tickets aún.</td></tr>
                  ) : (
                    tickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b border-border hover:bg-muted/50 cursor-pointer" onClick={handleNotImplemented}>
                        <td className="p-4 font-mono text-primary text-xs">{ticket.id.substring(0, 8)}</td>
                        <td className="p-4 font-medium">{ticket.title}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground">{new Date(ticket.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Tickets;