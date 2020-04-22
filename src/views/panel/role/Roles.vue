<template>
  <div class="rtl">
    <list-modal-form
      title="نقش"
      :items="items"
      :cols="cols"
      :deletable="item.id"
      @rowClick="setItem"
      @clearForm="clearForm"
      @submit="submit"
      @delete="deleteItem"
      ref="listModelForm"
    >
      <template #default>
        <div class="row">
          <div class="form-group col-12">
            <label class="required">نام</label>
            <input type="text" class="form-control" v-model="item.name" />
          </div>
          <div
            class="form-check col-12 col-md-4"
            v-for="(permission, i) in allPermissions"
            :key="i"
          >
            <label class="form-check-label mt-1">
              <input
                type="checkbox"
                class="form-check-input"
                @change="togglePermission(permission)"
                v-model="permissionsModel[String(permission.id)]"
              />
              {{ permission.name }}
            </label>
          </div>
        </div>
      </template>
    </list-modal-form>
  </div>
</template>
<script>
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm.js";
import getRolesApi from "./getRolesApi";

export default {
  mixins: [ListModalFormMixin, getRolesApi],
  props: {},
  data() {
    return {
      baseUrl: "users/roles/list",
      items: [],
      allPermissions: [],
      cols: [
        {
          th: "نام",
          td: "name",
          type: "text",
          filters: ["name__icontains"]
        }
      ],
      itemTemplate: {
        name: "",
        permissions: [],
      },
      permissionsModel: {}
    };
  },
  computed: {
    createUrl() {
      return "users/roles/create";
    },
    updateUrl() {
      return this.item.id && `users/roles/update/${this.item.id}`;
    },
    deleteUrl() {
      return this.item.id && `users/roles/delete/${this.item.id}`;
    }
  },
  methods: {
    clearForm() {
      this.item = { ...this.itemTemplate };
      this.permissionsModel = {}
    },
    setItem(item){
      this.item = item;
      this.permissionsModel = {}
      for(const permission of item.permissions){
        this.permissionsModel[String(permission)] = true
      }
    },
    togglePermission(permission) {
      if (this.isCheckedPermission(permission)) {
        this.item.permissions = this.item.permissions.filter(
          id => id != permission.id
        );
      } else {
        this.item.permissions.push(permission.id);
      }
    },
    isCheckedPermission(permission) {
      return this.item.permissions.filter(id => id == permission.id).length;
    },
    getData() {
      this.getRoles(this.setRoles);
      this.getPermissions();
    },
    setRoles(data) {
      this.items = data;
    },
    getPermissions() {
      this.request({
        url: this.endpoint(`users/permissions/list`),
        method: "get",
        success: data => {
          this.allPermissions = data;
        }
      });
    }
    // getSerialized() {}
  }
};
</script>