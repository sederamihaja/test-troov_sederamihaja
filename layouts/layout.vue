<template>
  <div>
    <div v-if="user"><TheNavbar /></div>

    <div class="container mt-4">
      <Nuxt />
    </div>
  </div>
</template>

<script>
  import TheNavbar from '~/components/TheNavbar'
  export default {
    name: 'Layout',
    components: {
      TheNavbar
    },
    computed: {
      user() {
        return this.$auth.$storage.getUniversal('user');
      }
    }
  }
</script>


