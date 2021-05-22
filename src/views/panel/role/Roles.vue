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
            <div class="d-flex flex-column flex-md-row">
              <v-text-field placeholder="جستجو" v-model="modelSearch" :disabled="!isEditing" />
              <v-spacer></v-spacer>
              <v-btn
                @click="setAll({value: false})"
                :disabled="!isEditing"
                small
                depressed
                color="cyan white--text"
                class="mt-1 mt-md-0"
              >عدم انتخاب همه</v-btn>
              <v-btn
                @click="setAll({value: true})"
                :disabled="!isEditing"
                small
                depressed
                color="cyan white--text"
                class="mt-1 mt-md-0 mr-md-1"
              >انتخاب همه</v-btn>
            </div>
            <v-expansion-panels multiple class="mt-3">
              <v-expansion-panel
                v-for="(model, i) in filteredModels"
                :key="i"
                v-show="showModelPermissions(model)"
              >
                <v-expansion-panel-header>
                  <v-row no-gutters>
                    <v-col>{{ model.label }}</v-col>
                    <v-spacer></v-spacer>
                    <v-col class="text-left pl-6 d-flex justify-end">
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
                  <v-row>
                    <v-col cols="12" v-if="hasShortcutPerms(model)">
                      <v-row no-gutters>
                        <v-col cols="12" class="pb-0">
                          <v-btn-toggle
                            v-model="item[model.modelKey]"
                            background-color="white"
                            multiple
                            color="green"
                            tile
                            borderless
                          >
                            <v-tooltip top v-for="(btn, i) in getPermissionBtns(model)" :key="i">
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  :style="(getPermissionBtns(model).length != i-1)?'border-left: 1px solid black':''"
                                  tile
                                  v-bind="attrs"
                                  v-on="on"
                                  :value="btn.value"
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
                            v-model="item[model.ownModelKey]"
                            background-color="white"
                            multiple
                            color="lime"
                            tile
                            borderless
                          >
                            <template v-for="(btn, i) in getPermissionBtns(model)">
                              <v-tooltip bottom v-if="btn.ownValue">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    :style="(getPermissionBtns(model).length != i-1)?'border-left: 1px solid black':''"
                                    tile
                                    v-bind="attrs"
                                    v-on="on"
                                    :value="btn.ownValue"
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
                        v-for="(permission, i) in model.permissions"
                        :key="i"
                        :label="permission.name"
                        v-model="item[model.otherModelKey][permission.id]"
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
import { MFormMixin } from "@/components/m-form";
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
      operations: ["get", "create", "update", "delete"],
      cols: [
        {
          text: "نام",
          value: "name",
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
    otherPermissions() {
      return this.rawPermissions.filter((o) => {
        let codename = o.codename;
        let f =
          o.contentType.model == "report" ||
          o.codename.includes("firstPeriodInventory") ||
          (!codename.startsWith("get") &&
            !codename.startsWith("create") &&
            !codename.startsWith("update") &&
            !codename.startsWith("delete"));
        return f;
      });
    },
    models() {
      let models = [
        { app: "users", name: "role", label: "نقش ها" },
        { app: "users", name: "user", label: "کاربران" },
        { app: "companies", name: "company", label: "شرکت ها" },
        { app: "companies", name: "financialYear", label: "سال های مالی" },
        {
          app: "accounts",
          name: "floatAccountGroup",
          label: "گروه حساب شناور و مرکز هزینه و درآمد",
        },
        {
          app: "accounts",
          name: "floatAccount",
          label: "حساب شناور و مرکز هزینه و درآمد",
        },
        { app: "accounts", name: "account", label: "حساب ها" },
        { app: "accounts", name: "defaultAccount", label: "حساب های پیشفرض" },
        { app: "wares", name: "unit", label: "واحد ها" },
        { app: "wares", name: "warehouse", label: "انبار ها" },
        { app: "wares", name: "ware", label: "کالا و سطوح کالا" },
        { app: "wares", name: "salePriceType", label: "انواع نرخ های فروش" },
        { app: "sanads", name: "sanad", label: "اسناد" },
        { app: "transactions", name: "receiveTransaction", label: "دریافت" },
        { app: "transactions", name: "paymentTransaction", label: "پرداخت" },
        { app: "cheques", name: "chequebook", label: "دسته چک" },
        { app: "cheques", name: "cheque", label: "چک" },
        { app: "cheques", name: "statusChange", label: "تغییر وضعیت چک" },
        { app: "factors", name: "expense", label: "هزینه های فاکتور" },
        { app: "factors", name: "receipt", label: "رسید" },
        { app: "factors", name: "remittance", label: "حواله" },
        { app: "factors", name: "buyPreFactor", label: "پیش فاکتور خرید" },
        { app: "factors", name: "salePreFactor", label: "پیش فاکتور فروش" },
        { app: "factors", name: "buyFactor", label: "فاکتور خرید" },
        { app: "factors", name: "saleFactor", label: "فاکتور فروش" },
        {
          app: "factors",
          name: "backFromBuyFactor",
          label: "فاکتور برگشت از خرید",
        },
        {
          app: "factors",
          name: "backFromSaleFactor",
          label: "فاکتور برگشت از فروش",
        },
        {
          app: "factors",
          name: "firstPeriodInventory",
          label: "موجودی اول دوره",
        },
        {
          app: "factors",
          name: "consumptionWareFactor",
          label: "حواله کالای مصرفی",
        },
        { app: "factors", name: "transfer", label: "انتقال" },
        { app: "factors", name: "warehouseHandling", label: "انبارگردانی" },
        { app: "reports", name: "report", label: "گزارش ها" },
        {
          app: "reports",
          name: "exportVerifier",
          label: "تایید کنندگان خروجی",
        },
      ];
      if (this.hasModule("dashtbashi")) {
        models.push(
          ...[
            { app: "_dashtbashi", name: "driver", label: "راننده" },
            { app: "_dashtbashi", name: "car", label: "ماشین" },
            {
              app: "_dashtbashi",
              name: "driving",
              label: "انتصاب راننده به ماشین",
            },
            { app: "_dashtbashi", name: "association", label: "انجمن" },
            {
              app: "_dashtbashi",
              name: "remittance",
              label: "حواله حمل و نقل",
            },
            {
              app: "_dashtbashi",
              name: "ladingBillSeries",
              label: "سری بارگیری",
            },
            {
              app: "_dashtbashi",
              name: "ladingBillNumber",
              label: "کد بارگیری",
            },
            { app: "_dashtbashi", name: "lading", label: "بارگیری" },
            {
              app: "_dashtbashi",
              name: "oilCompanyLading",
              label: "بارگیری شرکت نفت",
            },
            {
              app: "_dashtbashi",
              name: "otherDriverPayment",
              label: "پرداخت رانندگان متفرقه",
            },
          ]
        );
      }
      if (this.hasModule("distribution")) {
        models.push(
          ...[
            { app: "distributions", name: "path", label: "مسیر ها" },
            { app: "distributions", name: "car", label: "ماشین" },
            { app: "distributions", name: "visitor", label: "ویزیتور ها" },
            {
              app: "distributions",
              name: "commissionRange",
              label: "بازه کمیسیون",
            },
            { app: "distributions", name: "distributor", label: "موزع" },
            { app: "distributions", name: "driver", label: "راننده" },
            {
              app: "distributions",
              name: "distribution",
              label: "تحویل فاکتور جهت توزیع",
            },
          ]
        );
      }

      models.map((o) => {
        o.permissions = this.getModelOtherPermissions(o);
        o.modelKey = `${o.app}.${o.name}`;
        o.ownModelKey = `${o.modelKey}.own`;
        o.otherModelKey = `${o.modelKey}.other`;
        return o;
      });

      return models;
    },
    filteredModels() {
      return this.models.filter((o) => {
        return o.label.includes(this.modelSearch);
      });
    },
  },
  methods: {
    showModelPermissions(model) {
      if (!this.item || !this.item.id || this.isEditing) return true;
      let show = false;
      return (
        this.item[model.modelKey].length ||
        this.item[model.ownModelKey].length ||
        Object.keys(this.item[model.otherModelKey]).length
      );
    },
    getPermissionBtns(model) {
      let permissionBtns = [
        {
          icon: "fa-eye",
          tootltip: "مشاهده",
          value: `get.${model.name}`,
          ownValue: `getOwn.${model.name}`,
        },
        {
          icon: "fa-plus",
          tootltip: "تعریف",
          value: `create.${model.name}`,
        },
        {
          icon: "fa-edit",
          tootltip: "ویرایش",
          value: `update.${model.name}`,
          ownValue: `updateOwn.${model.name}`,
        },
        {
          icon: "fa-trash-alt",
          tootltip: "حذف",
          value: `delete.${model.name}`,
          ownValue: `deleteOwn.${model.name}`,
        },
      ];
      return permissionBtns;
    },
    getPermissionByCodename(codename) {
      let results = this.rawPermissions.filter((o) => o.codename == codename);
      if (results.length) return results[0];
      return null;
    },
    hasShortcutPerms(model) {
      return !["firstPeriodInventory", "report"].includes(model.name);
    },
    getModelOtherPermissions(model) {
      return this.otherPermissions.filter((o) => {
        return this.isModelPermission(model, o);
      });
    },
    isModelPermission(model, permission) {
      return (
        permission.contentType.app_label == model.app &&
        permission.codename.split(".")[1] == model.name
      );
    },
    getItemTemplate() {
      let item = {};

      for (const model of this.models) {
        item[model.modelKey] = [];
        item[model.ownModelKey] = [];
        item[model.otherModelKey] = {};
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
      item = {
        ...this.getItemTemplate(),
        ...item,
      };
      item.permissionObjects = item.permissions.map((permissionId) => {
        return this.rawPermissions.find((o) => o.id == permissionId);
      });

      for (const model of this.models) {
        for (const permission of item.permissionObjects) {
          if (this.isModelPermission(model, permission)) {
            if (
              this.otherPermissions.map((o) => o.id).includes(permission.id)
            ) {
              item[model.otherModelKey][permission.id] = true;
            } else if (permission.codename.includes("Own")) {
              item[model.ownModelKey].push(permission.codename);
            } else {
              item[model.modelKey].push(permission.codename);
            }
          }
        }
      }

      this.item = item;
    },
    isCheckedPermission(permission) {
      return this.item.permissions.filter((id) => id == permission.id).length;
    },
    getData() {
      this.getRoles(this.setRoles);
      this.getPermissions();
    },
    setRoles(data) {
      this.modelSearch = "";
      this.items = data;
    },
    getPermissions() {
      this.request({
        url: this.endpoint(`users/permissions/list`),
        method: "get",
        success: (data) => {
          this.rawPermissions = data;
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
      let item = this.copy(this.item);
      delete item.permissionObjects;

      let permissions = [];
      for (const model of this.models) {
        permissions.push(
          ...this.rawPermissions
            .filter(
              (o) =>
                this.isModelPermission(model, o) &&
                (item[model.modelKey].includes(o.codename) ||
                  item[model.ownModelKey].includes(o.codename))
            )
            .map((o) => o.id)
        );

        permissions.push(
          ...Object.keys(item[model.otherModelKey]).filter(
            (key) => item[model.otherModelKey][key]
          )
        );

        delete item[model.modelKey];
        delete item[model.ownModelKey];
        delete item[model.otherModelKey];
      }

      item.permissions = permissions;
      return item;
    },
  },
};
</script>