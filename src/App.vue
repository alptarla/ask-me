<script>
import { mapActions } from 'vuex'
import AppHeader from './components/AppHeader.vue'
export default {
  name: 'App',
  components: {
    AppHeader
  },
  methods: {
    ...mapActions('auth', ['loadAuthUser'])
  },
  mounted() {
    this.loadAuthUser()
  }
}
</script>

<template>
  <div class="app">
    <header class="header">
      <AppHeader />
    </header>
    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<style>
/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

body {
  font-family: 'Poppins', sans-serif;
}

.header {
  margin-bottom: 4rem;
}
</style>
