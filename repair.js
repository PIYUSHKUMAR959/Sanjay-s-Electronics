import { useState } from 'react'

export default function Repair(){
  const [model,setModel] = useState('')
  const [phone,setPhone] = useState('')
  const [issue,setIssue] = useState('')
  const [sent,setSent] = useState(false)

  async function submit(){
    if(!model||!phone||!issue) return alert('Fill all fields')
    // For demo: save to Firestore if configured; else pretend success
    setSent(true)
  }

  return (
    <div style={{padding:18}}>
      <div className="card">
        <h2>Request Repair</h2>
        <div className="small">Only enter details. Admin will contact you.</div>
        <div style={{marginTop:12}}>
          <label>Model<input value={model} onChange={e=>setModel(e.target.value)} /></label>
          <label>Phone<input value={phone} onChange={e=>setPhone(e.target.value)} /></label>
          <label>Issue<textarea value={issue} onChange={e=>setIssue(e.target.value)} /></label>
          <div style={{marginTop:8}}>
            <button className="btn" onClick={submit}>Submit Request</button>
          </div>
          {sent && <div className="small" style={{marginTop:8,color:'green'}}>Request submitted (demo)</div>}
        </div>
      </div>
    </div>
  )
}
