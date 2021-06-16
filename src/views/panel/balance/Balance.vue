<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12" md="12">
          <v-row>
            <v-col cols="12" md="3">
              <v-select label="تعداد ستون ها" v-model="filters.cols_count" :items="[2, 4, 6, 8]"></v-select>

              <v-select
                class="mt-3"
                :items="accountStatuses"
                v-model="filters.balance_status"
                label="وضعیت حساب"
              />

              <v-switch
                class="mt-3"
                label="نمایش مغایرت حساب ها"
                v-model="filters.show_differences"
              />
            </v-col>

            <template v-if="showAccountFilters">
              <v-col cols="12" md="3">
                <v-select
                  label="سطح حساب"
                  v-model="filters.level"
                  item-text="text"
                  item-value="value"
                  :items="accountLevels"
                  :return-object="false"
                />

                <v-select
                  class="mt-3"
                  label="حساب های خاص"
                  v-model="filters.account_type"
                  :items="specialAccounts"
                  item-text="text"
                  item-value="value"
                  :return-object="false"
                />

                <v-switch
                  label="نمایش حساب های تفضیلی شناور"
                  v-model="filters.show_float_accounts"
                  class="mt-3 text-right"
                />

                <v-switch
                  label="نمایش مرکز هزینه و درآمد"
                  v-model="filters.show_cost_centers"
                  class="mt-3"
                />
              </v-col>

              <v-col cols="12" md="2">
                <v-text-field
                  label="از کد حساب"
                  type="number"
                  v-model="filters.account__code__gte"
                />
                <v-text-field
                  label="تا کد حساب"
                  type="number"
                  v-model="filters.account__code__lte"
                  class="mt-3"
                />
              </v-col>
            </template>

            <v-col cols="12" md="2">
              <date label="از تاریخ" v-model="filters.from_date" />
              <div class="mt-3">
                <date label="تا تاریخ" v-model="filters.to_date" />
              </div>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field label="از شماره سند" type="number" v-model="filters.from_code" />
              <v-text-field
                label="تا شماره سند"
                type="number"
                v-model="filters.to_code"
                class="mt-3"
              />
            </v-col>
            <v-col cols="12" md="2"></v-col>
          </v-row>
          <v-col cols="12"></v-col>
          <template v-if="showAccountFilters"></template>
        </v-col>

        <v-col cols="12">
          <m-datatable
            ref="datatable"
            :headers="headers"
            :items="items"
            :hidden-cols="hiddenCols"
            :export-url="url"
            :filters.sync="filters"
            show-expand
            :expanded.sync="items"
          >
            <template
              #item.bed_sum="{ item }"
            >{{ item.bed_sum - (filters.cols_count == 8?item.opening_bed_sum:0) | toMoney }}</template>
            <template
              #item.bes_sum="{ item }"
            >{{ item.bes_sum - (filters.cols_count == 8?item.opening_bes_sum:0) | toMoney }}</template>

            <template #item.data-table-expand></template>

            <template
              v-if="filters.show_float_accounts || filters.show_cost_centers"
              v-slot:expanded-item="{ headers, item }"
            >
              <template v-if="hasSubAccount(item)">
                <td colspan="4"></td>
                <td class>
                  <div
                    class="py-1"
                    v-for="(subAccount, i ) in getSubAccounts(item)"
                  >{{ subAccount.name }}</div>
                </td>
                <td class="text-center">
                  <div
                    class="py-1"
                    v-for="(subAccount, i ) in getSubAccounts(item)"
                  >{{ subAccount.bed_sum | toMoney }}</div>
                </td>
                <td class="text-center">
                  <div
                    class="py-1"
                    v-for="(subAccount, i ) in getSubAccounts(item)"
                  >{{ subAccount.bes_sum | toMoney }}</div>
                </td>
                <template v-if="hiddenCols.length == 0">
                  <td class="text-center">
                    <div
                      class="py-1"
                      v-for="(subAccount, i ) in getSubAccounts(item)"
                    >{{ subAccount.bed_remain | toMoney }}</div>
                  </td>
                  <td class="text-center">
                    <div
                      class="py-1"
                      v-for="(subAccount, i ) in getSubAccounts(item)"
                    >{{ subAccount.bes_remain | toMoney }}</div>
                  </td>
                </template>
                <td>
                  <div
                    v-if="getSubAccountLedgerQuery"
                    class="py-1"
                    v-for="(subAccount, i ) in getSubAccounts(item)"
                  >
                    <open-ledger-btn :query="getSubAccountLedgerQuery(item, subAccount)" />
                  </div>
                </td>
              </template>
            </template>

            <template v-slot:body.append="{ headers }">
              <tr class="text-center">
                <td :colspan="2 + cols.cols.length"></td>
                <td>جمع کل</td>
                <template v-if="filters.cols_count > 6">
                  <td>{{ sum['openingBed'] | toMoney }}</td>
                  <td>{{ sum['openingBes'] | toMoney }}</td>
                </template>
                <template v-if="filters.cols_count > 4">
                  <td>{{ sum['openingBed'] | toMoney }}</td>
                  <td>{{ sum['previousBes'] | toMoney }}</td>
                </template>
                <template v-if="filters.cols_count > 2">
                  <td>{{ sum['bed'] | toMoney }}</td>
                  <td>{{ sum['bes'] | toMoney }}</td>
                </template>
                <td>{{ sum['bedRemain'] | toMoney }}</td>
                <td>{{ sum['besRemain'] | toMoney }}</td>
              </tr>
            </template>

            <template #item.ledger="{ item }" v-if="getAccountLedgerQuery">
              <open-ledger-btn :query="getAccountLedgerQuery(item)" />
            </template>
          </m-datatable>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import datatableBaseCols from "./_datatableBaseCols";
