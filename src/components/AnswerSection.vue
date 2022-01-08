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
      isEdit: false,
      editedAnswer: ''
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
    handleDeleteAnswerClick() {
      this.removeAnswerFromQuestion({ answerId: this.answer.id, questionId: this.questionId })
    },
    handleEditAnswerClick() {
      this.isEdit = true
    },
    handleUpdateClick() {
      this.updateAnswer({
        questionId: this.questionId,
        answerId: this.answer.id,
        fields: { answer: this.editedAnswer }
      })
      this.editedAnswer = ''
      this.isEdit = false
    },
    handleCancelEditClick() {
      this.isEdit = false
      this.editedAnswer = ''
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
        <b-button v-if="!isEdit" type="is-ghost" @click="handleEditAnswerClick">
          <i class="fas fa-pencil-alt mr-2" />
          <span>Edit</span>
        </b-button>
        <b-button v-else type="is-ghost" @click="handleCancelEditClick">Cancel Changes</b-button>
      </div>
    </template>
    <template #card-description>
      <p v-if="!isEdit">
        <span class="has-text-primary mr-2">@{{ answerTo }}</span>
        <span>{{ answer.answer }}</span>
      </p>
      <div v-else>
        <b-field label="Edit" label-position="on-border">
          <b-input type="textarea" v-model="editedAnswer" />
        </b-field>
        <b-button @click="handleUpdateClick" type="is-primary">Update</b-button>
      </div>
    </template>
  </SectionCard>
</template>
