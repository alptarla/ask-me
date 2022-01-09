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
      pageLoading: false,
      questionLoading: false
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
    async handleSendQuestion() {
      this.$v.$touch()
      if (this.$v.$invalid) return

      try {
        this.questionLoading = true
        await this.createQuestion({
          question: {
            id: uuid(),
            question: this.question,
            user: this.user,
            answers: [],
            votes: [],
            createdAt: Date.now()
          }
        })

        this.question = ''
        this.$v.$reset()
      } catch (error) {
        this.displayErrorMessage()
      } finally {
        this.questionLoading = false
      }
    }
  },
  async created() {
    try {
      this.pageLoading = true
      await this.getQuestions()
    } catch (error) {
      this.displayErrorMessage()
    } finally {
      this.pageLoading = false
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
      <b-button type="is-primary" :loading="questionLoading" @click="handleSendQuestion">
        Send Question
      </b-button>
    </div>
    <div class="my-5" v-for="(question, index) in questions" :key="index">
      <QuestionSection :question="question" />
      <div class="answers">
        <AnswerSection
          v-for="(answer, index) in question.answers"
          :answer="answer"
          :answer-to="question.user.username"
          :question-id="question.id"
          :key="index"
        />
      </div>
    </div>
    <b-loading v-model="pageLoading" :is-full-page="true" />
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
