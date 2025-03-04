// Login Form Submission
document.getElementById('login-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Check if both fields are filled in
  if (!email || !password) {
      alert('Please fill in all fields.');
      return;
  }

  console.log('Logging in with:', email, password);
  
  // Show success alert and redirect after 2 seconds
  Swal.fire({
      title: "Good job!",
      text: "Login successful! Redirecting...",
      icon: "success",
      timer: 2000,  // Alert duration of 2 seconds
  }).then(() => {
      // After the alert closes, redirect to the dashboard page
      window.location.href = 'dashboard.html';
  });
});

 
  // Forgot Password Form Submission
  document.getElementById('forgot-password-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('reset-email').value;
 
    if (!email) {
      alert('Please enter your email.');
      return;
    }
 
    console.log('Reset password for:', email);
    alert('Password reset link sent to your email.');
  });
 
  // Sign Up Form Submission
  document.getElementById('signup-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const fullName = document.getElementById('fullname').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
 
    if (!fullName || !email || !password) {
      alert('Please fill in all fields.');
      return;
    }
 
    console.log('Signing up with:', fullName, email, password);
    alert('Sign up successful! Redirecting...');
    window.location.href = 'dashboard.html';
  });

