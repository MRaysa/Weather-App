// Fetch users from the backend
async function fetchUsers() {
  try {
    const response = await fetch("http://localhost:5502/users");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const users = await response.json();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Populate the table with users
async function populateTable() {
  const users = await fetchUsers();
  const tableBody = document.getElementById("user-table-body");

  tableBody.innerHTML = "";

  users.forEach((user, index) => {
    const row = document.createElement("tr");

    const userEmailCell = document.createElement("td");
    userEmailCell.textContent = user.email;
    row.appendChild(userEmailCell);

    const defaultLocationCell = document.createElement("td");
    defaultLocationCell.textContent = user.defaultLocation;
    row.appendChild(defaultLocationCell);

    const savedLocationsCell = document.createElement("td");
    savedLocationsCell.textContent = user.savedLocations.join(", ");
    row.appendChild(savedLocationsCell);

    const actionCell = document.createElement("td");
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("remove-button");
    removeButton.addEventListener("click", () => removeUser(index));
    actionCell.appendChild(removeButton);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
  });
}

// Remove a user (frontend-only for now)
function removeUser(index) {
  // This is a frontend-only removal. To persist changes, you need to update the backend.
  users.splice(index, 1);
  populateTable();
}

// Logout
function handleLogout() {
  window.location.href = "index.html";
}

const logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", handleLogout);

// Initialize table on page load
populateTable();
