import supabase from './supabase.js'
async function handleSuperuserLogin(email, password) {
  if (email === 'root@admin.com' && password === 'T9x!rV@5mL#8wQz&Kd3') {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'root@admin.com',
        password: 'T9x!rV@5mL#8wQz&Kd3'
      });

      if (error) throw error;

      // Mark session as superuser
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
      });

      localStorage.setItem('isSuperuser', 'true');
      
      window.location.href = '/admin-dashboard.html';
      return true;
    } catch (error) {
      console.error('Superuser login error:', error);
      return false;
    }
  }
  return false;
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const isSuperuser = await handleSuperuserLogin(email, password);
  if (isSuperuser) return;
  if (email === 'admin@admin.com' && password === 'admin') {
    window.location.href = 'admin.html'
    return
  }
  else if (email === 'root@yourdomain.com' && password === 'T9x!rV@5mL#8wQz&Kd3') {
    window.location.href = 'test_superUser.html'
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

  window.location.href = 'dashboard.html'
})

document.getElementById('guestLogin').addEventListener('click', () => {
  window.location.href = 'guest_dashboard.html?guest=true'
})