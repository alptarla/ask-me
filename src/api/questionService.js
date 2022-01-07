import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc
} from 'firebase/firestore'
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
  },
  async updateQuestionVote({ type, questionId, userId }) {
    const questionDoc = doc(db, 'questions', questionId)
    await updateDoc(questionDoc, {
      votes: type === 'inc' ? arrayUnion(userId) : arrayRemove(userId)
    })
  },
  async addAnswerToQuestion(questionId, answer) {
    await updateDoc(doc(db, 'questions', questionId), { answers: arrayUnion(answer) })
  }
}
