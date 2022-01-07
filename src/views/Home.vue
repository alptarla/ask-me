<script>
import { v4 as uuid } from 'uuid'
import { required } from 'vuelidate/lib/validators'
import { mapActions, mapState } from 'vuex'
import AnswerSection from '../components/AnswerSection.vue'
import QuestionSection from '../components/QuestionSection.vue'

export default {
  name: 'Home',
  data() {
    return {
      question: '',
      isPageLoading: false,
      isSendLoading: false
    }
  },
  validations: {
    question: {
      required
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
      this.$v.$touch()
      if (this.$v.$invalid) return

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
        this.$v.$reset()
      } catch (error) {
        this.displayErrorMessage()
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
  components: { QuestionSection, AnswerSection }
}
</script>

<template>
  <div class="home">
    <div class="question-input card p-5">
      <b-field
        label="Question"
        label-position="on-border"
        :type="$v.question.$error ? 'is-danger' : null"
      >
        <b-input v-model="$v.question.$model" type="textarea" />
        <div v-if="$v.question.$error">
          <small class="has-text-danger">Question is required!</small>
        </div>
      </b-field>
      <b-button type="is-primary" :loading="isSendLoading" @click="handleSendQuestionClick">
        Send Question
      </b-button>
    </div>
    <div class="my-5" v-for="question in questions" :key="question.id">
      <QuestionSection :question="question" />
      <div class="answers">
        <AnswerSection
          v-for="answer in question.answers"
          :answer="answer"
          :answer-to="answer.user.username"
          :key="answer.id"
        />
      </div>
    </div>
    <b-loading v-model="isPageLoading" :is-full-page="true" />
  </div>
</template>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto 4rem;
}

.home .answers {
  position: relative;
  max-width: 700px;
  margin-left: auto;
}

.home .answers::after {
  content: '';
  position: absolute;
  top: 0;
  left: -3.5rem;
  width: 3px;
  height: 100%;
  background-color: hsl(0, 0%, 96%);
}
</style>
