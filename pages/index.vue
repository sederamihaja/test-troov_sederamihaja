<template>
  <div class="mt-5">
    <div class="d-flex justify-content-between">
      <div><h2 class="text-secondary">Liste de tous les objets</h2></div>
      <div>
        <nuxt-link to="/add" class="btn btn-primary">Ajouter un objet</nuxt-link>
      </div>
    </div>
    <div class="mt-5">
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
              <nuxt-link :to="`/${object._id}`">
                <b-icon class="mr-3 action-button" icon="pencil-fill" variant="info"></b-icon>
              </nuxt-link>
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
    name: "Home",
    layout: 'layout',
    middleware: 'auth',
    async asyncData(context){
      const responses = await context.$axios.get('/api/objects')
      const data = responses?.data?.data
      return {
        objects: data
      }
    },
    data() {
      return {
        idToDelete:null
      }
    },
    head: {
      title: "Accueil"
    },
    methods: {
      toggleModalDelete(id) {
        this.$refs.modalDeleteObject.show()
        this.idToDelete = id
      },
      deleteObject() {
        this.$axios.delete(`/api/objects/${this.idToDelete}`)
        .then(() => {
          this.$refs.modalDeleteObject.hide()
          this.$nuxt.refresh()
          this.makeToast("success", "Suppression d'un objet réussie !")
          this.idToDelete = null
        })
        .catch( (error) => {
          this.makeToast("danger", error)
        });
      },
      makeToast(type, message) {
        this.$bvToast.toast(message, {
          title: "Notification",
          variant: type,
          solid: true
        })
      },
    },
  }
</script>
