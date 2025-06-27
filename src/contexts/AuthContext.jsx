import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Nueva función para obtener el id de business_info
  const fetchBusinessInfoId = useCallback(async (clientId) => {
    if (!clientId) return null;
    try {
      const { data, error } = await supabase
        .from('business_info')
        .select('id')
        .eq('client_id', clientId)
        .single();
      if (error) {
        console.error('Error fetching business_info:', error);
        return null;
      }
      return data?.id || null;
    } catch (error) {
      console.error('Error in fetchBusinessInfoId:', error);
      return null;
    }
  }, []);

  // Función para obtener los datos del cliente desde Supabase
  const fetchClientData = useCallback(async (userId) => {
    if (!userId) return null;
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', userId)
        .single();

      let clientData = data;

      if (error) {
        if (error.code === 'PGRST116') {
          // Cliente no existe, crear uno nuevo
          const { data: newClient, error: createError } = await supabase
            .from('clients')
            .insert({
              user_id: userId,
              email: user?.email || '',
              onboarding_completed: false,
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating client:', createError);
            return null;
          }
          clientData = newClient;
        } else {
          console.error('Error fetching client:', error);
          return null;
        }
      }

      // Buscar el id de business_info y añadirlo al objeto client
      const businessInfoId = await fetchBusinessInfoId(clientData.id);
      return { ...clientData, businessInfoId };
    } catch (error) {
      console.error('Error in fetchClientData:', error);
      return null;
    }
  }, [user?.email, fetchBusinessInfoId]);

  // Función para refrescar los datos del cliente
  const refreshClient = useCallback(async () => {
    if (!user?.id) return;
    
    const clientData = await fetchClientData(user.id);
    setClient(clientData);
  }, [user?.id, fetchClientData]);

  const handleSession = useCallback(async (session) => {
    setSession(session);
    setUser(session?.user ?? null);
    
    if (session?.user) {
      // Obtener datos del cliente cuando hay sesión
      const clientData = await fetchClientData(session.user.id);
      setClient(clientData);
    } else {
      setClient(null);
    }
    
    setLoading(false);
  }, [fetchClientData]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        handleSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);

  const signUp = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error en el registro",
        description: error.message || "Algo salió mal",
      });
    }

    return { error };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error al iniciar sesión",
        description: error.message || "Algo salió mal",
      });
    }

    return { error };
  }, [toast]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        variant: "destructive",
        title: "Error al cerrar sesión",
        description: error.message || "Algo salió mal",
      });
    } else {
      // Limpiar estado del cliente al cerrar sesión
      setClient(null);
    }

    return { error };
  }, [toast]);

  const value = useMemo(() => ({
    user,
    session,
    client,
    loading,
    signUp,
    signIn,
    signOut,
    refreshClient,
  }), [user, session, client, loading, signUp, signIn, signOut, refreshClient]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};