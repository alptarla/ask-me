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
    }
  }
}
