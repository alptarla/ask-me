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
  data() {
    return {
      editView: false,
      editedAnswer: '',
      loading: false
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
    ...mapActions('question', ['updateAnswerVote', 'removeAnswerFromQuestion', 'updateAnswer']),
    handleUpdateVote(type) {
      this.updateAnswerVote({
        questionId: this.questionId,
        answerId: this.answer.id,
        userId: this.user.id,
        type
      })
    },
    handleRemove() {
      this.removeAnswerFromQuestion({ answerId: this.answer.id, questionId: this.questionId })
    },
    toggleEditView(val) {
      this.editView = val
      this.editedAnswer = ''
    },
    async handleUpdate() {
      try {
        this.loading = true
        await this.updateAnswer({
          questionId: this.questionId,
          answerId: this.answer.id,
          fields: { answer: this.editedAnswer }
        })

        this.toggleEditView(false)
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
        <b-button type="is-ghost" class="mr-2 has-text-danger" @click="handleRemove">
          <i class="fas fa-trash-alt mr-2" />
          <span>Delete</span>
        </b-button>
        <b-button v-if="!editView" type="is-ghost" @click="toggleEditView(true)">
          <i class="fas fa-pencil-alt mr-2" />
          <span>Edit</span>
        </b-button>
        <b-button v-else type="is-ghost" @click="toggleEditView(false)">Cancel Changes</b-button>
      </div>
    </template>
    <template #card-description>
      <p v-if="!editView">
        <span class="has-text-primary mr-2">@{{ answerTo }}</span>
        <span>{{ answer.answer }}</span>
      </p>
      <div v-else>
        <b-field label="Edit" label-position="on-border">
          <b-input type="textarea" v-model="editedAnswer" />
        </b-field>
        <b-button @click="handleUpdate" type="is-primary" :loading="loading">Update</b-button>
      </div>
    </template>
  </SectionCard>
</template>
