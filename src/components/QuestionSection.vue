<script>
import moment from 'moment'
import { mapActions, mapState } from 'vuex'
import SectionCard from './SectionCard.vue'
import VoteButton from './VoteButton.vue'

export default {
  name: 'QuestionSection',
  props: {
    question: {
      type: Object,
      required: true
    }
  },
  components: { VoteButton, SectionCard },
  computed: {
    ...mapState('auth', ['user']),
    dateFromNow() {
      return moment(this.question.createdAt).fromNow()
    },
    isAlreadyVoted() {
      return this.question.votes.includes(this.user.id)
    }
  },
  methods: {
    ...mapActions('question', ['updateQuestionVote']),
    handleUpdateVote(type) {
      this.updateQuestionVote({ userId: this.user.id, questionId: this.question.id, type })
    },
    handleReplyClick() {
      // todo: reply this question
    }
  }
}
</script>

<template>
  <SectionCard :username="question.user.username" :date="dateFromNow">
    <template #card-left>
      <VoteButton
        @update-vote="handleUpdateVote"
        :vote="question.votes.length"
        :is-already-voted="isAlreadyVoted"
      />
    </template>
    <template #card-action>
      <b-button type="is-ghost">
        <i class="fas fa-reply mr-2" />
        <span>Reply</span>
      </b-button>
    </template>
    <template #card-description>
      {{ question.question }}
    </template>
  </SectionCard>
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
