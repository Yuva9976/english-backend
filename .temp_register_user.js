(async ()=>{
  try{
    const crypto = require('crypto')
    const rand = crypto.randomBytes(9).toString('base64').replace(/[^a-zA-Z0-9]/g,'')
    const password = `Tmp!${rand.slice(0,10)}`
    const body = { name: 'Indhu', email: 'indhu19164@gmail.com', password }
    console.log('Registering user:', body.email)
    const res = await fetch('http://localhost:4000/api/auth/register', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) })
    const json = await res.json()
    console.log('status', res.status)
    console.log(JSON.stringify(json, null, 2))
    if(res.ok){
      console.log('\n=== REGISTRATION SUCCESS ===')
      console.log('email:', body.email)
      console.log('password:', password)
    } else {
      console.error('\nRegistration failed')
    }
  }catch(e){ console.error('Script error', e) }
})()
