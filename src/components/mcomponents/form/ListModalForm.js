import ListModalForm from "./ListModalForm.vue";
import OpenSanadBtn from "@/components/form/OpenSanadBtn";

export default {
  components: {
    ListModalForm,
    OpenSanadBtn
  },
  props: {
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
      isEditing: true,
      rowKey: null,
      rows: [],
      itemsToDelete: []
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
    canSubmit() {
      if (!this.permissionBasename) {
        console.warn("Please set permissionBase")
      }
      if (this.item.id) {
        return this.hasPerm('update', this.permissionBasename, this.item)
      } else {
        return this.hasPerm('create', this.permissionBasename, this.item)
      }
    },
    canDelete() {
      return this.item.id != undefined && this.hasPerm('delete', this.permissionBasename, this.item)
    }
  },
  watch: {
    query() {
      this.setDefaults();
    },
    $route(newRoute, oldRoute) {
      if (!newRoute.params.id) {
        this.clearForm();
      } else {
        this.getItem();
      }
    },
    rows: {
      handler() {
        if (!this.rowKey) {
          console.error('Please set rowKey');
          return;
        }
        if (this.rows[this.rows.length - 1][this.rowKey]) {
          this.rows.push(this.getRowTemplate());
        }
      },
      deep: true
    },
  },
  created() {
    this.item = this.getItemTemplate();
    this.rows = [this.getRowTemplate()];
    this.getData();
    if (this.id) {
      this.getItem();
    }
    this.EventBus.$on('get:accounts', () => this.setDefaults())
  },
  mounted() {
    this.setDefaults()
  },
  methods: {
    getRowTemplate() {
      return {}
    },
    getItemTemplate() {
      return {}
    },
    /*
      Set default fields with data query.item
    */
    setDefaults() {
      this.$nextTick(() => {
        for (let key in this.query) {
          let path = key.split('.')
          let lastObject = path.slice(0, path.length - 1).reduce((o, i) => o[i], this)
          let lastKey = path[path.length - 1];

          switch (lastKey) {
            case 'account':
              lastObject[lastKey] = this.accounts.filter(o => o.id == this.query[key])[0];
              break
            default:
              lastObject[lastKey] = this.query[key]
          }
        }
      })
    },
    getData() {
      // must be implemented
    },
    getItem() {
      // must be implemented, but by default
      if (this.hasList) {
        // This line does not work
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
    getItemByPosition(position) {
      return this.request({
        url: this.endpoint(`${this.baseUrl}/byPosition`),
        method: "get",
        params: {
          id: this.item.id,
          position: position
        },
        success: data => {
          this.setItem(data);
        }
      });
    },
    setItem(item) {
      // must be implemented, but by default
      this.item = item;
      if (this.hasIdProp && this.id != item.id) {
        this.changeRouteTo(item.id);
      }
    },
    changeRouteTo(id) {
      let params = {
        ...this.$route.params,
        id: id
      }

      let isDuplicate = true;
      Object.keys(params).forEach(key => {
        if (params[key] != this.$route.params[key]) {
          isDuplicate = false;
        }
      })

      if (!isDuplicate) {
        this.$router.push({
          name: this.$route.name,
          params: params
        })
      }

      if (!id) {
        this.isEditing = true;
      } else {
        this.isEditing = false;
      }

    },
    clearForm() {
      // must be implemented, but by default
      this.isEditing = true;
      this.item = this.getItemTemplate();
      this.rows = [this.getRowTemplate()];
      this.itemsToDelete = [];
      if (this.hasIdProp) {
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
        this.getItem();
        this.isEditing = false;
      }
      if (this.hasList) {
        this.getData();
      }
      this.successNotify();
    },

    // Helpers
    rowsSum(key) {
      let sum = 0;
      for (const row of this.rows) {
        let value = row[key];
        if (this.hasValue(value)) {
          sum += +value;
        }
      }
      return sum;
    },

    deleteRow(index) {
      if (index == -1) {
        this.rows.forEach(row => {
          if (row.id) this.itemsToDelete.push(row.id);
        });
        this.rows.splice(0, this.rows.length - 1);
      } else {
        let row = this.rows[index];
        if (row.id) this.itemsToDelete.push(row.id);
        this.rows.splice(index, 1);
      }
    },
  }

}