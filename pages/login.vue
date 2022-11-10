<template>
  <div class="d-flex justify-content-center mt-3">
    <div class="w-50">
      <h1 class="text-center text-secondary">Login</h1>
      <hr>
      <b-form action="" method="post" @submit.prevent="submitLogin()">
        <b-form-group id="input_login" class="mt-5">
          <b-form-input v-model="login" type="text" class="form-control" placeholder="Login" :class="{ 'is-invalid': errors && errors.login }" size="lg" />
          <div v-if="errors && errors.login" class="invalid-feedback">
            {{ errors.login }}
          </div>
        </b-form-group>

        <b-form-group id="input_password" class="mt-5">
          <b-form-input v-model="password" type="password" class="form-control" placeholder="Password" :class="{ 'is-invalid': errors && errors.password }" size="lg" />
          <div v-if="errors && errors.password" class="invalid-feedback">
            {{ errors.password }}
          </div>
        </b-form-group>
        
        <div class="mt-5">
          <b-button type="submit" variant="primary" size="lg" block>Se connecter</b-button>
          <div class="text-right mt-3">
            <label>Vous n'avez pas encore de compte ?</label>
            <nuxt-link to="/register" class="text-muted font-weight-bold">S'inscrire</nuxt-link>
          </div>
        </div>
      </b-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    middleware: 'auth',
    auth: 'guest',
    data(){
      return{
        errors:null,
        login:null,
        password:null,
      }
    },

    methods:{
      submitLogin(){
        if (!this.login) {
          this.errors = {...this.errors, login: "Veuillez saisir votre login"}
        } else {
          this.errors = {...this.errors, login: null}
        }
        if (!this.password) {
          this.errors = {...this.errors, password: "Veuillez saisir votre mot de passe"}
        } else {
          this.errors = {...this.errors, password: null}
        }

        if (!this.errors.login && !this.errors.password) {
          this.$auth.loginWith('local', {
              data: {
                login: this.login,
                password: this.password
              }
            })
            .then(() => this.$router.push({ path: '/' }))
            .catch( (error) => {
              const { errorFor, msg } = error?.response?.data
              if (errorFor) {
                this.errors = {...this.errors, [errorFor]: msg}
              }
            })
        }
      }
    }
  }
</script>