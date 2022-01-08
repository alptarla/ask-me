import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db, makeResObject } from '../lib/firebase'

export default {
  async signIn(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const userSnapshot = await getDoc(doc(db, 'users', userCredential.user.uid))
    return makeResObject(userSnapshot)
  },
  async signUp({ email, password, username }) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)

    const userDoc = doc(db, 'users', userCredential.user.uid)
    await setDoc(userDoc, {
      email: userCredential.user.email,
      username,
      profileImage: userCredential.user.photoURL
    })

    const userRes = await getDoc(userDoc)
    return makeResObject(userRes)
  },
  async fetchUserById(id) {
    const userRes = await getDoc(doc(db, 'users', id))
    return makeResObject(userRes)
  },
  signOut: () => auth.signOut()
}
