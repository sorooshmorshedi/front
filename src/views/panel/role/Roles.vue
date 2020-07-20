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
        <v-row>
          <v-col cols="12">
            <v-text-field label=" * نام" v-model="item.name" />
          </v-col>
          <v-col cols="12">
            <v-subheader>دسترسی ها</v-subheader>
            <div class="d-flex">
              <v-text-field class="mr-2" placeholder="جستوجو" v-model="modelSearch" />
              <v-spacer></v-spacer>
              <v-btn @click="deselectAll" small depressed color="cyan white--text">عدم انتخاب همه</v-btn>
              <v-btn
                @click="selectAll"
                small
                depressed
                color="cyan white--text"
                class="mr-1"
              >انتخاب همه</v-btn>
            </div>
            <v-expansion-panels multiple class="mt-3">
              <v-expansion-panel v-for="(model, i) in models" :key="i">
                <v-expansion-panel-header>
                  <v-row no-gutters>
                    <v-col>{{ model.label }}</v-col>
                    <v-spacer></v-spacer>
                    <v-col class="text-left pl-6">
                      <v-btn @click.stop="deselectAll({model: model.name})" icon>
                        <v-icon>fa-times</v-icon>
                      </v-btn>
                      <v-btn @click.stop="selectAll({model: model.name})" icon class="mr-1">
                        <v-icon>fa-check-double</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row v-if="Object.keys(item.permissions).length == permissions.length">
                    <v-col
                      cols="12"
                      md="6"
                      v-for="(permission, i) in modelPermissions[model.name]"
                      :key="i"
                    >
                      <v-switch :label="permission.name" v-model="item.permissions[permission.id]"></v-switch>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
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
      modelSearch: "",
      permissionsData: [],
      cols: [
        {
          th: "نام",
          td: "name",
          type: "text",
          filters: ["name"]
        }
      ]
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
    },
    modelPermissions() {
      return this.permissionsData;
      let models = this.models.filter(o => o.label.includes(this.modelSearch));
      let result = {};
      for (let model of models) {
        result[model.name] = this.permissionsData[model.name];
      }
      return result;
    },
    models() {
      return [
        { name: "role", label: "نقش ها" },
        { name: "user", label: "کاربران" },
        { name: "company", label: "شرکت ها" },
        { name: "financialyear", label: "سال های مالی" },
        { name: "floataccountgroup", label: "گروه حساب شناور" },
        { name: "floataccount", label: "حساب شناور" },
        { name: "account", label: "حساب ها" },
        { name: "defaultaccount", label: "حساب های پیشفرض" },
        { name: "unit", label: "واحد ها" },
        { name: "warehouse", label: "انبار ها" },
        { name: "warelevel", label: "سطوح کالا" },
        { name: "ware", label: "کالا ها" },
        { name: "sanad", label: "اسناد" },
        { name: "transaction", label: "دریافت و پرداخت" },
        { name: "chequebook", label: "دسته چک" },
        { name: "cheque", label: "چک" },
        { name: "statuschange", label: "تغییر وضعیت چک" },
        { name: "expense", label: "هزینه های فاکتور" },
        { name: "factor", label: "فاکتور" },
        { name: "transfer", label: "انتقال" },
        { name: "report", label: "گزارش ها" },
        { name: "exportverifier", label: "تایید کنندگان خروجی" }
      ].filter(o => o.label.includes(this.modelSearch));
    },
    permissions() {
      let permissions = [];
      for (let modelPermission of Object.values(this.modelPermissions)) {
        if (modelPermission) {
          permissions.push(...modelPermission);
        }
      }
      return permissions;
    }
  },
  methods: {
    getItemTemplate() {
      return {
        name: "",
        permissions: {}
      };
    },
    clearForm() {
      this.item = this.copy(this.getItemTemplate());
      this.item.permissions = this.getPermissionsTemplate();
    },
    getPermissionsTemplate() {
      let permissions = {};
      for (const permission of this.permissions) {
        permissions[permission.id] = false;
      }
      return permissions;
    },
    setItem(item) {
      this.item = { ...item };
      let permissions = {};
      for (const permission of this.permissions) {
        permissions[permission.id] = false;
      }
      for (const permissionId of item.permissions) {
        permissions[permissionId] = true;
      }
      this.item.permissions = permissions;
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
          this.permissionsData = data;
          for (let permission of this.permissions) {
            this.getItemTemplate().permissions[permission.id] = false;
          }
          this.clearForm();
        }
      });
    },
    selectAll({ model = null }) {
      for (let permission of this.permissions) {
        if (!model || permission.contentType.model == model) {
          this.item.permissions[permission.id] = true;
        }
      }
    },
    deselectAll({ model = null }) {
      for (let permission of this.permissions) {
        if (!model || permission.contentType.model == model) {
          this.item.permissions[permission.id] = false;
        }
      }
    },
    getSerialized() {
      let item = this.item;
      let permissions = [];
      Object.keys(item.permissions).forEach(permissionId => {
        if (item.permissions[permissionId]) permissions.push(permissionId);
      });
      item.permissions = permissions;
      return item;
    }
  },
  filters: {}
};
</script>