import authApi from '../../api/auth'
import storageApi from '../../api/storage'
import { auth } from '../../lib/firebase'

const initState = () => {
  const stored = storageApi.get('user')
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
          storageApi.remove('user')
          commit('removeUser')
          return
        }

        const authUser = await authApi.fetchUserById(user.uid)
        storageApi.set('user', authUser)
        commit('setUser', authUser)
      })
    },
    async signOut({ commit }) {
      await authApi.signOut()
      commit('removeUser')
    }
  }
}
