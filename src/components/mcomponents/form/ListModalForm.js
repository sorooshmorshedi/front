import ListModalForm from "./ListModalForm.vue";
import OpenSanadBtn from "@/components/form/OpenSanadBtn";
import jsonToFormData from "@/mixin/_jsonToFormData";
import queryBinding from "@/mixin/queryBinding";

import MFileInput from "@/components/mcomponents/form/MFileInput";

export default {
  mixins: [queryBinding],
  components: {
    ListModalForm,
    OpenSanadBtn,
    MFileInput
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
      leadingSlash: false,
      formData: false,
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
      return id && `${this.baseUrl}/${id}${this.leadingSlash ? "/" : ""}`;
    },
    confirmUrl() {
      let id = this.item.id || this.id || null;
      return id && `${this.baseUrl}/${id}/confirm` + (this.leadingSlash ? "/" : "")
    },
    deleteUrl() {
      return this.item.id && `${this.baseUrl}/${this.item.id}` + (this.leadingSlash ? "/" : "")
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
    canConfirm() {
      let hasPerm = this.item.id != undefined;
      if (!this.item.first_confirmed_at) {
        hasPerm &= this.hasPerm('firstConfirm', this.permissionBasename, this.item);
      } else if (!this.item.second_confirmed_at) {
        hasPerm &= this.hasPerm('secondConfirm', this.permissionBasename, this.item);
      } else {
        return false;
      }
      return hasPerm
    },
    canCancelConfirm() {
      let hasPerm = this.item.id != undefined;
      if (this.item.first_confirmed_at) {
        hasPerm &= this.hasPerm('firstConfirm', this.permissionBasename, this.item);
      } else if (this.item.second_confirmed_at) {
        hasPerm &= this.hasPerm('secondConfirm', this.permissionBasename, this.item);
      } else {
        return false;
      }
      return hasPerm
    },
    confirmBtnText() {
      if (!this.item.first_confirmed_at) {
        return "تایید اول"
      } else {
        return "تایید دوم"
      }
    },
    cancelConfirmBtnText() {
      if (this.item.first_confirmed_at && !this.item.second_confirmed_at) {
        return "لفو تایید اول"
      } else {
        return "لفو تایید دوم"
      }
    }
  },
  watch: {
    $route(newRoute, oldRoute) {
      if (!newRoute.params.id) {
        this.clearForm();
      } else {
        this.getItem();
      }
    },
    rows: {
      handler() {
        if (!this.rowKey) return;
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
      let data = this.extractIds(this.item);
      if (this.formData) data = this.jsonToFormData(data);
      console.log(data);
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
    confirm(cancel = false) {
      this.request({
        url: this.endpoint(this.confirmUrl),
        method: "put",
        data: {
          cancel: cancel
        },
        success: data => {
          this.getItem();
          this.isEditing = false;
          this.successNotify();
        }
      });
    },
    cancelConfirm() {
      this.confirm(true)
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

    jsonToFormData(jsonObject, options) {
      return jsonToFormData(jsonObject, options)
    },

  }

}