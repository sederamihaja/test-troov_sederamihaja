<template>
  <div>
    <TheNavbar />

    <div class="container mt-4">
      <Nuxt />
    </div>
  </div>
</template>

<script>
  import TheNavbar from '~/components/TheNavbar'
  export default {
    name: 'layout',
    components: {
      TheNavbar
    }
  }
</script>


