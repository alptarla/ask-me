import authService from '../../api/authService'

export default {
  namespaced: true,
  state: () => ({
    user: {},
    isLoggedIn: false
  }),
  mutations: {
    setUser(state, user) {
      state.user = user
      state.isLoggedIn = true
    },
    removeUser(state) {
      state.user = {}
      state.isLoggedIn = false
    }
  },
  actions: {
    async signIn(context, { email, password }) {
      const user = await authService.signIn(email, password)
      context.commit('setUser', user)
    },
    async signUp(_, { email, password, username }) {
      await authService.signUp({ email, password, username })
    }
  }
}
