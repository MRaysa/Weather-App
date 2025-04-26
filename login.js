import supabase from './supabase.js'

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  
  // Admin bypass (remove in production)
  if (email === 'admin@admin.com' && password === 'admin') {
    window.location.href = 'admin.html'
    return
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    Swal.fire({
      title: 'Login Failed',
      text: error.message,
      icon: 'error',
      confirmButtonText: 'Try Again'
    })
    return
  }

  // Success - redirect to dashboard
  window.location.href = 'dashboard.html'
})

// Guest login
document.getElementById('guestLogin').addEventListener('click', () => {
  window.location.href = 'guest_dashboard.html?guest=true'
})
