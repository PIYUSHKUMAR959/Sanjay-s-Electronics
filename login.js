import { useState } from 'react'
import { useRouter } from 'next/router'
export default function AdminLogin(){
  const router = useRouter()
  const [email,setEmail] = useState('')
  const [pw,setPw] = useState('')

  async function login(e){
    e.preventDefault()
    // For production: perform Firebase Auth here.
    // This demo will redirect to /admin/dashboard if email matches env
    const allowed = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'Piyush90643@gmail.com'
    if(email.trim().toLowerCase() === allowed.toLowerCase()){
      // In production, verify password via Firebase Auth
      router.push('/admin/dashboard')
    } else {
      alert('Not allowed (demo): make sure admin email is created in Firebase Auth.')
    }
  }

  return (
    <div style={{padding:18}}>
      <div className="card" style={{maxWidth:520,margin:'0 auto'}}>
        <h2>Admin Login</h2>
        <form onSubmit={login}>
          <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} /></label>
          <label>Password<input type="password" value={pw} onChange={e=>setPw(e.target.value)} /></label>
          <div style={{marginTop:8}}><button className="btn" type="submit">Sign in</button></div>
        </form>
      </div>
    </div>
  )
}
