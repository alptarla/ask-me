import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/authModule'
import question from './modules/questionModule'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    question
  }
})
