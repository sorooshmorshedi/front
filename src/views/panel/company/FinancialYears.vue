<template>
  <div class="rtl">
    <m-form
      title="سال مالی"
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
      <template #header-btns></template>
      <template #default>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field label=" * نام" v-model="item.name" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              label="* سیستم انبار"
              v-model="item.warehouse_system"
              :items="warehouseSystems"
              :disabled="item.id != undefined"
              :return-object="false"
            />
          </v-col>
          <v-col cols="12" md="6">
            <date label=" * شروع" v-model="item.start" :default="true" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="6">
            <date label=" * پایان" v-model="item.end" :default="true" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12">
            <v-textarea label="توضیحات" v-model="item.explanation" :disabled="!isEditing" />
          </v-col>
        </v-row>
      </template>

      <template #item.activate="{ item }">
        <v-btn
          v-if="!financialYear || financialYear.id != item.id"
          @click="activeFinancialYear(item)"
          color="blue"
          icon
          large
        >
          <v-icon>fa-toggle-off</v-icon>
        </v-btn>
        <v-btn v-else icon color="blue" large>
          <v-icon>fa-toggle-on</v-icon>
        </v-btn>
      </template>
    </m-form>
  </div>
</template>
<script>
import { MFormMixin } from "@/components/m-form";
import GetUserApi from "@/views/panel/user/getUserApi.js";
import CompanyMixin from "@/views/panel/company/mixin";

export default {
  mixins: [MFormMixin, GetUserApi, CompanyMixin],
  props: {},
  data() {
    let warehouseSystems = [
      {
        text: "دائمی",
        value: "d",
      },
      {
        text: "ادواری",
        value: "a",
      },
    ];
    return {
      baseUrl: "companies/financialYears",
      permissionBasename: "financialYear",
      items: [],
      warehouseSystems: warehouseSystems,
      cols: [
        {
          text: "نام",
          value: "name",
        },
        {
          text: "سیستم انبار",
          value: "warehouse_system",
          type: "select",
          items: warehouseSystems,
        },
        {
          text: "شروع",
          value: "start",
        },
        {
          text: "پایان",
          value: "end",
        },
        {
          text: "",
          value: "activate",
          sortable: false,
          filterable: false,
        },
      ],
    };
  },
  computed: {
    createUrl() {
      return `${this.baseUrl}/`;
    },
    updateUrl() {
      return this.item.id && `${this.baseUrl}/${this.item.id}/`;
    },
    deleteUrl() {
      return this.item.id && `${this.baseUrl}/${this.item.id}/`;
    },
  },
  methods: {
    getData() {
      this.getUser();
      this.getFinancialYears((data) => (this.items = data));
    },
    getSerialized() {
      this.item.company = this.company.id;
      return this.item;
    },
    activeFinancialYear(item) {
      this.request({
        url: this.endpoint("users/setActiveFinancialYear"),
        method: "post",
        data: {
          financial_year: item.id,
        },
        success: (data) => {
          this.successNotify();
          window.location.reload();
          this.$store.commit("setUser", data);
        },
      });
    },
  },
};
</script>