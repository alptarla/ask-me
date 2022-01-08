<script>
import moment from 'moment'
import { mapActions, mapState } from 'vuex'
import SectionCard from './SectionCard.vue'
import VoteButton from './VoteButton.vue'

export default {
  name: 'AnswerSection',
  components: { SectionCard, VoteButton },
  props: {
    answer: {
      type: Object,
      requried: true
    },
    answerTo: {
      type: String,
      required: true
    },
    questionId: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    dateFromNow() {
      return moment(this.answer.createdAt).fromNow()
    },
    isAlreadyVoted() {
      return this.answer.votes.includes(this.user.id)
    },
    isOwner() {
      return this.answer.user.id === this.user.id
    }
  },
  methods: {
    ...mapActions('question', ['updateAnswerVote']),
    handleUpdateVote(type) {
      // todo: update answer vote count
      this.updateAnswerVote({
        questionId: this.questionId,
        answerId: this.answer.id,
        userId: this.user.id,
        type
      })
    },
    handleDeleteAnswerClick() {
      // todo: delete this answer
    },
    handleEditAnswerClick() {
      // todo: edit this answer
    }
  }
}
</script>

<template>
  <SectionCard :username="answer.user.username" :date="dateFromNow" :is-owner="isOwner">
    <template #card-left>
      <VoteButton
        :vote="answer.votes.length"
        @update-vote="handleUpdateVote"
        :is-already-voted="isAlreadyVoted"
      />
    </template>
    <template v-if="isOwner" #card-action class="ml-auto">
      <div class="is-flex is-align-items-center">
        <b-button type="is-ghost" class="mr-2 has-text-danger" @click="handleDeleteAnswerClick">
          <i class="fas fa-trash-alt mr-2" />
          <span>Delete</span>
        </b-button>
        <b-button type="is-ghost" @click="handleEditAnswerClick">
          <i class="fas fa-pencil-alt mr-2" />
          <span>Edit</span>
        </b-button>
      </div>
    </template>
    <template #card-description>
      <p>
        <span class="has-text-primary mr-2">@{{ answerTo }}</span>
        <span>{{ answer.answer }}</span>
      </p>
    </template>
  </SectionCard>
</template>
