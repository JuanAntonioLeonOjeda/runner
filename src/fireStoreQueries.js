import { collection, getDocs, addDoc, orderBy, limit, query } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'
import { db } from "./fireStoreConfig.js"

async function getTopTen() {
  const usersCollection = collection(db, 'users')
  const q = query(usersCollection, orderBy('score', 'desc'), limit(10))

  const querySnapshot = await getDocs(q)
  const orderedScores = querySnapshot.docs.map(doc => doc.data())

  return orderedScores
}

async function insertUser(data) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name: data.name,
      score: data.score
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export {
  getTopTen,
  insertUser
}