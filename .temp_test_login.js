(async ()=>{
  try{
    const res = await fetch('http://localhost:4000/api/auth/login', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ email: 'teacher@example.com', password: 'teach123' }) })
    console.log('status', res.status)
    const t = await res.text()
    console.log(t)
  }catch(e){ console.error(e) }
})()