import AccountApiMixin from "@/mixin/accountMixin";
import _ from "lodash";
import OpenLedgerBtn from "@/components/btns/OpenLedgerBtn.vue";
export default {
  name: "Balance",
  mixins: [AccountApiMixin],
  components: { OpenLedgerBtn },
  props: {
    title: {
      required: true,
    },
    cols: {
      required: true,
    },
    url: {
      required: true,
    },
    showAccountFilters: {
      default: true,
    },
    getAccountLedgerQuery: {
      default: null,
    },
    getSubAccountLedgerQuery: {
      default: null,
    },
  },
  data() {
    return {
      sanadFilters: {},
      accountFilters: {},

      filters: {},

      allAccounts: [],
      items: [],
      debouncedGetData: null,
      debouncedFilterAccounts: null,

      accountLevels: [
        { value: null, text: "همه" },
        { value: 0, text: "گروه" },
        { value: 1, text: "کل" },
        { value: 2, text: "معین" },
        { value: 3, text: "تفضیلی" },
      ],
      specialAccounts: [
        { value: null, text: "همه" },
        { value: "bank", text: "بانک" },
        { value: "buyer", text: "خریدار" },
        { value: "seller", text: "فروشنده" },
      ],
      accountStatuses: [
        { value: null, text: "همه" },
        { value: "with_remain", text: "حساب های دارای مانده" },
        { value: "bed_remain", text: "مانده بدهکار" },
        { value: "bes_remain", text: "مانده بستانکار" },
        { value: "without_remain", text: "بدون مانده" },
        { value: "with_transaction", text: "حساب های دارای گردش" },
        { value: "without_transaction", text: "حساب های بدون گردش" },
      ],
    };
  },
  computed: {
    sum() {
      let bed = 0,
        bes = 0,
        openingBed = 0,
        openingBes = 0,
        previousBed = 0,
        previousBes = 0;
      for (const account of this.items) {
        if (this.filters.level == null && account.level != undefined) {
          if (account.level == 0) {
            bed += +account.bed_sum;
            bes += +account.bes_sum;
            previousBed += +account.previous_bed_sum;
            previousBes += +account.previous_bes_sum;
            openingBed += +account.opening_bed_sum;
            openingBes += +account.opening_bes_sum;
          }
        } else {
          bed += +account.bed_sum;
          bes += +account.bes_sum;
          previousBed += +account.previous_bed_sum;
          previousBes += +account.previous_bes_sum;
          openingBed += +account.opening_bed_sum;
          openingBes += +account.opening_bes_sum;
        }
      }

      return {
        bed,
        bes,
        bedRemain: Math.max(bed - bes),
        besRemain: Math.max(bes - bed),
        previousBed,
        previousBes,
        openingBed,
        openingBes,
      };
    },
    hiddenCols() {
      if (this.filters.cols_count == 6)
        return ["opening_bed_sum", "opening_bes_sum"];
      if (this.filters.cols_count == 4)
        return [
          "opening_bed_sum",
          "opening_bes_sum",
          "previous_bed_sum",
          "previous_bes_sum",
        ];
      if (this.filters.cols_count == 2)
        return [
          "bed_sum",
          "bes_sum",
          "opening_bed_sum",
          "opening_bes_sum",
          "previous_bed_sum",
          "previous_bes_sum",
        ];
      return [];
    },
    headers() {
      let cols = [...this.cols.cols, ...datatableBaseCols.cols];
      cols = cols.filter((o) => !this.hiddenCols.includes(o.value));
      return cols;
    },
  },
  created() {
    this.debouncedGetData = _.debounce(this.getData, 1000);
    this.clearFilters();
  },
  watch: {
    url() {
      this.getData();
    },
    filters: {
      handler() {
        if (this.debouncedGetData) this.debouncedGetData();
        else this.getData();
      },
      deep: true,
    },
  },
  methods: {
    hasSubAccount(item) {
      return (
        (item.floatAccounts_data && item.floatAccounts_data.length) ||
        (item.costCenters_data && item.costCenters_data.length)
      );
    },
    getSubAccounts(item) {
      let subAccounts = [];

      if (this.filters.show_float_accounts) {
        let floatAccounts = item.floatAccounts_data;
        floatAccounts.forEach((o) => (o.level = "floatAccounts"));
        subAccounts = [...subAccounts, ...floatAccounts];
      }

      if (this.filters.show_cost_centers) {
        let costCenters = item.costCenters_data;
        costCenters.forEach((o) => (o.level = "costCenters"));
        subAccounts = [...subAccounts, ...costCenters];
      }

      return subAccounts;
    },
    getData() {
      this.updateFilters();
      this.request({
        url: this.endpoint(this.url),
        method: "get",
        params: this.filters,
        success: (data) => {
          this.items = data;
        },
      });
    },
    clearFilters() {
      this.accountFilters = {
        level: null,
        status: null,
        special: null,
        showFloatAccounts: false,
        showCostCenters: false,
        showDifferences: false,
      };
      this.sanadFilters = {};
      this.filters = {
        cols_count: 2,
      };
    },
    updateFilters() {
      let filters = {};
      Object.keys(this.sanadFilters).forEach((k) => {
        if (["undefined", ""].includes(this.sanadFilters[k])) return;
        if (k.includes("date") || k.includes("due")) {
          let gDate = this.toGDate(this.sanadFilters[k]);
          if (gDate == "Invalid date") {
            this.notify("فرمت تاریخ وارد شده معتبر نمی باشد", "danger");
            return;
          }
          filters[k] = gDate;
        } else {
          filters[k] = this.sanadFilters[k];
        }
      });

      return;
      this.filters = {
        ...filters,
        ...this.filters,
        ...this.accountFilters,
      };
    },
  },
};
</script>

<style lang="scss">
.v-data-table tbody tr.v-data-table__expanded__content {
  box-shadow: none !important;
}
</style>
