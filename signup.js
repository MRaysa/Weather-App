// Option 1: Use the correct ES module import (recommended)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Option 2: Alternative CDN import (if esm.sh is blocked)
// import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2'

// Initialize Supabase client
const supabase = createClient(
  'https://csqxcidppjfcamonqpia.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzcXhjaWRwcGpmY2Ftb25xcGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMTQ3MDQsImV4cCI6MjA2MDc5MDcwNH0.h3wv7O81cvUbhatQnssAGuG3XFNnGDvBOziPY4v57h8'
)

document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  
  const email = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value
  const fullName = document.getElementById('fullName').value.trim()
  const location = document.getElementById('location').value.trim()

  // Basic validation
  if (!email || !password || !fullName || !location) {
    Swal.fire('Error', 'Please fill in all fields', 'error')
    return
  }

  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalBtnText = submitBtn.innerHTML
  submitBtn.disabled = true
  submitBtn.innerHTML = '<span>Creating Account...</span>'

  try {
    // Sign up user with metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          default_location: location
        },
        emailRedirectTo: window.location.origin
      }
    })

    if (error) throw error
    if (!data.user) throw new Error('User creation failed')

    Swal.fire({
      title: 'Success!',
      html: `Account created!<br>Check your email to verify your account.`,
      icon: 'success'
    }).then(() => {
      window.location.href = 'index.html'
    })

  } catch (error) {
    console.error('Signup error:', error)
    
    let errorMessage = 'Account creation failed. Please try again.'
    if (error.message.includes('already registered')) {
      errorMessage = 'This email is already registered'
    } else if (error.message.includes('invalid email')) {
      errorMessage = 'Please enter a valid email address'
    } else if (error.message.includes('password')) {
      errorMessage = 'Password must be at least 6 characters'
    }

    Swal.fire('Error', errorMessage, 'error')
  } finally {
    submitBtn.disabled = false
    submitBtn.innerHTML = originalBtnText
  }
})