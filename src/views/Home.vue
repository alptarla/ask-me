<script>
import { mapState } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapState('auth', ['user'])
  }
}
</script>

<template>
  <div class="has-text-centered">Welcom {{ user.username }}</div>
</template>
