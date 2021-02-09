<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12" md="12">
          <v-row>
            <v-col cols="12" md="3">
              <v-select label="تعداد ستون ها" v-model="filters.cols_count" :items="[2, 4]"></v-select>

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
              <date label="تا تاریخ" v-model="filters.to_date" class="mt-3" />
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
              </template>
            </template>

            <template v-slot:body.append="{ headers }">
              <tr class="text-center">
                <td :colspan="2 + cols.cols.length"></td>
                <td>جمع کل</td>
                <td>{{ sum['bed'] | toMoney }}</td>
                <td>{{ sum['bes'] | toMoney }}</td>
                <template v-if="hiddenCols.length == 0">
                  <td>{{ sum['bedRemain'] | toMoney }}</td>
                  <td>{{ sum['besRemain'] | toMoney }}</td>
                </template>
              </tr>
            </template>
          </m-datatable>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import date from "@/components/mcomponents/cleave/Date";
import datatableBaseCols from "./_datatableBaseCols";
import AccountApiMixin from "@/mixin/accountMixin";
import _ from "lodash";
export default {
  name: "Balance",
  mixins: [AccountApiMixin],
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
        bes = 0;
      for (const account of this.items) {
        if (this.filters.level == null && account.level != undefined) {
          if (account.level == 0) {
            bed += +account.bed_sum;
            bes += +account.bes_sum;
          }
        } else {
          bed += +account.bed_sum;
          bes += +account.bes_sum;
        }
      }

      return {
        bed: bed,
        bes: bes,
        bedRemain: Math.max(bed - bes),
        besRemain: Math.max(bes - bed),
      };
    },
    hiddenCols() {
      if (this.filters.cols_count == 4) return [];
      return ["bed_sum", "bes_sum"];
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
      return [
        ...(this.filters.show_float_accounts ? item.floatAccounts_data : []),
        ...(this.filters.show_cost_centers ? item.costCenters_data : []),
      ];
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
