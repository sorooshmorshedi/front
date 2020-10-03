<template>
  <div class="rtl">
    <m-form
      title="نقش"
      :items="items"
      :cols="cols"
      :canSubmit="canSubmit"
      :canDelete="canDelete"
      :is-editing.sync="isEditing"
      :showListBtn="false"
      :show-navigation-btns="false"
      @click:row="setItem"
      @clearForm="clearForm"
      @submit="submit"
      @delete="deleteItem"
    >
      <template #default>
        <v-row>
          <v-col cols="12">
            <v-text-field label=" * نام" v-model="item.name" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12">
            <v-subheader>دسترسی ها</v-subheader>
            <div class="d-flex">
              <v-text-field
                class="mr-2"
                placeholder="جستوجو"
                v-model="modelSearch"
                :disabled="!isEditing"
              />
              <v-spacer></v-spacer>
              <v-btn
                @click="setAll({value: false})"
                :disabled="!isEditing"
                small
                depressed
                color="cyan white--text"
              >عدم انتخاب همه</v-btn>
              <v-btn
                @click="setAll({value: true})"
                :disabled="!isEditing"
                small
                depressed
                color="cyan white--text"
                class="mr-1"
              >انتخاب همه</v-btn>
            </div>
            <v-expansion-panels multiple class="mt-3">
              <v-expansion-panel
                v-for="(model, i) in models"
                :key="i"
                v-if="showModelPermissions(model)"
              >
                <v-expansion-panel-header>
                  <v-row no-gutters>
                    <v-col>{{ model.label }}</v-col>
                    <v-spacer></v-spacer>
                    <v-col class="text-left pl-6">
                      <v-btn
                        @click.stop="setAll({model: model.name, value:false})"
                        icon
                        :disabled="!isEditing"
                      >
                        <v-icon>fa-times</v-icon>
                      </v-btn>
                      <v-btn
                        @click.stop="setAll({model: model.name, value:true})"
                        icon
                        class="mr-1"
                        :disabled="!isEditing"
                      >
                        <v-icon>fa-check-double</v-icon>
                      </v-btn>

                      <v-btn
                        @click.stop="setAll({model: model.name, value:true, justOwn: true})"
                        icon
                        class="mr-1"
                        :disabled="!isEditing"
                      >
                        <v-icon>fa-user-shield</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row v-if="Object.keys(item.permissions).length == rawPermissions.length">
                    <v-col cols="12">
                      <v-row no-gutters>
                        <v-col cols="12" class="pb-0">
                          <v-btn-toggle
                            v-model="item.localPerms[model.name]"
                            @change="setCRUDPermissions(model)"
                            background-color="white"
                            multiple
                            color="green"
                            tile
                            borderless
                          >
                            <v-tooltip top v-for="(btn, i) in getPermissionBtns(model)">
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  :style="(getPermissionBtns(model).length != i-1)?'border-left: 1px solid black':''"
                                  tile
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                  <v-icon>{{ btn.icon }}</v-icon>
                                </v-btn>
                              </template>
                              <span>{{ btn.tootltip }}</span>
                            </v-tooltip>
                          </v-btn-toggle>
                        </v-col>
                        <v-col cols="12" class="pt-0">
                          <v-btn-toggle
                            v-model="item.localOwnPerms[model.name]"
                            @change="setCRUDPermissions(model, true)"
                            background-color="white"
                            multiple
                            color="lime"
                            tile
                            borderless
                          >
                            <template v-for="(btn, i) in getPermissionBtns(model)">
                              <v-tooltip bottom v-if="btn.hasOwn">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    :style="(getPermissionBtns(model).length != i-1)?'border-left: 1px solid black':''"
                                    tile
                                    v-bind="attrs"
                                    v-on="on"
                                  >
                                    <v-icon>fa-user-shield</v-icon>
                                  </v-btn>
                                </template>
                                <span>{{ btn.tootltip }} مواردی که خود کاربر ثبت کرده است</span>
                              </v-tooltip>
                              <v-btn
                                v-else
                                disabled
                                style="border-left: 1px solid black;background-color: white !important"
                              ></v-btn>
                            </template>
                          </v-btn-toggle>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12">
                      <v-switch
                        v-for="(permission, i) in getModelPermissions(model.name)"
                        :key="i"
                        :label="permission.name"
                        v-model="item.permissions[permission.id]"
                        :disabled="!isEditing"
                      ></v-switch>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </template>
    </m-form>
  </div>
</template>
<script>
import { MFormMixin } from "@bit/mmd-mostafaee.vue.m-form";
import getRolesApi from "./getRolesApi";

