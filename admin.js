// Initialize Supabase (no authentication needed)
const supabase = window.supabase.createClient(
  'https://wyicgttorbmwngjmtsnu.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5aWNndHRvcmJtd25nam10c251Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NjA2NTksImV4cCI6MjA2MTIzNjY1OX0.2303RI9npdrVAQ2xLgg1Q7pLSIlDQXfxhUqdkpnmaj8'
);

// DOM Elements
const usersTableBody = document.getElementById('usersTableBody');
const totalUsersEl = document.getElementById('totalUsers');
const activeUsersEl = document.getElementById('activeUsers');
const newUsersEl = document.getElementById('newUsers');
const searchInput = document.getElementById('searchInput');
const refreshBtn = document.getElementById('refreshBtn');

// Main data loading function
async function loadData() {
  try {
    showLoadingState();
    
    // Fetch users without any authentication
    const { data: users, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    renderUsers(users || []);
    updateStats(users || []);

  } catch (error) {
    console.error("Error loading data:", error);
    showErrorState(error);
  }
}

// Render users to the table
function renderUsers(users) {
  if (!users || users.length === 0) {
    usersTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="no-data">No users found</td>
      </tr>
    `;
    return;
  }

  usersTableBody.innerHTML = users.map(user => `
    <tr>
      <td>${user.full_name || 'Unknown'}</td>
      <td>${user.email || 'No email'}</td>
      <td>${user.default_location || 'Not specified'}</td>
      <td>${formatDate(user.created_at)}</td>
      <td>User</td>
      <td class="actions">
        <button class="btn btn-primary" onclick="viewUser('${user.id}')">
          <i class="fas fa-eye"></i> View
        </button>
      </td>
    </tr>
  `).join('');
}

// Update statistics cards
function updateStats(users) {
  if (!users) return;
  
  const totalUsers = users.length;
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const newThisWeek = users.filter(user => 
    new Date(user.created_at) > oneWeekAgo
  ).length;

  totalUsersEl.textContent = totalUsers;
  newUsersEl.textContent = newThisWeek;
  activeUsersEl.textContent = 'N/A';
}

// Helper functions
function showLoadingState() {
  usersTableBody.innerHTML = `
    <tr>
      <td colspan="6" class="loading-state">
        <span class="spinner"></span> Loading users...
      </td>
    </tr>
  `;
  
  totalUsersEl.innerHTML = '<span class="spinner"></span>';
  activeUsersEl.innerHTML = '<span class="spinner"></span>';
  newUsersEl.innerHTML = '<span class="spinner"></span>';
}

function showErrorState(error) {
  usersTableBody.innerHTML = `
    <tr>
      <td colspan="6" class="error-state">
        Error loading data: ${error.message || 'Unknown error'}
      </td>
    </tr>
  `;
  
  totalUsersEl.textContent = 'Error';
  activeUsersEl.textContent = 'Error';
  newUsersEl.textContent = 'Error';
}

function formatDate(dateString) {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

// View user details (simple alert for demo)
function viewUser(userId) {
  const user = allUsers.find(u => u.id === userId);
  if (user) {
    alert(`User Details:\n\nName: ${user.full_name}\nEmail: ${user.email}\nLocation: ${user.default_location}`);
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', loadData);
refreshBtn.addEventListener('click', loadData);
searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase();
  const rows = usersTableBody.querySelectorAll('tr');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(term) ? '' : 'none';
  });
});

// Remove logout functionality since we're not authenticating
document.getElementById('logout').addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = 'index.html';
});