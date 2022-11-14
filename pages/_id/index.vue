<template>
  <div class="d-flex justify-content-center mt-3">
    <div class="w-50">
      <h1 class="text-center text-secondary">Modifier un objet</h1>
      <hr>
      <b-form action="" method="post" @submit.prevent="submitUpdateObject()">
        <b-form-group id="input_name">
          <label for="">Nom de l'objet</label>
          <b-form-input v-model="name" type="text" class="form-control" :class="{ 'is-invalid': errors && errors.name }" />
          <div v-if="errors && errors.name" class="invalid-feedback">
            {{ errors.name }}
          </div>
        </b-form-group>

        <b-form-group id="input_description">
          <label for="">Description</label>
          <b-form-textarea v-model="description" cols="30" rows="4" class="form-control" :class="{ 'is-invalid': errors && errors.description }" />
          <div v-if="errors && errors.description" class="invalid-feedback">
            {{ errors.description }}
          </div>
        </b-form-group>

        <div class="d-flex justify-content-end">
          <input type="submit" value="Enregistrer" class="btn btn-primary mr-3">
        </div>
      </b-form>
    </div>
  </div>
</template>

<script>
export default {
  layout: "layout",
  middleware: 'auth',
  async asyncData(context){
    const { data } = await context.$axios.get('/api/objects/' + context.route.params.id)
    return {
      object : data.data,
    }
  },
  data(){
    return{
      errors:null,
      name:null,
      description:null,
    }
  },
  head: {
    title: "Objet - Modifier"
  },
  mounted(){
    this.fillData(this.object)
  },
  methods:{
    fillData(data) {
      this.name = data.name
      this.description = data.description
    },
    makeToast(type, message) {
      this.$bvToast.toast(message, {
        title: "Notification",
        variant: type,
        solid: true
      })
    },
    submitUpdateObject(){
      if (!this.name) {
          this.errors = {...this.errors, name: "Veuillez ajouter un nom"}
        } else {
          this.errors = {...this.errors, name: null}
        }
        if (!this.description) {
          this.errors = {...this.errors, description: "Veuillez ajouter une description"}
        } else {
          this.errors = {...this.errors, description: null}
        }

        if (!this.errors.name && !this.errors.description) {
          const responses = this.$axios.put(`/api/objects/${this.object._id}`, {
            name: this.name,
            description: this.description,
          })
          responses
            .then(() => {
              this.$router.push({ path:'/' })
            })
            .catch( (error) => {
              const { type, msg } = error?.response?.data
              if(type === "duplicate") {
                this.errors = {...this.errors, name: msg}
              } else {
                this.makeToast("danger", error)
              }
            });
        }
    }
  }
}
</script>
