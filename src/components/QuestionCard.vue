<script>
import moment from 'moment'
import VoteButton from './VoteButton.vue'

export default {
  name: 'QuestionCard',
  props: {
    question: {
      type: Object,
      required: true
    }
  },
  components: { VoteButton },
  computed: {
    dateFromNow() {
      return moment(this.question.createdAt).fromNow()
    }
  },
  methods: {
    handleUpdateVote(val) {
      console.log('vote :>> ', val)
      // todo: update question vote
    },
    handleReplyClick() {
      // todo: reply this question
    }
  }
}
</script>

<template>
  <div class="card p-5 is-flex is-align-items-flex-start">
    <VoteButton @update-vote="handleUpdateVote" :vote="question.vote" />
    <div class="card-content">
      <div class="is-flex is-align-items-center mb-2">
        <h4 class="mr-2 has-text-weight-bold">{{ question.user.username }}</h4>
        <p class="has-text-grey-light">{{ dateFromNow }}</p>
        <b-button type="is-primary is-outlined ml-auto" @click="handleReplyClick">
          <i class="fas fa-reply mr-2" />
          <span>Reply</span>
        </b-button>
      </div>
      <p>{{ question.question }}</p>
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
