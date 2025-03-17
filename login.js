document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      // Check for admin credentials
      if (email === "admin" && password === "admin") {
        // Redirect to admin.html
        window.location.href = "admin.html";
        return; // Stop further execution
      }

      // Send login request to the backend
      try {
        const response = await fetch("http://localhost:5502/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          Swal.fire({
            title: "Success!",
            text: data.message,
            icon: "success",
            confirmButtonText: "Continue",
          }).then(() => {
            window.location.href = "dashboard.html"; // Redirect to dashboard
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: data.message,
            icon: "error",
            confirmButtonText: "Try Again",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "An error occurred. Please try again.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    });
  }
});

// // Import Supabase client (ES modules)
// import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// // Initialize Supabase client
// const supabaseUrl = "https://db.lkirjepcrvbzctuwdqma.supabase.co"; // Replace with your Supabase URL
// const supabaseKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxraXJqZXBjcnZiemN0dXdkcW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMDUzNjgsImV4cCI6MjA1NzY4MTM2OH0.ygiGNGJyL19mmp3SIKZ96ZNKgF9nS6dc4VwtsGsqKyk"; // Replace with your Supabase key
// const supabase = createClient(supabaseUrl, supabaseKey);

// // Wait for the DOM to load
// document.addEventListener("DOMContentLoaded", () => {
//   // Login Form Submission
//   const loginForm = document.getElementById("login-form");
//   if (loginForm) {
//     loginForm.addEventListener("submit", async (e) => {
//       e.preventDefault();

//       const email = document.getElementById("email").value;
//       const password = document.getElementById("password").value;

//       // Check for admin credentials (hardcoded for demo purposes)
//       if (email === "admin" && password === "admin") {
//         window.location.href = "admin.html";
//         return;
//       }

//       // Sign in with Supabase
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) {
//         Swal.fire({
//           title: "Error!",
//           text: error.message,
//           icon: "error",
//           confirmButtonText: "Try Again",
//         });
//       } else {
//         Swal.fire({
//           title: "Success!",
//           text: `Welcome back, ${data.user.email}!`,
//           icon: "success",
//           confirmButtonText: "Continue",
//         }).then(() => {
//           window.location.href = "dashboard.html"; // Redirect to dashboard
//         });
//       }
//     });
//   }

//   // Forgot Password Form Submission
//   const forgotPasswordForm = document.getElementById("forgot-password-form");
//   if (forgotPasswordForm) {
//     forgotPasswordForm.addEventListener("submit", async (e) => {
//       e.preventDefault();

//       const email = document.getElementById("reset-email").value;

//       // Send password reset email
//       const { error } = await supabase.auth.resetPasswordForEmail(email);

//       if (error) {
//         Swal.fire({
//           title: "Error!",
//           text: error.message,
//           icon: "error",
//           confirmButtonText: "Try Again",
//         });
//       } else {
//         Swal.fire({
//           title: "Success!",
//           text: "Password reset email sent. Check your inbox.",
//           icon: "success",
//           confirmButtonText: "Continue",
//         });
//       }
//     });
//   }

//   // Sign Up Form Submission
//   const signupForm = document.getElementById("signup-form");
//   if (signupForm) {
//     signupForm.addEventListener("submit", async (e) => {
//       e.preventDefault();

//       const fullName = document.getElementById("fullname").value;
//       const email = document.getElementById("signup-email").value;
//       const password = document.getElementById("signup-password").value;
//       const defaultLocation = document.getElementById("default_location").value;

//       // Sign up with Supabase
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//       });

//       if (error) {
//         Swal.fire({
//           title: "Error!",
//           text: error.message,
//           icon: "error",
//           confirmButtonText: "Try Again",
//         });
//       } else {
//         // Save additional user data to the profiles table
//         const { error: profileError } = await supabase.from("profiles").insert([
//           {
//             user_id: data.user.id, // Use user_id instead of id
//             name: fullName,
//             email,
//             default_location: defaultLocation,
//           },
//         ]);

//         if (profileError) {
//           console.error("Error saving profile:", profileError);
//           Swal.fire({
//             title: "Error!",
//             text: "Failed to save profile data.",
//             icon: "error",
//             confirmButtonText: "Try Again",
//           });
//         } else {
//           Swal.fire({
//             title: "Success!",
//             text: "Account created successfully.",
//             icon: "success",
//             confirmButtonText: "Continue",
//           }).then(() => {
//             window.location.href = "dashboard.html"; // Redirect to dashboard
//           });
//         }
//       }
//     });
//   }
// });
