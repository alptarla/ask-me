import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { db, makeResObject } from '../lib/firebase'

export default {
  async createQuestion(question) {
    const questionDoc = doc(db, 'questions', question.id)
    await setDoc(questionDoc, question)

    const questionRes = await getDoc(questionDoc)
    return makeResObject(questionRes)
  },
  async fetchQuestions() {
    const questionsRes = await getDocs(collection(db, 'questions'))
    return questionsRes.docs.map((doc) => makeResObject(doc))
  }
}
