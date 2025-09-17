# Recommended Firestore & Storage Rules (starter)

Firestore (allow reads publicly, writes only to admins using custom claims or server security):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{docId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    match /orders/{docId} {
      allow read: if request.auth != null && request.auth.token.admin == true;
      allow create: if true; // allow customers to create orders
    }
    match /repairs/{docId} {
      allow read: if request.auth != null && request.auth.token.admin == true;
      allow create: if true;
    }
  }
}
```

Storage rules (only allow authenticated admins to write):
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

To set `admin` custom claim on your admin user (in Firebase Admin SDK): set `admin=true` on the user.
