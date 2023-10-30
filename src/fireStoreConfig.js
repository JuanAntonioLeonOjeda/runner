import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'

const firebaseConfig = {
  apiKey: "AIzaSyAWUX2UaP9LZnUkUrMFEX4F2QfOsARVjtw",
  authDomain: "boda-ef1c7.firebaseapp.com",
  projectId: "boda-ef1c7",
  storageBucket: "boda-ef1c7.appspot.com",
  messagingSenderId: "15933979577",
  appId: "1:15933979577:web:59a1a0d22b4591308a5468"
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export { db }