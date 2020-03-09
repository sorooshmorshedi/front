import ListModalForm from "./ListModalForm.vue";

export default {
  components: {
    ListModalForm
  },
  data() {
    return {
      item: {},

      // must be set
      cols: [],
      baseUrl: ''
    };
  },
  watch: {
    query() {
      this.queryChanged();
    }
  },
  created() {
    this.getData();
  },
  mounted() {
    this.queryChanged();
  },
  methods: {
    queryChanged() {
      let item = this.query.item;
      for (let key in item) {
        this.item[key] = item[key];
      }
    },
    getData() {
      // must be implemented
      console.error("getData method must be implemented")
    },
    setItem(item) {
      // must be implemented, but by default
      this.item = item;
    },
    clearForm() {
      // must be implemented, but by default
      this.item = {};
    },
    getSerialized() {
      // must be implemented, but by default
      return this.item;
    },
    submit() {
      if (this.item.id) this.updateItem();
      else this.storeItem();
    },
    storeItem() {
      this.request({
        url: this.endpoint(this.baseUrl),
        method: "post",
        data: this.getSerialized(),
        success: data => {
          this.clearForm();
          this.getData();
          this.successNotify();
          this.$refs.listModelForm.hideModal();
        }
      });
    },
    updateItem() {
      this.request({
        url: this.endpoint(this.baseUrl + "/" + this.item.id),
        method: "put",
        data: this.getSerialized(),
        success: data => {
          this.clearForm();
          this.getData();
          this.successNotify();
          this.$refs.listModelForm.hideModal();
        }
      });
    },
    deleteItem() {
      this.request({
        url: this.endpoint(this.baseUrl + "/" + this.item.id),
        method: "delete",
        success: data => {
          this.clearForm();
          this.getData();
          this.successNotify();
          this.$refs.listModelForm.hideModal();
        }
      });
    }
  }

}
