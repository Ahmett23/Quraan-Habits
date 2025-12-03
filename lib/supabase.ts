import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qlkugqdojokjaqcymkcr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsa3VncWRvam9ramFxY3lta2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NTM0NjQsImV4cCI6MjA4MDMyOTQ2NH0.4dLsX72Rc2ZRZDomBzYSPa7mRYVgTHNtJRBws8Wehfc';

export const supabase = createClient(supabaseUrl, supabaseKey);