import supabase from './supabase';

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

  // Regular user login
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
document.getElementById('forgot-password-form').addEventListener('submit', async function (e) {
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
document.getElementById('signup-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const fullName = document.getElementById('fullname').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  const { user, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    Swal.fire({
      title: 'Error!',
      text: error.message,
      icon: 'error',
      confirmButtonText: 'Try Again',
    });
  } else {
    // Save additional user data to profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: user.id, name: fullName, email }]);

    if (profileError) {
      console.error('Error saving profile:', profileError);
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