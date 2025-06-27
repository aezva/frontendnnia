import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, LogOut, User, Lock, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Helmet } from 'react-helmet';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, client, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "🚧 ¡Función en construcción!",
      description: "La actualización de perfil estará disponible pronto.",
    });
  };

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await signOut();
    if (error) {
      toast({ title: 'Error al cerrar sesión', description: error.message, variant: 'destructive' });
      setLoading(false);
    } else {
      navigate('/login');
      toast({ title: 'Has cerrado sesión exitosamente.' });
    }
  };
  
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <>
      <Helmet>
        <title>Ajustes - Asistente IA</title>
      </Helmet>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ajustes de Usuario</h1>
          <p className="text-muted-foreground">Gestiona tu perfil y la seguridad de tu cuenta.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center"><User className="mr-3 h-6 w-6 text-primary" />Perfil de Usuario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={client?.profile_image_url} />
                  <AvatarFallback>{getInitials(client?.name)}</AvatarFallback>
                </Avatar>
                <Button type="button" variant="outline" onClick={() => toast({ title: "🚧 Próximamente..." })}>Cambiar Foto</Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" defaultValue={client?.name || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email || ''} disabled />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center"><Lock className="mr-3 h-6 w-6 text-primary" />Seguridad</CardTitle>
              <CardDescription>Cambia tu contraseña.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Contraseña Actual</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input id="newPassword" type="password" />
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-between items-center">
            <Button type="button" variant="destructive" onClick={handleLogout} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
              Cerrar Sesión
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Settings;