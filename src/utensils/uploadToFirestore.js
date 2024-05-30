
// This file is for uplading json file to firestore

const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = require('./serviceAccountKey.json');

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Read the JSON file
const data = JSON.parse(
  fs.readFileSync('E:\\TodoApp\\src\\utensils\\jsonData.json', 'utf8'),
);

// Function to upload data to Firestore
async function uploadData() {
  const batch = db.batch();

  data.forEach(doc => {
    if (doc.id) {
      // Check if the 'id' field exists
      const docRef = db.collection('todo').doc(doc.id.toString()); // Use the 'id' as the document reference
      batch.set(docRef, doc);
    } else {
      console.error('Document does not have an id field', doc);
    }
  });

  await batch.commit();
  console.log('Data successfully uploaded to Firestore!');
}

uploadData().catch(console.error);
