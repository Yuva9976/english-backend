(async ()=>{
  try{
    const res = await fetch('http://localhost:4000/api/users?role=learner')
    console.log('status', res.status)
    console.log(await res.json())
  }catch(e){ console.error(e) }
})()
