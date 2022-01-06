<script>
export default {
  name: 'SignUp',
  data() {
    return {
      form: {
        fullName: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    handleFormSubmit() {
      console.log('form :>> ', this.form)
    }
  }
}
</script>

<template>
  <form class="form" @submit.prevent="handleFormSubmit">
    <b-field label="Full Name" expanded>
      <b-input v-model="form.fullName" />
    </b-field>
    <b-field grouped>
      <b-field label="Email" expanded>
        <b-input v-model="form.email" />
      </b-field>
      <b-field label="Password" expanded>
        <b-input v-model="form.password" />
      </b-field>
    </b-field>
    <b-button type="is-primary" native-type="submit">Sign up</b-button>
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
