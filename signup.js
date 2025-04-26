import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  'https://wyicgttorbmwngjmtsnu.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5aWNndHRvcmJtd25nam10c251Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NjA2NTksImV4cCI6MjA2MTIzNjY1OX0.2303RI9npdrVAQ2xLgg1Q7pLSIlDQXfxhUqdkpnmaj8'
  )


document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  
  const email = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value
  const fullName = document.getElementById('fullName').value.trim()
  const location = document.getElementById('location').value.trim()

  // Validate inputs
  if (!email || !password || !fullName || !location) {
    Swal.fire('Error', 'Please fill in all fields', 'error')
    return
  }

  const submitBtn = e.target.querySelector('button[type="submit"]')
  submitBtn.disabled = true
  submitBtn.innerHTML = '<span>Creating Account...</span>'

  try {
    // 1. Sign up user
    const { data: { user }, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {  // This stores data in auth.users table
          full_name: fullName,
          default_location: location
        }
      }
    })

    if (authError) throw authError
    if (!user) throw new Error('User creation failed')

    // 2. Create profile in public.profiles table (optional)
    // Wait 1 second to ensure user is propagated
    await new Promise(resolve => setTimeout(resolve, 1000))

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name: fullName,
        email,
        default_location: location
      })

    if (profileError && !profileError.message.includes('duplicate key')) {
      throw profileError
    }

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
    } else if (error.message.includes('permission denied')) {
      errorMessage = 'System configuration error. Please try again later.'
    }

    Swal.fire('Error', errorMessage, 'error')
  } finally {
    submitBtn.disabled = false
    submitBtn.innerHTML = '<span>Sign Up</span>'
  }
  // In your signup.js or via Supabase dashboard
await supabase.auth.signUp({
  email: 'admin@admin.com',
  password: 'admin',
  options: {
    data: {
      full_name: 'Admin User',
      default_location: 'Admin HQ'
    }
  }
});
})