(async ()=>{
  try{
    const email = 'indhu19164@gmail.com'
    const password = 'Tmp!Citadk16jH'
    console.log('Logging in', email)
    const login = await fetch('http://localhost:4000/api/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) })
    const loginJson = await login.json()
    console.log('login status', login.status)
    console.log(JSON.stringify(loginJson, null, 2))

    const token = loginJson.token
    if(!token){ console.error('No token returned'); process.exit(1) }

    console.log('\nCalling /api/auth/me with Authorization header')
    const me = await fetch('http://localhost:4000/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } })
    console.log('me status', me.status)
    console.log(await me.text())
  }catch(e){ console.error('error', e) }
})()
