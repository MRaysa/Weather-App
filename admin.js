// Mock Data (Replace with data from your database/API)
let users = [
  {
    userId: 1,
    defaultLocation: "Dhaka, Bangladesh",
    savedLocations: ["New York, USA", "London, UK"],
  },
  {
    userId: 2,
    defaultLocation: "New York, USA",
    savedLocations: ["Paris, France", "Tokyo, Japan"],
  },
  {
    userId: 3,
    defaultLocation: "London, UK",
    savedLocations: ["Sydney, Australia", "Berlin, Germany"],
  },
];

// Function to Populate Table
function populateTable() {
  const tableBody = document.getElementById("user-table-body");

  // Clear existing rows
  tableBody.innerHTML = "";

  // Add rows for each user
  users.forEach((user, index) => {
    const row = document.createElement("tr");

    // User ID Column
    const userIdCell = document.createElement("td");
    userIdCell.textContent = user.userId;
    row.appendChild(userIdCell);

    // Default Location Column
    const defaultLocationCell = document.createElement("td");
    defaultLocationCell.textContent = user.defaultLocation;
    row.appendChild(defaultLocationCell);

    // Saved Locations Column
    const savedLocationsCell = document.createElement("td");
    savedLocationsCell.textContent = user.savedLocations.join(", ");
    row.appendChild(savedLocationsCell);

    // Remove Button Column
    const actionCell = document.createElement("td");
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("remove-button");
    removeButton.addEventListener("click", () => removeUser(index)); // Add event listener
    actionCell.appendChild(removeButton);
    row.appendChild(actionCell);

    // Add Row to Table
    tableBody.appendChild(row);
  });
}

// Function to Remove User
function removeUser(index) {
  users.splice(index, 1); // Remove user from the array
  populateTable(); // Refresh the table
}

// Function to Handle Logout
function handleLogout() {
  // Redirect to login page (index.html)
  window.location.href = "index.html";
}

// Add Event Listener to Logout Button
const logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", handleLogout);

// Populate Table on Page Load
populateTable();
