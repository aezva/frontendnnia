import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Ticket, Users, BarChart3, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import ChatAssistant from './ChatAssistant';
import { fetchAppointments } from '@/services/appointmentsService';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { client } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalConversations: 0,
    openTickets: 0,
    totalCustomers: 0,
    resolutionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [nextAppointments, setNextAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!client) return;
      
      setLoading(true);
      try {
        // Obtener estadísticas de mensajes
        const { count: messageCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', client.id);

        // Obtener estadísticas de tickets
        const { count: ticketCount } = await supabase
          .from('tickets')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', client.id);

        // Obtener tickets abiertos
        const { count: openTicketCount } = await supabase
          .from('tickets')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', client.id)
          .eq('status', 'open');

        // Calcular tasa de resolución (tickets cerrados / total tickets)
        const { count: closedTicketCount } = await supabase
          .from('tickets')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', client.id)
          .eq('status', 'closed');

        const resolutionRate = ticketCount > 0 ? Math.round((closedTicketCount / ticketCount) * 100) : 0;

        // Por ahora, usar un valor fijo ya que no tenemos customer_id en messages
        const uniqueCustomerCount = 0;

        setStats({
          totalConversations: messageCount || 0,
          openTickets: openTicketCount || 0,
          totalCustomers: uniqueCustomerCount,
          resolutionRate: resolutionRate
        });

        // Obtener próximas citas pendientes
        const appointments = await fetchAppointments(client.id);
        const now = new Date();
        const pending = appointments
          .filter(a => (a.status === 'pending' || !a.status))
          .filter(a => {
            // Considera solo citas futuras
            const dateTime = new Date(`${a.date}T${a.time}`);
            return dateTime >= now;
          })
          .sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA - dateB;
          })
          .slice(0, 2);
        setNextAppointments(pending);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar las estadísticas',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Refrescar citas cada 20 segundos para mostrar nuevas citas en tiempo real
    if (client) {
      const interval = setInterval(async () => {
        try {
          const appointments = await fetchAppointments(client.id);
          const now = new Date();
          const pending = appointments
            .filter(a => (a.status === 'pending' || !a.status))
            .filter(a => {
              const dateTime = new Date(`${a.date}T${a.time}`);
              return dateTime >= now;
            })
            .sort((a, b) => {
              const dateA = new Date(`${a.date}T${a.time}`);
              const dateB = new Date(`${b.date}T${b.time}`);
              return dateA - dateB;
            })
            .slice(0, 2);
          setNextAppointments(pending);
        } catch (error) {
          console.error('Error refreshing appointments:', error);
        }
      }, 20000); // 20 segundos

      return () => clearInterval(interval);
    }
  }, [client, toast]);

  const statsData = [
    { 
      title: 'Conversaciones Totales', 
      value: stats.totalConversations.toLocaleString(), 
      icon: MessageSquare, 
      change: '+0%' 
    },
    { 
      title: 'Tickets Abiertos', 
      value: stats.openTickets.toString(), 
      icon: Ticket, 
      change: '+0%' 
    },
    { 
      title: 'Clientes Atendidos', 
      value: stats.totalCustomers.toString(), 
      icon: Users, 
      change: '+0%' 
    },
    { 
      title: 'Tasa de Resolución', 
      value: `${stats.resolutionRate}%`, 
      icon: BarChart3, 
      change: '+0%' 
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Asistente IA</title>
      </Helmet>
      <div className="space-y-8">
        {/* Chat tipo GPT al inicio */}
        <ChatAssistant userName={client?.name || 'Usuario'} />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Un resumen de la actividad de tu asistente.</p>
          </div>
        </div>

        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {statsData.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <stat.icon className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change} vs el mes pasado
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="grid gap-6 lg:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {/* Próximas citas pendientes */}
          <Card className="lg:col-span-1 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Próximas Citas Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              {nextAppointments.length === 0 ? (
                <div className="text-muted-foreground text-center p-4">No hay citas pendientes próximas.</div>
              ) : (
                <ul className="space-y-4">
                  {nextAppointments.map(appt => (
                    <li key={appt.id} className="border rounded-lg p-4 bg-white/80 flex flex-col gap-1 cursor-pointer hover:bg-blue-50 transition" onClick={() => navigate('/citas')}>
                      <div className="font-semibold">{appt.name} ({appt.email})</div>
                      <div className="text-sm text-muted-foreground">{appt.type} - {appt.date} {appt.time}</div>
                      <div className="text-xs text-muted-foreground">Origen: {appt.origin}</div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          {/* Conversaciones Recientes */}
          <Card className="lg:col-span-1 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Conversaciones Recientes</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground py-16">
              <p>Gráfico de conversaciones irá aquí.</p>
              <p className="text-sm">(Función en desarrollo)</p>
            </CardContent>
          </Card>
          {/* Rendimiento del Asistente */}
          <Card className="lg:col-span-1 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Rendimiento del Asistente</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground py-16">
              <p>Gráfico de rendimiento irá aquí.</p>
              <p className="text-sm">(Función en desarrollo)</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Dashboard;