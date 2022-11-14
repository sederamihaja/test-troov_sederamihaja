<template>
  <b-navbar toggleable="lg" type="dark" variant="dark">
    <b-navbar-brand href="#">Nuxt js</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">

        <b-nav-item href="/">Accueil</b-nav-item>

        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <em>{{ user.firstName }}</em>
          </template>
          <b-dropdown-item href="/register">Profil</b-dropdown-item>
          <b-dropdown-item @click="logout">Déconnexion</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
  export default {
    name: 'TheNavbar',
    computed: {
      user() {
        return this.$auth.$storage.getUniversal('user');
      }
    },
    methods: {
      async logout() {
        await this.$auth.logout()
        this.$auth.$storage.removeUniversal('user')
      }
    },
  }
</script>
