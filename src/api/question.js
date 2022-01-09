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

// utils
const questionDoc = (id) => doc(db, 'questions', id)
const questionCollection = collection(db, 'questions')

const getQuestion = async (id) => {
  const res = await getDoc(questionDoc(id))
  return makeResObject(res)
}

export default {
  async createQuestion(question) {
    await setDoc(questionDoc(question.id), question)
    return getQuestion(question.id)
  },
  async fetchQuestions() {
    const res = await getDocs(questionCollection)
    return res.docs.map((doc) => makeResObject(doc))
  },
  async updateQuestionVote({ type, questionId, userId }) {
    const newVotes = type === 'inc' ? arrayUnion(userId) : arrayRemove(userId)
    await updateDoc(questionDoc(questionId), { votes: newVotes })
  },
  removeQuestion: (id) => deleteDoc(questionDoc(id)),
  async updateQuestion(id, fields) {
    await updateDoc(questionDoc(id), fields)
    return getQuestion(id)
  },
  addAnswerToQuestion: (id, answer) => updateDoc(questionDoc(id), { answers: arrayUnion(answer) }),
  async updateAnswerVote({ questionId, answerId, type, userId }) {
    const question = await getQuestion(questionId)
    const answerIdx = question.answers.findIndex((answer) => answer.id === answerId)
    let votes = question.answers[answerIdx].votes

    if (type === 'inc') votes.push(userId)
    else votes = votes.filter((vote) => vote !== userId)

    question.answers[answerIdx].votes = votes
    await updateDoc(questionDoc(questionId), question)
  },
  async removeAnswerfromQuestion(questionId, answerId) {
    const question = await getQuestion(questionId)
    question.answers = question.answers.filter((answer) => answer.id !== answerId)
    await updateDoc(questionDoc(questionId), question)
  },
  async updateAnswer({ questionId, answerId, fields }) {
    const question = await getQuestion(questionId)
    question.answers = question.answers.map((answer) =>
      answer.id === answerId ? { ...answer, ...fields } : answer
    )
    await updateDoc(questionDoc(questionId), question)

    const newQuestion = await getQuestion(questionId)
    return newQuestion.answers.find((answer) => answer.id === answerId)
  }
}
