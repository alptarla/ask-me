import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db, makeResObject } from '../lib/firebase'

// utils
const userDoc = (id) => doc(db, 'users', id)
const getUser = async (id) => {
  const userRes = await getDoc(userDoc(id))
  return makeResObject(userRes)
}

export default {
  async signIn(email, password) {
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    return getUser(user.uid)
  },
  async signUp({ email, password, username }) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)

    await setDoc(userDoc(user.uid), {
      email: user.email,
      username,
      profileImage: user.photoURL
    })

    return getUser(user.uid)
  },
  fetchUserById: (id) => getUser(id),
  signOut: () => auth.signOut()
}
