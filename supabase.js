// supabase.js
const { createClient } = supabase;
const supabaseUrl = 'https://lkirjepcrvbzctuwdqma.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxraXJqZXBjcnZiemN0dXdkcW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMDUzNjgsImV4cCI6MjA1NzY4MTM2OH0.ygiGNGJyL19mmp3SIKZ96ZNKgF9nS6dc4VwtsGsqKyk';
const supabase = createClient(supabaseUrl, supabaseKey);

// Export supabase client for use in other scripts
window.supabase = supabase;