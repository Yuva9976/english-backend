(async ()=>{
  try{
    const res = await fetch('http://localhost:4000/api/auth/login', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ email: 'indhu19164@gmail.com', password: 'Tmp!Citadk16jH' }) })
    console.log('status', res.status)
    console.log(await res.json())
  }catch(e){ console.error(e) }
})()
