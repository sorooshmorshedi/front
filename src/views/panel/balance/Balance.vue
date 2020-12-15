<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-row>
            <v-col cols="12" md="4">
              <v-select label="تعداد ستون ها" v-model="filters.cols_count" :items="[2, 4]"></v-select>
            </v-col>

            <template v-if="showAccountFilters">
              <v-col cols="12" md="4">
                <v-select
                  label="سطح حساب"
                  v-model="filters.level"
                  item-text="text"
                  item-value="value"
                  :items="accountLevels"
                  :return-object="false"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  label="حساب های خاص"
                  v-model="filters.account_type"
                  :items="specialAccounts"
                  item-text="text"
                  item-value="value"
                  :return-object="false"
                />
              </v-col>
            </template>
            <v-col v-else cols="0" md="4"></v-col>

            <v-col cols="12" md="4">
              <date label="از تاریخ" v-model="filters.from_date" />
            </v-col>
            <v-col cols="12" md="4">
              <date label="تا تاریخ" v-model="filters.to_date" />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                :items="accountStatuses"
                v-model="filters.balance_status"
                label="وضعیت حساب"
              ></v-select>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="از شماره سند" type="number" v-model="filters.from_code" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="تا شماره سند" type="number" v-model="filters.to_code" />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="6">
          <v-col cols="12">
            <v-switch label="نمایش مغایرت حساب ها" v-model="filters.show_differences" />
          </v-col>
          <template v-if="showAccountFilters">
            <v-col cols="12">
              <v-switch label="نمایش حساب های تفضیلی شناور" v-model="filters.show_float_accounts" />
            </v-col>

            <v-col cols="12">
              <v-switch label="نمایش مرکز هزینه و درآمد" v-model="filters.show_cost_centers" />
            </v-col>
          </template>
        </v-col>

        <v-col cols="12">
          <m-datatable
            ref="datatable"
            :headers="headers"
            :items="items"
            :hidden-cols="hiddenCols"
            :searchable="false"
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
  components: { date },
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
        { value: "all", text: "همه" },
        { value: 0, text: "گروه" },
        { value: 1, text: "کل" },
        { value: 2, text: "معین" },
        { value: 3, text: "تفضیلی" },
      ],
      specialAccounts: [
        { value: "all", text: "همه" },
        { value: "bank", text: "بانک" },
        { value: "buyer", text: "خریدار" },
        { value: "seller", text: "فروشنده" },
      ],
      accountStatuses: [
        { value: "all", text: "همه" },
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
        if (this.filters.level == "all" && account.level != undefined) {
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
    this.debouncedFilterAccounts = _.debounce(this.filterAccounts, 200);
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
    accountFilters: {
      handler() {
        if (this.debouncedFilterAccounts) this.debouncedFilterAccounts();
        else this.filterAccounts();
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
          // this.filterAccounts();
        },
      });
    },
    filterAccounts() {
      let filters = this.accountFilters;

      let sortedAccounts = this.getSortedAccounts(this.allAccounts, true);
      let accounts = sortedAccounts.filter((acc) => {
        if (filters.level != "all") {
          if (acc.level != filters.level) return false;
        }

        if (filters.status != "all") {
          switch (filters.status) {
            case "withRemain":
              if (acc.bes_remain == 0 && acc.bes_remain == 0) return false;
              break;
            case "bedRemain":
              if (acc.bed_remain == 0) return false;
              break;
            case "besRemain":
              if (acc.bes_remain == 0) return false;
              break;
            case "withoutRemain":
              if (acc.bed_sum != 0 || acc.bes_sum != 0) return false;
              break;
            case "withTransaction":
              if (acc.bed_sum == 0 && acc.bes_sum == 0) return false;
              break;
            case "withoutTransaction":
              if (acc.bed_sum != 0 || acc.bes_sum != 0) return false;
              break;
          }
        }

        if (filters.from_code) {
          // todo: check for chilren too
          if (acc.code < filters.from_code) return false;
        }

        if (filters.special != "all") {
          switch (filters.special) {
            case "seller":
              if (!acc.person_data || acc.person_data.type != "seller")
                return false;
              break;
            case "buyer":
              if (!acc.person_data || acc.person_data.type != "buyer")
                return false;
              break;
            case "bank":
              if (!acc.bank_data) return false;
              break;
          }
        }

        if (filters.showDifferences) {
          if (!acc.type_data) return false;
          let nature = acc.type_data.nature;
          if (acc.bes_remain == 0 && acc.bed_remain == 0) return false;
          if (nature == "bed" && acc.bes_remain == 0) return false;
          if (nature == "bes" && acc.bed_remain == 0) return false;
        }

        return true;
      });

      this.updateFilters();

      this.items = accounts;
    },
    clearFilters() {
      this.accountFilters = {
        level: "all",
        status: "all",
        special: "all",
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