export default {
  mixins: [MFormMixin, getRolesApi],
  props: {},
  data() {
    return {
      baseUrl: "users/roles/list",
      permissionBasename: "role",
      items: [],
      modelSearch: "",
      rawPermissions: [],
      operations: [
        "get",
        "create",
        "update",
        "delete",
        "firstConfirm",
        "secondConfirm",
      ],
      cols: [
        {
          text: "نام",
          value: "name",
          type: "text",
          filters: ["name"],
        },
      ],
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
      let models = this.models;
      let result = {};
      for (let model of models) {
        result[model.name] = this.permissionsData[model.name];
      }
      return result;
    },
    permissions() {
      return this.rawPermissions.filter((o) => {
        let codename = o.codename;
        let f =
          !codename.startsWith("get") &&
          !codename.startsWith("create") &&
          !codename.startsWith("update") &&
          !codename.startsWith("firstConfirm") &&
          !codename.startsWith("secondConfirm") &&
          !codename.startsWith("delete");
        return f;
      });
    },
    models() {
      return [
        { name: "role", label: "نقش ها" },
        { name: "user", label: "کاربران" },
        { name: "company", label: "شرکت ها" },
        { name: "financialYear", label: "سال های مالی" },
        {
          name: "floatAccountGroup",
          label: "گروه حساب شناور و مرکز هزینه و درآمد",
        },
        { name: "floatAccount", label: "حساب شناور و مرکز هزینه و درآمد" },
        { name: "account", label: "حساب ها" },
        { name: "defaultAccount", label: "حساب های پیشفرض" },
        { name: "unit", label: "واحد ها" },
        { name: "warehouse", label: "انبار ها" },
        { name: "wareLevel", label: "سطوح کالا" },
        { name: "ware", label: "کالا ها" },
        { name: "sanad", label: "اسناد" },
        { name: "receiveTransaction", label: "دریافت" },
        { name: "paymentTransaction", label: "پرداخت" },
        { name: "chequebook", label: "دسته چک" },
        { name: "cheque", label: "چک" },
        { name: "statusChange", label: "تغییر وضعیت چک" },
        { name: "expense", label: "هزینه های فاکتور" },
        { name: "buyFactor", label: "فاکتور خرید" },
        { name: "saleFactor", label: "فاکتور فروش" },
        { name: "backFromBuyFactor", label: "فاکتور برگشت از خرید" },
        { name: "backFromSaleFactor", label: "فاکتور برگشت از فروش" },
        { name: "consumptionWareFactor", label: "حواله کالای مصرفی" },
        { name: "transfer", label: "انتقال" },
        { name: "report", label: "گزارش ها" },
        { name: "exportVerifier", label: "تایید کنندگان خروجی" },
        { name: "driver", label: "راننده" },
        { name: "car", label: "ماشین" },
        { name: "driving", label: "انتصاب راننده به ماشین" },
        { name: "association", label: "انجمن" },
        { name: "remittance", label: "حواله" },
        { name: "ladingBillSeries", label: "سری بارگیری" },
        { name: "ladingBillNumber", label: "کد بارگیری" },
        { name: "lading", label: "بارگیری" },
        { name: "oilCompanyLading", label: "بارگیری شرکت نفت" },
        { name: "otherDriverPayment", label: "پرداخت رانندگان متفرقه" },
      ].filter((o) => o.label.includes(this.modelSearch));
    },
  },
  methods: {
    showModelPermissions(model) {
      if (!this.item || !this.item.id) return true;
      let show = false;
      for (let permission of this.rawPermissions) {
        if (model.name.toLowerCase().includes(permission.contentType.model)) {
          show |= this.item.permissions[permission.id];
        }
      }
      return show;
    },
    getPermissionBtns(model) {
      let permissionBtns = [
        {
          icon: "fa-eye",
          tootltip: "مشاهده",
          hasOwn: true,
        },
        {
          icon: "fa-plus",
          tootltip: "تعریف",
          hasOwn: false,
        },
        {
          icon: "fa-edit",
          tootltip: "ویرایش",
          hasOwn: true,
        },
        {
          icon: "fa-trash-alt",
          tootltip: "حذف",
          hasOwn: true,
        },
      ];
      if (this.hasConfirmPermission(model)) {
        permissionBtns.push(
          { icon: "fa-check", tootltip: "تایید اول", hasOwn: true },
          { icon: "fa-check-double", tootltip: "تایید دوم", hasOwn: true }
        );
      }

      return permissionBtns;
    },
    hasConfirmPermission(model) {
      return (
        this.rawPermissions.filter(
          (o) => o.codename == `firstConfirm.${model.name}`
        ).length != 0
      );
    },
    getPermissionByCodename(codename) {
      let results = this.rawPermissions.filter((o) => o.codename == codename);
      if (results.length) return results[0];
      return null;
    },
    setCRUDPermissions(model, isOwnChanged) {
      let modelPermissions = this.item.localPerms[model.name];
      let modelOwnPermissions = this.item.localOwnPerms[model.name];

      for (let i = 0; i < this.operations.length; i++) {
        let codename = `${this.operations[i]}.${model.name}`;
        let permission = this.getPermissionByCodename(codename);

        let ownCodename = `${this.operations[i]}Own.${model.name}`;
        let ownPermission = this.getPermissionByCodename(ownCodename);

        let hasPerm = modelPermissions.includes(i);
        let hasOwnPerm = modelOwnPermissions.includes(i);

        if (hasPerm && !isOwnChanged) {
          this.item.permissions[permission.id] = true;
          ownPermission && (this.item.permissions[ownPermission.id] = false);
          hasOwnPerm &&
            modelOwnPermissions.splice(modelOwnPermissions.indexOf(i), 1);
          hasOwnPerm = false;
        }
        if (hasOwnPerm) {
          this.item.permissions[permission.id] = false;
          ownPermission && (this.item.permissions[ownPermission.id] = true);
          hasPerm && modelPermissions.splice(modelPermissions.indexOf(i), 1);
        }
        if (!hasPerm && !hasOwnPerm) {
          permission && (this.item.permissions[permission.id] = false);
          ownPermission && (this.item.permissions[ownPermission.id] = false);
        }
      }

      for (const i of modelPermissions) {
        let codename = `${this.operations[i]}.${model}`;
        let permission = this.getPermissionByCodename(codename);
      }
    },
    getModelPermissions(model) {
      return this.permissions.filter((o) => o.codename.includes(model));
    },
    getItemTemplate() {
      let item = {
        name: "",
        permissions: {},
        localPerms: {},
        localOwnPerms: {},
      };

      for (const model of this.models) {
        item.localPerms[model.name] = [];
        item.localOwnPerms[model.name] = [];
      }

      return item;
    },
    clearForm() {
      this.item = this.copy(this.getItemTemplate());
      this.item.permissions = this.getPermissionsTemplate();
      this.isEditing = true;
    },
    getPermissionsTemplate() {
      let permissions = {};
      for (const permission of this.rawPermissions) {
        permissions[permission.id] = false;
      }
      return permissions;
    },
    setItem(item) {
      this.item = {
        ...this.getItemTemplate(),
        ...item,
      };

      let permissions = {};
      for (const permission of this.rawPermissions) {
        permissions[permission.id] = false;
      }
      for (const permissionId of item.permissions) {
        permissions[permissionId] = true;
      }
      this.item.permissions = permissions;

      for (const model of this.models) {
        for (let i = 0; i < this.operations.length; i++) {
          let codename = `${this.operations[i]}.${model.name}`;
          let ownCodename = `${this.operations[i]}Own.${model.name}`;

          let permission = this.getPermissionByCodename(codename);
          let ownPermission = this.getPermissionByCodename(ownCodename);

          if (permission && this.item.permissions[permission.id]) {
            this.item.localPerms[model.name].push(i);
          }

          if (ownPermission && this.item.permissions[ownPermission.id]) {
            this.item.localOwnPerms[model.name].push(i);
          }
        }
      }
    },
    isCheckedPermission(permission) {
      return this.item.permissions.filter((id) => id == permission.id).length;
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
        success: (data) => {
          this.rawPermissions = data;
          for (let permission of this.rawPermissions) {
            this.getItemTemplate().permissions[permission.id] = false;
          }
          this.clearForm();
        },
      });
    },
    setAll({ model = null, value, justOwn = false }) {
      for (let permission of this.rawPermissions) {
        if (
          !model ||
          model.toLowerCase().includes(permission.contentType.model)
        ) {
          if (justOwn && !permission.codename.includes("Own")) {
            continue;
          }
          this.item.permissions[permission.id] = value;
        }
      }

      if (model) {
        if (value) {
          if (justOwn) {
            this.item.localOwnPerms[model] = [0, 1, 2, 3, 4, 5];
          } else {
            this.item.localPerms[model] = [0, 1, 2, 3, 4, 5];
          }
        } else {
          this.item.localPerms[model] = [];
          this.item.localOwnPerms[model] = [];
        }
      } else {
        Object.keys(this.item.localPerms).forEach((key) => {
          if (value) {
            this.item.localPerms[key] = [0, 1, 2, 3, 4, 5];
          } else {
            this.item.localPerms[key] = [];
          }
          this.item.localOwnPerms[key] = [];
        });
      }
    },
    getSerialized() {
      let item = this.item;
      let permissions = [];
      Object.keys(item.permissions).forEach((permissionId) => {
        if (item.permissions[permissionId]) permissions.push(permissionId);
      });
      item.permissions = permissions;
      return item;
    },
  },
  filters: {},
};
</script>