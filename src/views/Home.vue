<script>
import { v4 as uuid } from 'uuid'
import { mapActions, mapState } from 'vuex'
import QuestionCard from '../components/QuestionCard.vue'

export default {
  name: 'Home',
  data() {
    return {
      question: '',
      isPageLoading: false,
      isSendLoading: false
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapState('question', ['questions'])
  },
  methods: {
    ...mapActions('question', ['getQuestions', 'createQuestion']),
    displayErrorMessage() {
      this.$buefy.notification.open({
        duration: 2000,
        message: 'Something went wrong!',
        type: 'is-danger',
        position: 'is-top-right'
      })
    },
    async handleSendQuestionClick() {
      try {
        this.isSendLoading = true
        await this.createQuestion({
          id: uuid(),
          question: this.question,
          answers: [],
          votes: [],
          user: this.user,
          createdAt: Date.now()
        })
        this.question = ''
      } catch (error) {
        this.displayErrorMessage()
        console.log(error)
      } finally {
        this.isSendLoading = false
      }
    }
  },
  async created() {
    try {
      this.isPageLoading = true
      await this.getQuestions()
    } catch (error) {
      this.displayErrorMessage()
    } finally {
      this.isPageLoading = false
    }
  },
  components: { QuestionCard }
}
</script>

<template>
  <div class="question">
    <div class="question-input card p-5">
      <b-field label="Question" label-position="on-border">
        <b-input v-model="question" type="textarea" />
      </b-field>
      <b-button type="is-primary" :loading="isSendLoading" @click="handleSendQuestionClick">
        Send Question
      </b-button>
    </div>
    <div class="question-list my-5">
      <QuestionCard v-for="question in questions" :key="question.id" :question="question" />
    </div>
    <b-loading v-model="isPageLoading" :is-full-page="true" />
  </div>
</template>

<style scoped>
.question {
  max-width: 800px;
  margin: 0 auto;
}

.avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
}
</style>
