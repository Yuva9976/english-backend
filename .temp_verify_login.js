(async ()=>{
  try{
    const email = 'indhu19164@gmail.com'
    const password = 'Tmp!Citadk16jH' // replace with printed password if changed
    const res = await fetch('http://localhost:4000/api/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) })
    console.log('status', res.status)
    console.log(await res.json())
  }catch(e){ console.error(e) }
})()
