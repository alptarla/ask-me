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
      showAnswerInput: false,
      answer: '',
      loading: false,
      editView: false,
      editedQuestion: ''
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
    ...mapActions('question', [
      'updateQuestionVote',
      'addAnswerToQuestion',
      'removeQuestion',
      'updateQuestion'
    ]),
    handleUpdateVote(type) {
      this.updateQuestionVote({ userId: this.user.id, questionId: this.question.id, type })
    },
    toggleAnswerInput(val) {
      this.showAnswerInput = val
      this.answer = ''
    },
    async handleSendAnswer() {
      try {
        this.loading = true
        await this.addAnswerToQuestion({
          id: this.question.id,
          answer: {
            id: uuid(),
            user: this.user,
            createdAt: Date.now(),
            answer: this.answer,
            votes: []
          }
        })

        this.toggleAnswerInput(false)
      } catch (error) {
        this.$buefy.notification.open({
          duration: 2000,
          message: 'Something went wrong!',
          type: 'is-danger',
          position: 'is-top-right'
        })
      } finally {
        this.loading = false
      }
    },
    handleRemove() {
      this.removeQuestion({ questionId: this.question.id })
    },
    toggleEditView(val) {
      this.editView = val
      this.editedQuestion = ''
    },
    async handleUpdate() {
      try {
        this.loading = true
        await this.updateQuestion({
          id: this.question.id,
          fields: { question: this.editedQuestion }
        })

        this.toggleEditView(false)
      } catch (error) {
        // todo: display error
      } finally {
        this.loading = false
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
        <template v-if="isOwner">
          <b-button type="is-ghost" class="mr-2 has-text-danger" @click="handleRemove">
            <i class="fas fa-trash-alt mr-2" />
            <span>Delete</span>
          </b-button>
          <b-button v-if="!editView" type="is-ghost" @click="toggleEditView(true)">
            <i class="fas fa-pencil-alt mr-2" />
            <span>Edit</span>
          </b-button>
          <b-button v-else type="is-ghost" @click="toggleEditView(false)">Cancel</b-button>
        </template>
        <b-button type="is-ghost" @click="toggleAnswerInput(true)" :disabled="showAnswerInput">
          <i class="fas fa-reply mr-2" />
          <span>Reply</span>
        </b-button>
      </template>
      <template #card-description>
        <p v-if="!editView">{{ question.question }}</p>
        <div v-else>
          <b-field label="Edit" label-position="on-border">
            <b-input type="textarea" v-model="editedQuestion" />
          </b-field>
          <b-button @click="handleUpdate" type="is-primary" :loading="loading">Update</b-button>
        </div>
      </template>
    </SectionCard>
    <div v-if="showAnswerInput" class="card p-5">
      <b-field label="Answer" label-position="on-border">
        <b-input type="textarea" placeholder="Add your answer..." v-model="answer" />
      </b-field>
      <b-button type="is-primary" @click="handleSendAnswer" :loading="loading">Send</b-button>
    </div>
  </div>
</template>
