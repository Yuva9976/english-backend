// Simple test script to authenticate and exercise attendance APIs
const fetch = global.fetch || require('node-fetch')

const BASE = 'http://localhost:4000/api'

async function run(){
  try{
    console.log('Logging in as teacher...')
    const loginRes = await fetch(`${BASE}/auth/login`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email: 'teacher@example.com', password: 'teach123' }) })
    const loginJson = await loginRes.json()
    console.log('login status', loginRes.status)
    console.log(loginJson)
    const token = loginJson.token
    if(!token){
      console.error('No token returned; aborting tests')
      return
    }

    const headers = { 'Authorization': `Bearer ${token}` }

    console.log('\nFetching learners list...')
    const usersRes = await fetch(`${BASE}/users?role=learner`, { headers })
    console.log('users status', usersRes.status)
    const usersJson = await usersRes.json()
    console.log(usersJson)
    const learner = (usersJson.users && usersJson.users[0]) || null
    if(!learner){
      console.error('No learners found; aborting')
      return
    }

    console.log('\nRecording bulk attendance for learner:', learner.id)
    const today = new Date().toISOString().slice(0,10)
    const items = [{ userId: learner.id, date: today, status: 'present', note: 'Auto-test', lessonId: 'eng-101', sessionId: 's1' }]
    const bulkRes = await fetch(`${BASE}/attendance/bulk`, { method: 'POST', headers: {...headers, 'Content-Type':'application/json'}, body: JSON.stringify({ attendance: items }) })
    console.log('bulk status', bulkRes.status)
    console.log(await bulkRes.json())

    console.log('\nFetching attendance for learner...')
    const attRes = await fetch(`${BASE}/attendance/user/${learner.id}?from=${today}&to=${today}`, { headers })
    console.log('attendance status', attRes.status)
    console.log(await attRes.json())

  }catch(err){
    console.error('Test script error', err)
  }
}

run()
