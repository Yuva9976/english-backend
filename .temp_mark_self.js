(async ()=>{
  try{
    const email='indhu19164@gmail.com'
    const password='New!TpjpNP6cJH'
    const login = await fetch('http://localhost:4000/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})})
    const j = await login.json()
    console.log('login', login.status)
    const token = j.token
    if(!token) return console.error('no token')
    const today = new Date().toISOString().slice(0,10)
    const res = await fetch('http://localhost:4000/api/attendance/record',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},body:JSON.stringify({ userId: j.user.id, date: today, status: 'present' })})
    console.log('mark status', res.status)
    console.log(await res.json())
  }catch(e){ console.error(e) }
})()
