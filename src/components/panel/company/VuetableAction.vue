 <template>
  <div class="custom-actions">
    <button class="btn btn-sm" @click="editItem()">
      <i class="fas fa-pencil-alt"></i>
    </button>
    <button class="btn btn-sm" @click="deleteItem()">
      <i class="fas fa-trash-alt"></i>
    </button>
  </div>
</template>

  <script>
export default {
  props: ["rowData", "rowIndex"],
  methods: {
    editItem() {
      this.$router.push({
        name: "UpdateCompany",
        params: { id: this.rowData.id }
      });
    },
    deleteItem(){
      this.request({
        url: this.endpoint('companies/' + this.rowData.id),
        method: 'delete',
        success: data => {
          this.$router.go();
          this.notify('شرکت با موفقیت حذف شد','success')
        }
      })
    }
  }
};
</script>

<style scoped lang="scss">
.custom-actions {
  width: 70px;
}
</style>