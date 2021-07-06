import jsonToFormData from "./jsonToFormData";
import MFileInput from "./MFileInput";
import InputTable from "./InputTable";
import RowTextarea from "./RowTextarea";

import queryBinding from "@/components/m-query-binding";

export default {
  mixins: [queryBinding],
  components: {
    MFileInput,
    InputTable,
    RowTextarea
  },
  props: {
    id: {
      default: null
    },
  },
  data() {
    return {
      item: {},

      // must be set
      // cols: [],
      // baseUrl: ''

      // options
      appendSlash: false,
      formData: false,
      hasList: true,
      isEditing: true,
      rowKey: null,
      rows: [],
      itemsToDelete: [],
      isDefinable: false,
      hasLock: false
    };
  },
  computed: {
    rules() {
      return {
        required: [
          (value) => !["", null, undefined].includes(value) || "این فیلد اجباری می باشد",
        ]
      }
    },
    createUrl() {
      return this.baseUrl + (this.appendSlash ? "/" : "")
    },
    retrieveUrl() {
      return this.updateUrl;
    },
    updateUrl() {
      let id = this.item.id || this.id || null;
      return id && `${this.baseUrl}/${id}${this.appendSlash ? "/" : ""}`;
    },
    deleteUrl() {
      return this.item.id && `${this.baseUrl}/${this.item.id}` + (this.appendSlash ? "/" : "")
    },
    defineUrl() {
      return this.item.id && `${this.baseUrl}/define` + (this.appendSlash ? "/" : "")
    },
    toggleLockUrl() {
      return this.item.id && `${this.baseUrl}/toggleLock` + (this.appendSlash ? "/" : "")
    },
    canSubmit() {
      if (!this.permissionBasename) {
        console.warn("Please set permissionBasename")
      }
      if (this.item.id) {
        return this.hasPerm('update', this.permissionBasename, this.item)
      } else {
        return this.hasPerm('create', this.permissionBasename, this.item)
      }
    },
    canDelete() {
      return this.item.id != undefined && this.hasPerm('delete', this.permissionBasename, this.item)
    },
  },
  watch: {
    $route(newRoute, oldRoute) {
      if (!newRoute.params.id) {
        this.clearForm();
      } else if (newRoute.params.id != this.item.id) {
        this.getItem();
      }
    },
    rows: {
      handler() {
        if (!this.rowKey) return;
        if (this.rows.length > 0 && this.rows[this.rows.length - 1][this.rowKey]) {
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
  },
  methods: {
    getRowTemplate() {
      return {}
    },
    getItemTemplate() {
      return {}
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
          url: this.endpoint(this.retrieveUrl),
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
      if (this.rowKey) {
        this.rows = this.copy(this.item.items);
      }
      if (this.hasIdProp && this.id != item.id) {
        this.changeRouteTo(item.id);
      }
    },
    changeRouteTo(id, params = null) {
      if (!params) params = this.copy(this.$route.params)
      params.id = id

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
    removeAttachmentUrls(data) {
      Object.keys(data).forEach((key) => {
        if (key.includes('attachment') && typeof (data[key]) == typeof ("")) {
          delete data[key]
        }
      })
    },
    getSerialized() {
      // must be implemented, but by default
      let data = this.extractIds(this.item);

      if (this.rowKey) {
        let items = this.copy(this.rows);
        items.map(this.extractIds)
        items = items.slice(0, -1);
        data = {
          item: data,
          items: {
            ids_to_delete: this.itemsToDelete,
            items: items
          }
        }
      }

      this.removeAttachmentUrls(data)
      if (this.formData) {
        data = this.jsonToFormData(data);
      }
      return data;
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
    defineItem(indefine) {
      this.request({
        url: this.endpoint(this.defineUrl),
        method: "post",
        data: {
          item: this.item.id,
          indefine: indefine
        },
        success: data => {
          this.successResponse(data, false)
        }
      });
    },
    toggleItemLock() {
      this.request({
        url: this.endpoint(this.toggleLockUrl),
        method: "post",
        data: {
          item: this.item.id
        },
        success: data => {
          this.successResponse(data, false)
        }
      });
    },
    successResponse(data, clearForm) {
      if (clearForm) {
        this.clearForm();
      } else {
        this.setItem(data)
        this.isEditing = false;
      }
      if (this.hasList) {
        this.getData();
        if (this.serverProcessing) {
          this.$refs.form.$refs.datatable.getDataFromApi();
        }
      }
      this.successNotify();
    },

    updateRowsExplanation(i) {
      if (i == 0) {
        this.rows.map((o) => this.$set(o, 'explanation', this.rows[0].explanation))
      } else {
        this.$set(this.rows[i], 'explanation', this.rows[i - 1].explanation)
      }
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
      sum = sum.toFixed(6);
      return sum
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

    jsonToFormData(jsonObject, options) {
      return jsonToFormData(jsonObject, options)
    },

  }

}