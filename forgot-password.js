import supabase from './supabase.js'

document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  
  const email = document.getElementById('email').value

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://yourdomain.com/update-password'
  })

  if (error) {
    Swal.fire({
      title: 'Error',
      text: error.message,
      icon: 'error'
    })
    return
  }

  Swal.fire({
    title: 'Email Sent',
    html: `Password reset link sent to <strong>${email}</strong>.<br>Check your inbox.`,
    icon: 'success'
  }).then(() => {
    window.location.href = 'index.html'
  })
})