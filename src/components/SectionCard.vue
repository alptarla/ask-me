<script>
export default {
  name: 'SectionCard',
  props: {
    username: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      default: ''
    },
    isOwner: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<template>
  <div class="card p-5 is-flex is-align-items-flex-start">
    <slot name="card-left" />
    <div class="card-content">
      <div class="is-flex is-align-items-center mb-2">
        <h4 class="mr-3 has-text-weight-bold">{{ username }}</h4>
        <b-tag v-if="isOwner" type="is-primary" class="mr-3">you</b-tag>
        <p class="has-text-grey-light">{{ date }}</p>
        <div class="ml-auto">
          <slot name="card-action" />
        </div>
      </div>
      <slot name="card-description" />
    </div>
  </div>
</template>

<style scoped>
.card {
  gap: 1rem;
  margin-bottom: 1rem;
}
.card-content {
  padding: 0;
  width: 100%;
}
</style>
