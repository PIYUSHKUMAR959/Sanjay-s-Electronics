import Razorpay from 'razorpay'
export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'})
  const {amount,currency,receipt} = req.body
  const key_id = process.env.RAZORPAY_KEY_ID
  const key_secret = process.env.RAZORPAY_KEY_SECRET
  if(!key_id || !key_secret) return res.status(500).json({error:'Razorpay keys not configured'})
  const razorpay = new Razorpay({key_id, key_secret})
  try{
    const options = { amount: Math.round(amount*100), currency: currency||'INR', receipt: receipt||('rcpt_'+Date.now()) }
    const order = await razorpay.orders.create(options)
    return res.status(200).json(order)
  }catch(e){
    console.error('Razorpay create order failed', e)
    return res.status(500).json({error:'Order creation failed'})
  }
}
