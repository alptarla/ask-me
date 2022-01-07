<script>
import SectionCard from './SectionCard.vue'
import VoteButton from './VoteButton.vue'
export default {
  name: 'AnswerSection',
  components: { SectionCard, VoteButton },
  methods: {
    handleUpdateVote() {
      // todo: update answer vote count
    }
  }
}
</script>

<template>
  <SectionCard username="Alp Tarla" date="2 hours ago">
    <template #card-left>
      <VoteButton :vote="10" @update-vote="handleUpdateVote" :is-already-voted="false" />
    </template>
    <template #card-action class="ml-auto">
      <div class="is-flex is-align-items-center">
        <b-button type="is-ghost" class="mr-2 has-text-danger">
          <i class="fas fa-trash-alt mr-2" />
          <span>Delete</span>
        </b-button>
        <b-button type="is-ghost">
          <i class="fas fa-pencil-alt mr-2" />
          <span>Edit</span>
        </b-button>
      </div>
    </template>
    <template #card-description> This is a answer for this question </template>
  </SectionCard>
</template>
