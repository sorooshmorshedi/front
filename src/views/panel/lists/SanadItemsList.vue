<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text>
          <v-row>
            <template>
              <v-col cols="12">
                <sanad-item-list-report
                  :filters.sync="filters"
                  :showAccountInTable="showAccountInTable"
                  :sortable="true"
                  :filterable="true"
                  :showRemain="false"
                  :showPreviousRemain="true"
                  :showLink="true"
                  :headers="headers"
                  :colspan="11"
                />
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import SanadItemListReport from "@/components/mcomponents/report/SanadItemListReport";
import queryBinding from "@/components/m-query-binding";
import AccountMixin from "@/mixin/accountMixin";
export default {
  name: "SanadItemsList",
  mixins: [queryBinding, AccountMixin],
  components: { SanadItemListReport },
  data() {
    return {
      filters: {},
    };
  },
  computed: {
    title() {
      return "جزئیات اسناد";
    },
    headers() {
      return [
        {
          text: "عطف",
          value: "sanad.local_id",
        },
        {
          text: "شماره سند",
          value: "sanad.code",
        },
        {
          text: "تاریخ",
          value: "sanad.date",
          type: "date",
        },
        {
          text: "سیستمی",
          value: "is_auto_created",
          type: "boolean",
        },
        {
          text: "کاربر",
          value: "created_by.name",
        },
        {
          text: "شرح",
          value: "sanad.explanation",
        },
        {
          text: "شرح ردیف",
          value: "explanation",
        },
        {
          text: "کد حساب",
          value: "account.code",
        },
        {
          text: "نام حساب",
          value: "account.name",
        },
        {
          text: "شناور",
          value: "floatAccount.name",
        },
        {
          text: "مرکز",
          value: "floatAccount.name",
        },
        {
          text: "بدهکار",
          value: "bed",
          type: "numeric",
        },
        {
          text: "بستانکار",
          value: "bes",
          type: "numeric",
        },
        {
          text: "مشاهده سند",
          value: "detail",
          sortable: false,
          filterable: false,
          align: "left",
          hideInExport: true,
          show: this.showLink,
        },
      ];
    },
  },
  created() {
    this.filters = this.getFiltersTemplate();
    this.init();
  },
  methods: {
    getFiltersTemplate() {
      return {
        financial_year: this.financialYear.id,
        account_title: "",
        account__code__startswith: "",
        floatAccount: null,
        costCenter: null,
        floatAccount__floatAccountGroups: null,
        costCenter__floatAccountGroups: null,
        title: this.title,
      };
    },
  },
};
</script>

<style scoped lang="scss">
</style>
