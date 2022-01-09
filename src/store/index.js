import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import question from './modules/question'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    question
  }
})
