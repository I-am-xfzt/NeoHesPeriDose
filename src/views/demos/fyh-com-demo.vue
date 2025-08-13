<template>
  <fyh-form
    v-model="form"
    :disabled="false"
    :module-path="`views/demos`"
  ></fyh-form>
</template>

<script setup lang="ts" name="fyh-com-demo">
  import FyhForm from '@/components/FyhComs/FyhForm.vue'
  const form = reactive({
    timeSlot: '',
    val: ''
  })
</script>

<style></style>
