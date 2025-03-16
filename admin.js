// Fetch users from Supabase
async function fetchUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  return data;
}

// Populate the table with users
async function populateTable() {
  const users = await fetchUsers();
  const tableBody = document.getElementById('user-table-body');

  tableBody.innerHTML = '';

  users.forEach((user, index) => {
    const row = document.createElement('tr');

    const userEmailCell = document.createElement('td');
    userEmailCell.textContent = user.email;
    row.appendChild(userEmailCell);

    const defaultLocationCell = document.createElement('td');
    defaultLocationCell.textContent = user.default_location;
    row.appendChild(defaultLocationCell);

    const savedLocationsCell = document.createElement('td');
    savedLocationsCell.textContent = user.saved_locations.join(', ');
    row.appendChild(savedLocationsCell);

    const actionCell = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.classList.add('remove-button');
    removeButton.addEventListener('click', () => removeUser(user.id));
    actionCell.appendChild(removeButton);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
  });
}

// Remove a user from Supabase
async function removeUser(userId) {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (error) {
    console.error('Error removing user:', error);
  } else {
    populateTable(); // Refresh the table
  }
}

// Logout
function handleLogout() {
  supabase.auth.signOut().then(() => {
    window.location.href = 'index.html';
  });
}

const logoutButton = document.getElementById('logout-button');
logoutButton.addEventListener('click', handleLogout);

// Initialize table on page load
populateTable();