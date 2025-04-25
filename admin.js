import supabase from './supabase.js'

// Check admin status
async function checkAdmin() {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || user.email !== 'admin@gmail.com') {
    window.location.href = 'index.html'
    return false
  }
  return true
}

// Load admin data
async function loadAdminData() {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return

  // Get user stats
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })

  document.getElementById('totalUsers').textContent = totalUsers || 0

  // Get recent signups
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  const tbody = document.querySelector('#usersTable tbody')
  tbody.innerHTML = recentUsers.map(user => `
    <tr>
      <td>${user.full_name}</td>
      <td>${user.email}</td>
      <td>${user.default_location}</td>
      <td>${new Date(user.created_at).toLocaleDateString()}</td>
    </tr>
  `).join('')
}

// Logout
document.getElementById('logout').addEventListener('click', async () => {
  await supabase.auth.signOut()
  window.location.href = 'index.html'
})

// Initialize
document.addEventListener('DOMContentLoaded', loadAdminData)