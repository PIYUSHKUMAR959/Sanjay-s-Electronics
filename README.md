# Sanjay Electronic — Next.js (Seller / Marketplace) Starter

This repository is a ready-to-deploy Next.js (pages-router) app for **Sanjay Electronic** — an Amazon-style marketplace + repair requests + admin panel.

## What’s included
- Next.js (pages) app
- Firebase client integration (Auth / Firestore / Storage)
- Admin login (email/password) page (connect to Firebase Auth)
- Products, Cart, Checkout (COD + Razorpay integration)
- API route `/api/create-order` to create Razorpay orders (server-side)
- Sample demo products.json (used if Firebase isn't configured yet)
- Clear setup steps below

> IMPORTANT: You must create a Firebase project and a Razorpay account, then add credentials to `.env.local` before deploying.

## Setup (local)
1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` in project root with the values below:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=app_id

# Razorpay (server-side) - keep SECRET safe (used only by serverless API)
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=rzp_test_secret_xxx

# Admin email allowed to manage the site
NEXT_PUBLIC_ADMIN_EMAIL=Piyush90643@gmail.com
```

3. Start dev server:
```bash
npm run dev
```

4. Create Firebase project and enable:
- Authentication (Email/Password)
- Firestore (create a collection `products` manually or use `demo/products.json`)
- Storage (for product images)

5. Create Razorpay account and get API keys (Key ID and Key Secret). Use test keys for development.

## Deployment
- Recommended: Deploy to **Vercel** (recommended for Next.js API routes).
- Alternatively: Use Firebase Hosting + Cloud Functions (extra setup) or Netlify (with serverless functions).

## Notes
- Admin account: create an account in Firebase Auth for `Piyush90643@gmail.com` with the password you provided.
- Do **not** store Razorpay secret on client-side. It is used only in server-side API route (`/api/create-order`).
- The project includes fallback demo products for quick testing if Firebase is not configured.

If you want, I can now:
- Walk you step-by-step through creating Firebase project and Razorpay account.
- Deploy this to Vercel for you (I’ll give exact env var steps).


## Seeding real data & creating admin (one-time)
To make the site *real* you should seed Firestore and create the admin user using the Firebase Admin SDK:

1. In Firebase Console → Project settings → Service accounts → Generate new private key. Save as `serviceAccount.json`.
2. Place `serviceAccount.json` in the project root (or set GOOGLE_APPLICATION_CREDENTIALS to its path).
3. Run:
```
export GOOGLE_APPLICATION_CREDENTIALS="./serviceAccount.json"
export FIREBASE_PROJECT_ID=your_project_id
export ADMIN_EMAIL=Piyush90643@gmail.com
export ADMIN_PASSWORD=nandani@12
node scripts/seed.js
```
This script will add sample products to `products` collection and create the admin Auth user with custom claim `admin: true`.

## Deploy to Vercel
1. Push this repo to GitHub.
2. Import project into Vercel.
3. Set environment variables (in Vercel dashboard):
   - NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, NEXT_PUBLIC_FIREBASE_APP_ID
   - RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
   - NEXT_PUBLIC_ADMIN_EMAIL=Piyush90643@gmail.com
4. Deploy. The API route `/api/create-order` will be able to create Razorpay orders using server-side secret.

Note: After seeding, the admin user will have `admin` custom claim — ensure Firestore security rules use that claim to allow writes.
