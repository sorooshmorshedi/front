import ListModalForm from "./ListModalForm.vue";

export default {
  components: {
    ListModalForm
  },
  props: {
    itemObject: {
      default: null
    },
    id: {
      default: null
    }
  },
  data() {
    return {
      item: {},

      // must be set
      // cols: [],
      // baseUrl: ''

      // options
      leadingSlash: false,
      hasList: true,
    };
  },
  computed: {
    createUrl() {
      return this.baseUrl + (this.leadingSlash ? "/" : "")
    },
    updateUrl() {
      let id = this.item.id || this.id || null;
      return id && `${this.baseUrl}/${id}` + (this.leadingSlash ? "/" : "")
    },
    deleteUrl() {
      return this.item.id && `${this.baseUrl}/${this.item.id}` + (this.leadingSlash ? "/" : "")
    },
    itemTemplate() {
      return {}
    },
  },
  watch: {
    query() {
      this.queryChanged();
    },
    itemObject() {
      if (this.itemObject) this.setItem(this.itemObject);
    },
    $route() {
      // we had problems with id prop
      // this.clearForm();
    }
  },
  created() {
    this.item = this.itemTemplate;
    this.getData();
    if (this.id) {
      this.getItem();
    }
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
    getItem() {
      // must be implemented, but by default
      if (this.hasList) {
        // this.setItem(this.items.filter(o => o.id == this.id)[0])
      } else {
        this.request({
          url: this.endpoint(this.updateUrl),
          method: "get",
          success: data => {
            this.setItem(data);
          }
        });
      }
    },
    setItem(item) {
      // must be implemented, but by default
      this.item = item;
      if (!this.hasList && this.id != item.id) {
        this.changeRouteTo(item.id);
      }
    },
    changeRouteTo(id) {
      this.$router.push({
        name: this.$route.name,
        params: {
          ...this.$route.params,
          id: id
        }
      })
    },
    clearForm() {
      // must be implemented, but by default
      this.item = this.itemTemplate;
      if (!this.hasList) {
        this.changeRouteTo(null);
      }
    },
    getSerialized() {
      // must be implemented, but by default
      return this.extractIds(this.item);
    },
    submit(clearForm = true) {
      if (this.item.id) this.updateItem(clearForm);
      else this.storeItem(clearForm);
    },
    storeItem(clearForm) {
      this.request({
        url: this.endpoint(this.createUrl),
        method: "post",
        data: this.getSerialized(),
        success: data => {
          this.successResponse(data, clearForm)
        }
      });
    },
    updateItem(clearForm) {
      this.request({
        url: this.endpoint(this.updateUrl),
        method: "put",
        data: this.getSerialized(),
        success: data => {
          this.successResponse(data, clearForm)
        }
      });
    },
    deleteItem() {
      this.request({
        url: this.endpoint(this.deleteUrl),
        method: "delete",
        success: data => {
          this.successResponse(data, true)
        }
      });
    },
    successResponse(data, clearForm) {
      if (clearForm) {
        this.clearForm();
      } else {
        this.item = data;
        this.getItem(data);
      }
      if (this.hasList) {
        this.getData();
      }
      this.successNotify();
    }
  }

}