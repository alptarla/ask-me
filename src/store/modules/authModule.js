import authApi from '../../api/authApi'
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
    async signIn({ commit }, { email, password }) {
      const user = await authApi.signIn(email, password)
      commit('setUser', user)
    },
    async signUp({ commit }, { email, password, username }) {
      const user = await authApi.signUp({ email, password, username })
      commit('setUser', user)
    },
    async loadAuthUser({ commit }) {
      auth.onAuthStateChanged(async (user) => {
        if (!user) {
          localStorage.removeItem('user')
          commit('removeUser')
          return
        }

        const authUser = await authApi.fetchUserById(user.uid)
        localStorage.setItem('user', JSON.stringify(authUser))
        commit('setUser', authUser)
      })
    },
    async signOut({ commit }) {
      await authApi.signOut()
      commit('removeUser')
    }
  }
}
