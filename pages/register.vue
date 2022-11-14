<template>
  <div class="d-flex justify-content-center mt-3">
    <div class="w-50">
      <h1 v-if="!user" class="text-center text-secondary">S'inscrire</h1>
      <h1 v-else class="text-center text-secondary">Modification profil</h1>
      <hr>
      <b-form action="" method="post" @submit.prevent="submitRegister()">
        <b-form-group id="input_lastName" class="mt-5">
          <b-form-input v-model="lastName" type="text" class="form-control" placeholder="Nom" :class="{ 'is-invalid': errors && errors.lastName }" size="lg" />
          <div v-if="errors && errors.lastName" class="invalid-feedback">
            {{ errors.lastName }}
          </div>
        </b-form-group>
        <b-form-group id="input_firstName" class="mt-5">
          <b-form-input v-model="firstName" type="text" class="form-control" placeholder="Prénom" :class="{ 'is-invalid': errors && errors.firstName }" size="lg" />
          <div v-if="errors && errors.firstName" class="invalid-feedback">
            {{ errors.firstName }}
          </div>
        </b-form-group>
        <b-form-group id="input_email" class="mt-5">
          <b-form-input v-model="email" type="email" class="form-control" placeholder="Email" :class="{ 'is-invalid': errors && errors.email }" size="lg" />
          <div v-if="errors && errors.email" class="invalid-feedback">
            {{ errors.email }}
          </div>
        </b-form-group>
        <div v-if="!user">
          <b-form-group id="input_login" class="mt-5">
            <b-form-input v-model="login" type="text" class="form-control" placeholder="Login" :class="{ 'is-invalid': errors && errors.login }" size="lg" />
            <div v-if="errors && errors.login" class="invalid-feedback">
              {{ errors.login }}
            </div>
          </b-form-group>
          <b-form-group id="input_password" class="mt-5">
            <b-form-input v-model="password" type="password" class="form-control" placeholder="Mot de passe" :class="{ 'is-invalid': errors && errors.password }" size="lg" minlength="6" />
            <div v-if="errors && errors.password" class="invalid-feedback">
              {{ errors.password }}
            </div>
          </b-form-group>
          <b-form-group id="input_passwordCheck" class="mt-5">
            <b-form-input v-model="passwordCheck" type="password" class="form-control" placeholder="Confirmation mot de passe" :class="{ 'is-invalid': errors && errors.passwordCheck }" size="lg" />
            <div v-if="errors && errors.passwordCheck" class="invalid-feedback">
              {{ errors.passwordCheck }}
            </div>
          </b-form-group>
        </div>
        <div class="mt-5">
          <b-button type="submit" variant="primary" size="lg" block>Enregistrer</b-button>
          <div v-if="!user" class="text-right mt-3">
            <label>Vous avez déjà un compte ?</label>
            <nuxt-link to="/login" class="text-muted font-weight-bold">Se connecter</nuxt-link>
          </div>
        </div>
      </b-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Register",
    layout: "layout",
    data(){
      return{
        pageTitle:null,
        errors:null,
        lastName:null,
        firstName:null,
        email:null,
        login:null,
        password:null,
        passwordCheck:null,
      }
    },
    head() {
      return {
        title: this.pageTitle
      }
    },
    computed: {
      user() {
        return this.$auth.$storage.getUniversal('user');
      }
    },
    mounted(){
      if(this.user) {
        this.setFormData()
        this.pageTitle = "Profil"
      } else {
        this.pageTitle = "S'inscrire"
      }
    },
    methods:{
      setFormData(){
        const { lastName, firstName, email } = this.user
        this.lastName = lastName
        this.firstName = firstName
        this.email = email
      },
      makeToast(type, message) {
        this.$bvToast.toast(message, {
          title: "Notification",
          variant: type,
          solid: true
        })
      },
      submitRegister(){
        if (!this.lastName) {
          this.errors = {...this.errors, lastName: "Veuillez saisir votre nom"}
        } else {
          this.errors = {...this.errors, lastName: null}
        }
        if (!this.firstName) {
          this.errors = {...this.errors, firstName: "Veuillez saisir votre prénom"}
        } else {
          this.errors = {...this.errors, firstName: null}
        }
        if (!this.email) {
          this.errors = {...this.errors, email: "Veuillez saisir votre email"}
        } else {
          this.errors = {...this.errors, email: null}
        }
        if (!this.user && !this.login) {
          this.errors = {...this.errors, login: "Veuillez saisir votre login"}
        } else {
          this.errors = {...this.errors, login: null}
        }
        if (!this.user && !this.password) {
          this.errors = {...this.errors, password: "Veuillez saisir votre mot de passe"}
        } else {
          this.errors = {...this.errors, password: null}
        }
        if (!this.user && !this.passwordCheck) {
          this.errors = {...this.errors, passwordCheck: "Veuillez confirmer votre mot de passe"}
        } else {
          this.errors = {...this.errors, passwordCheck: null}
        }
        if (!this.user && this.password !== this.passwordCheck) {
          this.errors = {...this.errors, passwordCheck: "Les mot de passe ne sont pas identiques"}
        } else {
          this.errors = {...this.errors, passwordCheck: null}
        }

        if (!this.errors.lastName && !this.errors.firstName && !this.errors.email && !this.errors.login && !this.errors.password && !this.errors.passwordCheck) {
          const responses = this.user
            ? this.$axios.put('/api/user', {
              _id: this.user.id,
              lastName: this.lastName,
              firstName: this.firstName,
              email: this.email
            })
            : this.$axios.post('/api/user', {
              lastName: this.lastName,
              firstName: this.firstName,
              email: this.email,
              login: this.login,
              password: this.password
            })
          responses
            .then(() => {
              if (this.user) {
                this.$auth.$storage.setUniversal(
                  'user',
                  {
                    id: this.user.id,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email
                  },
                  true
                )
                this.makeToast("success", "Modification de votre profil réussie !")
              } else {
                this.$auth.loginWith('local', {
                  data: {
                    login: this.login,
                    password: this.password
                  }
                })
                .then((res) => this.$auth.$storage.setUniversal('user', res.data.user, true))
                .catch( (error) => {
                  const { errorFor, msg } = error?.response?.data
                  if (errorFor) {
                    this.errors = {...this.errors, [errorFor]: msg}
                  }
                })
              }
            })
            .catch( (error) => {
              const { type, errorFor, msg } = error?.response?.data
              if(type === "duplicate") {
                if (errorFor) {
                  this.errors = {...this.errors, [errorFor]: msg}
                }
              } else {
                this.makeToast("danger", error)
              }
            });
        }
      }
    }
  }
</script>