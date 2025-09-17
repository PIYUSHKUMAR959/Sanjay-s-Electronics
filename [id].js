import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import initFirebase from '../../lib/firebaseClient'
import { doc, getDoc } from 'firebase/firestore'

export default function ProductPage(){
  const router = useRouter()
  const { id } = router.query
  const [p, setP] = useState(null)
  useEffect(()=>{
    if(!id) return
    async function load(){
      try{
        const { db } = initFirebase;
        const d = await getDoc(doc(db,'products',id));
        if(d.exists()) setP({ id: d.id, ...d.data() });
        else setP(null)
      }catch(e){
        console.error(e)
      }
    }
    load()
  },[id])
  if(!p) return <div style={{padding:24}}>Loading...</div>
  return (
    <div style={{padding:18}}>
      <div style={{display:'grid',gridTemplateColumns:'420px 1fr',gap:18}}>
        <div style={{background:'#fff',padding:12,borderRadius:8}}><img src={p.image} style={{width:'100%',height:360,objectFit:'contain'}}/></div>
        <div style={{background:'#fff',padding:12,borderRadius:8}}>
          <h2>{p.name}</h2>
          <div className="small">{p.short}</div>
          <div style={{fontWeight:800,color:'#ff9900',marginTop:8}}>₹{p.price}</div>
          <div style={{marginTop:12,display:'flex',gap:8}}>
            <button className="btn" onClick={()=>{ if(typeof window !== 'undefined'){ const cart = JSON.parse(localStorage.getItem('cart'||'[]')||'[]'); cart.push({id:p.id,name:p.name,price:p.price,qty:1}); localStorage.setItem('cart',JSON.stringify(cart)); alert('Added to cart') } }}>Add to Cart</button>
            <Link href="/repair"><a className="btn" style={{background:'#222',color:'#fff'}}>Request Repair</a></Link>
          </div>
          <hr style={{margin:'12px 0'}}/>
          <div>{p.desc}</div>
        </div>
      </div>
    </div>
  )
}
