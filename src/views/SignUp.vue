<script>
import { email, required } from 'vuelidate/lib/validators'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'SignUp',
  data() {
    return {
      form: {
        fullName: '',
        email: '',
        password: ''
      },
      loading: false
    }
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required
      },
      fullName: {
        required
      }
    }
  },
  computed: {
    ...mapState('auth', ['user'])
  },
  methods: {
    ...mapActions('auth', ['signUp']),
    displayNotification(type, message) {
      this.$buefy.notification.open({
        duration: 2000,
        message,
        type,
        position: 'is-top-right'
      })
    },
    async handleSubmit() {
      this.$v.$touch()
      if (this.$v.$invalid) return

      try {
        this.loading = true
        const { email, password, fullName } = this.form
        await this.signUp({ email, password, username: fullName })

        this.displayNotification('is-success', `Welcome ${this.user.username}!`)
        this.$router.push('/')
      } catch (error) {
        this.displayNotification('is-danger', 'Authentication denied!')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template>
  <form class="form" @submit.prevent="handleSubmit">
    <b-field label="Full Name" expanded :type="$v.form.fullName.$error ? 'is-danger' : null">
      <b-input v-model="$v.form.fullName.$model" />
      <div v-if="$v.form.fullName.$error" class="has-text-danger">
        <small v-if="!$v.form.fullName.required">Full Name is required!</small>
      </div>
    </b-field>
    <b-field grouped>
      <b-field label="Email" expanded :type="$v.form.email.$error ? 'is-danger' : null">
        <b-input v-model="$v.form.email.$model" />
        <div v-if="$v.form.email.$error" class="has-text-danger">
          <small v-if="!$v.form.email.required">Email is required!</small>
          <small v-if="!$v.form.email.email">Please enter a valid email!</small>
        </div>
      </b-field>
      <b-field label="Password" expanded :type="$v.form.password.$error ? 'is-danger' : null">
        <b-input type="password" v-model="$v.form.password.$model" />
        <div v-if="$v.form.password.$error" class="has-text-danger">
          <small v-if="!$v.form.password.required">Password is required!</small>
        </div>
      </b-field>
    </b-field>
    <b-button type="is-primary" native-type="submit" :loading="loading" :disabled="$v.$invalid">
      Sign up
    </b-button>
  </form>
</template>

<style scoped>
.form {
  max-width: 600px;
  margin: 0 auto;
  border: 2px solid hsl(0, 0%, 96%);
  padding: 2rem 4rem;
  border-radius: 0.5rem;
}
</style>
