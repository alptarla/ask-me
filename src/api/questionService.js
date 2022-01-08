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
  },
  async updateAnswerVote({ questionId, answerId, type, userId }) {
    const questionDoc = doc(db, 'questions', questionId)
    const questionRes = await getDoc(questionDoc)

    const question = makeResObject(questionRes)
    question.answers = question.answers.map((answer) => {
      if (answer.id !== answerId) return answer
      if (type === 'inc') {
        answer.votes.push(userId)
      } else {
        answer.votes = answer.votes.filter((vote) => vote !== userId)
      }
      return answer
    })

    await updateDoc(questionDoc, { ...question })
  }
}
