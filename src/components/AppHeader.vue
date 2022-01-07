<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'AppHeader',
  computed: {
    ...mapState('auth', ['isLoggedIn'])
  },
  methods: {
    ...mapActions('auth', ['signOut']),
    async handleSignOutClick() {
      await this.signOut()
      this.$router.push('/auth/sign-in')
    }
  }
}
</script>

<template>
  <div class="header">
    <b-navbar class="container">
      <template #brand>
        <b-navbar-item tag="router-link" to="/">
          <span class="brand">AskMe</span>
          <i class="fas fa-question fa-2x" />
        </b-navbar-item>
      </template>
      <template #end>
        <b-navbar-item tag="div">
          <div class="buttons">
            <b-button v-if="isLoggedIn" type="is-light" @click="handleSignOutClick">
              Sign out
            </b-button>
            <template v-else>
              <router-link to="/auth/sign-up" class="button is-primary">Sign up</router-link>
              <router-link to="/auth/sign-in" class="button is-light">Log in</router-link>
            </template>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
  </div>
</template>

<style scoped>
.header {
  padding: 1rem 0;
  border-bottom: 2px solid hsl(0, 0%, 96%);
}

.brand {
  font-size: 24px;
}
</style>
