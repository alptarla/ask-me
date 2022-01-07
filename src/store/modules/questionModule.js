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
    }
  }
}
