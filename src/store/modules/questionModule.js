import questionService from '../../api/questionService'

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
    updateVote(state, { questionId, userId, type }) {
      state.questions = state.questions.map((question) => {
        if (question.id !== questionId) return question

        if (type === 'inc') {
          question.votes.push(userId)
          return question
        }

        question.votes = question.votes.filter((vote) => vote !== userId)
        return question
      })
    },
    addAnswerToQuestion(state, { questionId, answer }) {
      state.questions = state.questions.map((question) => {
        if (question.id !== questionId) return question

        question.answers.push(answer)
        return question
      })
    },
    updateAnswerVote(state, { questionId, answerId, userId, type }) {
      const question = state.questions.find((question) => question.id === questionId)
      question.answers = question.answers.map((answer) => {
        if (answer.id !== answerId) return answer

        if (type === 'inc') {
          answer.votes.push(userId)
        } else {
          answer.votes = answer.votes.filter((vote) => vote !== userId)
        }
        return answer
      })

      state.questions = state.questions.map((q) => (q.id === question.id ? question : q))
    }
  },
  actions: {
    async createQuestion({ commit }, question) {
      const newQuestion = await questionService.createQuestion(question)
      commit('addQuestion', newQuestion)
    },
    async getQuestions({ commit }) {
      const questions = await questionService.fetchQuestions()
      commit('setQuestions', questions)
    },
    async updateQuestionVote({ commit }, { questionId, userId, type }) {
      commit('updateVote', { type, questionId, userId })
      await questionService.updateQuestionVote({ questionId, userId, type })
    },
    async addAnswerToQuestion({ commit }, { questionId, answer }) {
      await questionService.addAnswerToQuestion(questionId, answer)
      commit('addAnswerToQuestion', { questionId, answer })
    },
    async updateAnswerVote({ commit }, { answerId, questionId, userId, type }) {
      commit('updateAnswerVote', { answerId, questionId, userId, type })
      await questionService.updateAnswerVote({ questionId, answerId, userId, type })
    }
  }
}
