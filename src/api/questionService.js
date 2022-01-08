import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc
} from 'firebase/firestore'
import { db, makeResObject } from '../lib/firebase'

const getQuestion = async (id) => {
  const questionRes = await getDoc(doc(db, 'questions', id))
  return makeResObject(questionRes)
}

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
  async removeQuestion(questionId) {
    await deleteDoc(doc(db, 'questions', questionId))
  },
  async updateQuestion(questionId, fields) {
    await updateDoc(doc(db, 'questions', questionId), { ...fields })
  },
  async addAnswerToQuestion(questionId, answer) {
    await updateDoc(doc(db, 'questions', questionId), { answers: arrayUnion(answer) })
  },
  async updateAnswerVote({ questionId, answerId, type, userId }) {
    const question = await getQuestion(questionId)
    question.answers = question.answers.map((answer) => {
      if (answer.id !== answerId) return answer
      if (type === 'inc') {
        answer.votes.push(userId)
      } else {
        answer.votes = answer.votes.filter((vote) => vote !== userId)
      }
      return answer
    })

    await updateDoc(doc(db, 'questions', questionId), { ...question })
  },
  async removeAnswerfromQuestion(questionId, answerId) {
    const question = await getQuestion(questionId)
    question.answers = question.answers.filter((answer) => answer.id !== answerId)
    await updateDoc(doc(db, 'questions', questionId), { ...question })
  },
  async updateAnswer({ questionId, answerId, fields }) {
    const question = await getQuestion(questionId)
    question.answers = question.answers.map((answer) =>
      answer.id === answerId ? { ...answer, ...fields } : answer
    )
    await updateDoc(doc(db, 'questions', questionId), { ...question })
  }
}
