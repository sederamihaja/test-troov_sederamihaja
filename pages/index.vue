<template>
  <div class="mt-5">
    <div class="d-flex justify-content-between">
      <div><h2 class="text-secondary">Liste de tous les objets</h2></div>
      <div><bouton class="btn btn-primary">Ajouter un objet</bouton></div>
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
        <tbody>
          <tr>
            <td>Mark</td>
            <td>Otto</td>
            <td class="actions">
              <b-icon class="mr-3 action-button" icon="pencil-fill" variant="info"></b-icon>
              <b-icon class="action-button" icon="trash" variant="danger"></b-icon>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'IndexPage',
    layout: 'layout',
  }
</script>
