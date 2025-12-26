(async ()=>{
  try{
    const email='indhu19164@gmail.com'
    const password='New!TpjpNP6cJH'
    const login = await fetch('http://localhost:4000/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})})
    const j = await login.json()
    console.log('login', login.status)
    const token = j.token
    if(!token) return console.error('no token')
    const res = await fetch('http://localhost:4000/api/users?role=learner',{headers:{'Authorization':`Bearer ${token}`}})
    console.log('users status', res.status)
    console.log(await res.json())
  }catch(e){ console.error(e) }
})()
