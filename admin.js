// Initialize Supabase
const supabase = window.supabase.createClient(
  'https://wyicgttorbmwngjmtsnu.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5aWNndHRvcmJtd25nam10c251Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NjA2NTksImV4cCI6MjA2MTIzNjY1OX0.2303RI9npdrVAQ2xLgg1Q7pLSIlDQXfxhUqdkpnmaj8'
);

// DOM Elements
const usersTableBody = document.getElementById('usersTableBody');
const totalUsersEl = document.getElementById('totalUsers');
const activeUsersEl = document.getElementById('activeUsers');
const newUsersEl = document.getElementById('newUsers');

// Completely remove admin check - just load the data
async function loadData() {
  try {
    // Show loading state
    usersTableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center;">
          <span class="spinner"></span> Loading data...
        </td>
      </tr>
    `;

    // Fetch users
    const { data: users, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Render users
    if (users.length === 0) {
      usersTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center;">No users found</td>
        </tr>
      `;
    } else {
      usersTableBody.innerHTML = users.map(user => `
        <tr>
          <td>${user.full_name || 'Unknown'}</td>
          <td>${user.email || 'No email'}</td>
          <td>${user.default_location || 'Not specified'}</td>
          <td>${new Date(user.created_at).toLocaleDateString()}</td>
          <td>
            <button class="btn btn-danger delete-btn" data-id="${user.id}">
              <i class="fas fa-trash"></i> Delete
            </button>
          </td>
        </tr>
      `).join('');
    }

    // Fetch stats
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const { count: newThisWeek } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo.toISOString());

    // Update stats
    totalUsersEl.textContent = totalUsers || '0';
    newUsersEl.textContent = newThisWeek || '0';
    activeUsersEl.textContent = 'N/A';

  } catch (error) {
    console.error("Error loading data:", error);
    usersTableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: red;">
          Failed to load data. Check console for details.
        </td>
      </tr>
    `;
  }
}

// Handle delete
document.addEventListener('click', async (e) => {
  if (e.target.closest('.delete-btn')) {
    const button = e.target.closest('.delete-btn');
    const userId = button.dataset.id;
    const row = button.closest('tr');
    
    if (confirm("Are you sure you want to delete this user?")) {
      row.classList.add('loading');
      button.disabled = true;
      button.innerHTML = '<span class="spinner"></span> Deleting...';

      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);

        if (error) throw error;
        
        row.remove();
        await loadData(); // Refresh data after delete
      } catch (error) {
        console.error("Delete error:", error);
        row.classList.remove('loading');
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-trash"></i> Delete';
        alert("Failed to delete user");
      }
    }
  }
});

// Refresh button
document.getElementById('refreshBtn').addEventListener('click', loadData);

// Logout button
document.getElementById('logout').addEventListener('click', async (e) => {
  e.preventDefault();
  await supabase.auth.signOut();
  window.location.href = 'index.html';
});

// Load data when page loads
document.addEventListener('DOMContentLoaded', loadData);