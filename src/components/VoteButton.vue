<script>
export default {
  name: 'VoteButton',
  props: {
    vote: {
      type: Number,
      default: 0
    },
    isAlreadyVoted: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    updateVote(type) {
      this.$emit('update-vote', type)
    }
  }
}
</script>

<template>
  <div class="vote has-background-light">
    <button class="vote-btn" @click="updateVote('inc')" :disabled="isAlreadyVoted">
      <i class="fas fa-chevron-up fa-2x has-text-success"></i>
    </button>
    <span class="vote-count">{{ vote }}</span>
    <button class="vote-btn" @click="updateVote('dec')" :disabled="!isAlreadyVoted">
      <i class="fas fa-chevron-down fa-2x has-text-danger"></i>
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
  padding: 1rem;
  border-radius: 0.5rem;
}

.vote .vote-btn {
  border: none;
  background-color: transparent;
  cursor: pointer;
  padding: 0;
}

.vote-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.vote .vote-count {
  font-size: 18px;
  padding: 0.3rem 0;
}
</style>
