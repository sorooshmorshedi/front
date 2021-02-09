<template>
  <m-datatable
    :headers="headers"
    api-url="reports/sanadItems"
    :filters.sync="localFilters"
    :previousApiData.sync="previousApiData"
    :currentApiData.sync="apiData"
  >
    <template #item.detail="{ item }">
      <detail-link :to="to(item.sanad)" :new-tab="true" />
    </template>

    <template v-if="apiData.previous" v-slot:body.prepend="{ headers }">
      <tr class="text-center">
        <td colspan="4"></td>
        <td>منقول از صفحه قبل</td>
        <td v-if="showAccountInTable" colspan="2"></td>
        <td v-if="showFinancialYear" colspan="1"></td>
        <td>{{ previousLastItem.comulative_bed | toMoney }}</td>
        <td>{{ previousLastItem.comulative_bes | toMoney }}</td>
        <template v-if="showRemain">
          <td>{{ previousLastItem.remain | toMoney }}</td>
          <td>{{ previousLastItem.remain_type }}</td>
        </template>
      </tr>
    </template>
    <template v-else-if="showPreviousRemain && lastItem" v-slot:body.prepend="{ headers }">
      <tr class="text-center">
        <td colspan="4"></td>
        <td>مانده از قبل</td>
        <td v-if="showAccountInTable" colspan="2"></td>
        <td v-if="showFinancialYear" colspan="1"></td>
        <td>{{ lastItem.previous_bed | toMoney }}</td>
        <td>{{ lastItem.previous_bes | toMoney }}</td>
        <template v-if="showRemain">
          <td>{{ lastItem.previous_remain | toMoney }}</td>
          <td>{{ lastItem.previous_remain_type }}</td>
        </template>
      </tr>
    </template>

    <template v-if="apiData.results.length" v-slot:body.append="{ headers }">
      <tr class="text-center">
        <td colspan="4"></td>
        <td>جمع این صفحه</td>
        <td v-if="showAccountInTable" colspan="2"></td>
        <td v-if="showFinancialYear" colspan="2"></td>
        <td>{{ pageSum['bed'] | toMoney }}</td>
        <td>{{ pageSum['bes'] | toMoney }}</td>
        <template v-if="showRemain">
          <td>{{ lastItem.remain | toMoney }}</td>
          <td>{{ lastItem.remain_type | toMoney }}</td>
        </template>
      </tr>
      <tr v-if="apiData.previous" class="text-center">
        <td colspan="4"></td>
        <td>جمع تا این صفحه</td>
        <td v-if="showAccountInTable" colspan="2"></td>
        <td v-if="showFinancialYear" colspan="1"></td>
        <td>{{ lastItem.comulative_bed | toMoney }}</td>
        <td>{{ lastItem.comulative_bes | toMoney }}</td>
        <template v-if="showRemain">
          <td>{{ lastItem.remain | toMoney }}</td>
          <td>{{ lastItem.remain_type | toMoney }}</td>
        </template>
      </tr>
    </template>

    <template v-for="(index, name) in $slots" v-slot:[name]>
      <slot :name="name" />
    </template>
    <template v-for="(index, name) in $scopedSlots" v-slot:[name]="data">
      <slot :name="name" v-bind="data"></slot>
    </template>
  </m-datatable>
</template>

<script>
import accountApiMixin from "@/mixin/accountMixin";
import _ from "lodash";
export default {
  name: "SanadItemListReport",
  mixins: [accountApiMixin],
  props: {
    filters: {},
    showAccountInTable: {
      required: true,
    },
    showFinancialYear: {
      required: false,
      default: false,
    },
    showLink: {
      required: true,
    },
    sortable: {
      required: true,
    },
    filterable: {
      required: true,
    },
    showRemain: {
      required: true,
    },
    showPreviousRemain: {
      required: true,
    },
  },
  data() {
    return {
      apiData: {
        results: [],
      },
      localFilters: this.filters,
      previousApiData: null,
    };
  },
  computed: {
    lastItem() {
      return this.apiData.results[this.apiData.results.length - 1];
    },
    previousLastItem() {
      if (this.previousApiData) {
        return this.previousApiData.results[
          this.previousApiData.results.length - 1
        ];
      } else {
        return null;
      }
    },
    previousRemain() {
      if (this.apiData.results.length) {
        let item = this.apiData.results[0];
        return Math.abs(
          item.comulative_bed - +item.bed - (item.comulative_bes - +item.bes)
        );
      }
      return 0;
    },
    previousRemainType() {
      if (this.apiData.results.length) {
        let item = this.apiData.results[0];
        let bed_remain =
          item.comulative_bed - +item.bed - (item.comulative_bes - +item.bes);
        if (bed_remain > 0) return "بد";
        if (bed_remain < 0) return "بس";
      }
      return " - ";
    },
    pageSum() {
      let bed = 0;
      let bes = 0;
      this.apiData.results.forEach((item) => {
        bed += +item.bed;
        bes += +item.bes;
      });
      return { bed, bes };
    },
    headers() {
      let headers = [
        {
          text: "سال مالی",
          value: "financial_year.name",
          sortable: this.sortable,
          filterable: this.filterable,
          show: this.showFinancialYear,
        },
        {
          text: "تاریخ",
          value: "sanad.date",
          type: "date",
          sortable: this.sortable,
          filterable: this.filterable,
        },
        {
          text: "شماره سند",
          value: "sanad.code",
          type: "numeric",
          sortable: this.sortable,
          filterable: this.filterable,
        },
        {
          text: "شرح",
          value: "explanation",
          sortable: this.sortable,
          filterable: this.filterable,
        },
      ];
      headers = headers.concat([
        {
          text: "کد حساب",
          value: "account.code",
          showRangeFilter: true,
          sortable: false,
          show: this.showAccountInTable,
        },
        {
          text: "نام حساب",
          value: "account.name",
          sortable: false,
          show: this.showAccountInTable,
        },
      ]);
      headers = headers.concat([
        {
          text: "بدهکار",
          value: "bed",
          type: "numeric",
          sortable: this.sortable,
          filterable: this.filterable,
        },
        {
          text: "بستانکار",
          value: "bes",
          type: "numeric",
          sortable: this.sortable,
          filterable: this.filterable,
        },
      ]);
      headers = headers.concat([
        {
          text: "مانده",
          value: "remain",
          type: "numeric",
          sortable: false,
          filterable: false,
          align: "center",
          show: this.showRemain,
        },
        {
          text: "تشخیص",
          value: "remain_type",
          sortable: false,
          filterable: false,
          align: "center",
          show: this.showRemain,
        },
      ]);

      headers = headers.concat([
        {
          text: "مشاهده سند",
          value: "detail",
          sortable: false,
          filterable: false,
          align: "left",
          hideInExport: true,
          show: this.showLink,
        },
      ]);

      return headers;
    },
  },
  watch: {
    filters: {
      deep: true,
      handler() {
        Object.keys(this.filters).forEach((key) => {
          if (this.filters[key] != this.localFilters[key]) {
            this.localFilters[key] = this.filters[key];
          }
        });
      },
    },
  },
  methods: {
    to(item) {
      return {
        name: "SanadForm",
        params: {
          id: item.id,
        },
      };
    },
  },
};
</script>

<style scoped lang="scss">
</style>
