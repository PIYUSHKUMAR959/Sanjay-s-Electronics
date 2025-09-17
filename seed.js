/**
 * Usage:
 * 1. Create a Firebase service account JSON and set env var:
 *    GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json
 * 2. Set env vars for project ID and admin email/password:
 *    FIREBASE_PROJECT_ID=your_project_id
 *    ADMIN_EMAIL=Piyush90643@gmail.com
 *    ADMIN_PASSWORD=nandani@12
 * 3. Run: node scripts/seed.js
 *
 * This script:
 * - Seeds demo products into Firestore
 * - Creates an admin user in Firebase Auth (email/password)
 *
 * IMPORTANT: You must run this locally where you control the service account file.
 */
const admin = require('firebase-admin')
const fs = require('fs')

if(!process.env.GOOGLE_APPLICATION_CREDENTIALS){
  console.error('Set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON file path.')
  process.exit(1)
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: process.env.FIREBASE_PROJECT_ID
})

const auth = admin.auth()
const db = admin.firestore()

async function main(){
  const products = [
    { name:'Samsung 55" QLED 4K Smart TV', short:'55 inch QLED Smart TV', price:69999, brand:'Samsung', category:'tv', image:'https://via.placeholder.com/800x600?text=Samsung+55', created: Date.now() },
    { name:'Sony Bravia 49" 4K Smart TV', short:'49 inch 4K Smart TV', price:54999, brand:'Sony', category:'tv', image:'https://via.placeholder.com/800x600?text=Sony+49', created: Date.now()-1000 },
    { name:'LG OLED 55" 4K TV', short:'55 inch OLED TV', price:129999, brand:'LG', category:'tv', image:'https://via.placeholder.com/800x600?text=LG+55', created: Date.now()-2000 },
    { name:'Mi 43" Smart TV', short:'43 inch Full HD', price:19999, brand:'Mi', category:'tv', image:'https://via.placeholder.com/800x600?text=Mi+43', created: Date.now()-3000 },
  ]

  console.log('Seeding products...')
  for(const p of products){
    await db.collection('products').add(p)
  }
  console.log('Products seeded.')

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  if(adminEmail && adminPassword){
    try{
      const user = await auth.getUserByEmail(adminEmail)
      console.log('Admin user already exists:', user.uid)
    }catch(e){
      const u = await auth.createUser({ email: adminEmail, password: adminPassword })
      console.log('Created admin user', u.uid)
      // Set custom claim 'admin' true (requires Firebase Admin privileges)
      await auth.setCustomUserClaims(u.uid, { admin: true })
      console.log('Set admin custom claim for', adminEmail)
    }
  } else {
    console.log('ADMIN_EMAIL or ADMIN_PASSWORD not provided; skipping admin creation.')
  }

  process.exit(0)
}

main().catch(e=>{ console.error(e); process.exit(1) })
