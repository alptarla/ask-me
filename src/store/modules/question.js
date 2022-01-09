import questionApi from '../../api/question'

export default {
  namespaced: true,
  state: () => ({
    questions: []
  }),
  mutations: {
    setQuestions(state, questions) {
      state.questions = questions
    },
    addQuestion(state, question) {
      state.questions.push(question)
    },
    removeQuestion(state, id) {
      state.questions = state.questions.filter((question) => question.id !== id)
    },
    updateQuestion(state, newQuestion) {
      state.questions = state.questions.map((question) =>
        question.id === newQuestion.id ? newQuestion : question
      )
    },
    updateQuestionVote(state, { questionId, userId, type }) {
      state.questions = state.questions.map((question) => {
        if (question.id !== questionId) return question

        if (type === 'inc') question.votes.push(userId)
        else question.votes = question.votes.filter((v) => v !== userId)
        return question
      })
    },
    addAnswer(state, { id, answer }) {
      state.questions = state.questions.map((question) => {
        if (question.id !== id) return question
        question.answers.push(answer)
        return question
      })
    },
    updateAnswerVote(state, { questionId, answerId, userId, type }) {
      const question = state.questions.find((question) => question.id === questionId)
      question.answers = question.answers.map((answer) => {
        if (answer.id !== answerId) return answer

        if (type === 'inc') answer.votes.push(userId)
        else answer.votes = answer.votes.filter((id) => id !== userId)
        return answer
      })

      state.questions = state.questions.map((question) =>
        question.id === question.id ? question : question
      )
    },
    removeAnswer(state, { questionId, answerId }) {
      state.questions = state.questions.map((question) => {
        if (question.id !== questionId) return question
        question.answers = question.answers.filter((answer) => answer.id !== answerId)
        return question
      })
    },
    updateAnswer(state, { id, answer }) {
      state.questions = state.questions.map((question) => {
        if (question.id !== id) return question
        question.answers = question.answers.map((ans) => (ans.id === ans.id ? answer : ans))
        return question
      })
    }
  },
  actions: {
    async createQuestion({ commit }, { question }) {
      const newQuestion = await questionApi.createQuestion(question)
      commit('addQuestion', newQuestion)
    },
    async getQuestions({ commit }) {
      const questions = await questionApi.fetchQuestions()
      commit('setQuestions', questions)
    },
    async updateQuestionVote({ commit }, { questionId, userId, type }) {
      commit('updateQuestionVote', { questionId, userId, type })
      await questionApi.updateQuestionVote({ questionId, userId, type })
    },
    async removeQuestion({ commit }, { questionId }) {
      commit('removeQuestion', questionId)
      await questionApi.removeQuestion(questionId)
    },
    async updateQuestion({ commit }, { id, fields }) {
      const question = await questionApi.updateQuestion(id, fields)
      commit('updateQuestion', question)
    },
    async addAnswerToQuestion({ commit }, { id, answer }) {
      await questionApi.addAnswerToQuestion(id, answer)
      commit('addAnswer', { id, answer })
    },
    async updateAnswerVote({ commit }, { answerId, questionId, userId, type }) {
      commit('updateAnswerVote', { answerId, questionId, userId, type })
      await questionApi.updateAnswerVote({ questionId, answerId, userId, type })
    },
    async removeAnswerFromQuestion({ commit }, { answerId, questionId }) {
      commit('removeAnswer', { answerId, questionId })
      await questionApi.removeAnswerfromQuestion(questionId, answerId)
    },
    async updateAnswer({ commit }, { questionId, answerId, fields }) {
      const answer = await questionApi.updateAnswer({ questionId, answerId, fields })
      commit('updateAnswer', { id: questionId, answer })
    }
  }
}
