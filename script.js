// Import Supabase client (if using ES modules)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Rest of your code...
document.addEventListener('DOMContentLoaded', function () {
// Initialize Supabase client
const supabaseUrl = 'postgresql://postgres:[CSE309WebApp]@db.lkirjepcrvbzctuwdqma.supabase.co:5432/postgres';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxraXJqZXBjcnZiemN0dXdkcW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMDUzNjgsImV4cCI6MjA1NzY4MTM2OH0.ygiGNGJyL19mmp3SIKZ96ZNKgF9nS6dc4VwtsGsqKyk';
const supabase = createClient(supabaseUrl, supabaseKey);
  // Login Form Submission
  document.getElementById('login-form').addEventListener('submit', async function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // Check for admin credentials
      if (email === 'admin' && password === 'admin') {
          window.location.href = 'admin.html';
          return;
      }

      const { user, error } = await supabase.auth.signIn({ email, password });

      if (error) {
          Swal.fire({
              title: 'Error!',
              text: error.message,
              icon: 'error',
              confirmButtonText: 'Try Again',
          });
      } else {
          window.location.href = 'dashboard.html';
      }
  });

  // Forgot Password Form Submission
  document.getElementById('forgot-password-form')?.addEventListener('submit', async function (e) {
      e.preventDefault();

      const email = document.getElementById('reset-email').value;

      const { error } = await supabase.auth.api.resetPasswordForEmail(email);

      if (error) {
          Swal.fire({
              title: 'Error!',
              text: error.message,
              icon: 'error',
              confirmButtonText: 'Try Again',
          });
      } else {
          Swal.fire({
              title: 'Success!',
              text: 'Password reset email sent. Check your inbox.',
              icon: 'success',
              confirmButtonText: 'Continue',
          });
      }
  });

  // Sign Up Form Submission
  document.getElementById('signup-form')?.addEventListener('submit', async function (e) {
      e.preventDefault();

      const fullName = document.getElementById('fullname').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      const defaultLocation = document.getElementById('default_location').value;

      // Sign up with Supabase
      const { user, error } = await supabase.auth.signUp({ email, password });

      if (error) {
          Swal.fire({
              title: 'Error!',
              text: error.message,
              icon: 'error',
              confirmButtonText: 'Try Again',
          });
      } else {
          // Save additional user data to the profiles table
          const { error: profileError } = await supabase
              .from('profiles')
              .insert([{ 
                  user_id: user.id, // Use user_id instead of id
                  name: fullName, 
                  email, 
                  default_location: defaultLocation 
              }]);

          if (profileError) {
              console.error('Error saving profile:', profileError);
              Swal.fire({
                  title: 'Error!',
                  text: 'Failed to save profile data.',
                  icon: 'error',
                  confirmButtonText: 'Try Again',
              });
          } else {
              Swal.fire({
                  title: 'Success!',
                  text: 'Account created successfully.',
                  icon: 'success',
                  confirmButtonText: 'Continue',
              }).then(() => {
                  window.location.href = 'dashboard.html';
              });
          }
      }
  });
  
});