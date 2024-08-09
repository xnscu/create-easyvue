<script setup>
const framework = utils.capitalize('vue')
const title = process.env.TITLE
</script>

<template>
  <div>
    <h1> {{ title }}</h1>
    <h2>Auto component and route worked!</h2>
    <h2 v-if="framework === 'Vue'">Global export utils worked!</h2>
  </div>
</template>