let users = [
  {
    email: "user1@example.com",
    defaultLocation: "Dhaka, Bangladesh",
    savedLocations: ["New York, USA", "London, UK"],
  },
  {
    email: "user2@example.com",
    defaultLocation: "New York, USA",
    savedLocations: ["Paris, France", "Tokyo, Japan"],
  },
  {
    email: "user3@example.com",
    defaultLocation: "London, UK",
    savedLocations: ["Sydney, Australia", "Berlin, Germany"],
  },
];

function populateTable() {
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

function removeUser(index) {
  users.splice(index, 1);
  populateTable();
}

function handleLogout() {
  window.location.href = "index.html";
}

const logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", handleLogout);

populateTable();
