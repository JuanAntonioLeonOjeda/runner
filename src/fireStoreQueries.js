import { collection, getDocs, addDoc, orderBy, limit, query, where, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'
import { db } from "./fireStoreConfig.js"

const usersCollection = collection(db, "users");

async function getTopTen() {
  const q = query(usersCollection, orderBy('score', 'desc'), limit(5))

  const querySnapshot = await getDocs(q)
  const orderedScores = querySnapshot.docs.map(doc => doc.data())

  return orderedScores
}

async function insertUser(data) {
  try {
    // Create a query against the 'users' collection
    const q = query(usersCollection, where("name", "==", data.name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // User exists, check the score
      let userDoc = querySnapshot.docs[0];
      let userData = userDoc.data();

      if (data.score > userData.score) {
        // Update the score if the new score is higher
        await updateDoc(userDoc.ref, {
          score: data.score,
        });
        console.log("Score updated for user:", data.name);
      } else {
        console.log(
          "New score is not higher than the existing score. No update made."
        );
      }
    } else {
      // User does not exist, add new user
      const docRef = await addDoc(collection(db, "users"), {
        name: data.name,
        score: data.score,
      });
      console.log("New user added with ID:", docRef.id);
    }
  } catch (e) {
    console.error("Error accessing the database: ", e);
  }
}


// async function insertUser(data) {
//   try {
//     const docRef = await addDoc(collection(db, "users"), {
//       name: data.name,
//       score: data.score
//     });
//   } catch (e) {
//     console.error("Error adding document: ", e);
//   }
// }

async function getAllPlayers() {
  try {
    const users = collection(db, 'users');
    const q = query(users, orderBy('score', 'desc'))

    const querySnapshot = await getDocs(q);
    const result = querySnapshot.docs.map(doc => doc.data());

    return result;
  } catch (error) {
    console.error(error)
  }
}

export {
  getTopTen,
  insertUser,
  getAllPlayers
}