import ListModalForm from "./ListModalForm.vue";

export default {
  components: {
    ListModalForm
  },
  props: {
    itemObject: {
      default: null
    }
  },
  data() {
    return {
      item: {},
      itemTemplate: {},

      // must be set
      // cols: [],
      // baseUrl: ''
    };
  },
  watch: {
    query() {
      this.queryChanged();
    },
    itemObject() {
      if (this.itemObject) this.setItem(this.itemObject);
    }
  },
  created() {
    this.getData();
    this.clearForm();
  },
  mounted() {
    this.queryChanged();
    if (this.itemObject) this.setItem(this.itemObject);
  },
  methods: {
    /*
      Set default fields with data query.item
    */
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
      this.item = {
        ...this.itemTemplate
      };
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
        }
      });
    }
  }

}
