import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.use(Vuelidate)
Vue.use(Buefy)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
