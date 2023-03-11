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
            <v-text-field class="rounded-lg" label=" * نام" v-model="item.name" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
                class="rounded-lg"
                label="* سیستم انبار"
                v-model="item.warehouse_system"
                :items="warehouseSystems"
                :disabled="item.id != undefined && item.warehouse_system != ''"
                :return-object="false"
            />
          </v-col>
          <v-col cols="12" md="6">
            <date label=" * شروع" v-model="item.start" :default="true" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="6">
            <date label=" * پایان" v-model="item.end" :default="true" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12">
            <v-textarea class="rounded-lg" label="توضیحات" v-model="item.explanation" :disabled="!isEditing"/>
          </v-col>
        </v-row>
      </template>

      <template #item.activate="{ item }">
        <v-tooltip v-if="!financialYear || financialYear.id != item.id" top color="secondary">
          <template v-slot:activator="{ on, attrs }">

            <v-btn
                @click="changeFinancialYear(item)"
                color="secondary"
                icon
                large
                v-bind="attrs"
                v-on="on"
            >
              <v-icon>fa-power-off</v-icon>
            </v-btn>
          </template>
          فعال سازی
        </v-tooltip>

        <v-tooltip v-else top color="success">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="success"
                icon
                large
                v-bind="attrs"
                v-on="on"

            >
              <v-icon>fa-check</v-icon>
            </v-btn>
          </template>
          سال مالی فعال
        </v-tooltip>
        <v-dialog
            v-model="changeFinancialYearDialog"
            activator="parent"
            transition="dialog-top-transition"
            width="auto"
        >
          <v-card class="pa-5 rounded-lg">
            <v-card-title :style="{'color': '#F1416C'}">
              آیا اطمینان دارید؟
            </v-card-title>
            <v-card-text>
              با تغییر سال مالی سایر تب های سامانه بسته می شوند، میخواهید ادامه دهید؟
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn depressed color="error" @click="notChangeFinancialYear">خیر</v-btn>
              <v-btn depressed title="تغییر سال مالی" color="success" @click="activeFinancialYear">بله</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </template>
    </m-form>
  </div>
</template>
<script>
import {MFormMixin} from "@/components/m-form";
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
      next_year: null,
      changeFinancialYearDialog: false,
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
    activeFinancialYear() {
      this.request({
        url: this.endpoint("users/setActiveFinancialYear"),
        method: "post",
        data: {
          financial_year: this.next_year.id,
        },
        success: (data) => {
          this.tabEmit("change:activeFinancialYear");
          this.successNotify();
          window.location.reload();
        },
      });
    },
    changeFinancialYear(item) {
      console.log(item)
      this.next_year = item
      this.changeFinancialYearDialog = true
    },
    notChangeFinancialYear() {
      this.next_year = null
      this.changeFinancialYearDialog = false
    },

  },
};
</script>