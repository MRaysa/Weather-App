window.onload = function () {
    const userData = JSON.parse(localStorage.getItem("userProfile")) || {
        name: "John Doe",
        email: "johndoe@example.com",
        profilePicture: "default-avatar.png",
    };

    document.getElementById("userName").value = userData.name;
    document.getElementById("userEmail").value = userData.email;
    document.getElementById("profilePic").src = userData.profilePicture;
};

// Update user profile (save changes)
function updateUserProfile() {
    const name = document.getElementById("userName").value.trim();

    if (name === "") {
        alert("Name cannot be empty.");
        return;
    }

    const userData = {
        name: name,
        email: document.getElementById("userEmail").value,
        profilePicture: document.getElementById("profilePic").src,
    };

    localStorage.setItem("userProfile", JSON.stringify(userData));
    alert("Profile updated successfully!");
}

// Upload and preview profile picture
function uploadProfilePicture() {
    const fileInput = document.getElementById("profilePicInput");
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            document.getElementById("profilePic").src = e.target.result;

            // Save the new profile picture in local storage
            const userData = JSON.parse(localStorage.getItem("userProfile")) || {};
            userData.profilePicture = e.target.result;
            localStorage.setItem("userProfile", JSON.stringify(userData));
        };

        reader.readAsDataURL(file);
    } else {
        alert("Please select a valid image file.");
    }
}

// Change password (dummy function)
function changePassword() {
    const newPassword = document.getElementById("newPassword").value;

    if (newPassword.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    alert("Password changed successfully! (Not stored for security reasons)");
}

// Delete user account
function deleteAccount() {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        localStorage.removeItem("userProfile");
        alert("Account deleted successfully!");
        window.location.reload(); // Reload the page to reset everything
    }
}