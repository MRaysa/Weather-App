import supabase from './supabase.js'

document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const fullName = document.getElementById('fullName').value
  const location = document.getElementById('location').value

  const submitBtn = e.target.querySelector('button[type="submit"]')
  submitBtn.disabled = true
  submitBtn.innerHTML = '<span>Creating Account...</span>'

  try {
    // 1. Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })

    if (authError) {
      throw new Error(`Auth error: ${authError.message}`)
    }

    if (!authData.user) {
      throw new Error('No user returned after signup')
    }

    // 2. Create profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name: fullName,
        email,
        default_location: location
      })
      .select()
      .single()

    if (profileError) {
      throw new Error(`Profile error: ${profileError.message}`)
    }

    console.log('Successfully created profile:', profileData)
    
    Swal.fire({
      title: 'Success!',
      html: `Account created!<br>You can now log in.`,
      icon: 'success'
    }).then(() => {
      window.location.href = 'index.html'
    })

  } catch (error) {
    console.error('Signup error:', error)
    Swal.fire({
      title: 'Error',
      text: error.message,
      icon: 'error'
    })
    
    // Optional: Delete the auth user if profile creation failed
    if (authData?.user) {
      await supabase.auth.admin.deleteUser(authData.user.id)
    }
  } finally {
    submitBtn.disabled = false
    submitBtn.innerHTML = '<span>Sign Up</span>'
  }
})