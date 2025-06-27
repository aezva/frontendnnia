import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cafolvqmbzzqwtmuyvnj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhZm9sdnFtYnp6cXd0bXV5dm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MDE1MjAsImV4cCI6MjA2NjM3NzUyMH0.UhBCK8wPxJvSD3hbuk17p4sW_dyB1EDPeHiZlWMRbDE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);