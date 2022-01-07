<script>
export default {
  name: 'VoteButton',
  props: {
    vote: {
      type: Number,
      default: 0
    }
  },
  methods: {
    updateVote(newVal) {
      this.$emit('update-vote', newVal)
    }
  }
}
</script>

<template>
  <div class="vote has-background-primary">
    <button class="vote-btn" @click="updateVote(vote + 1)">
      <i class="fas fa-plus" />
    </button>
    <span class="vote-count">{{ vote }}</span>
    <button class="vote-btn" @click="updateVote(vote - 1)">
      <i class="fas fa-minus" />
    </button>
  </div>
</template>

<style scoped>
.vote {
  max-width: 40px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
}

.vote .vote-btn {
  border: none;
  background-color: transparent;
  color: white;
  cursor: pointer;
  padding: 0;
}

.vote .vote-count {
  font-size: 18px;
  padding: 0.3rem 0;
}
</style>
