<script>
import moment from 'moment'
import { v4 as uuid } from 'uuid'
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
  data() {
    return {
      isShowReplyInput: false,
      answer: '',
      isLoading: false
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
    },
    isOwner() {
      return this.question.user.id === this.user.id
    }
  },
  methods: {
    ...mapActions('question', ['updateQuestionVote', 'addAnswerToQuestion']),
    handleUpdateVote(type) {
      this.updateQuestionVote({ userId: this.user.id, questionId: this.question.id, type })
    },
    handleReplyClick() {
      this.isShowReplyInput = true
    },
    async handleSendAnswerClick() {
      try {
        this.isLoading = true
        await this.addAnswerToQuestion({
          questionId: this.question.id,
          answer: {
            id: uuid(),
            user: this.user,
            createdAt: Date.now(),
            answer: this.answer,
            votes: []
          }
        })
        this.answer = ''
        this.isShowReplyInput = false
      } catch (error) {
        console.error(error)
        // todo: display error message as "something went wrong"
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<template>
  <div>
    <SectionCard :username="question.user.username" :date="dateFromNow" :is-owner="isOwner">
      <template #card-left>
        <VoteButton
          @update-vote="handleUpdateVote"
          :vote="question.votes.length"
          :is-already-voted="isAlreadyVoted"
        />
      </template>
      <template #card-action>
        <b-button type="is-ghost" @click="handleReplyClick" :disabled="isShowReplyInput">
          <i class="fas fa-reply mr-2" />
          <span>Reply</span>
        </b-button>
      </template>
      <template #card-description>
        {{ question.question }}
      </template>
    </SectionCard>
    <div v-if="isShowReplyInput" class="card p-5">
      <b-field label="Answer" label-position="on-border">
        <b-input type="textarea" placeholder="Add your answer..." v-model="answer" />
      </b-field>
      <b-button type="is-primary" @click="handleSendAnswerClick" :loading="isLoading">
        Send
      </b-button>
    </div>
  </div>
</template>

<style scoped></style>
