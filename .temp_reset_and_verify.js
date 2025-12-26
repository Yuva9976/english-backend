(async ()=>{
  try{
    const crypto = require('crypto')
    const email = 'indhu19164@gmail.com'
    const pwdRand = crypto.randomBytes(9).toString('base64').replace(/[^a-zA-Z0-9]/g,'')
    const newPassword = `New!${pwdRand.slice(0,10)}`
    console.log('Generated password:', newPassword)

    // 1) Request reset token
    const forgot = await fetch('http://localhost:4000/api/auth/forgot-password', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email }) })
    const forgotJson = await forgot.json()
    console.log('\nforgot-password status', forgot.status)
    console.log(JSON.stringify(forgotJson, null, 2))

    const resetToken = forgotJson.resetToken
    if(!resetToken){
      console.error('No resetToken returned; aborting')
      return
    }

    // 2) Apply new password
    const resetRes = await fetch('http://localhost:4000/api/auth/reset-password', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ token: resetToken, password: newPassword }) })
    const resetJson = await resetRes.json()
    console.log('\nreset-password status', resetRes.status)
    console.log(JSON.stringify(resetJson, null, 2))

    if(resetRes.status !== 200){
      console.error('Reset failed; aborting')
      return
    }

    // 3) Login with new password
    const login = await fetch('http://localhost:4000/api/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password: newPassword }) })
    const loginJson = await login.json()
    console.log('\nlogin status', login.status)
    console.log(JSON.stringify(loginJson, null, 2))

    if(!loginJson.token){
      console.error('Login failed after reset')
      return
    }

    // 4) Call /api/auth/me
    const me = await fetch('http://localhost:4000/api/auth/me', { headers: { 'Authorization': `Bearer ${loginJson.token}` } })
    console.log('\n/me status', me.status)
    console.log(await me.text())

    // Print final instruction
    console.log('\n=== COMPLETE ===')
    console.log('Use this to login in the browser:')
    console.log('Email:', email)
    console.log('Password:', newPassword)
  }catch(e){ console.error('Script error', e) }
})()
