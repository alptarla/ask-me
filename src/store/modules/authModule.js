import authService from '../../api/authService'
import { auth } from '../../lib/firebase'

const initState = () => {
  const stored = JSON.parse(localStorage.getItem('user'))
  return stored ? { isLoggedIn: true, user: stored } : { isLoggedIn: false, user: {} }
}

export default {
  namespaced: true,
  state: initState,
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
    },
    async loadAuthUser({ commit }) {
      auth.onAuthStateChanged(async (user) => {
        if (!user) {
          localStorage.removeItem('user')
          commit('removeUser')
          return
        }

        const authUser = await authService.fetchUserById(user.uid)
        localStorage.setItem('user', JSON.stringify(authUser))
        commit('setUser', authUser)
      })
    }
  }
}
