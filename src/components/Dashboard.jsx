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
import { getCurrentDate, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
    // Actualizar fecha cada minuto
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      // Obtener fecha actual
      const today = await getCurrentDate();
      console.log('📅 Dashboard: Fecha actual:', today);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No hay usuario autenticado');
        return;
      }

      // Obtener citas pendientes (hoy y futuras)
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('business_id', user.id)
        .gte('appointment_date', today.toISOString().split('T')[0])
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true })
        .limit(5);

      if (error) {
        console.error('Error fetching appointments:', error);
        return;
      }

      setNextAppointments(data || []);
    } catch (error) {
      console.error('Error en fetchAppointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    return time.substring(0, 5); // HH:MM
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { label: 'Pendiente', variant: 'secondary' },
      'confirmed': { label: 'Confirmada', variant: 'default' },
      'cancelled': { label: 'Cancelada', variant: 'destructive' },
      'completed': { label: 'Completada', variant: 'outline' }
    };
    
    const config = statusConfig[status] || statusConfig['pending'];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

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
            <p className="text-muted-foreground">
              {formatDate(currentDate)}
            </p>
          </div>
          <Button onClick={() => navigate('/appointments')}>
            Ver todas las citas
          </Button>
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
                <div className="space-y-4">
                  {nextAppointments.slice(0, 5).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => navigate('/appointments')}
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{appointment.client_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.service_name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {new Date(appointment.appointment_date).toLocaleDateString('es-ES')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatTime(appointment.appointment_time)}
                        </p>
                        {getStatusBadge(appointment.status)}
                      </div>
                    </div>
                  ))}
                </div>
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