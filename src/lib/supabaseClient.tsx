// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Access the environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseKey);
