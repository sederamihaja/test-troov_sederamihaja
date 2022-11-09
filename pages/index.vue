<template>
  <div class="mt-5">
    <div class="d-flex justify-content-between">
      <div><h2 class="text-secondary">Liste de tous les objets</h2></div>
      <div>
        <b-button variant="primary" @click="toggleModal">Ajouter un objet</b-button>
      </div>
      <b-modal ref="modalObject" hide-footer>
        <template #modal-header>
          <div class="mx-auto">
          <h4 class="text-secondary">Ajouter un objet</h4>
          </div>
        </template>

        <template #default>
          <form action="" method="post" @submit.prevent="saveData()">
            <div class="form-group">
              <label for="">Nom de l'objet</label>
              <input v-model="name" type="text" class="form-control" :class="{ 'is-invalid': errors && errors.name }">
              <div v-if="errors && errors.name" class="invalid-feedback">
                {{ errors.name }}
              </div>
            </div>

            <div class="form-group">
              <label for="">Description</label>
              <textarea v-model="description" cols="30" rows="4" class="form-control" :class="{ 'is-invalid': errors && errors.description }"></textarea>
              <div v-if="errors && errors.description" class="invalid-feedback">
                {{ errors.description }}
              </div>
            </div>

            <div class="d-flex justify-content-end">
              <input type="submit" value="Enregistrer" class="btn btn-primary mr-3">
            </div>
          </form>
        </template>
      </b-modal>
    </div>
    <div class="mt-5">
      <b-alert
        :show="dismissNotification"
        dismissible
        :variant="notificationType"
      >
        {{ notificationMessage }}
      </b-alert>
      <table class="table">
        <thead class="thead-light">
          <tr>
            <th scope="col">Nom</th>
            <th scope="col">Description</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody v-if="objects?.length">
          <tr v-for="(object, index) in objects" :key="index">
            <td>{{ object.name }}</td>
            <td>{{ object.description }}</td>
            <td class="actions">
              <b-icon class="mr-3 action-button" icon="pencil-fill" variant="info"></b-icon>
              <b-icon class="action-button" icon="trash" variant="danger"></b-icon>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <td class="text-center text-warning" colspan="3">Liste vide ! Veuillez ajouter un objet</td>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'IndexPage',
    layout: 'layout',
    async asyncData(context){
      const responses = await context.$axios.get('/api/objects')
      const data = responses?.data?.data
      return {
        objects: data
      }
    },
    data() {
      return {
        modalShow: false,
        isUpdate: true,
        dismissNotification: false,
        notificationType: "",
        notificationMessage: "",
        errors:null,
        name:null,
        description:null
      }
    },
    methods: {
      toggleModal() {
        this.$refs.modalObject.show()
      },
      showAlert(type, message) {
        this.dismissNotification = true
        this.notificationType = type
        this.notificationMessage = message
      },
      saveData() {
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
          this.$axios.post( '/api/objects', {
            name: this.name,
            description: this.description,
          })
          .then((response) => {
            this.$refs.modalObject.hide()
            this.$nuxt.refresh()
            this.showAlert("success", "Ajout d'un objet réussi !")
          })
          .catch( (error) => {
            this.showAlert("danger", error)
          });
        }
      }
    },
  }
</script>
