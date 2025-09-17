import { useEffect, useState } from 'react'
import Link from 'next/link'
import initFirebase from '../lib/firebaseClient'
import { collection, getDocs } from 'firebase/firestore'

const demoProducts = [
  { id:'p1', name:'Samsung 55" QLED 4K Smart TV', short:'55 inch QLED Smart TV', price:69999, brand:'Samsung', category:'tv', image:'/demo/samsung.jpg', created: Date.now() },
  { id:'p2', name:'Sony Bravia 49" 4K Smart TV', short:'49 inch 4K Smart TV', price:54999, brand:'Sony', category:'tv', image:'/demo/sony.jpg', created: Date.now()-1000 },
  { id:'p3', name:'LG OLED 55" 4K TV', short:'55 inch OLED TV', price:129999, brand:'LG', category:'tv', image:'/demo/lg.jpg', created: Date.now()-2000 },
  { id:'p4', name:'Mi 43" Smart TV', short:'43 inch Full HD', price:19999, brand:'Mi', category:'tv', image:'/demo/mi.jpg', created: Date.now()-3000 },
]

export default function Home(){
  const [products, setProducts] = useState(demoProducts)
  const [query, setQuery] = useState('')

  useEffect(()=>{
    // Try to load real products from Firestore if config is present
    async function load(){ 
      try{
        const { db } = initFirebase;
        const snap = await getDocs(collection(db,'products'));
        const arr = [];
        snap.forEach(s=> arr.push({ id: s.id, ...s.data() }));
        if(arr.length) setProducts(arr.sort((a,b)=> (b.created||0)-(a.created||0)));
      }catch(e){
        console.log('Firestore not configured or failed to load products, using demo products', e);
      }
    }
    load();
  },[])

  const filtered = products.filter(p=> p.name.toLowerCase().includes(query.toLowerCase()) || p.short.toLowerCase().includes(query.toLowerCase()) )

  return (
    <>
      <header className="header">
        <div style={{fontWeight:900,display:'flex',alignItems:'center',gap:8}}><span style={{background:'#fff',padding:'6px 8px',borderRadius:6,color:'#ff9900'}}>SE</span> Sanjay Electronic</div>
        <div style={{flex:1,display:'flex',alignItems:'center',gap:8}}>
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search TVs, parts, services..." style={{flex:1,padding:10,borderRadius:6,border:'1px solid rgba(0,0,0,0.08)'}}/>
          <button className="btn">Search</button>
        </div>
        <div style={{display:'flex',gap:8}}>
          <Link href="/repair"><a className="btn" style={{background:'#222',color:'#fff'}}>Repair</a></Link>
          <Link href="/admin/login"><a className="btn">Admin</a></Link>
        </div>
      </header>

      <main className="container">
        <h2>Top Products</h2>
        <div className="grid">
          {filtered.map(p=>(
            <div key={p.id} className="card">
              <img src={p.image} alt={p.name} style={{width:'100%',height:160,objectFit:'cover',borderRadius:6}}/>
              <div style={{fontWeight:700,marginTop:8}}>{p.name}</div>
              <div className="small">{p.short}</div>
              <div style={{marginTop:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{fontWeight:800,color:'#ff9900'}}>₹{p.price}</div>
                <div style={{display:'flex',gap:8}}>
                  <Link href={'/product/'+p.id}><a className="btn">View</a></Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
