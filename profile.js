import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://lkirjepcrvbzctuwdqma.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxraXJqZXBjcnZiemN0dXdkcW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMDUzNjgsImV4cCI6MjA1NzY4MTM2OH0.ygiGNGJyL19mmp3SIKZ96ZNKgF9nS6dc4VwtsGsqKyk';
const supabase = createClient(supabaseUrl, supabaseKey);


// DOM Elements
const profileForm = document.getElementById('profile-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const profilePictureInput = document.getElementById('profile-picture');
const profilePicturePreview = document.getElementById('profile-picture-preview');
const saveButton = document.getElementById('save-button');
const messageDiv = document.getElementById('message');

// Fetch and display the user's profile data
async function fetchProfile() {
  const user = supabase.auth.user();
  if (!user) {
    window.location.href = 'login.html'; // Redirect to login if not authenticated
    return;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    showMessage('Error fetching profile data.', 'error');
  } else {
    // Populate form fields
    nameInput.value = data.name || '';
    emailInput.value = data.email || '';
    profilePicturePreview.src = data.profile_picture || 'images/default-profile.png';
  }
}

// Update the user's profile
async function updateProfile() {
  const user = supabase.auth.user();
  if (!user) {
    window.location.href = 'login.html'; // Redirect to login if not authenticated
    return;
  }

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const profilePictureFile = profilePictureInput.files[0];

  try {
    // Update name and email in the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ name, email })
      .eq('id', user.id);

    if (profileError) throw profileError;

    // Update email in Supabase authentication
    if (email !== user.email) {
      const { error: authError } = await supabase.auth.update({ email });
      if (authError) throw authError;
    }

    // Update password if provided
    if (password) {
      const { error: passwordError } = await supabase.auth.update({ password });
      if (passwordError) throw passwordError;
    }

    // Upload and update profile picture if provided
    if (profilePictureFile) {
      const filePath = `profile-pictures/${user.id}/${profilePictureFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, profilePictureFile);

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded image
      const { publicURL } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      // Update profile picture URL in the profiles table
      const { error: pictureError } = await supabase
        .from('profiles')
        .update({ profile_picture: publicURL })
        .eq('id', user.id);

      if (pictureError) throw pictureError;

      // Update the profile picture preview
      profilePicturePreview.src = publicURL;
    }

    showMessage('Profile updated successfully!', 'success');
  } catch (error) {
    console.error('Error updating profile:', error);
    showMessage('Error updating profile. Please try again.', 'error');
  }
}

// Show a message to the user
function showMessage(message, type) {
  messageDiv.textContent = message;
  messageDiv.className = type; // 'success' or 'error'
  setTimeout(() => {
    messageDiv.textContent = '';
    messageDiv.className = '';
  }, 5000);
}

// Handle form submission
profileForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  saveButton.disabled = true;
  await updateProfile();
  saveButton.disabled = false;
});

// Preview profile picture before uploading
profilePictureInput.addEventListener('change', () => {
  const file = profilePictureInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePicturePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Initialize profile manager on page load
fetchProfile();