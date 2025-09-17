import Link from 'next/link'
import { useEffect, useState } from 'react'
import initFirebase from '../../lib/firebaseClient'
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function Dashboard(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { db, storage } = initFirebase

  useEffect(()=>{ refresh() },[])

  async function refresh(){
    setLoading(true)
    try{
      const snap = await getDocs(collection(db,'products'))
      const arr = []
      snap.forEach(s=> arr.push({ id: s.id, ...s.data() }))
      setProducts(arr)
    }catch(e){ console.error(e) }
    setLoading(false)
  }

  async function newProduct(){
    const name = prompt('Product name'); if(!name) return
    const price = parseFloat(prompt('Price')||0)
    const short = prompt('Short description')||''
    // For image uploading quickly, we allow URL input
    const image = prompt('Image URL (or leave blank to upload later)')||''
    await addDoc(collection(db,'products'), { name, short, price, image, created: Date.now(), category:'tv' })
    await refresh()
  }

  async function del(id){
    if(!confirm('Delete?')) return
    await deleteDoc(doc(db,'products',id))
    await refresh()
  }

  return (
    <div style={{padding:18}}>
      <div style={{display:'flex',gap:12,alignItems:'center',justifyContent:'space-between'}}>
        <h2>Admin Dashboard</h2>
        <div><Link href="/admin/login"><a className="btn btn-ghost">Sign out</a></Link></div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'240px 1fr',gap:12,marginTop:12}}>
        <div className="card">
          <h3>Menu</h3>
          <ul style={{listStyle:'none',padding:0}}>
            <li><a href="#products">Products</a></li>
            <li><a href="#orders">Orders</a></li>
            <li><a href="#repairs">Repairs</a></li>
            <li><a href="#settings">Settings</a></li>
          </ul>
        </div>
        <div>
          <section id="products" className="card"><h3>Products</h3>
            <div style={{marginTop:8}}><button className="btn" onClick={newProduct}>+ New product</button></div>
            {loading? <div className="small">Loading…</div> : products.map(p=>(
              <div key={p.id} style={{display:'flex',gap:8,alignItems:'center',padding:'8px 0',borderBottom:'1px solid #f1f1f1'}}>
                <div style={{width:84,height:64,overflow:'hidden'}}><img src={p.image} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
                <div style={{flex:1}}><strong>{p.name}</strong><div className="small">₹{p.price}</div></div>
                <div style={{display:'flex',flexDirection:'column',gap:6}}><button className="btn" onClick={()=>{ const nm = prompt('New name',p.name); if(!nm) return; updateDoc(doc(db,'products',p.id),{name:nm}) }}>Edit</button><button className="btn ghost" onClick={()=>del(p.id)}>Delete</button></div>
              </div>
            ))}
          </section>
          <section id="orders" className="card" style={{marginTop:12}}><h3>Orders</h3><p>Orders will appear here when customers place them.</p></section>
          <section id="repairs" className="card" style={{marginTop:12}}><h3>Repair Requests</h3><p>Repair requests will appear here.</p></section>
          <section id="settings" className="card" style={{marginTop:12}}><h3>Settings</h3><p>Manage allowed delivery cities (Gaya only by default).</p></section>
        </div>
      </div>
    </div>
  )
}
