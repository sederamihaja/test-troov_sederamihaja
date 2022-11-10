<template>
  <div class="mt-5">
    <div class="d-flex justify-content-between">
      <div><h2 class="text-secondary">Liste de tous les objets</h2></div>
      <div>
        <b-button variant="primary" @click="toggleModal">Ajouter un objet</b-button>
      </div>
      <b-modal ref="modalObject" :title="isUpdate === true  ? 'Modifier un objet' : 'Ajouter un objet'" hide-footer>
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
              <b-icon class="mr-3 action-button" icon="pencil-fill" variant="info" @click="toggleModalEdit(object)"></b-icon>
              <b-icon class="action-button" icon="trash" variant="danger" @click="toggleModalDelete(object._id)"></b-icon>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <td class="text-center text-warning" colspan="3">Liste vide ! Veuillez ajouter un objet</td>
        </tbody>
      </table>
      <b-modal ref="modalDeleteObject" title="Supprimer un objet" centered>
        <template #default>
          <h3 class="text-center">Voullez vous vraimment supprimer cet objet ?</h3>
        </template>
        <template #modal-footer="{ cancel }">
          <div class="d-flex justify-content-end">
            <b-button class="btn btn-light mr-3" @click="cancel()">Annuler</b-button>
            <b-button class="btn btn-danger mr-3" @click="deleteObject">Supprimer</b-button>
          </div>
        </template>>
      </b-modal>
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
        isUpdate: false,
        dismissNotification: false,
        notificationType: "",
        notificationMessage: "",
        errors:null,
        name:null,
        description:null,
        idUpdate: null,
        idToDelete:null
      }
    },
    methods: {
      toggleModal() {
        this.errors = null
        this.isUpdate = false
        this.idUpdate = null
        this.name = null
        this.description = null
        this.$refs.modalObject.show()
      },
      toggleModalEdit(data) {
        const { _id, name, description } = data
        this.isUpdate = true
        this.idUpdate = _id
        this.name = name
        this.description = description
        this.errors = null
        this.$refs.modalObject.show()
      },
      toggleModalDelete(id) {
        this.$refs.modalDeleteObject.show()
        this.idToDelete = id
      },
      deleteObject() {
        this.$axios.delete(`/api/objects/${this.idToDelete}`)
        .then(() => {
          this.$refs.modalDeleteObject.hide()
          this.$nuxt.refresh()
          this.showAlert("success", "Suppression d'un objet réussie !")
          this.idToDelete = null
        })
        .catch( (error) => {
          this.showAlert("danger", error)
        });
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
          const responses = this.isUpdate === true
            ? this.$axios.put(`/api/objects/${this.idUpdate}`, {
                name: this.name,
                description: this.description,
              })
            : this.$axios.post('/api/objects', {
              name: this.name,
              description: this.description,
            })
          responses
            .then(() => {
              this.$refs.modalObject.hide()
              this.$nuxt.refresh()
              this.showAlert("success", this.isUpdate === true ? "Modification d'un objet réussie !" : "Ajout d'un objet réussi !")
            })
            .catch( (error) => {
              const { type, msg } = error?.response?.data
              if(type === "duplicate") {
                this.errors = {...this.errors, name: msg}
              } else {
                this.showAlert("danger", error)
              }
            });
        }
      }
    },
  }
</script>
